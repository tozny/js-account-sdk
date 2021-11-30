import Account from '../account'
// @ts-ignore no type defs exist for js-sdk
import Tozny from '@toznysecure/sdk/node'
import { v4 as uuidv4 } from 'uuid'
import { cleanupRealms } from './utils'

const accountFactory = new Account(Tozny, process.env.API_URL)
let client: any = null
let realmName: string
let identity: any = null
let realmConfig: any = null
let realm: any
let username: any = null
let apiURL = process.env.API_URL

beforeAll(async () => {
  // Create an account to re-use across test cases
  const seed = uuidv4()
  const name = `Test Account ${seed}`
  const email = `test-emails-group+${seed}@tozny.com`
  const password = uuidv4()
  const accountClient: any = await accountFactory.register(
    name,
    email,
    password
  )
  const sovereignName = 'JELP'
  realmName = `TestRealm${seed.split('-')[0]}`.toLowerCase()

  const tokenName = 'example token'
  const permissions = {
    enabled: true,
    allowed_types: ['general', 'identity'],
  }
  client = accountClient.client
  const token = await client.newRegistrationToken(tokenName, permissions)
  const stringToken = String(token.token)
  const createdRealm = await client.createRealm(realmName, sovereignName)
  username = `it-user-${uuidv4()}`
  realmConfig = {
    realmName: realmName,
    appName: 'account',
    brokerTargetUrl: 'http://integrationtest.local.tozny.com',
    apiURL,
  }
  realm = new Tozny.identity.Realm(
    realmConfig.realmName,
    realmConfig.appName,
    realmConfig.brokerTargetUrl,
    apiURL
  )
  await realm.register(
    username,
    password,
    stringToken,
    `${username}@example.com`
  )
  identity = await realm.login(username, password)
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Identity Group Membership', () => {
  it('adds, lists, removes identity group membership', async () => {
    let identity_id = identity.storage.config.clientId

    // This identity should currently have no groups
    const responseEmptyGroups = await client.groupMembership(
      realmName,
      identity_id
    )
    expect(responseEmptyGroups).toBeInstanceOf(Array)
    expect(responseEmptyGroups).toHaveLength(0)

    // Create a group
    const group1 = await client.createRealmGroup(realmName, {
      name: 'ToznyEngineers',
    })

    // Check for group created
    expect(group1.id).toBeTruthy()
    expect(group1.name).toBe('ToznyEngineers')

    // Add identity to the group
    await client.updateGroupMembership(realmName, identity_id, {
      groups: [group1.id],
    })

    // List out the groups the identity is in, expected only ToznyEngineers
    const responseToznyEngineers = await client.groupMembership(
      realmName,
      identity_id
    )
    // Check to make sure the group we added is the only group
    expect(responseToznyEngineers).toBeInstanceOf(Array)
    expect(responseToznyEngineers).toHaveLength(1)
    expect(responseToznyEngineers[0].id).toBeTruthy()
    expect(responseToznyEngineers[0].name).toBe('ToznyEngineers')

    // Leave the group
    await client.leaveGroups(realmName, identity_id, { groups: [group1.id] })

    // Check group membership expected to be 0
    const empty = await client.groupMembership(realmName, identity_id)
    expect(empty).toBeInstanceOf(Array)
    expect(empty).toHaveLength(0)

    // Create 2 new groups
    const group2 = await client.createRealmGroup(realmName, { name: 'ToznyHR' })
    expect(group2.id).toBeTruthy()
    expect(group2.name).toBe('ToznyHR')
    const group3 = await client.createRealmGroup(realmName, {
      name: 'ToznyOps',
    })
    expect(group3.id).toBeTruthy()
    expect(group3.name).toBe('ToznyOps')
    // Join all 3 groups
    await client.joinGroups(realmName, identity_id, {
      groups: [group1.id, group2.id, group3.id],
    })

    // Check membership for all 3 groups
    const allGroups = await client.groupMembership(realmName, identity_id)
    expect(allGroups).toBeInstanceOf(Array)
    expect(allGroups).toHaveLength(3)
    expect(allGroups[0].id).toBeTruthy()
    expect(allGroups[0].name).toBe('ToznyEngineers')
    expect(allGroups[1].id).toBeTruthy()
    expect(allGroups[1].name).toBe('ToznyHR')
    expect(allGroups[2].id).toBeTruthy()
    expect(allGroups[2].name).toBe('ToznyOps')
  })
})
