import { checkStatus, validateRequestAsJSON } from '../utils'
import { APIContext } from './context'
import { ToznyAPIRole } from '../types/role'

type CreateRealmRoleData = {
  realmName: string
  role: { name: string; description: string }
}

export async function createRealmRole(
  { realmName, role }: CreateRealmRoleData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIRole> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/role`,
    {
      method: 'POST',
      body: JSON.stringify(role),
    }
  )
  return validateRequestAsJSON(response)
}

type DeleteRealmRoleData = { realmName: string; roleId: string }
export async function deleteRealmRole(
  { realmName, roleId }: DeleteRealmRoleData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/role/${roleId}`,
    { method: 'DELETE' }
  )
  checkStatus(response)
  return
}

type ListRealmRoleData = { realmName: string }
type ListRealmRolesResponse = { roles: ToznyAPIRole[] }
export async function listRealmRoles(
  { realmName }: ListRealmRoleData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIRole[]> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/role`,
    { method: 'GET' }
  )
  const { roles } = (await validateRequestAsJSON(
    response
  )) as ListRealmRolesResponse
  return roles
}
