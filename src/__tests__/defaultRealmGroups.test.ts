import Account from '../account'
// @ts-ignore no type defs exist for js-sdk
import Tozny from '@toznysecure/sdk/node'
import { v4 as uuidv4 } from 'uuid'
import { cleanupRealms } from './utils'

const accountFactory = new Account(Tozny, process.env.API_URL)
let client: any = null
let realmName: string

beforeAll(async () => {
  // Create an account to re-use across test cases
  const seed = uuidv4()
  const name = `Test Account ${seed}`
  const email = `test+${seed}@tozny.com`
  const password = uuidv4()
  const registration: any = await accountFactory.register(name, email, password)
  client = registration.client

  realmName = `TestRealm${seed.split('-')[0]}`
  const sovereignName = 'YassQueen'
  await client.createRealm(realmName, sovereignName)
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Default Realm Groups', () => {
  it('adds, updates, lists, & deletes default realm groups', async () => {
    // Create a realm group
    const adminGroup = await client.createRealmGroup(realmName, {
      name: 'Admins',
    })
    expect(adminGroup.id).toBeTruthy()
    expect(adminGroup.name).toBe('Admins')

    // List Default Groups
    const emptyGroup = await client.listDefaultRealmGroups(realmName)
    expect(emptyGroup).toHaveLength(0)

    // Add Default Group
    await client.addDefaultRealmGroups(realmName, { groups: [adminGroup.id] })
    // List Default Groups expected to have one
    const groups = await client.listDefaultRealmGroups(realmName)
    expect(groups).toHaveLength(1)
    expect(groups[0].id).toBe(adminGroup.id)
    expect(groups[0].name).toBe('Admins')
    // Create one more  default group
    const veggies = await client.createRealmGroup(realmName, {
      name: 'Vegetables',
    })
    // Replace Default Groups for the Realm
    await client.replaceDefaultRealmGroups(realmName, {
      groups: [adminGroup.id, veggies.id],
    })
    // List Default Groups expected to have 2 groups
    const groups2 = await client.listDefaultRealmGroups(realmName)
    expect(groups2).toHaveLength(2)
    expect(groups2[0].id).toBe(adminGroup.id)
    // Expected to be Admins
    expect(groups2[0].name).toBe('Admins')
    expect(groups2[1].id).toBe(veggies.id)
    // Expected to be Vegetables
    expect(groups2[1].name).toBe('Vegetables')
    // Remove Admin as a Default Group
    await client.removeDefaultRealmGroups(realmName, {
      groups: [adminGroup.id],
    })
    // List Default Groups expected to have only Vegetables
    const groups3 = await client.listDefaultRealmGroups(realmName)
    expect(groups3).toHaveLength(1)
    expect(groups3[0].id).toBe(veggies.id)
    expect(groups3[0].name).toBe('Vegetables')
    // Replace Current Default Group with  OnlyAdmins
    await client.replaceDefaultRealmGroups(realmName, {
      groups: [adminGroup.id],
    })
    // List Default Groups expected to have one
    const groups4 = await client.listDefaultRealmGroups(realmName)
    expect(groups4).toHaveLength(1)
    expect(groups4[0].id).toBe(adminGroup.id)
    expect(groups4[0].name).toBe('Admins')
  })
})
