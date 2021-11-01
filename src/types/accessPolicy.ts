import Role, { MinimumRoleWithId, ToznyAPIRole } from './role'

class AccessPolicy {
  id: string
  approvalRoles: Role[]
  requiredApprovals: number
  maxAccessDurationSeconds: number

  constructor(
    id: string,
    approvalRoles: Role[],
    requiredApprovals: number,
    maxAccessDurationSeconds: number
  ) {
    this.id = id
    this.approvalRoles = approvalRoles
    this.maxAccessDurationSeconds = maxAccessDurationSeconds
    this.requiredApprovals = requiredApprovals
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * @param {ToznyAPIAccessPolicy} json
   * @return {<AccessPolicy>}
   */
  static decode(json: ToznyAPIAccessPolicy): AccessPolicy {
    const realmRoles = json.approval_roles.map(Role.decode)
    return new AccessPolicy(
      json.id,
      realmRoles,
      json.required_approvals,
      json.max_access_duration_seconds
    )
  }
}

export type AccessPolicyData = {
  id?: string
  approvalRoles: MinimumRoleWithId[]
  requiredApprovals: number
  maxAccessDurationSeconds: number
}
export type ToznyAPIAccessPolicy = {
  id: string
  approval_roles: ToznyAPIRole[]
  required_approvals: number
  max_access_duration_seconds: number
}

export type GroupAccessPolicies = {
  /** Id of group */
  id: string
  /** List of access policies for group */
  accessPolicies: AccessPolicy[]
}
export type ToznyAPIGroupAccessPolicies = {
  id: string
  access_policies: ToznyAPIAccessPolicy[]
}
export default AccessPolicy
