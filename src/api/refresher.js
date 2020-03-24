class SRPRefresher {
  constructor(api, crypto, keys, username) {
    ;(this.api = api), (this.crypto = crypto), (this.keys = keys)
    this.username = username
  }

  async refresh() {
    const profile = await this.profile()
    return profile.token
  }

  async profile() {
    const challenge = await this.api.getChallenge(this.username)
    const signature = await this.crypto.sign(
      challenge.challenge,
      this.keys.privateKey
    )
    const profile = await this.api.completeChallenge(
      this.username,
      challenge.challenge,
      signature,
      'password'
    )
    return profile
  }

  serialize() {
    return {
      username: this.username,
      keys: this.keys,
    }
  }
}

module.exports = SRPRefresher
