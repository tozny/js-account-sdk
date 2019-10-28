const { validateStorageClient } = require('./utils')
const API = require('./api')
const { KEY_HASH_ROUNDS } = require('./utils/constants')
const {
  AccountBillingStatus,
  RegistrationToken,
  Realm,
  Realms,
  Identity,
} = require('./types')
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

  async changePassword({ password, newPassword, type = 'standard' }) {
    /*
     *  If the type is paper, the password is the user's backup paperkey.
     *  In this case, the paperkey has already been validated.
     */
    const passwordChecksOut =
      type === 'paper' ? true : await this.validatePassword(password)
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

  async getRequests(startTime, endTime, nextToken, endpointsToExclude) {
    const accountId = this.profile.id
    return this.api.getRequests(
      this._queenClient,
      accountId,
      startTime,
      endTime,
      nextToken,
      endpointsToExclude
    )
  }

  /**
   * Gets aggregations for the api calls made in a given timeframe.
   * @param {String} startTime Start time for range of requests
   *  @param {String} endTime End time for range of requests
   *
   * @returns {Object} aggregations response object
   */

  async getAggregations(startTime, endTime) {
    const accountId = this.profile.id
    return this.api.getAggregations(
      this._queenClient,
      accountId,
      startTime,
      endTime
    )
  }
  /*
   * Requests the creation of a new TozID Realm.
   *
   * @param {string} realmName The user defined name for the realm to create.
   * @param {string} sovereignName The user defined name for the ruler of the realm to create.
   *
   * @returns {Promise<Realm>} The representation of the created realm returned by the server.
   */
  async createRealm(realmName, sovereignName) {
    const rawResponse = await this.api.createRealm(
      this._queenClient,
      realmName,
      sovereignName
    )
    return Realm.decode(rawResponse)
  }

  /**
   * Lists all Realms belonging to the account.
   *
   * @returns {Promise<Realms>} The listed realm representations returned by the server.
   */
  async listRealms() {
    const rawResponse = await this.api.listRealms(this._queenClient)
    return Realms.decode(rawResponse)
  }

  /**
   * Requests the deletion of a named TozID Realm belonging to the account.
   *
   * @param {string} realmName The name for the realm to delete.
   *
   * @returns {Promise<Object>} Empty object.
   */
  async deleteRealm(realmName) {
    return this.api.deleteRealm(this._queenClient, realmName)
  }

  /**
   * registerRealmBrokerIdentity registers an identity to be the broker for a realm.
   * @param  {string} realmName         The name of the realm to register the broker identity with.
   * @param  {string} registrationToken A registration for the account that has permissions for registering clients of type broker.
   * @return {Promise<Identity>} The broker identity for the realm.
   */
  async registerRealmBrokerIdentity(realmName, registrationToken) {
    // Generate key material for the broker Identity
    const crypto = this._queenClient.crypto
    const encryptionKeyPair = await crypto.generateKeypair()
    const signingKeyPair = await crypto.generateSigningKeypair()
    const brokerIdentity = {
      name: `realm_${realmName}_broker_tozny_client`,
      public_key: { curve25519: encryptionKeyPair.publicKey },
      signing_key: { ed25519: signingKeyPair.publicKey },
    }
    // register the broker for the realm
    const rawResponse = await this.api.registerRealmBrokerIdentity(
      this._queenClient,
      realmName,
      registrationToken,
      brokerIdentity
    )
    // populate the client side held key material so the
    // full broker configuration can be persisted and reused
    rawResponse.identity.private_key = {
      curve25519: encryptionKeyPair.privateKey,
    }
    rawResponse.identity.private_signing_key = {
      ed25519: signingKeyPair.privateKey,
    }
    return Identity.decode(rawResponse)
  }

  /**
   * Requests email verification for a Tozny account.
   *
   * @param {string} toznyo - a one-time code generated by tozauth
   * @param {string} toznyr - a realm name generated by tozauth
   *
   * @returns response
   */

  async verifyEmail(toznyo, toznyr) {
    return this.api.verifyEmail(toznyo, toznyr)
  }

  /**
   * Requests Tozny account email verification be resent.
   */

  async resendVerificationEmail() {
    console.log('profile', this.profile)
    const email = this.profile.email
    return this.api.resendVerificationEmail(email)
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
