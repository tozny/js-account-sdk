const { validateStorageClient } = require('./utils')
const API = require('./api')
const { KEY_HASH_ROUNDS } = require('./utils/constants')
const { AccountBillingStatus, RegistrationToken } = require('./types')
const Refresher = require('./api/refresher')
const Token = require('./api/token')

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

  async validatePassword(password) {
    const crypto = this._queenClient.crypto
    const authSalt = await crypto.b64decode(this.profile.auth_salt)
    const keypair = await crypto.deriveSigningKey(
      password,
      authSalt,
      KEY_HASH_ROUNDS
    )
    const signingKey = this.profile.signing_key
    return keypair.publicKey === signingKey.ed25519
  }

  async changePassword({ password, newPassword }) {
    const passwordChecksOut = await this.validatePassword(password)
    if (passwordChecksOut) {
      // The profile to be re-encrypted.
      const crypto = this._queenClient.crypto

      // Generate new salts and keys
      const encSalt = await crypto.randomBytes(16)
      const authSalt = await crypto.randomBytes(16)
      const encKey = await crypto.deriveSymmetricKey(
        newPassword,
        encSalt,
        KEY_HASH_ROUNDS
      )
      const authKeypair = await crypto.deriveSigningKey(
        newPassword,
        authSalt,
        KEY_HASH_ROUNDS
      )

      // Make new Profile and update existing profile.
      const b64AuthSalt = await crypto.b64encode(authSalt)
      const b64EncSalt = await crypto.b64encode(encSalt)
      const newProfileInfo = {
        auth_salt: b64AuthSalt,
        enc_salt: b64EncSalt,
        signing_key: {
          ed25519: authKeypair.publicKey,
        },
      }
      const response = await this.api.updateProfile(newProfileInfo)

      // Re-encrypt the queen client's credentials and update profile meta.
      const currentProfileMeta = await this.api.getProfileMeta()
      const serializedQueenClientConfig = this._queenClient.config.serialize()
      const encQueenCreds = await crypto.encryptString(
        JSON.stringify(serializedQueenClientConfig),
        encKey
      )
      await this.api.updateProfileMeta({
        backupEnabled: currentProfileMeta.backupEnabled,
        backupClient: encQueenCreds,
        paperBackup: currentProfileMeta.paperBackup,
      })

      // Update the refresher with new signing keys
      const clientToken = new Token(this.profile.token)
      const clientApi = this.api.clone()
      const username = this.profile.email
      clientToken.refresher = new Refresher(
        clientApi,
        this._queenClient.crypto,
        authKeypair,
        username
      )
      this.api.setToken(clientToken)

      // Return the updated profile.
      return response
    } else {
      throw new Error('Current password incorrect.')
    }
  }

  async billingStatus() {
    const rawResponse = await this.api.getBillingStatus(this._queenClient)
    return AccountBillingStatus.decode(rawResponse)
  }

  async updateAccountBilling(stripeToken) {
    const account = { cc_token: stripeToken.id }
    return this.api.updateAccountBilling(account)
  }

  async addBillingCoupon(couponCode) {
    return this.api.addBillingCoupon(this._queenClient, couponCode)
  }

  async subscribe() {
    return this.api.subscribe(this._queenClient)
  }

  async unsubscribe() {
    return this.api.unsubscribe(this._queenClient)
  }

  async accountClients(nextToken = 0) {
    const rawResponse = await this.api.listClients(this._queenClient, nextToken)
    // TODO: add ClientList type and decode to that versus vanilla JS object
    return rawResponse
  }

  /* 
  Allows user to update the name and email on their account.
  Profile param contains a name and email for the user.
*/
  async updateProfile(profile) {
    const response = await this.api.updateProfile(profile)
    return response
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
    // TODO: Add type and type checking
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

  /**
   * Gets the api request history using provided params.
   * @param {String} startTime Start time for range of requests
   *  @param {String} endTime End time for range of requests
   * @param {Boolean} includeAdminRequests Indicates whether to exclude admin requests
   * @param {Number} nextToken allows backend to paginate requests
   *
   * @returns {Object} request response object
   */

  async getRequests(startTime, endTime, includeAdminRequests, nextToken) {
    console.log('calls sdk getRequests')
    console.log(this._profile)
    console.log(this._profile.id)
    const accountId = this._profile.id
    console.log(startTime, endTime, includeAdminRequests, nextToken, accountId)
    return this.api.getRequests(
      this._queenClient,
      accountId,
      startTime,
      endTime,
      includeAdminRequests,
      nextToken
    )
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
