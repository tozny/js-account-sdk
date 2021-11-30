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

  realmName = `TestRealm${seed.split('-')[0]}`
  const sovereignName = 'YassQueen'
  await client.createRealm(realmName, sovereignName)
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Realm Roles', () => {
  it('creates, updates, lists, & deletes roles', async () => {
    // create a realm role
    const superhuman = await client.createRealmRole(realmName, {
      name: 'Superhuman',
      description: 'Someone really great at things',
    })

    expect(superhuman).toBeInstanceOf(Role)
    expect(superhuman.name).toMatchInlineSnapshot(`"Superhuman"`)
    expect(superhuman.description).toMatchInlineSnapshot(
      `"Someone really great at things"`
    )
    // gets id from server
    expect(superhuman.id).toBeTruthy()

    // Create another realm role
    const chef = await client.createRealmRole(realmName, {
      name: 'Chef',
      description: 'They cook things.',
    })

    // List all current realm roles
    const realmRoles: Role[] = await client.listRealmRoles(realmName)
    // there are two default roles plus the two created above
    expect(realmRoles).toHaveLength(4)

    const roleNames = realmRoles.map(r => r.name)
    // 2 default realm roles
    expect(roleNames).toContain('offline_access')
    expect(roleNames).toContain('uma_authorization')
    // Realm roles created
    expect(roleNames).toContain(superhuman.name)
    expect(roleNames).toContain(chef.name)

    const roleIds = realmRoles.map(r => r.id)
    expect(roleIds).toContain(superhuman.id)
    expect(roleIds).toContain(chef.id)

    // update realm role
    chef.name = 'Updated Name'
    chef.description = 'Updated Description'
    const updatedChef = await client.updateRealmRole(realmName, chef)
    expect(updatedChef.name).toBe('Updated Name')
    expect(updatedChef.description).toBe('Updated Description')

    // deleting
    // NO MORE CHEFS!
    const deleted = await client.deleteRealmRole(realmName, chef.id)
    expect(deleted).toBeTruthy()

    const listed: Role[] = await client.listRealmRoles(realmName)
    expect(listed).toHaveLength(3)
    expect(listed.map(r => r.id)).not.toContain(chef.id)
  })

  it('describes a role by id', async () => {
    const chef = await client.createRealmRole(realmName, {
      name: 'Chef',
      description: 'They cook things.',
    })

    const described = await client.describeRealmRole(realmName, chef.id)
    expect(described.id).toBe(chef.id)
    expect(described.name).toBe('Chef')

    // sad but true, we throw 500 on nonexistent entity, not 404
    await expect(
      client.describeRealmRole(
        realmName,
        '000000000000-0000-0000-0000-00000000'
      )
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Internal Server Error"`)
  })
})
