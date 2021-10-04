import Account from '../account'
// @ts-ignore no type defs exist for js-sdk
import Tozny from '@toznysecure/sdk/node'
import { v4 as uuidv4 } from 'uuid'
import { cleanupRealms } from './utils'
const DetailedIdentity = require('../types/detailedIdentity')

const accountFactory = new Account(Tozny, process.env.API_URL)
let client: any = null
let realmName: string
let seed: string
let sovereignName: string

beforeAll(async () => {
  // Create an account to re-use across test cases
  seed = uuidv4()
  const name = `Test Account ${seed}`
  const email = `test+${seed}@tozny.com`
  const password = uuidv4()
  const registration: any = await accountFactory.register(name, email, password)
  client = registration.client
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Identity', () => {
  it('Identity Flow', async () => {
    // Create a Realm
    realmName = `TestRealm${seed.split('-')[0]}`
    sovereignName = 'sovereignname'
    await client.createRealm(realmName, sovereignName)

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

    // List all identities in realm, Expected new identity and sovereign
    const idList = await client.listIdentities(realmName, 1000)
    let identities
    while (!idList.done) {
      identities = await idList.next()
    }
    expect(identities).toBeInstanceOf(Array)
    expect(identities).toHaveLength(2)
    expect(identities[0].username).toBe(identity.name)
    expect(identities[0].firstName).toBe(identity.first_name)
    expect(identities[0].lastName).toBe(identity.last_name)

    // Get Identity Details to get ToznyID for identity created
    const idDetails = await client.identityDetails(realmName, identity.name)
    expect(idDetails.id).toBeTruthy()
    expect(idDetails.toznyId).toBeTruthy()
    expect(idDetails).toBeInstanceOf(DetailedIdentity)

    const responseEmptyGroups = await client.groupMembership(
      realmName,
      idDetails.toznyId
    )
    expect(responseEmptyGroups).toBeInstanceOf(Array)
    expect(responseEmptyGroups).toHaveLength(0)

    // Create a group
    const group = await client.createRealmGroup(realmName, {
      name: 'ToznyEngineers',
    })
    // Check for group created
    expect(group.id).toBeTruthy()
    expect(group.name).toBe('ToznyEngineers')

    // Add identity to the group
    await client.updateGroupMembership(realmName, idDetails.toznyId, {
      groups: [group.id],
    })

    // Create 2 Realm Role
    const role1 = await client.createRealmRole(realmName, {
      name: 'FridgeAccess',
      description: 'Grants access to the secrets of the fridge.',
    })
    const role2 = await client.createRealmRole(realmName, {
      name: 'StovePowers',
      description: 'They can turn on the stove.',
    })

    // Expected there are no mapped roles to start
    const roleMappings = await client.listGroupRoleMappings(realmName, group.id)
    expect(roleMappings.client).toEqual({})
    expect(roleMappings.realm).toBeInstanceOf(Array)
    expect(roleMappings.realm).toHaveLength(0)

    // add a mapping to the group
    const addResponse = await client.addGroupRoleMappings(realmName, group.id, {
      realm: [
        // use minimal set of inputs
        { id: role1.id, name: role1.name, description: role1.description },
        // or a full blown Role
        role2,
      ],
    })

    expect(addResponse).toBeTruthy()

    // List out the groups the identity is in, expected only ToznyEngineers
    const responseToznyEngineers = await client.groupMembership(
      realmName,
      idDetails.toznyId
    )
    // Check to make sure the group we added is the only group
    expect(responseToznyEngineers).toBeInstanceOf(Array)
    expect(responseToznyEngineers).toHaveLength(1)
    expect(responseToznyEngineers[0].id).toBeTruthy()
    expect(responseToznyEngineers[0].name).toBe('ToznyEngineers')

    // Get Identity Details to check current roles
    const identityDetails = await client.identityDetails(
      realmName,
      identity.name
    )
    expect(identityDetails.id).toBeTruthy()
    expect(identityDetails.toznyId).toBeTruthy()
    expect(identityDetails).toBeInstanceOf(DetailedIdentity)
    expect(identityDetails.roles.realm).toBeInstanceOf(Array)
    // 2 roles we added from the group and 2 default roles
    expect(identityDetails.roles.realm).toHaveLength(4)

    // Leave the group
    await client.leaveGroups(realmName, idDetails.toznyId, {
      groups: [group.id],
    })

    // Check group membership expected to be 0
    const empty = await client.groupMembership(realmName, idDetails.toznyId)
    expect(empty).toBeInstanceOf(Array)
    expect(empty).toHaveLength(0)

    // Get Identity Details to check current roles after group removal
    const identityDetailsAfterGroup = await client.identityDetails(
      realmName,
      identity.name
    )
    expect(identityDetailsAfterGroup.id).toBeTruthy()
    expect(identityDetailsAfterGroup.toznyId).toBeTruthy()
    expect(identityDetailsAfterGroup).toBeInstanceOf(DetailedIdentity)
    expect(identityDetailsAfterGroup.roles.realm).toBeInstanceOf(Array)
    //  2 default roles expected after group removal
    expect(identityDetailsAfterGroup.roles.realm).toHaveLength(2)

    // Delete new identity

    await client.deleteIdentity(realmName, identityDetailsAfterGroup.toznyId)

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
