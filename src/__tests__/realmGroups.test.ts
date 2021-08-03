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

describe('Realm Groups', () => {
  it('creates realm groups', async () => {
    const adminGroup = await client.createRealmGroup(realmName, {
      name: 'Admins',
    })

    expect(adminGroup.id).toBeTruthy()
    expect(adminGroup.name).toBe('Admins')

    const groups = await client.listRealmGroups(realmName)

    expect(groups).toHaveLength(1)
    expect(groups[0].id).toBe(adminGroup.id)
    expect(groups[0].name).toBe('Admins')
  })
})
