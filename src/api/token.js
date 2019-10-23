const { TOKEN_LIFETIME_SECONDS } = require('../utils/constants')

class Token {
  constructor(token, created = Date.now()) {
    this._token = token
    this._created = created
  }

  get token() {
    return this._token
  }

  get bearer() {
    return { Authorization: `Bearer ${this._token}` }
  }

  get expired() {
    console.log(this._created)
    console.log(Date.now() - this._created)
    console.log(TOKEN_LIFETIME_SECONDS)
    console.log(Date.now() - this._created > TOKEN_LIFETIME_SECONDS)
    return Date.now() - this._created > TOKEN_LIFETIME_SECONDS
  }

  get refresher() {
    return this._refresher
  }

  set refresher(refresher) {
    if (typeof refresher !== 'object') {
      throw new Error(
        'The refresher must be an object with refresh and serialize methods'
      )
    }
    if (typeof refresher.refresh !== 'function') {
      throw new Error(
        'The refresher.refresh method must be an async function that fetches a new token'
      )
    }
    if (typeof refresher.refresh !== 'function') {
      throw new Error('The refresher.serialize method must be function')
    }
    this._refresher = refresher
  }

  async refresh() {
    if (!this._refresher) {
      throw new Error(
        'A refresher object must be set before the refresh method can be called.'
      )
    }
    const newToken = await this.refresher.refresh()
    this._token = newToken
    this._created = Date.now()
  }

  serialize() {
    const serialized = {
      token: this._token,
      created: this._created,
    }
    if (this._refresher) {
      const refresher = this._refresher.serialize()
      if (refresher) {
        serialized.refresher = refresher
      }
    }
    return serialized
  }
}

module.exports = Token
