const Account = require('../account')
const Tozny = require('@toznysecure/sdk/node')
const { v4: uuidv4 } = require('uuid')
const BasicIdentity = require('../types/basicIdentity')
const DetailedIdentity = require('../types/detailedIdentity')

// Set really high for slower APIs.
jest.setTimeout(100000)

const accountFactory = new Account(Tozny, process.env.API_URL)
let client = null
let registrationToken = null

beforeAll(async () => {
  // Create an account to re-use across test cases
  const seed = uuidv4()
  const name = `Test Account ${seed}`
  const email = `test+${seed}@tozny.com`
  const password = uuidv4()
  const registration = await accountFactory.register(name, email, password)
  client = registration.client
  // Create a registration token
  const permissions = {
    enabled: true,
    allowed_types: ['general', 'identity', 'broker'],
  }
  registrationToken = await client.newRegistrationToken(
    'it-test-token',
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
        registrationToken.token
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

  test('can list identities in a realm', async () => {
    try {
      // set up
      // create a realm
      const realmName = uuidv4().split('-')[0]
      const sovereignName = 'YassQueen'
      const createdRealm = await client.createRealm(realmName, sovereignName)
      await client.registerRealmBrokerIdentity(
        createdRealm.name,
        registrationToken.token
      )
      // Register set up normal SDK realm to register identities
      const realm = new Tozny.identity.Realm(
        realmName,
        'account',
        `http://localhost:8081/${realmName}/recover`,
        process.env.API_URL
      )
      // Register identities so there are several to test with
      const usernames = await Promise.all(
        [0, 1].map(async i => {
          const username = `testuser${i}`
          await realm.register(
            username,
            'password',
            registrationToken.token,
            `testuser${i}@example.com`
          )
          return username
        })
      )
      usernames.push(sovereignName.toLowerCase())
      // Test
      const idList = client.listIdentities(realmName)
      const identities = await idList.next()
      // Validate
      expect(identities.length).toEqual(usernames.length)
      const seen = []
      identities.forEach(i => {
        expect(i).toBeInstanceOf(BasicIdentity)
        expect(usernames).toContain(i.username)
        expect(seen).toEqual(expect.not.arrayContaining([i.id]))
        seen.push(i.id)
      })
    } finally {
      await cleanup(client)
    }
  })
  test('can paginate identities', async () => {
    try {
      // set up
      // create a realm
      const realmName = uuidv4().split('-')[0]
      const sovereignName = 'YassQueen'
      const createdRealm = await client.createRealm(realmName, sovereignName)
      await client.registerRealmBrokerIdentity(
        createdRealm.name,
        registrationToken.token
      )
      // Set up normal SDK realm to register identities
      const realm = new Tozny.identity.Realm(
        realmName,
        'account',
        `http://localhost:8081/${realmName}/recover`,
        process.env.API_URL
      )
      // Register identities so there are several to test with
      await Promise.all(
        [0, 1].map(async i => {
          const username = `testuser${i}`
          await realm.register(
            username,
            'password',
            registrationToken.token,
            `testuser${i}@example.com`
          )
          return username
        })
      )
      // Test
      let pages = 0
      let seen = []
      const idList = client.listIdentities(realmName, 2)
      // more iterations than we actually need, but with a sane stop instead
      // of a while loop for now.
      for (let i = 0; i < 3; i++) {
        const identities = await idList.next()
        seen = seen.concat(
          identities.map(i => i.id).filter(i => !seen.includes(i))
        )
        pages++
        // if the list report it is done iterating, break the loop.
        if (idList.done) {
          break
        }
      }
      // Validate
      expect(pages).toBe(2)
      expect(seen.length).toEqual(3)
    } finally {
      await cleanup(client)
    }
  })
  test('can get identity details', async () => {
    try {
      // set up
      // create a realm
      const realmName = uuidv4().split('-')[0]
      const sovereignName = 'YassQueen'
      const createdRealm = await client.createRealm(realmName, sovereignName)
      await client.registerRealmBrokerIdentity(
        createdRealm.name,
        registrationToken.token
      )
      // Test
      const idDetails = await client.identityDetails(
        realmName,
        sovereignName.toLowerCase()
      )
      expect(idDetails).toBeInstanceOf(DetailedIdentity)
      expect(idDetails.username).toBe(sovereignName.toLowerCase())
      expect(
        idDetails.roles.clients['realm-management'].map(r => r.name)
      ).toContain('realm-admin')
    } finally {
      await cleanup(client)
    }
  })
})
