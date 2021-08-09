import Account from '../account'
// @ts-ignore no type defs exist for js-sdk
import Tozny from '@toznysecure/sdk/node'
import { v4 as uuidv4 } from 'uuid'
import { cleanupRealms } from './utils'
import { Role } from '../types'

const accountFactory = new Account(Tozny, process.env.API_URL)
let client: any
let realmName: string
let applicationId: string

// this client application id is guaranteed to exist by default
// we find the application and use it's id.
const clientId = 'account-console'

// TODO: remove me once we have list method for application clients!
// we need an existing client to attach roles to. to get the id for a default one,
// we must list the existing client applications
const getApplications = async () =>
  client.queenClient.authenticator
    .tsv1Fetch(
      `${process.env.API_URL}/v1/identity/realm/${realmName}/application`,
      { method: 'GET' }
    )
    .then((res: any) => res.json())

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

  // TODO: when we have application support, replace me.
  const { applications } = await getApplications()
  const app = applications.find(
    (app: { id: string; client_id: string }) => app.client_id === clientId
  )
  applicationId = app.id
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Realm Application Roles', () => {
  it('creates, lists, & deletes application roles', async () => {
    // creating
    const superhuman = await client.createRealmApplicationRole(
      realmName,
      applicationId,
      {
        name: 'Superhuman',
        description: 'Someone really great at things',
      }
    )

    expect(superhuman).toBeInstanceOf(Role)
    expect(superhuman.clientRole).toBeTruthy()
    expect(superhuman.name).toMatchInlineSnapshot(`"Superhuman"`)
    expect(superhuman.description).toMatchInlineSnapshot(
      `"Someone really great at things"`
    )
    // gets id from server
    expect(superhuman.id).toBeTruthy()

    const chef = await client.createRealmApplicationRole(
      realmName,
      applicationId,
      {
        name: 'Chef',
        description: 'They cook things.',
      }
    )

    // listing
    const realmApplicationRoles: Role[] = await client.listRealmApplicationRoles(
      realmName,
      applicationId
    )

    // there is one default role plus the two created above
    expect(realmApplicationRoles).toHaveLength(3)

    const roleNames = realmApplicationRoles.map(r => r.name)
    expect(roleNames).toContain('uma_protection')
    expect(roleNames).toContain(superhuman.name)
    expect(roleNames).toContain(chef.name)

    const roleIds = realmApplicationRoles.map(r => r.id)
    expect(roleIds).toContain(superhuman.id)
    expect(roleIds).toContain(chef.id)

    // deleting
    // NO MORE CHEFS!
    const deleted = await client.deleteRealmApplicationRole(
      realmName,
      applicationId,
      chef.name
    )
    expect(deleted).toBeTruthy()

    const listed: Role[] = await client.listRealmApplicationRoles(
      realmName,
      applicationId
    )
    expect(listed).toHaveLength(2)
    expect(listed.map(r => r.id)).not.toContain(chef.id)
  })

  it('describes a role by id', async () => {
    const chef = await client.createRealmApplicationRole(
      realmName,
      applicationId,
      {
        name: 'Chef',
        description: 'They cook things.',
      }
    )

    const described = await client.describeRealmApplicationRole(
      realmName,
      applicationId,
      chef.name
    )

    expect(described.id).toBe(chef.id)
    expect(described.name).toBe('Chef')

    // sad but true, we throw 500 on nonexistent entity, not 404
    await expect(
      client.describeRealmRole(
        realmName,
        applicationId,
        '000000000000-0000-0000-0000-00000000'
      )
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Internal Server Error"`)
  })
})
