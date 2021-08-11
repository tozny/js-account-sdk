/**
 * A registered Identity for a Tozny realm.
 */
class Identity {
  id: string
  toznyId: string
  realmId: string
  realmName: string
  name: string
  apiKeyId: string
  apiSecretKey: string
  publicKey: string
  signingKey: string
  privateKey: string
  privateSigningKey: string
  email: string

  constructor(
    id: string,
    toznyId: string,
    realmId: string,
    realmName: string,
    name: string,
    apiKeyId: string,
    apiSecretKey: string,
    publicKey: string,
    signingKey: string,
    privateKey: string,
    privateSigningKey: string,
    email: string
  ) {
    this.id = id
    this.toznyId = toznyId
    this.realmId = realmId
    this.realmName = realmName
    this.name = name
    this.apiKeyId = apiKeyId
    this.apiSecretKey = apiSecretKey
    this.publicKey = publicKey
    this.signingKey = signingKey
    this.privateKey = privateKey
    this.privateSigningKey = privateSigningKey
    this.email = email
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * identity = Identity::decode({
   *   id: 0,
   *   tozny_id: '23dee26e-8b4c-4e5b-911f-84fb65586808',
   *   realm_id: 56,
   *   realm_name: '387e7ba1',
   *   name: '387e7ba1_broker_identity_realm_387e7ba1_broker_tozny_client',
   *   api_key_id: '4601691abc53c542252bca4f31b939ed5cea32d3c301cca01b920305197330af',
   *   api_secret_key: '6d4b836124d9f4cf054b8be3f6f46831e220b35f2ba9731d26fa9dfcd1cebe56',
   *   public_key: { curve25519: 'OmQ2DANNDlXRQwFZUAcOnSicSfZKnONnBWxFRFZt3W4' },
   *   signing_key: { ed25519: '7oOXyq7bVW5SWqv57RUkeb92YIGbdkM9jp30874vDzg' },
   *   private_key: { curve25519: 'JnaQwO1HTJLEjSrhq97BxANq2atD_uij1uCytPtHYcU' },
   *   private_signing_key: {
   *     ed25519: 'XGSKAMSK3V2wb8xcHw8kMTFdpRZMvwwYEFwdDm_e8mvug5fKrttVblJaq_ntFSR5v3ZggZt2Qz2OnfTzvi8POA'
   *   }
   * })
   * <code>
   *
   * @param {object} json
   *
   * @return {<Identity>}
   */
  static decode(json: ToznyAPIIdentity): Identity {
    return new Identity(
      json.id,
      json.tozny_id,
      json.realm_id,
      json.realm_name,
      json.name,
      json.api_key_id,
      json.api_secret_key,
      json.public_key,
      json.signing_key,
      json.private_key,
      json.private_signing_key,
      json.email
    )
  }
}

export type ToznyAPIIdentity = {
  id: string
  tozny_id: string
  realm_id: string
  realm_name: string
  name: string
  api_key_id: string
  api_secret_key: string
  public_key: string
  signing_key: string
  private_key: string
  private_signing_key: string
  email: string
}

export default Identity
