/**
 * High level client info for Tozny storage.
 */
class ClientInfo {
  constructor(
    clientId,
    name,
    type,
    enabled,
    hasBackup,
    publicKey,
    signingKey,
    apiKeyId
  ) {
    this.clientId = clientId
    this.name = name
    this.type = type
    this.enabled = enabled
    this.hasBackup = hasBackup
    this.publicKey = publicKey
    this.signingKey = signingKey
    this.apiKeyId = apiKeyId
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * clientInfo = clientInfo::decode({
   *   client_id: '46fa26e-db4c-4c5f-741f-84fb65aab5ce',
   *   name: 'clientName',
   *   type: 'general',
   *   enabled: true,
   *   has_backup: false,
   *   realm_name: '387e7ba1',
   *   public_key: { curve25519: 'OmQ2DANNDlXRQwFZUAcOnSicSfZKnONnBWxFRFZt3W4' },
   *   signing_key: { ed25519: '7oOXyq7bVW5SWqv57RUkeb92YIGbdkM9jp30874vDzg' },
   *   api_key_id: '4601691abc53c542252bca4f31b939ed5cea32d3c301cca01b920305197330af',
   * })
   * <code>
   *
   * @param {object} json
   *
   * @return {<ClientInfo>}
   */
  static decode(json) {
    return new ClientInfo(
      json.client_id,
      json.name,
      json.type,
      json.enabled,
      json.has_backup,
      json.public_key,
      json.signing_key,
      json.api_key_id,
      json.api_secret_key
    )
  }
}

module.exports = ClientInfo
