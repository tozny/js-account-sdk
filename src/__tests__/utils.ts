/**
 * cleanupRealms deletes all realms associated with a Tozny client.
 */
export async function cleanupRealms(client: any): Promise<void> {
  // Cleanup all created realms
  const realms = await client.listRealms()
  for (let realm of realms.realms) {
    await client.deleteRealm(realm.name)
  }
}
