import { ToznyAPIGroupRoleMapping } from '../types/groupRoleMapping'
import { checkStatus, validateRequestAsJSON } from '../utils'
import { APIContext } from './context'

/** Minimal set of data required for role info */
interface RoleData {
  id: string
  name: string
  description: string
}

/** Minimal set of data required for role mapping input */
export type GroupRoleMappingInput = {
  realm?: RoleData[]
  client?: Record<string, RoleData[]>
}

const roleMappingForGroupUri = (
  apiUrl: string,
  realmName: string,
  groupId: string
): String =>
  `${apiUrl}/v1/identity/realm/${realmName}/group/${groupId}/role_mapping`

type ListGroupRoleMappingsData = { groupId: string; realmName: string }
export async function listGroupRoleMappings(
  { groupId, realmName }: ListGroupRoleMappingsData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIGroupRoleMapping> {
  const response = await queenClient.authenticator.tsv1Fetch(
    roleMappingForGroupUri(apiUrl, realmName, groupId),
    { method: 'GET' }
  )
  return validateRequestAsJSON(response)
}

type AddRemoveGroupRoleMappingData = {
  realmName: string
  groupId: string
  groupRoleMapping: GroupRoleMappingInput
}
export async function addGroupRoleMappings(
  { realmName, groupId, groupRoleMapping }: AddRemoveGroupRoleMappingData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  const response = await queenClient.authenticator.tsv1Fetch(
    roleMappingForGroupUri(apiUrl, realmName, groupId),
    {
      method: 'POST',
      body: JSON.stringify(groupRoleMapping),
    }
  )
  checkStatus(response)
  return
}

export async function removeGroupRoleMappings(
  { realmName, groupId, groupRoleMapping }: AddRemoveGroupRoleMappingData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  const response = await queenClient.authenticator.tsv1Fetch(
    roleMappingForGroupUri(apiUrl, realmName, groupId),
    {
      method: 'DELETE',
      body: JSON.stringify(groupRoleMapping),
    }
  )
  checkStatus(response)
  return
}
