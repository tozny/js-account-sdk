import RealmSettings, { ToznyAPIRealmSettings } from '../types/realmSettings'
import { checkStatus, validateRequestAsJSON } from '../utils'
import { APIContext } from './context'

type RealmInfoData = {
  realmName: string
}
type RealmInfoResponse = {
  domain: string
  name: string
}
/** not publicly exposed. used primarily internally for realmName -> domainName conversion */
export async function getRealmInfo(
  { realmName }: RealmInfoData,
  { apiUrl }: APIContext
): Promise<RealmInfoResponse> {
  const response = await fetch(
    `${apiUrl}/v1/identity/info/realm/${realmName.toLowerCase()}`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  )
  const realmInfo = (await validateRequestAsJSON(response)) as RealmInfoResponse
  return realmInfo
}

type UpdateRealmSettingsData = {
  realmName: string
  apiUrl: string
  settings: RealmSettings
}
export async function updateRealmSettings(
  {
    realmName,
    settings: {
      secretsEnabled,
      mfaAvailable,
      emailLookupsEnabled,
      tozIDFederationEnabled,
      mpcEnabled,
    },
  }: UpdateRealmSettingsData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  // Get the Realm Domain
  const info = await getRealmInfo({ realmName }, { apiUrl, queenClient })
  const payload: ToznyAPIRealmSettings = {
    secrets_enabled: secretsEnabled,
    mfa_available: mfaAvailable,
    email_lookups_enabled: emailLookupsEnabled,
    tozid_federation_enabled: tozIDFederationEnabled,
    mpc_enabled: mpcEnabled,
  }
  // Update Realm Settings
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/admin/realm/info/${info.domain}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  )
  checkStatus(response)
  return
}
