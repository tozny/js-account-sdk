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
  /**
   * Validates a suspected instance of the API is actually an instance.
   *
   * @param {API} api The value to check type of
   * @return {API} the passed instance, only if it is valid.
   */
  static validateInstance(api) {
    if (!(api instanceof API)) {
      throw new Error('the api sent is not an instance of the API class')
    }
    return api
  }

  constructor(apiUrl = DEFAULT_API_URL) {
    this.apiUrl = apiUrl
  }

  /**
   * Gets a token, either cached, or if expired, from the refresh method.
   *
   * @return {Token} The token for use in account level requests.
   */
  async token() {
    if (!this._token) {
      throw new Error('No token has been set for the API')
    }
    if (this._token.expired) {
      await this._token.refresh()
    }
    return this._token
  }

  /**
   * Sets the token object for this API instance.
   *
   * @param {Token} token The token object to use in requests.
   * @return {undefined}
   */
  setToken(token) {
    if (!(token instanceof Token)) {
      throw new Error('Tokens must be an instance of the token helper class')
    }
    this._token = token
  }

  /**
   * Creates a new API instance copying this one.
   *
   * @return {API} The new API instance.
   */
  clone() {
    return new this.constructor(this.apiUrl)
  }

  /**
   * Takes a header object and injects the bearer auth header into it with the defined token.
   *
   * @return {object} the headers object with the Authorization bearer token added.
   */
  async withToken(headers = {}) {
    const token = await this.token()
    const bearer = await token.bearer
    return Object.assign(headers, bearer)
  }

  /**
   * Creates a serialized object that can be stored as a string if needed.
   *
   * @return {object} This API represented as a serialized JSON object.
   */
  serialize() {
    const serialized = {
      apiUrl: this.apiUrl,
    }
    if (this._token) {
      serialized.token = this._token.serialize()
    }
    return serialized
  }

  /**
   * Get a challenge for an account, beginning the SRP log in flow.
   *
   * @param {string} username The username of the account logging in.
   * @return {Promise<object>} The fetched challenge information.
   */
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

  /**
   * Send back a signature asserting authentication for an account challenge.
   *
   * @param {string} username The username of the account logging in.
   * @param {string} challenge The challenge sent by the server.
   * @param {string} response The signed challenge to authenticate.
   * @param {string} keyType Either password or paper, depending on which seed is used to sign.
   * @return {Promise<object>} The account information when authenticated.
   */
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

  /**
   * Get the profile metadata associated with an account
   *
   * @return Promise<object> The raw profile meta for an account.
   */
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

  /**
   * Overwrite the profile meta for an account.
   *
   * @return {Promise<undefined>} Nothing on success, throws on failure.
   */
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

  /**
   * Send a request with registration information to create a new account.
   *
   * @return {Promise<object>} The new account object for the created account.
   */
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
  /**
   * backfillSigningKeys updates the existing v1 client credentials to include a
   * signing key
   *
   * @param {object} queenClient the client to be migrated from v1 to v2
   * @param {string} publicSigningKey the public signing key generated
   * @param {string} clientID the Tozny Client ID for the client
   *
   * @return {Promise<object>} The Client Object
   */
  async backfillSigningKeys(queenClient, publicSigningKey, clientID) {
    const body = JSON.stringify({
      signing_key: publicSigningKey,
    })
    const request = await queenClient.authenticator.tokenFetch(
      this.apiUrl + '/v1/client/' + clientID + '/keys',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      }
    )
    return validateRequestAsJSON(request)
  }
  /** requests email verification for a tozny account
   *
   *  Displays error to user if
   *     request fails
   *     account service is down
   *
   * @param {string} id Challenge ID sent to the email address
   * @param {string} otp One time password to validate the email address is accessible
   * @returns response
   */
  async verifyEmail(id, otp) {
    const request = await fetch(
      this.apiUrl + `/v1/account/profile/verified?id=${id}&otp=${otp}`,
      {
        method: 'GET',
      }
    )
    return checkStatus(request)
  }

  /** requests email verification for Tozny account be resent
   *
   * @param {string} email The Tozny account email
   * @returns response
   */
  async resendVerificationEmail(email) {
    const headers = await this.withToken({
      'Content-Type': 'application/json',
    })
    const request = await fetch(this.apiUrl + '/v1/account/profile', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        profile: {
          email: email,
        },
      }),
    })
    return checkStatus(request)
  }

  async initiateRecoverAccount(email) {
    const response = await fetch(
      this.apiUrl + '/v1/account/challenge/email/reset',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
        }),
      }
    )
    return checkStatus(response)
  }

  async verifyRecoverAccountChallenge(id, otp) {
    const response = await fetch(
      this.apiUrl + `/v1/account/profile/authenticate?id=${id}&otp=${otp}`,
      {
        method: 'GET',
      }
    )
    return validateRequestAsJSON(response)
  }

  async rollQueen(client) {
    const headers = await this.withToken({
      'Content-Type': 'application/json',
    })
    const response = await fetch(
      this.apiUrl + `/v1/account/e3db/clients/queen`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ client }),
      }
    )
    return validateRequestAsJSON(response)
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

  async addBillingCoupon(queenClient, couponCode) {
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + '/v1/billing/coupon',
      {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify({ coupon_code: couponCode }),
      }
    )
    return checkStatus(response)
  }

  async updateAccountBilling(account) {
    const headers = await this.withToken({
      'Content-Type': 'application/json',
    })
    const response = await fetch(this.apiUrl + '/v1/account/profile', {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify({
        account: account,
      }),
    })
    return validateRequestAsJSON(response)
  }

  async subscribe(queenClient) {
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + '/v1/billing/resubscribe',
      {
        method: 'GET',
      }
    )
    return checkStatus(response)
  }

  async unsubscribe(queenClient) {
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + '/v1/billing/unsubscribe',
      {
        method: 'GET',
      }
    )
    return checkStatus(response)
  }

  async listClients(queenClient, nextToken, perPage = 50) {
    const response = await queenClient.authenticator.tokenFetch(
      `${this.apiUrl}/v1/client/admin?next=${nextToken}&limit=${perPage}`,
      {
        method: 'GET',
      }
    )
    return validateRequestAsJSON(response)
  }

  async getClient(queenClient, clientId) {
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + `/v1/client/admin/${clientId}`,
      {
        method: 'GET',
      }
    )
    return validateRequestAsJSON(response)
  }

  async setClientEnabled(queenClient, clientId, enabled) {
    const request = await queenClient.authenticator.tokenFetch(
      `${this.apiUrl}/v1/client/admin/${clientId}/enable`,
      {
        method: 'PATCH',
        body: JSON.stringify({ enabled }),
      }
    )
    return checkStatus(request)
  }

  async updateProfile(profile) {
    const headers = await this.withToken({
      'Content-Type': 'application/json',
    })
    const request = await fetch(this.apiUrl + '/v1/account/profile', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ profile: profile }),
    })
    return validateRequestAsJSON(request)
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

  async getRequests(
    queenClient,
    accountId,
    startTime,
    endTime,
    nextToken,
    endpointsToExclude
  ) {
    const body = JSON.stringify({
      account_id: accountId,
      range: {
        start_time: startTime,
        end_time: endTime,
      },
      exclude: {
        api_endpoints: endpointsToExclude,
      },
      next_token: nextToken,
    })
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + `/v1/metric/requests`,
      {
        method: 'POST',
        body: body,
      }
    )
    return validateRequestAsJSON(response)
  }
  /**
   * Requests the creation of a new TozID Realm.
   *
   * @param {object} queenClient The queen client for the account to create the realm for.
   * @param {string} realmName The user defined name for the realm to create.
   * @param {string} sovereignName The user defined name for the ruler of the realm to create.
   *
   * @return {Promise<Realm>} The decoded create realm response returned by the server.
   */
  async createRealm(
    queenClient,
    realmName,
    sovereignName,
    realmRegistrationToken
  ) {
    const createRealmRequest = {
      realm_name: realmName,
      sovereign_name: sovereignName,
      registration_token: realmRegistrationToken,
    }
    const response = await queenClient.authenticator.tsv1Fetch(
      this.apiUrl + '/v1/identity/realm',
      {
        method: 'POST',
        body: JSON.stringify(createRealmRequest),
      }
    )
    return validateRequestAsJSON(response)
  }

  /**
   * Lists all Realms belonging to the account.
   *
   * @param {object} queenClient The queen client for the account to list the realms of.
   *
   * @return {Promise<ListedRealms>} The decoded listed realm representations returned by the server.
   */
  async listRealms(queenClient) {
    const response = await queenClient.authenticator.tsv1Fetch(
      this.apiUrl + '/v1/identity/realm',
      {
        method: 'GET',
      }
    )
    return validateRequestAsJSON(response)
  }

  async getAggregations(queenClient, accountId, startTime, endTime) {
    const body = JSON.stringify({
      account_id: accountId,
      range: {
        start_time: startTime,
        end_time: endTime,
      },
    })
    const response = await queenClient.authenticator.tokenFetch(
      this.apiUrl + `/v1/metric/requests/aggregations`,
      {
        method: 'POST',
        body: body,
      }
    )
    return validateRequestAsJSON(response)
  }
  /**
   * Requests the creation of a new TozID Realm.
   *
   * @param {object} queenClient The queen client for the account to delete the realm from.
   * @param {string} realmName The name of the realm to delete.
   *
   * @return {Promise<object>} Empty object.
   */
  async deleteRealm(queenClient, realmName) {
    const response = await queenClient.authenticator.tsv1Fetch(
      this.apiUrl + `/v1/identity/realm/${realmName}`,
      {
        method: 'DELETE',
      }
    )
    return validateRequestAsJSON(response)
  }

  /**
   * Gets the public info about the Tozny hosted broker
   *
   * @return {Promise<object>} The hosted broker public info.
   */
  async getHostedBrokerInfo() {
    const response = await fetch(`${this.apiUrl}/v1/identity/broker/info`)
    return validateRequestAsJSON(response)
  }

  /**
   * registerRealmBrokerIdentity registers an identity to be the broker for a realm.
   * @param  {object} queenClient       The queen client for the account.
   * @param  {string} realmName         The name of the realm to register the broker identity with.
   * @param  {string} registrationToken A registration for the account that has permissions for registering clients of type broker.
   * @param  {Identity} brokerIdentity   Params for an identity to register as the realm's broker.
   * @return {Promise<Identity>} The broker identity for the realm.
   */
  async registerRealmBrokerIdentity(
    queenClient,
    realmName,
    registrationToken,
    brokerIdentity
  ) {
    const registerRealmBrokerRequest = {
      realm_registration_token: registrationToken,
      identity: brokerIdentity,
    }
    const response = await queenClient.authenticator.tsv1Fetch(
      this.apiUrl + `/v1/identity/realm/${realmName}/broker/identity`,
      {
        method: 'POST',
        body: JSON.stringify(registerRealmBrokerRequest),
      }
    )
    return validateRequestAsJSON(response)
  }

  /**
   * listIdentities queries the API to fetch a list of basic identity information
   * @param  {object} queenClient The queen client for the account.
   * @param  {string} realmName   The name of the realm to register the broker identity with.
   * @param  {number} max         The maximum number of identities to fetch at once, min 1, max 1000. Default 100.
   * @param  {number} first       The first (0-indexed) identity to fetch after offset. Default 0.
   * @return {Promise<Array<object>>} The list of basic identity information.
   */
  async listIdentities(queenClient, realmName, max, first) {
    const url = [`${this.apiUrl}/v1/identity/realm/${realmName}/identity`]
    const query = { first, max }
    const queryString = Object.keys(query)
      .filter(k => !!query[k])
      .map(k => `${k}=${encodeURIComponent(query[k])}`)
      .join('&')
    if (queryString) {
      url.push(queryString)
    }
    const fullUrl = url.join('?')
    const response = await queenClient.authenticator.tsv1Fetch(fullUrl, {
      method: 'GET',
    })
    return validateRequestAsJSON(response)
  }

  /**
   * Fetches detailed identity information given a realm name and username
   * @param  {object} queenClient The queen client for the account.
   * @param  {string} realmName   The name of the realm to register the broker identity with.
   * @param  {string} username    The username to fetch details for.
   * @return {Promise<IdentityDetails>} The detailed information about the identity.
   */
  async identityDetails(queenClient, realmName, username) {
    const encUsername = encodeURIComponent(username)
    const response = await queenClient.authenticator.tsv1Fetch(
      `${this.apiUrl}/v1/identity/realm/${realmName}/identity/${encUsername}`,
      {
        method: 'GET',
      }
    )
    return validateRequestAsJSON(response)
  }
}

module.exports = API
