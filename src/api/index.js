/**
 * Account level API request definitions.
 */

const fetch = require('isomorphic-fetch')
const Token = require('./token')
const utils = require('../utils/index')
const { validateRequestAsJSON, checkStatus } = require('../utils')
const { DEFAULT_API_URL } = require('../utils/constants')

/**
 * API abstracts over the actual API calls made for various account-level operations.
 */
class API {
  static validateInstance(api) {
    if (!(api instanceof API)) {
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
    if (!(token instanceof Token)) {
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
      apiUrl: this.apiUrl,
    }
    if (this._token) {
      serialized.token = this._token.serialize()
    }
    return serialized
  }

  async getChallenge(username) {
    const body = JSON.stringify({
      email: username,
    })
    const request = await fetch(this.apiUrl + '/v1/account/challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    return utils.validateRequestAsJSON(request)
  }

  async completeChallenge(username, challenge, response, keyType) {
    const request = await fetch(this.apiUrl + '/v1/account/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        challenge: challenge,
        response: response,
        keyid: keyType,
      }),
    })
    return validateRequestAsJSON(request)
  }

  async getProfileMeta() {
    const headers = await this.withToken({
      'Content-Type': 'application/json',
    })
    const request = await fetch(this.apiUrl + '/v1/account/profile/meta', {
      method: 'GET',
      headers,
    })
    return validateRequestAsJSON(request)
  }

  async updateProfileMeta(metaMap) {
    const headers = await this.withToken({
      'Content-Type': 'application/json',
    })
    const request = await fetch(this.apiUrl + '/v1/account/profile/meta', {
      method: 'PUT',
      headers,
      body: JSON.stringify(metaMap),
    })
    return checkStatus(request)
  }

  async register(profile, account) {
    const body = JSON.stringify({
      profile: profile,
      account: account,
    })
    const request = await fetch(this.apiUrl + '/v1/account/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    return validateRequestAsJSON(request)
  }

  async getBillingStatus(queenClient) {
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + '/v1/billing/subscription/status',
      {
        method: 'GET',
      }
    )
    return validateRequestAsJSON(response)
  }

  async listClients(queenClient, nextToken) {
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + `/v1/client/admin?next=${nextToken}&limit=50`,
      {
        method: 'GET',
      }
    )
    return validateRequestAsJSON(response)
  }

  /**
   * Requests a list of tokens available for the account.
   *
   * @return {Array<object>} An array of token objects.
   */
  async listTokens() {
    const headers = await this.withToken({
      'Content-Type': 'application/json',
    })
    const response = await fetch(this.apiUrl + `/v1/account/tokens`, {
      method: 'GET',
      headers,
    })
    return validateRequestAsJSON(response)
  }

  /**
   * Requests the creation of a new registration token.
   *
   * @param {string} name A user defined name for the token.
   * @param {object} permissions A set of key-value permissions. Default: {}
   * @param {number} totalUsesAllowed The number of uses to allow for the token.
   *                                  If not defined, unlimited uses are allowed.
   *
   * @return {Promise<object>} The raw token object written
   */
  async writeToken(name, permissions = {}, totalUsesAllowed) {
    const body = JSON.stringify({
      name,
      permissions,
      total_uses_allowed: totalUsesAllowed,
    })
    const headers = await this.withToken({
      'Content-Type': 'application/json',
    })
    const response = await fetch(this.apiUrl + `/v1/account/tokens`, {
      method: 'POST',
      headers,
      body,
    })
    return validateRequestAsJSON(response)
  }

  /**
   * Requests a specific token is removed from the account by token value.
   *
   * @param {string} token The token value to delete from the server
   *
   * @return {Promise<boolean>} True if the operation is successful.
   */
  async deleteToken(token) {
    const headers = await this.withToken({
      'Content-Type': 'application/json',
    })
    const response = await fetch(`${this.apiUrl}/v1/account/tokens/${token}`, {
      method: 'DELETE',
      headers,
    })
    await checkStatus(response)
    return true
  }

  /**
   * Requests a list of webhooks available for the account.
   *
   * @return {Array<object>} An array of webhook objects.
   */

  async listWebhooks(queenClient) {
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + `/v1/hook`,
      {
        method: 'GET',
      }
    )
    return validateRequestAsJSON(response)
  }

  /**
   * Requests the creation of a new webhook.
   *
   * @param {string} webhook_url A user defined name for the token.
   * @param {object} trigger A list of WebhookTrigger objects.
   *
   * @return {Promise<object>} The raw webhook object written
   */
  async createWebhook(queenClient, webhook_url, triggers) {
    const webhookTriggers = triggers.map(eventString => {
      return {
        enabled: true,
        api_event: eventString,
      }
    })
    const body = JSON.stringify({
      webhook_url,
      triggers: webhookTriggers,
    })
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + `/v1/hook`,
      {
        method: 'POST',
        body,
      }
    )
    return validateRequestAsJSON(response)
  }

  /**
   * Requests a specific webhook be removed from the account by webhook id.
   *
   * @param {string} webhook_id The webhook id to delete from the server
   *
   * @return {Promise<boolean>} True if the operation is successful.
   */
  async deleteWebhook(queenClient, webhookId) {
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + `/v1/hook/${webhookId}`,
      {
        method: 'DELETE',
      }
    )
    await checkStatus(response)
    return true
  }
}

module.exports = API
