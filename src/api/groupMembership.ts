import { validateRequestAsJSON, checkStatus } from '../utils'
import { APIContext } from './context'
import Group, { ToznyAPIGroup } from '../types/group'

type GroupMembershipData = {
  realmName: string
  identityId: string
}

type GroupsInput = { groups: Group | Group['id'] }

type GroupMembershipResponse = { groups: ToznyAPIGroup[] }
export async function groupMembership(
  { realmName, identityId }: GroupMembershipData,
  { apiUrl, queenClient }: APIContext
): Promise<ToznyAPIGroup[]> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/identity/${identityId}/groups`,
    {
      method: 'GET',
    }
  )
  const { groups } = (await validateRequestAsJSON(
    response
  )) as GroupMembershipResponse
  return groups
}

type UpdateGroupMembershipData = {
  realmName: string
  identityId: string
  groups: GroupsInput
}
export async function updateGroupMembership(
  { realmName, identityId, groups }: UpdateGroupMembershipData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/identity/${identityId}/groups`,
    {
      method: 'PUT',
      body: JSON.stringify(groups),
    }
  )
  checkStatus(response)
  return
}

type JoinGroupsData = {
  realmName: string
  identityId: string
  groups: GroupsInput
}
export async function joinGroups(
  { realmName, identityId, groups }: JoinGroupsData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/identity/${identityId}/groups`,
    {
      method: 'PATCH',
      body: JSON.stringify(groups),
    }
  )
  checkStatus(response)
  return
}

type LeaveGroupsData = {
  realmName: string
  identityId: string
  groups: GroupsInput
}
export async function leaveGroups(
  { realmName, identityId, groups }: LeaveGroupsData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/identity/${identityId}/groups`,
    {
      method: 'DELETE',
      body: JSON.stringify(groups),
    }
  )
  checkStatus(response)
  return
}
