/**
 * A Tozny ID Realm belonging to an account.
 */
class RealmUserCount {
  constructor(identity_count) {
    this.identity_count = identity_count
  }

  /**
   *
   * @param {object} json
   *
   * @return {RealmUserCount}
   */
  static decode(json) {
    return new RealmUserCount(json.identity_count)
  }
}

module.exports = RealmUserCount
