import Account from '../account'
// @ts-ignore no type defs exist for js-sdk
import Tozny from '@toznysecure/sdk/node'
import { v4 as uuidv4 } from 'uuid'
import { cleanupRealms } from './utils'
import { Role } from '../types'

const accountFactory = new Account(Tozny, process.env.API_URL)
let client: any = null
let realmName: string

beforeAll(async () => {
  // Create an account to re-use across test cases
  const seed = uuidv4()
  const name = `Test Account ${seed}`
  const email = `test-emails-group+${seed}@tozny.com`
  const password = uuidv4()
  const registration: any = await accountFactory.register(name, email, password)
  client = registration.client

  realmName = `TestRealm${seed.split('-')[0]}`.toLowerCase()
  const sovereignName = 'YassQueen'
  await client.createRealm(realmName, sovereignName)
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Group Role Mappings', () => {
  it('adds, lists, removes group role mappings', async () => {
    // Create a Realm Group
    const group = await client.createRealmGroup(realmName, { name: 'Chefs' })
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

    const mappingsAfterAdd = await client.listGroupRoleMappings(
      realmName,
      group.id
    )

    // Expected to be 2 mapped roles now
    expect(mappingsAfterAdd.realm).toHaveLength(2)
    expect(
      mappingsAfterAdd.realm.find((r: Role) => r.id === role1.id)
    ).toMatchObject(role1)
    expect(
      mappingsAfterAdd.realm.find((r: Role) => r.id === role2.id)
    ).toMatchObject(role2)

    //  Remove One Role from the group mappings
    const removeResponse = await client.removeGroupRoleMappings(
      realmName,
      group.id,
      { realm: [role1] }
    )

    expect(removeResponse).toBeTruthy()
    // Expected to have one group role
    const mappingsAfterRemove = await client.listGroupRoleMappings(
      realmName,
      group.id
    )

    expect(mappingsAfterRemove.realm).toHaveLength(1)
    expect(mappingsAfterRemove.realm[0].id).toEqual(role2.id)
    expect(mappingsAfterRemove.realm[0].name).toMatchInlineSnapshot(
      `"StovePowers"`
    )
  })
})
