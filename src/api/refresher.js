class SRPRefresher {
  constructor(api, crypto, keys, username, type) {
    ;(this.api = api), (this.crypto = crypto), (this.keys = keys)
    ;(this.username = username), (this.type = type)
  }

  async refresh() {
    const challenge = await this.api.getChallenge(this.username)
    const signature = await this.crypto.signDetached(
      challenge.challenge,
      this.keys.privateKey
    )
    const type = this.type === 'paper' ? 'paper' : 'password'
    const profile = await this.api.completeChallenge(
      this.username,
      challenge.challenge,
      signature,
      type
    )
    return profile.token
  }

  serialize() {
    return {
      username: this.username,
      keys: this.keys,
    }
  }
}

module.exports = SRPRefresher
