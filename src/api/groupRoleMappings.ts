import { ToznyAPIGroupRoleMapping } from '../types/groupRoleMapping'
import { validateRequestAsJSON } from '../utils'
import { APIContext } from './context'

type ListGroupRoleMappingsData = { groupId: string; realmName: string }
export async function listGroupRoleMappings(
  { groupId, realmName }: ListGroupRoleMappingsData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIGroupRoleMapping> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/group/${groupId}/role_mapping`,
    { method: 'GET' }
  )
  return validateRequestAsJSON(response)
}
