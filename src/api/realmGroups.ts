import { ToznyAPIGroup } from '../types/group'
import { checkStatus, validateRequestAsJSON } from '../utils'
import { APIContext } from './context'

type CreateRealmGroupData = {
  realmName: string
  group: {
    name: string
    attributes?: Record<string, string>
  }
}

// transformAttributesForApi converts attributes to expected api format
// { key1: 'value1' } becomes { key1: ['value1']}
function transformAttributesForApi(payload: any) {
  const attributes: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(payload.attributes || {})) {
    attributes[key] = [<string>value]
  }
  payload.attributes = attributes

  return payload
}

export async function createRealmGroup(
  { realmName, group }: CreateRealmGroupData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIGroup> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/group`,
    {
      method: 'POST',
      body: JSON.stringify(transformAttributesForApi(group)),
    }
  )
  return validateRequestAsJSON(response)
}

type UpdateRealmGroupData = {
  realmName: string
  groupId: string
  group: {
    name: string
    attributes?: Record<string, string>
  }
}
export async function updateRealmGroup(
  { realmName, groupId, group }: UpdateRealmGroupData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIGroup> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/group/${groupId}`,
    {
      method: 'PUT',
      body: JSON.stringify(transformAttributesForApi(group)),
    }
  )
  return validateRequestAsJSON(response)
}

type DeleteRealmGroupData = { realmName: string; groupId: string }
export async function deleteRealmGroup(
  { realmName, groupId }: DeleteRealmGroupData,
  { apiUrl, queenClient }: APIContext
): Promise<boolean> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/group/${groupId}`,
    { method: 'DELETE' }
  )
  checkStatus(response)
  return true
}

type DescribeRealmGroupData = { realmName: string; groupId: string }
export async function describeRealmGroup(
  { realmName, groupId }: DescribeRealmGroupData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIGroup> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/group/${groupId}`,
    { method: 'GET' }
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
