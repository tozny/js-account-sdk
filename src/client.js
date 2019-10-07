const { validateStorageClient } = require('./utils')
const API = require('./api')
const { AccountBillingStatus, RegistrationToken } = require('./types')

class Client {
  constructor(api, account, profile, queenClient) {
    this.api = API.validateInstance(api)
    this._queenClient = validateStorageClient(queenClient)
    this.account = account
    this.profile = profile
  }

  get queenClient() {
    return this._queenClient
  }

  async billingStatus() {
    const rawResponse = await this.api.getBillingStatus(this._queenClient)
    return AccountBillingStatus.decode(rawResponse)
  }

  async accountClients(nextToken = 0) {
    const rawResponse = await this.api.listClients(this._queenClient, nextToken)
    // TODO: add ClientList type and decode to that versus vanilla JS object
    return rawResponse
  }

  /**
   * Get a list of the current registration tokens for an account.
   *
   * @return {Promise<Array.<RegistrationToken>>}
   */
  async registrationTokens() {
    const tokens = await this.api.listTokens()
    return tokens.map(RegistrationToken.decode)
  }

  /**
   * Create a new registration token for the account.
   * @param {string} name The user defined name for the new token. Not unique.
   * @param {object} permissions A set of key-value pair of permissions for the token.
   * @param {number} totalUsesAllowed The number of uses the token is allowed. If
   *                                  not set, unlimited uses are allowed.
   *
   * @return {Promise<RegistrationToken>} The created registration token.
   */
  async newRegistrationToken(name, permissions = {}, totalUsesAllowed) {
    const token = await this.api.writeToken(name, permissions, totalUsesAllowed)
    return RegistrationToken.decode(token)
  }

  /**
   * Removes a token object from the accounts available tokens.
   * @param {Token} token The token to remove from the account.
   *
   * @returns {Promise<boolean>} True if the operation succeeds.
   */
  async deleteRegistrationToken(token) {
    return this.api.deleteToken(token.token)
  }

  /**
   * Get a list of the current webhooks for an account.
   *
   * @return {Promise<Array.<Webhook>>}
   */

  async webhooks() {
    const webhooks = await this.api.listWebhooks(this._queenClient)
    // To Do: Add type and type checking
    return webhooks
  }

  /**
   * Create a new webhook for the account.
   * @param {string} webhook_url The payload url
   * @param {object} triggers A list of triggers to associate with the webhook
   *                                  not set, unlimited uses are allowed.
   *
   * @return {Promise<Webhook>} The created webhook.
   */
  async newWebhook(webhook_url, triggers) {
    const webhook = await this.api.createWebhook(
      this._queenClient,
      webhook_url,
      triggers
    )
    // To Do: Add type and type checking
    return webhook
  }

  /**
   * Removes a webhook object from the accounts available webhooks.
   * @param {Webhook} webhook The webhook to remove from the account.
   *
   * @returns {Promise<boolean>} True if the operation succeeds.
   */
  async deleteWebhook(webhookId) {
    return this.api.deleteWebhook(this._queenClient, webhookId)
  }

  serialize() {
    return {
      api: this.api.serialize(),
      account: this.account,
      profile: this.profile,
      storageClient: this._queenClient.config,
    }
  }
}

module.exports = Client
