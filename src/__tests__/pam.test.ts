// @ts-ignore no type defs exist for js-sdk
import Tozny from '@toznysecure/sdk/node'
import { Account, Client } from '..'
import { cleanupRealms, createTestRealm } from './utils'

const accountFactory = new Account(Tozny, process.env.API_URL)
let client: Client
let realmName: string

beforeAll(async () => {
  const data = await createTestRealm(accountFactory)
  client = data.client
  realmName = data.realmName
})

afterAll(async () => {
  await cleanupRealms(client)
})

describe('Access Policies', () => {
  it('Can create, update, & list access policies', async () => {
    // setup
    const group = await client.createRealmGroup(realmName, {
      name: 'Admins',
    })
    const role = await client.createRealmRole(realmName, {
      name: 'approver-role',
      description: 'It will be the role approvers must have.',
    })
    const otherRole = await client.createRealmRole(realmName, {
      name: 'approver-role-2',
      description: 'A different role for approvers.',
    })

    // arrange
    // enable MPC for realm
    await client.updateRealmSettings(realmName, { mpcEnabled: true })
    const initialAccessPolicyData = {
      approvalRoles: [role],
      requiredApprovals: 1,
      maxAccessDurationSeconds: 3600 * 60,
    }

    // act
    //fetch policies
    const initial = await client.listAccessPoliciesForGroups(realmName, [
      group.id,
    ])
    // create new access policy
    const groupAccessPolicies = await client.upsertAccessPoliciesForGroup(
      realmName,
      group.id,
      [initialAccessPolicyData]
    )
    // fetch policies
    const afterCreate = await client.listAccessPoliciesForGroups(realmName, [
      group.id,
    ])
    const policyId = afterCreate.groupAccessPolicies[0].accessPolicies[0].id
    // update access policy
    const updated = Object.assign(initialAccessPolicyData, {
      id: policyId,
      approvalRoles: [otherRole],
    })
    const updatedGroupAccessPolicies = await client.upsertAccessPoliciesForGroup(
      realmName,
      group.id,
      [updated]
    )
    // remove access policy
    const removedGroupAccessPolicies = await client.upsertAccessPoliciesForGroup(
      realmName,
      group.id,
      []
    )
    // final fetch
    const afterRemove = await client.listAccessPoliciesForGroups(realmName, [
      group.id,
    ])

    // assert
    expect(initial.groupAccessPolicies).toHaveLength(1)
    expect(initial.groupAccessPolicies[0].id).toEqual(group.id)
    expect(initial.groupAccessPolicies[0].accessPolicies).toHaveLength(0)
    expect(initial.settings.mpcEnabledForRealm).toBeTruthy()
    expect(initial.settings.defaultRequiredApprovals).toBeGreaterThan(0)
    expect(initial.settings.defaultAccessDurationSeconds).toBeGreaterThan(0)

    expect(groupAccessPolicies.id).toEqual(group.id)
    expect(groupAccessPolicies.accessPolicies).toHaveLength(1)
    expect(groupAccessPolicies.accessPolicies[0].id).toBeTruthy()
    expect(groupAccessPolicies.accessPolicies[0].approvalRoles).toHaveLength(1)
    expect(groupAccessPolicies.accessPolicies[0].approvalRoles[0].id).toEqual(
      role.id
    )

    expect(afterCreate.groupAccessPolicies).toHaveLength(1)
    expect(afterCreate.groupAccessPolicies[0].id).toEqual(group.id)
    expect(afterCreate.groupAccessPolicies[0].accessPolicies).toHaveLength(1)
    expect(afterCreate.groupAccessPolicies[0].accessPolicies[0].id).toEqual(
      policyId
    )

    expect(updatedGroupAccessPolicies.id).toEqual(group.id)
    expect(updatedGroupAccessPolicies.accessPolicies).toHaveLength(1)
    expect(updatedGroupAccessPolicies.accessPolicies[0].id).toBe(policyId)
    expect(
      updatedGroupAccessPolicies.accessPolicies[0].approvalRoles
    ).toHaveLength(1)
    expect(
      updatedGroupAccessPolicies.accessPolicies[0].approvalRoles[0].id
    ).toEqual(otherRole.id)

    expect(removedGroupAccessPolicies.id).toEqual(group.id)
    expect(removedGroupAccessPolicies.accessPolicies).toHaveLength(0)

    expect(afterRemove.groupAccessPolicies).toHaveLength(1)
    expect(afterRemove.groupAccessPolicies[0].id).toEqual(group.id)
    expect(afterRemove.groupAccessPolicies[0].accessPolicies).toHaveLength(0)
  })
})
