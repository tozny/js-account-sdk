import { checkStatus, validateRequestAsJSON } from '../utils'
import { APIContext } from './context'
import { ToznyAPIRole } from '../types/role'

const realmApplicationRoleUri = (
  apiUrl: string,
  realmName: string,
  applicationId: string
): string =>
  `${apiUrl}/v1/identity/realm/${realmName}/application/${applicationId}/role`

type CreateRealmApplicationRoleData = {
  realmName: string
  applicationId: string
  role: { name: string; description: string }
}
export async function createRealmApplicationRole(
  { realmName, applicationId, role }: CreateRealmApplicationRoleData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIRole> {
  const response = await queenClient.authenticator.tsv1Fetch(
    realmApplicationRoleUri(apiUrl, realmName, applicationId),
    {
      method: 'POST',
      body: JSON.stringify(role),
    }
  )
  return validateRequestAsJSON(response)
}

type UpdateRealmApplicationRoleData = {
  realmName: string
  applicationId: string
  originalRoleName: string
  role: { id: string, name: string, description: string }
}
export async function updateRealmApplicationRole(
  { realmName, applicationId, originalRoleName, role }: UpdateRealmApplicationRoleData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIRole> {
  const encodedRoleName = encodeURIComponent(originalRoleName)
  const uri = `${realmApplicationRoleUri(apiUrl, realmName, applicationId)}/${encodedRoleName}`
  const response = await queenClient.authenticator.tsv1Fetch(uri,
    {
      method: 'PUT',
      body: JSON.stringify(role),
    }
  )
  return validateRequestAsJSON(response)
}

type DeleteRealmApplicationRoleData = {
  realmName: string
  applicationId: string
  roleName: string
}
export async function deleteRealmApplicationRole(
  { realmName, applicationId, roleName }: DeleteRealmApplicationRoleData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  const encodedRoleName = encodeURIComponent(roleName)
  const uri = `${realmApplicationRoleUri(apiUrl, realmName, applicationId)}/${encodedRoleName}`
  const response = await queenClient.authenticator.tsv1Fetch(uri, { method: 'DELETE' })
  checkStatus(response)
  return
}

type DescribeRealmApplicationRoleData = {
  realmName: string
  applicationId: string
  roleName: string
}
export async function describeRealmApplicationRole(
  { realmName, applicationId, roleName }: DescribeRealmApplicationRoleData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIRole> {
  const encodedRoleName = encodeURIComponent(roleName)
  const uri = `${realmApplicationRoleUri(apiUrl, realmName, applicationId)}/${encodedRoleName}`
  const response = await queenClient.authenticator.tsv1Fetch(uri, { method: 'GET' })
  return validateRequestAsJSON(response)
}

type ListRealmApplicationRolesData = {
  realmName: string
  applicationId: string
}
type ListRealmApplicationRolesResponse = { application_roles: ToznyAPIRole[] }
export async function listRealmApplicationRoles(
  { realmName, applicationId }: ListRealmApplicationRolesData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIRole[]> {
  const response = await queenClient.authenticator.tsv1Fetch(
    realmApplicationRoleUri(apiUrl, realmName, applicationId),
    { method: 'GET' }
  )
  const { application_roles: roles } = (await validateRequestAsJSON(
    response
  )) as ListRealmApplicationRolesResponse
  return roles
}
