import AccessPolicy, {
  GroupAccessPolicies,
  ToznyAPIGroupAccessPolicies,
} from './accessPolicy'

class ListAccessPoliciesResponse {
  constructor(
    public settings: RealmPAMSettings,
    public groupAccessPolicies: GroupAccessPolicies[]
  ) {}

  static decode(
    api: ToznyAPIListAccessPoliciesResponse
  ): ListAccessPoliciesResponse {
    const groups: GroupAccessPolicies[] = api.groups.map(
      ({ id, access_policies }) => ({
        id,
        accessPolicies: access_policies.map(AccessPolicy.decode),
      })
    )
    const settings: RealmPAMSettings = {
      defaultAccessDurationSeconds:
        api.settings.default_access_duration_seconds,
      defaultRequiredApprovals: api.settings.default_required_approvals,
      mpcEnabledForRealm: api.settings.mpc_enabled_for_realm,
    }
    return new ListAccessPoliciesResponse(settings, groups)
  }
}

export type RealmPAMSettings = {
  defaultAccessDurationSeconds: number
  defaultRequiredApprovals: number
  mpcEnabledForRealm: boolean
}

export type ToznyAPIListAccessPoliciesResponse = {
  settings: {
    mpc_enabled_for_realm: boolean
    default_access_duration_seconds: number
    default_required_approvals: number
  }
  groups: ToznyAPIGroupAccessPolicies[]
}

export default ListAccessPoliciesResponse
