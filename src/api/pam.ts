import { validateRequestAsJSON, checkStatus } from '../utils'
import { APIContext } from './context'
import { ToznyAPIRole } from '../types/role'
import AccessPolicy, { ToznyAPIAccessPolicy } from '../types/accessPolicy'
import { roleToAPI } from '../types/role'

type PAMRealmSettings = {
  mpc_enabled_for_realm: boolean
  default_access_duration_seconds: number
  default_required_approvals: number
}

type GroupAccessPolicies = {
  id: string
  access_policies: ToznyAPIAccessPolicy[]
}

type ListAccessPolicyData = {
  realmName: string
  groupIds: []
}

type ListAccessPolicyResponse = {
  settings: PAMRealmSettings
  groups: GroupAccessPolicies[]
}

export async function listAccessPolicies(
  { realmName, groupIds }: ListAccessPolicyData,
  { apiUrl, queenClient }: APIContext
): Promise<ListAccessPolicyResponse> {
  var query = new URLSearchParams()
  query.set('realm_name', encodeURIComponent(realmName))
  groupIds.forEach(groupId =>
    query.append('group_ids', encodeURIComponent(groupId))
  )
  const request = await queenClient.authenticator.tsv1Fetch(
    apiUrl + '/v1/identity/pam/polcies?${query.toString()}',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  const accessPolicyResponse = (await validateRequestAsJSON(
    request
  )) as ListAccessPolicyResponse
  return accessPolicyResponse
}

type UpsertPolicyData = {
  realmName: string
  groupId: string
  accessPolicies: AccessPolicy[]
}
export async function UpsertAccessPolicies(
  { realmName, groupId, accessPolicies }: UpsertPolicyData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  const payload = {
    realm_name: realmName,
    group: {
      id: groupId,
      accessPolicies: accessPolicies.map(ap => ({
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )
  checkStatus(response)
  return
}
