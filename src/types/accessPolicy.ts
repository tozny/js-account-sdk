import Role, { ToznyAPIRole } from './role'

class AccessPolicy {
  id: string
  approvalRoles: Role[]
  requiredApprovals: string
  maxAccessDurationSeconds: string

  constructor(
    id: string,
    approval_roles: Role[],
    required_approvals: string,
    max_access_duration_seconds: string
  ) {
    this.id = id
    this.approvalRoles = approval_roles
    this.maxAccessDurationSeconds = max_access_duration_seconds
    this.requiredApprovals = required_approvals
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * access_policy = AccessPolicy::decode({
   *   id: '00000000-0000-0000-0000-000000000000',
   *   approval_roles: Role::decode({
   *   id: '00000000-0000-0000-0000-000000000000',
   *   name: 'jsmith',
   *   description: 'This role provides access to...'
   *   composite: false',
   *   client_role: trie,
   *   container_id: '00000000-0000-0000-0000-000000000000',
   * })
   *   max_access_duration_seconds: '00',
   *   required_approvals: '00',
   * })
   * <code>
   *
   * @param {object} json
   *
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

export type ToznyAPIAccessPolicy = {
  id: string
  approval_roles: ToznyAPIRole[]
  required_approvals: string
  max_access_duration_seconds: string
}

export default AccessPolicy
