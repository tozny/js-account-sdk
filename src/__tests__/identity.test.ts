import Account from '../account'
import Tozny from '@toznysecure/sdk/node'
import { v4 as uuidv4 } from 'uuid'
import { cleanupRealms } from './utils'

const accountFactory = new Account(Tozny, process.env.API_URL)
let client: any = null
let realmName: string
let seed: string
let sovereignName: string

beforeAll(async () => {
  // Create an account to re-use across test cases
  seed = uuidv4()
  const name = `Test Account ${seed}`
  const email = `test-emails-group+${seed}@tozny.com`
  const password = uuidv4()
  const registration: any = await accountFactory.register(name, email, password)
  client = registration.client

  realmName = `TestRealm${seed.split('-')[0]}`
  sovereignName = 'yassqueen'
  await client.createRealm(realmName, sovereignName)
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Identity', () => {
  it('Registers and Deletes an Identity from a realm ', async () => {
    // Create a token with Identity permissions
    const tokenName = 'example token'
    const permissions = {
      enabled: true,
      allowed_types: ['general', 'identity'],
    }
    const token = await client.newRegistrationToken(tokenName, permissions)
    const identity = {
      name: `identity-${seed}`,
      email: `identity-${seed}@example.com`,
      first_name: 'firstName',
      last_name: 'coolLastName',
      attributes: {
        key1: 'value1',
        key2: 'value2',
      },
    }
    // Register Identity
    const identityResponse = await client.registerIdentity(
      realmName,
      token.token,
      identity
    )
    expect(identityResponse).toBeInstanceOf(Object)
    expect(identityResponse.identity.id).toBeTruthy()
    expect(identityResponse.identity.name).toBe(identity.name)
    expect(identityResponse.identity.first_name).toBe(identity.first_name)
    expect(identityResponse.identity.last_name).toBe(identity.last_name)
    expect(identityResponse.identity.attributes.key1).toBe('value1')
    expect(identityResponse.identity.attributes.key2).toBe('value2')

    // List all identities in realm, Expected new identity and sovereign
    // Set max page size to 1 in order to test paging
    const idList = client.listIdentities(realmName, 1)
    let identities = await idList.next()
    expect(identities).toBeInstanceOf(Array)
    expect(identities).toHaveLength(1)
    expect(identities[0].username).toBe(identity.name)
    expect(identities[0].firstName).toBe(identity.first_name)
    expect(identities[0].lastName).toBe(identity.last_name)
    expect(identities[0].email).toBe(`identity-${seed}@example.com`)

    // second identity should be sovereign client
    // second page
    identities = await idList.next()
    expect(identities).toBeInstanceOf(Array)
    expect(identities).toHaveLength(1)
    expect(identities[0].username).toBe(sovereignName)

    // Delete new identity
    await client.deleteIdentity(realmName, identityResponse.identity.tozny_id)

    // List identities, expected only sovereign
    const idList2 = await client.listIdentities(realmName, 1000)
    let identities2
    while (!idList2.done) {
      identities2 = await idList2.next()
    }
    expect(identities2).toBeInstanceOf(Array)
    expect(identities2).toHaveLength(1)
    expect(identities2[0].username).toBe(sovereignName)
  })
})
