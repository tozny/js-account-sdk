import { ToznyAPIIdentity } from '../types/identity'
import { validateRequestAsJSON, checkStatus } from '../utils'
import { APIContext } from './context'

type IdentityRegistrationData = {
  name: string
  email: string
  first_name: string
  last_name: string
  public_key: string
  signing_key: string
}
type RegisterIdentityData = {
  realm_name: string
  realm_registration_token: string
  identity: IdentityRegistrationData
}

type RegisterIdentityResponse = {
  identity: ToznyAPIIdentity
  realm_broker_identity_tozny_id: string
}

type RealmInfoData = {
  realm_name: string
  apiUrl: string
}
type RealmInfoResponse = {
  domain: string
  name: string
}
export async function realmInfo({
  realm_name,
  apiUrl,
}: RealmInfoData): Promise<RealmInfoResponse> {
  let lowerCasedRealmName = realm_name.toLowerCase()
  const response = await fetch(
    `${apiUrl}/v1/identity/info/realm/${lowerCasedRealmName}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  const realmInfo = (await validateRequestAsJSON(response)) as RealmInfoResponse
  return realmInfo
}
export async function registerIdentity(
  { realm_name, realm_registration_token, identity }: RegisterIdentityData,
  { apiUrl }: APIContext
): Promise<RegisterIdentityResponse> {
  const info = await realmInfo({ realm_name, apiUrl })
  let username = identity.name.toLowerCase()
  const payload = {
    realm_registration_token: realm_registration_token,
    realm_name: info.domain,
    identity: {
      realm_name: info.domain,
      name: username,
      public_key: identity.public_key,
      signing_key: identity.signing_key,
      first_name: identity.first_name,
      last_name: identity.last_name,
      email: identity.email,
    },
  }
  const request = await fetch(apiUrl + '/v1/identity/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const identityResponse = (await validateRequestAsJSON(
    request
  )) as RegisterIdentityResponse
  return identityResponse
}
type DeleteIdentityData = {
  realmName: string
  identityId: string
}
export async function deleteIdentity(
  { realmName, identityId }: DeleteIdentityData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  const response = await queenClient.authenticator.tsv1Fetch(
    `${apiUrl}/v1/identity/realm/${realmName}/identity/${identityId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  checkStatus(response)
  return
}

type RealmSettingData = {
  realm_name: string
  apiUrl: string
  secretsEnabled: boolean
  mfaAvailable: []
  emailLookupsEnabled: boolean
  tozIDFederationEnabled: boolean
  mpcEnabled: boolean
}

export async function updateRealmSettings(
  {
    realm_name,
    secretsEnabled,
    mfaAvailable,
    emailLookupsEnabled,
    tozIDFederationEnabled,
    mpcEnabled,
  }: RealmSettingData,
  { apiUrl, queenClient }: APIContext
): Promise<void> {
  // Get the Realm Domain
  const info = await realmInfo({ realm_name, apiUrl })
  const payload = {
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )
  checkStatus(response)
  return
}
