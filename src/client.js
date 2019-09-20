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
    const passwordChecksOut = await this.validatePassword(password)
    const crypto = this._queenClient.crypto
    const paperEncKey = this.profile.paper_enc_salt
    console.log('crypto', crypto)
    if (passwordChecksOut) {
      console.log("in if statement")
      // Generate new salts and keys
      const serializedQueenClientConfig = this._queenClient.config.serialize()
      // console.log(queenClientConfig)
      // console.log(JSON.stringify(queenClientConfig))
      const encSalt = await crypto.randomBytes(16)
      console.log('encSalt', encSalt)
      const authSalt = await crypto.randomBytes(16)
      console.log('authSalt', authSalt)
      const encKey = await crypto.deriveSymmetricKey(
        newPassword,
        encSalt,
        KEY_HASH_ROUNDS)
      console.log('encKey', encKey)
      const authKeypair = await crypto.deriveSigningKey(newPassword, authSalt)
      console.log('authKeyPair', authKeypair)
      const encQueenCreds = await crypto.encryptString(JSON.stringify(serializedQueenClientConfig), encKey)
      const paperEncQueenCreds = await crypto.encryptString(JSON.stringify(serializedConfig), paperEncKey)
      console.log('encQueenCreds', encQueenCreds)
      const updateProfileMetaResponse = this.api.updateProfileMeta({
        backupEnabled: 'enabled',
        backupClient: encQueenCreds,
        paperBackup: paperEncQueenCreds
      })
      return this.api.getProfileMeta()
      // console.log("Add call to change password")
      // console.log('encSalt', this.profile.enc_salt)
      // const encSalt = crypto.b64decode(this.profile.enc_salt)
      // console.log('encKeys', encKeys)
      // const encKey = crypto.deriveCryptoKey(password, encSalt)
      // console.log('')
      // changePassword = (old, password) => {
      //   // Derive the old keys
      //   const oldEncSalt = helpers.b64decode(sessionStorage.getItem('salt.enc'))
      //   const oldEncKey = toznyCrypto.deriveCryptoKey(old, oldEncSalt)

      //   // Fetch and decrypt the user's backup credentials
      //   const raw = sessionStorage.getItem('creds.backup')
      //   const nonce = helpers.b64decode(raw.split(':')[0])
      //   const cipher = helpers.b64decode(raw.split(':')[1])
      //   const jsonConfig = sodium.crypto_secretbox_open_easy(
      //     cipher,
      //     nonce,
      //     oldEncKey
      //   )

      //   return this.setNewPassword(password, jsonConfig)
      // }


    } else {
      console.log('in else statement')
      return new Error('Current password incorrect.')
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
