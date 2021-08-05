import Account from '../account'
// @ts-ignore no type defs exist for js-sdk
import Tozny from '@toznysecure/sdk/node'
import { v4 as uuidv4 } from 'uuid'
import { cleanupRealms } from './utils'
import { Group } from '../types'

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

  realmName = `TestRealm${seed.split('-')[0]}`.toLowerCase()
  const sovereignName = 'YassQueen'
  await client.createRealm(realmName, sovereignName)
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Group Role Mappings', () => {
  it('lists group role mappings', async () => {
    const group = await client.createRealmGroup(realmName, { name: 'Chefs' })

    const roleMappings = await client.listGroupRoleMappings(realmName, group.id)

    expect(roleMappings.clients).toEqual({})
    expect(roleMappings.realm).toBeInstanceOf(Array)
    expect(roleMappings.realm).toHaveLength(0)
  })
})
