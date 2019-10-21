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
 * The ruling Identity for a Tozny ID Realm.
 */
class Sovereign {
  constructor(id, name, password = null) {
    this.id = id
    this.name = name
    this.password = password
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * <code>
   * sovereign = Sovereign::decode({
   *   id: 15,
   *   name: 'YassQueen',
   *   password: 'ff1d5cb9-017b-4447-8386-7c2d14d42a49'
   * })
   * <code>
   *
   * @param {object} json
   *
   * @return {<Sovereign>}
   */
  static decode(json) {
    return new Sovereign(json.id, json.name, json.password)
  }
}

module.exports = Sovereign
