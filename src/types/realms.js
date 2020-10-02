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
