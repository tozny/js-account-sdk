const { validateStorageClient } = require('./utils')
const API = require('./api')
const { AccountBillingStatus } = require('./types')

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

  async changePassword({ password, newPassword }) {
    console.log("password", password)
    console.log("newPassword", newPassword)
    console.log(this._queenClient.crypto)
    const crypto = this._queenClient.crypto
    console.log(crypto)
    const authSalt = await crypto.b64decode(this.profile.auth_salt)
    console.log('authSalt', authSalt)
    const keypair = await crypto.deriveSigningKey(password, authSalt)
    console.log('keypair', keypair)
    const attempt = await crypto.b64encode(keypair.publicKey)
    console.log('attempt', attempt)
    const signingKey = this.profile.signing_key
    console.log('signingKey', signingKey)
    return 'THE RETURN STATEMENT'
    // verifyPassword(maybePassword) {
    //   return new Promise((resolve, reject) => {
    //     if (sessionStorage.getItem('key.signing') === attempt) resolve()
    //     else reject(new Error('Your password is incorrect.'))
    //   })
    // }
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
