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

const Realm = require('./realm')

/**
 * A list of Tozny ID Realms belonging to an account.
 */
class Realms {
  constructor(realms) {
    this.realms = realms
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * realms = Realms::decode({
   *   realms: [
   *     {
   *       id: 47,
   *       name: '33c6954c',
   *       admin_url: 'http://platform.local.tozny.com:8010/auth/admin/33c6954c/console',
   *       active: true,
   *       sovereign: [Object],
   *       broker_identity_tozny_id: '00000000-0000-0000-0000-000000000000'
   *     }
   *   ]
   * })
   * <code>
   *
   * @param {object} json
   *
   * @return {<Realms>}
   */
  static decode(json) {
    let realms = []
    if (json.realms == null || json.realms.length == 0) {
      return new Realms(realms)
    }
    for (let realm of json.realms) {
      realm = Realm.decode(realm)
      realms.push(realm)
    }
    return new Realms(realms)
  }
}

module.exports = Realms
