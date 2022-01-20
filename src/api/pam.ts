import {
  AccessPolicyData,
  ToznyAPIGroupAccessPolicies,
} from '../types/accessPolicy'
import { ToznyAPIListAccessPoliciesResponse } from '../types/listAccessPoliciesResponse'
import { roleToAPI } from '../types/role'
import { validateRequestAsJSON } from '../utils'
import { APIContext } from './context'

type ListAccessPoliciesData = {
  realmName: string
  groupIds: string[]
}
export async function listAccessPoliciesForGroups(
  { realmName, groupIds }: ListAccessPoliciesData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIListAccessPoliciesResponse> {
  // build query string
  const query = new URLSearchParams()
  query.set('realm_name', encodeURIComponent(realmName))
  groupIds.forEach((groupId) =>
    query.append('group_ids', encodeURIComponent(groupId))
  )
  // send request
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/pam/policies?${query.toString()}`,
    { method: 'GET' }
  )
  const data: ToznyAPIListAccessPoliciesResponse = await validateRequestAsJSON(
    response
  )
  return data
}

type UpsertPolicyData = {
  realmName: string
  groupId: string
  accessPolicies: AccessPolicyData[]
}
type UpsertPoliciesResponse = { group: ToznyAPIGroupAccessPolicies }
export async function upsertAccessPoliciesForGroup(
  { realmName, groupId, accessPolicies }: UpsertPolicyData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIGroupAccessPolicies> {
  const payload = {
    realm_name: realmName,
    group: {
      id: groupId,
      access_policies: accessPolicies.map((ap) => ({
        id: ap.id,
        required_approvals: ap.requiredApprovals,
        max_access_duration_seconds: ap.maxAccessDurationSeconds,
        approval_roles: ap.approvalRoles.map(roleToAPI),
      })),
    },
  }
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/pam/policies`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  )
  const data: UpsertPoliciesResponse = await validateRequestAsJSON(response)
  return data.group
}
