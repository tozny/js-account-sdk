const Account = require('../account')
const Tozny = require('tozny-node-sdk').default
const uuidv4 = require('uuid/v4')

const accountFactory = new Account(Tozny, process.env.API_URL)
let accountClient = null
let registrationToken = null
let registeredClients = []

/*
After the `beforeAll()` method runs, the registered client array is full of objects in this shape:
Basically information from the registration just stored in this module variable for testing reference.

{
  cryptoKeys: KeyPair {
    publicKey: 'ySi_1oTeTsap2UYIKv8tjC3L78CcsPICbWSECpsLvSU',
    privateKey: 'h8tlHrIgN_AThFkwuHz1W37mTpM8XR0EujDi_dMvAcc'
  },
  signingKeys: KeyPair {
    publicKey: 'CwMAUka1yyz-H65F_NoWx3V1UyTZCOlaMPoBxi0SwuI',
    privateKey: 'iB30XLBKlM7EwLKVGfcsvLt59eOouMYDwV842iNGk_cLAwBSRrXLLP4frkX82hbHdXVTJNkI6Vow-gHGLRLC4g'
  },
  info: ClientDetails {
    clientId: 'dd8204ea-1902-4239-8101-65f4cff7871e',
    apiKeyId: 'e62da6e65e3d268b8bcd9008e1b0adb298d1c3e101db60f9949db19573fa5623',
    apiSecret: '1fd975995b457de2c6133aba61639bee325c463f7daf3cd39b9fcd39d309913c',
    publicKey: [PublicKey],
    name: 'TestClient0',
    signingKey: [SigningKey]
  }
}
*/

beforeAll(async () => {
  const seed = uuidv4()
  const name = `Test Account ${seed}`
  const email = `test+${seed}@tozny.com`
  const password = uuidv4()
  const registration = await accountFactory.register(name, email, password)
  accountClient = registration.client
  registrationToken = await accountClient.newRegistrationToken(undefined, {
    allowed_types: ['general'],
    enabled: true,
  })
  for (let i = 0; i < 3; i++) {
    const clientName = `TestClient${i}`
    const cryptoKeys = await Tozny.Storage.Client.generateKeypair()
    const signingKeys = await Tozny.Storage.Client.generateSigningKeypair()
    const hasBackup = i % 2 === 0
    const info = await Tozny.Storage.Client.register(
      registrationToken.token,
      clientName,
      cryptoKeys,
      signingKeys,
      hasBackup,
      accountClient.api.apiUrl
    )
    registeredClients.push({
      cryptoKeys,
      signingKeys,
      info,
      hasBackup,
    })
  }
})

describe('Account Client', () => {
  test('can list client info', async () => {
    const clientList = await accountClient.listClientInfo()
    for (let i = 0; i < clientList.length; i++) {
      // Ignore the queen client
      if (
        clientList.clients[i].clientId ===
        accountClient.queenClient.config.clientId
      ) {
        continue
      }
      // Find the recorded client and validate the data.
      let recordedClient = false
      for (let maybe of registeredClients) {
        if (maybe.info.clientId === clientList.clients[i].clientId) {
          recordedClient = maybe
          break
        }
      }
      expect(recordedClient).toBeTruthy()
      expect(clientList.clients[i].name).toBe(recordedClient.info.name)
      expect(clientList.clients[i].enabled).toBe(true)
      expect(clientList.clients[i].hasBackup).toBe(recordedClient.hasBackup)
      expect(clientList.clients[i].publicKey.curve25519).toBe(
        recordedClient.info.public_key
      )
      expect(clientList.clients[i].signingKey.ed25519).toBe(
        recordedClient.info.signing_key
      )
    }
  })

  test('can paginate the client list', async () => {
    let i = 0
    let next = undefined
    // this iterates over all registered clients, one client at a time.
    while (next !== 0) {
      const clientList = await accountClient.listClientInfo(next, 1)
      i++
      next = clientList.nextToken
      // Because we page by 1, the last page is empty, and causes the test to fail.
      // This ensures the test continues.
      if (clientList.clients.length === 0) {
        continue
      }
      // Validate the 1-client-per-page list
      expect(clientList.clients.length).toBe(1)
      const fetchedClient = clientList.clients[0]
      // Ignore the queen client
      if (
        fetchedClient.clientId === accountClient.queenClient.config.clientId
      ) {
        continue
      }
      // Make sure any other clients are in the registerred list
      let recordedClient = false
      for (let maybe of registeredClients) {
        if (maybe.info.clientId === fetchedClient.clientId) {
          recordedClient = maybe
          break
        }
      }
      expect(recordedClient).toBeTruthy()
    }
    // We should have iterated at least the number of registered clients times
    expect(i > registeredClients.length).toBe(true)
  })

  test('can fetch a client info by client ID', async () => {
    for (let registered of registeredClients) {
      // fetch info for the registered client
      const clientId = registered.info.clientId
      const fetched = await accountClient.getClientInfo(clientId)
      // Validate the fetched into
      expect(fetched.clientId).toBe(clientId)
      expect(fetched.name).toBe(registered.info.name)
      expect(fetched.enabled).toBe(true)
      expect(fetched.hasBackup).toBe(registered.hasBackup)
      expect(fetched.publicKey.curve25519).toBe(registered.cryptoKeys.publicKey)
      expect(fetched.signingKey.ed25519).toBe(registered.signingKeys.publicKey)
    }
  })

  test('enabled and disabled clients', async () => {
    const testClient = registeredClients[0]
    const clientId = testClient.info.clientId
    // first verify the current state
    const fetched = await accountClient.getClientInfo(clientId)
    expect(fetched.enabled).toBe(true)
    // Disable the client
    const disable = await accountClient.setClientEnabled(clientId, false)
    const disabledFetched = await accountClient.getClientInfo(clientId)
    expect(disable).toBe(false)
    expect(disabledFetched.enabled).toBe(false)
    // Now re-enable
    const enable = await accountClient.setClientEnabled(clientId, true)
    const enabledFetched = await accountClient.getClientInfo(clientId)
    expect(enable).toBe(true)
    expect(enabledFetched.enabled).toBe(true)
    // Same direction doesn't change anything
    const same = await accountClient.setClientEnabled(clientId, true)
    const sameFetched = await accountClient.getClientInfo(clientId)
    expect(same).toBe(true)
    expect(sameFetched.enabled).toBe(true)
  })
})
