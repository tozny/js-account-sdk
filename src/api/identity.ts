import { ToznyAPIIdentity } from '../types/identity'
import { validateRequestAsJSON, checkStatus } from '../utils'
import { APIContext } from './context'
import { getRealmInfo } from './realmSettings'

type IdentityRegistrationData = {
  name: string
  email: string
  first_name: string
  last_name: string
  public_key: string
  signing_key: string
}
type RegisterIdentityData = {
  realmName: string
  realmRegistrationToken: string
  identity: IdentityRegistrationData
}

type RegisterIdentityResponse = {
  identity: ToznyAPIIdentity
  realm_broker_identity_tozny_id: string
}

export async function registerIdentity(
  { realmName, realmRegistrationToken, identity }: RegisterIdentityData,
  ctx: APIContext
): Promise<RegisterIdentityResponse> {
  const info = await getRealmInfo({ realmName }, ctx)
  const username = identity.name.toLowerCase()
  const payload = {
    realm_registration_token: realmRegistrationToken,
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
  const request = await fetch(ctx.apiUrl + '/v1/identity/register', {
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
