import { Account, Client } from '..'
// @ts-ignore no type defs exist for js-sdk
import Tozny from '@toznysecure/sdk/node'
import { cleanupRealms, createTestRealm } from './utils'

const accountFactory = new Account(Tozny, process.env.API_URL)
let client: Client
let realmName: string

beforeAll(async () => {
  const data = await createTestRealm(accountFactory)
  client = data.client
  realmName = data.realmName
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Realm applications', () => {
  it('can list applications', async () => {
    const clientId = 'account'
    const applications = await client.listApplications(realmName)
    const application = applications.find(app => app.clientId === clientId)
    expect(application).not.toBeUndefined()
  })
  it('can list applications by client ids', async () => {
    // Client IDs for applications that are made on realm creation
    const clientIds = ['account-console', 'account']
    const applications = await client.listApplicationsByClientIDs(
      realmName,
      clientIds
    )
    expect(applications).toHaveLength(2)
    expect(applications[0].clientId).toBe(clientIds[0])
    expect(applications[1].clientId).toBe(clientIds[1])
  })
  it('handles listing applications for invalid client id', async () => {
    // Client ID does not exist
    const clientIds = ['non-existent-app']
    const applications = await client.listApplicationsByClientIDs(
      realmName,
      clientIds
    )
    expect(applications).toHaveLength(0)
  })
})
