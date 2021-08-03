import { ToznyAPIGroup } from '../types/group'
import { checkStatus, validateRequestAsJSON } from '../utils'
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

type DeleteRealmGroupData = { realmName: string; groupId: string }
export async function deleteRealmGroup(
  { realmName, groupId }: DeleteRealmGroupData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/group/${groupId}`,
    { method: 'DELETE' }
  )
  checkStatus(response)
  return
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
