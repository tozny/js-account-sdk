const Account = require('../account')
const Tozny = require('tozny-node-sdk').default
const uuidv4 = require('uuid/v4')

const accountFactory = new Account(Tozny, process.env.API_URL)
let client = null
let brokerRegistrationToken = null

beforeAll(async () => {
  // Create an account to re-use across test cases
  const seed = uuidv4()
  const name = `Test Account ${seed}`
  const email = `test+${seed}@tozny.com`
  const password = uuidv4()
  const registration = await accountFactory.register(name, email, password)
  client = registration.client
  // Create a registration token for broker client types
  const permissions = { allowed_types: ['broker'] }
  brokerRegistrationToken = await client.newRegistrationToken(
    undefined,
    permissions
  )
})

/**
 * cleanup cleanup's all Tozny resources associated with a client
 * @param  {object} client the queen client for the account
 * @return {nil}
 */
async function cleanup(client) {
  // Cleanup all created realms
  const realms = await client.listRealms()
  for (let realm of realms.realms) {
    await client.deleteRealm(realm.name)
  }
}

describe('Account Client', () => {
  test('can create a realm', async () => {
    try {
      // create a realm
      const realmName = uuidv4().split('-')[0]
      const sovereignName = 'YassQueen'
      const realm = await client.createRealm(realmName, sovereignName)
      // verify the realm has the user defined name
      expect(realm.name).toEqual(realmName)
    } catch (error) {
      await cleanup(client)
      throw error
    } finally {
      await cleanup(client)
    }
  })
  test('can list created realm', async () => {
    try {
      // create a realm
      const realmName = uuidv4().split('-')[0]
      const sovereignName = 'YassQueen'
      const createdRealm = await client.createRealm(realmName, sovereignName)
      // list created realms
      const realms = await client.listRealms()
      // verify a realm with the specified name exists
      let found = false
      for (let realm of realms.realms) {
        if (realm.name == createdRealm.name) {
          found = true
          break
        }
      }
      expect(found).toEqual(true)
    } catch (error) {
      await cleanup(client)
      throw error
    } finally {
      await cleanup(client)
    }
  })
  test('can delete created realm', async () => {
    try {
      // create a realm
      const realmName = uuidv4().split('-')[0]
      const sovereignName = 'YassQueen'
      const createdRealm = await client.createRealm(realmName, sovereignName)
      // delete created realm
      await client.deleteRealm(realmName)
      // list created realms
      const realms = await client.listRealms()
      // verify a realm with the specified name doesn't exists
      let found = false
      // check none of the realms that exist are the one
      // that was supposed to be deleted
      for (let realm of realms.realms) {
        if (realm.name == createdRealm.name) {
          found = true
          break
        }
      }
      expect(found).toEqual(false)
    } catch (error) {
      await cleanup(client)
      throw error
    }
  })
  test('can register broker identity for realm', async () => {
    try {
      // create a realm
      const realmName = uuidv4().split('-')[0]
      const sovereignName = 'YassQueen'
      const createdRealm = await client.createRealm(realmName, sovereignName)
      const realmBrokerIdentity = await client.registerRealmBrokerIdentity(
        createdRealm.name,
        brokerRegistrationToken.token
      )
      let realmBrokerIdentityToznyClientID = ''
      // find the realm we created
      const realms = await client.listRealms()
      let found = false
      for (let realm of realms.realms) {
        if (realm.name == createdRealm.name) {
          found = true
          // grab the tozny client id for the broker identity of this realm
          realmBrokerIdentityToznyClientID = realm.brokerIdentityToznyId
          break
        }
      }
      expect(found).toEqual(true)
      // verify the realm's broker tozny client id is the same one registered
      expect(realmBrokerIdentityToznyClientID).toBe(realmBrokerIdentity.toznyId)
    } catch (error) {
      await cleanup(client)
      throw error
    } finally {
      await cleanup(client)
    }
  })
})
