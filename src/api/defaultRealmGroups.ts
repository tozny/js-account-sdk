import Group, { ToznyAPIGroup } from '../types/group'
import { checkStatus, validateRequestAsJSON } from '../utils'
import { APIContext } from './context'

type GroupsInput = { groups: (Group | Group['id'])[] }

type ListDefaultRealmGroupsData = { realmName: string }
type ListDefaultRealmGroupsResponse = { groups: ToznyAPIGroup[] }
export async function listDefaultRealmGroups(
  { realmName }: ListDefaultRealmGroupsData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIGroup[]> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/default-groups`,
    { method: 'GET' }
  )
  const { groups } = (await validateRequestAsJSON(
    response
  )) as ListDefaultRealmGroupsResponse
  return groups
}

type ReplaceDefaultRealmGroupsData = {
  realmName: string
  groups: GroupsInput
}
export async function replaceDefaultRealmGroups(
  { realmName, groups }: ReplaceDefaultRealmGroupsData,
  { apiUrl, queenClient }: APIContext
): Promise<boolean> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/default-groups`,
    {
      method: 'PUT',
      body: JSON.stringify(groups),
    }
  )
  checkStatus(response)
  return true
}

type AddDefaultRealmGroupsData = { realmName: string; groups: GroupsInput }
export async function addDefaultRealmGroups(
  { realmName, groups }: AddDefaultRealmGroupsData,
  { apiUrl, queenClient }: APIContext
): Promise<boolean> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/default-groups`,
    {
      method: 'PATCH',
      body: JSON.stringify(groups),
    }
  )
  checkStatus(response)
  return true
}

type RemoveDefaultRealmGroupsData = { realmName: string; groups: GroupsInput }
export async function removeDefaultRealmGroups(
  { realmName, groups }: RemoveDefaultRealmGroupsData,
  { apiUrl, queenClient }: APIContext
): Promise<boolean> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/default-groups`,
    {
      method: 'DELETE',
      body: JSON.stringify(groups),
    }
  )
  checkStatus(response)
  return true
}
