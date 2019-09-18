const fetch = require('isomorphic-fetch')
const Token = require('./token')
const utils = require('../utils/index')
const { validateRequestAsJSON, checkStatus } = require('../utils')
const { DEFAULT_API_URL } = require('../utils/constants')

class API {
  static validateInstance(api) {
    if (!api instanceof API) {
      throw new Error('the api sent is not an instance of the API class')
    }
    return api
  }

  constructor(apiUrl = DEFAULT_API_URL) {
    this.apiUrl = apiUrl
  }

  async token() {
    if (!this._token) {
      throw new Error('No token has been set for the API')
    }
    if (this._token.expired) {
      await this._token.refresh()
    }
    return this._token
  }

  setToken(token) {
    if (!token instanceof Token) {
      throw new Error('Tokens must be an instance of the token helper class')
    }
    this._token = token
  }

  clone() {
    return new this.constructor(this.apiUrl)
  }

  async withToken(headers = {}) {
    const token = await this.token()
    const bearer = await token.bearer
    return Object.assign(headers, bearer)
  }

  serialize() {
    const serialized = {
      apiUrl: this.apiUrl
    }
    if (this._token) {
      serialized.token = this._token.serialize()
    }
    return serialized
  }

  async getChallenge(username) {
    const body = JSON.stringify({
      email: username
    })
    const request = await fetch(
      this.apiUrl + '/v1/account/challenge',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      }
    )
    return utils.validateRequestAsJSON(request)
  }

  async completeChallenge(username, challenge, response, keyType) {
    const request = await fetch(
      this.apiUrl + '/v1/account/auth',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: username,
          challenge: challenge,
          response: response,
          keyid: keyType
        })
      }
    )
    return validateRequestAsJSON(request)
  }

  async getProfileMeta() {
    const headers = await this.withToken({
      'Content-Type': 'application/json'
    })
    const request = await fetch(
      this.apiUrl + '/v1/account/profile/meta',
      {
        method: 'GET',
        headers
      }
    )
    return validateRequestAsJSON(request)
  }

  async updateProfileMeta(metaMap) {
    const headers = await this.withToken({
      'Content-Type': 'application/json'
    })
    const request = await fetch(
      this.apiUrl + '/v1/account/profile/meta',
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(metaMap)
      }
    )
    return checkStatus(request)
  }

  async register(profile, account) {
    const body = JSON.stringify({
      profile: profile,
      account: account
    })
    const request = await fetch(
      this.apiUrl + '/v1/account/profile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      }
    )
    return validateRequestAsJSON(request)
  }

  async getBillingStatus(queenClient) {
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + '/v1/billing/subscription/status',
      {
        method: 'GET'
      }
    )
    return validateRequestAsJSON(response)
  }

  async listClients(queenClient, nextToken) {
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + `/v1/client/admin?next=${nextToken}&limit=50`,
      {
        method: 'GET'
      }
    )
    return validateRequestAsJSON(response)
  }

  async updateProfile(profile) {
    const headers = await this.withToken({
      'Content-Type': 'application/json'
    })
    const request = await fetch(
      this.apiUrl + '/v1/account/profile',
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ profile: profile })
      }
    )
    return validateRequestAsJSON(request)
  }


}

module.exports = API
