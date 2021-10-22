import Account from '../account'
// @ts-ignore no type defs exist for js-sdk
import Tozny from '@toznysecure/sdk/node'
import { v4 as uuidv4 } from 'uuid'
import { cleanupRealms } from './utils'
import { Role } from '../types'

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

  realmName = `TestRealm${seed.split('-')[0]}`
  sovereignName = 'yassqueen'
  await client.createRealm(realmName, sovereignName)
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Identity', () => {
  it('Can Create and list a Access Policy', async () => {
    // creation of group
    const adminGroup = await client.createRealmGroup(realmName, {
      name: 'Admins',
      attributes: {
        key1: 'value1',
        key2: 'value2',
      },
    })

    expect(adminGroup.id).toBeTruthy()
    expect(adminGroup.name).toBe('Admins')
    expect(adminGroup.attributes.key1).toBe('value1')
    expect(adminGroup.attributes.key2).toBe('value2')
    // list groups expected to have Admins
    const groups = await client.listRealmGroups(realmName)
    expect(groups).toHaveLength(1)
    expect(groups[0].id).toBe(adminGroup.id)
    expect(groups[0].name).toBe('Admins')

    // List all current realm roles
    const realmRoles: Role[] = await client.listRealmRoles(realmName)
    // there are two default roles plus the two created above
    expect(realmRoles).toHaveLength(4)
    const roleNames = realmRoles.map(r => r.name)
    // 2 default realm roles
    expect(roleNames).toContain('offline_access')
    expect(roleNames).toContain('uma_authorization')
    // TODO Need to update Realm Settings
  })
})
