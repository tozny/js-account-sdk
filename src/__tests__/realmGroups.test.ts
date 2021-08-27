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
  it('creates, updates, lists, & deletes realm groups', async () => {
    // creation of group
    const adminGroup = await client.createRealmGroup(realmName, {
      name: 'Admins',
      attributes: {
        key1: 'value1',
        key2: 'value2'
      }
    })

    expect(adminGroup.id).toBeTruthy()
    expect(adminGroup.name).toBe('Admins')
    expect(adminGroup.attributes.key1).toBe('value1')
    expect(adminGroup.attributes.key2).toBe('value2')

    // list groups
    const groups = await client.listRealmGroups(realmName)

    expect(groups).toHaveLength(1)
    expect(groups[0].id).toBe(adminGroup.id)
    expect(groups[0].name).toBe('Admins')

    // updates a group
    const updatedGroup = await client.updateRealmGroup(realmName, adminGroup.id, {
      name: 'Updated',
      attributes: {
        key2: 'updated',
        key3: 'new',
      }
    })

    expect(updatedGroup.name).toBe('Updated')
    expect(updatedGroup.attributes.key1).toBeUndefined()
    expect(updatedGroup.attributes.key2).toBe('updated')
    expect(updatedGroup.attributes.key3).toBe('new')

    // deletes groups
    const deleteSuccessful = await client.deleteRealmGroup(
      realmName,
      adminGroup.id
    )
    expect(deleteSuccessful).toBeTruthy()

    // ensure it really was deleted
    expect(await client.listRealmGroups(realmName)).toHaveLength(0)
  })

  it('describes a group by id', async () => {
    const veggies = await client.createRealmGroup(realmName, {
      name: 'Vegetables',
    })

    const described = await client.describeRealmGroup(realmName, veggies.id)
    expect(described.id).toBe(veggies.id)
    expect(described.name).toBe('Vegetables')

    // sad but true, we throw 500 on nonexistent entity, not 404
    await expect(
      client.describeRealmGroup(
        realmName,
        '000000000000-0000-0000-0000-00000000'
      )
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Internal Server Error"`)
  })

  it('has optional attributes', async () => {
    const createdWithoutAttributes = await client.createRealmGroup(realmName, {
      name: 'Without',
    })
    const createdWithAttributes = await client.createRealmGroup(realmName, {
      name: 'With',
      attributes: {
        key1: 'value1',
        key2: 'value2'
      }
    })

    const withoutAttributes = await client.describeRealmGroup(realmName, createdWithoutAttributes.id)
    const withAttributes = await client.describeRealmGroup(realmName, createdWithAttributes.id)

    expect(withoutAttributes.attributes).toStrictEqual({})
    expect(withAttributes.attributes).toMatchObject({ key1: 'value1'})
    expect(withAttributes.attributes).toMatchObject({ key2: 'value2'})
  })
})
