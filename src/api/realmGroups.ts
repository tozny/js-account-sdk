import { ToznyAPIGroup } from '../types/group'
import { validateRequestAsJSON } from '../utils'
import { APIContext } from './context'

type CreateRealmGroupData = {
  realmName: string
  group: { name: string }
}

export async function createRealmGroup(
  { realmName, group }: CreateRealmGroupData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIGroup> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/group`,
    {
      method: 'POST',
      body: JSON.stringify(group),
    }
  )
  return validateRequestAsJSON(response)
}

type ListRealmGroupData = { realmName: string }
type ListRealmGroupsResponse = { groups: ToznyAPIGroup[] }
export async function listRealmGroups(
  { realmName }: ListRealmGroupData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIGroup[]> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/group`,
    { method: 'GET' }
  )
  const { groups } = (await validateRequestAsJSON(
    response
  )) as ListRealmGroupsResponse
  return groups
}
