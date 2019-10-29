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
