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

const Sovereign = require('./sovereign')

/**
 * A Tozny ID Realm belonging to an account.
 */
class Realm {
  constructor(
    id,
    name,
    adminURL,
    active,
    sovereign,
    brokerIdentityToznyId = null
  ) {
    this.id = id
    this.name = name
    this.adminURL = adminURL
    this.active = active
    this.sovereign = sovereign
    this.brokerIdentityToznyId = brokerIdentityToznyId
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * realm = Realm::decode({
   *  id: 15,
   *  name: '10ba1902',
   *  admin_url: 'http://platform.local.tozny.com:8010/auth/admin/10ba1902/console',
   *  active: true,
   *  sovereign: {
   *    id: 15,
   *    name: 'YassQueen',
   *    password: 'ff1d5cb9-017b-4447-8386-7c2d14d42a49'
   *  },
   *  broker_identity_tozny_id: '00000000-0000-0000-0000-000000000000'
   * })
   * <code>
   *
   * @param {object} json
   *
   * @return {<Realm>}
   */
  static decode(json) {
    return new Realm(
      json.id,
      json.name,
      json.admin_url,
      json.active,
      Sovereign.decode(json.sovereign),
      json.broker_identity_tozny_id
    )
  }
}

module.exports = Realm
