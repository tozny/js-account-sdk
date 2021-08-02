import Account from '../account'
// @ts-ignore no type defs exist for js-sdk
import Tozny from '@toznysecure/sdk/node'
import { v4 as uuidv4 } from 'uuid'
import { cleanupRealms } from './utils'
import { Role } from '../types'

// default of 5s is sometimes, but not always, enough time. give the tests 10s
jest.setTimeout(10000)

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

describe('Realm Roles', () => {
  it('creates, lists, & deletes roles', async () => {
    // creating
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

    const chef = await client.createRealmRole(realmName, {
      name: 'Chef',
      description: 'They cook things.',
    })

    // listing
    const realmRoles: Role[] = await client.listRealmRoles(realmName)
    // there are two default roles plus the two created above
    expect(realmRoles).toHaveLength(4)

    const roleNames = realmRoles.map(r => r.name)
    expect(roleNames).toContain('offline_access')
    expect(roleNames).toContain('uma_authorization')
    expect(roleNames).toContain(superhuman.name)
    expect(roleNames).toContain(chef.name)

    const roleIds = realmRoles.map(r => r.id)
    expect(roleIds).toContain(superhuman.id)
    expect(roleIds).toContain(chef.id)

    // deleting
    // NO MORE CHEFS!
    const deleted = await client.deleteRealmRole(realmName, chef.id)
    expect(deleted).toBeTruthy()

    const listed: Role[] = await client.listRealmRoles(realmName)
    expect(listed).toHaveLength(3)
    expect(listed.map(r => r.id)).not.toContain(chef.id)
  })
})
