/*!
 * Tozny
 *
 * LICENSE
 *
 * Tozny dual licenses this product. For commercial use, please contact
 * info@tozny.com. For non-commercial use, the contents of this file are
 * subject to the TOZNY NON-COMMERCIAL LICENSE (the "License") which
 * permits use of the software only by government agencies, schools,
 * universities, non-profit organizations or individuals on projects that
 * do not receive external funding other than government research grants
 * and contracts.  Any other use requires a commercial license. You may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at https://tozny.com/legal/non-commercial-license.
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations under
 * the License. Portions of the software are Copyright (c) TOZNY LLC, 2019.
 * All rights reserved.
 *
 * @copyright Copyright (c) 2019 Tozny, LLC (https://tozny.com)
 */

'use strict'

/**
 * A registered Identity for a Tozny realm.
 */
class Identity {
  constructor(
    id,
    toznyId,
    realmId,
    realmName,
    name,
    apiKeyId,
    apiSecretKey,
    publicKey,
    signingKey,
    privateKey,
    privateSigningKey
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
  static decode(json) {
    return new Identity(
      json.identity.id,
      json.identity.tozny_id,
      json.identity.realm_id,
      json.identity.realm_name,
      json.identity.name,
      json.identity.api_key_id,
      json.identity.api_secret_key,
      json.identity.public_key,
      json.identity.signing_key,
      json.identity.private_key,
      json.identity.private_signing_key
    )
  }
}

module.exports = Identity
