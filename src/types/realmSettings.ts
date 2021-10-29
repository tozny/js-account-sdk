/**
 * RealmSettings is a simple type that represents custom setting for a realm.
 */
type RealmSettings = {
  emailLookupsEnabled?: boolean
  mfaAvailable?: string[]
  mpcEnabled?: boolean
  secretsEnabled?: boolean
  tozIDFederationEnabled?: boolean
}

/** RealmInfo contains the name & domain name of realm. */
export type RealmInfo = { name: string; domain: string }

export type ToznyAPIRealmSettings = Required<{
  secrets_enabled: RealmSettings['secretsEnabled']
  mfa_available: RealmSettings['mfaAvailable']
  email_lookups_enabled: RealmSettings['emailLookupsEnabled']
  tozid_federation_enabled: RealmSettings['tozIDFederationEnabled']
  mpc_enabled: RealmSettings['mpcEnabled']
}>

/**
 * decodeRealmSettings converts the API response type to the structure used by this package.
 */
export function decodeRealmSettings(api: ToznyAPIRealmSettings): RealmSettings {
  return {
    emailLookupsEnabled: api.secrets_enabled,
    mfaAvailable: api.mfa_available,
    mpcEnabled: api.email_lookups_enabled,
    secretsEnabled: api.tozid_federation_enabled,
    tozIDFederationEnabled: api.mpc_enabled,
  }
}

export default RealmSettings
