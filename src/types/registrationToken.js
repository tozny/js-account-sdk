/**
 * A Tozny Storage registration token with name and permissions.
 */
class RegistrationToken {
  /**
   * Set up the values for a Registration Token.
   *
   * @param {string} name The name of the token
   * @param {string} token The actual token value
   * @param {object} permissions A set of key-value permissions
   * @param {number} totalUsesAllowed The number of uses allowed for the token
   * @param {number} uses The number of times the token has been used to date.
   */
  constructor(name, token, permissions, totalUsesAllowed, uses) {
    this.name = name
    this.token = token
    this.permissions = permissions
    this.totalUsesAllowed = totalUsesAllowed
    this.uses = uses
  }

  /**
   * Specify how an already unserialized JSON array should be marshaled into
   * an object representation.
   *
   * @param {object} json
   *
   * @return {<RegistrationToken>}
   */
  static decode(json) {
    return new RegistrationToken(
      json.name,
      json.token,
      json.permissions,
      json.total_uses_allowed,
      json.uses
    )
  }
}

module.exports = RegistrationToken
