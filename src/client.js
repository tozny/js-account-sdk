const { validateStorageClient } = require('./utils')
const API = require('./api')
const { AccountBillingStatus } = require('./types')
const { KEY_HASH_ROUNDS } = require('./utils/constants')

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
    const keypair = await crypto.deriveSigningKey(password, authSalt, KEY_HASH_ROUNDS)
    const signingKey = this.profile.signing_key
    return keypair.publicKey === signingKey.ed25519
  }

  async changePassword({ password, newPassword }) {
    const currentProfileMeta = await this.api.getProfileMeta()
    const passwordChecksOut = await this.validatePassword(password)
    const crypto = this._queenClient.crypto
    if (passwordChecksOut) {
      // Generate new salts and keys
      const serializedQueenClientConfig = this._queenClient.config.serialize()
      const encSalt = await crypto.randomBytes(16)
      const authSalt = await crypto.randomBytes(16)
      const encKey = await crypto.deriveSymmetricKey(
        newPassword,
        encSalt,
        KEY_HASH_ROUNDS)
      const authKeypair = await crypto.deriveSigningKey(newPassword, authSalt, KEY_HASH_ROUNDS)
      const encQueenCreds = await crypto.encryptString(JSON.stringify(serializedQueenClientConfig), encKey)
      const b64AuthSalt = await crypto.b64encode(authSalt)
      const b64EncSalt = await crypto.b64encode(encSalt)
      const newProfileInfo = {
        auth_salt: b64AuthSalt,
        enc_salt: b64EncSalt,
        signing_key: {
          ed25519: authKeypair.publicKey
        },
      }

      const updateProfileResponse = await this.api.updateProfile(newProfileInfo)
      const updateProfileMetaResponse = await this.api.updateProfileMeta({
        backupEnabled: currentProfileMeta.backupEnabled,
        backupClient: encQueenCreds,
        paperBackup: currentProfileMeta.paperBackup
      })
      return this.api.getProfileMeta()

    } else {
      throw new Error('Current password incorrect.')
    }
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

  /* 
  Allows user to update the name and email on their account.
  Profile param contains a name and email for the user.
*/
  async updateProfile(profile) {
    const response = await this.api.updateProfile(profile)
    return response
  }

  serialize() {
    return {
      api: this.api.serialize(),
      account: this.account,
      profile: this.profile,
      storageClient: this._queenClient.config
    }
  }
}

module.exports = Client
