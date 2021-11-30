import { v4 as uuidv4 } from 'uuid'
import Account, { Client } from '..'

type TestRealmData = {
  client: Client
  realmName: string
}
export async function createTestRealm(
  accountFactory: Account
): Promise<TestRealmData> {
  const seed = uuidv4()
  const name = `Test Account ${seed}`
  const email = `test-emails-group+${seed}@tozny.com`
  const password = uuidv4()
  const registration: any = await accountFactory.register(name, email, password)
  const client = registration.client as Client

  const realmName = `TestRealm${seed.split('-')[0]}`
  const sovereignName = 'yassqueen'
  await client.createRealm(realmName, sovereignName)

  return { client, realmName }
}

/**
 * cleanupRealms deletes all realms associated with a Tozny client.
 */
export async function cleanupRealms(client: Client): Promise<void> {
  // Cleanup all created realms
  const realms = await client.listRealms()
  for (let realm of realms.realms) {
    await client.deleteRealm(realm.name)
  }
}
