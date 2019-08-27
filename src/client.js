const {validateStorageClient} = require('./utils')
const API = require('./api')
const { AccountBillingStatus } = require('./types')

class Client {
  constructor (api, account, profile, queenClient) {
    this.api = API.validateInstance(api)
    this._queenClient = validateStorageClient(queenClient)
    this.account = account
    this.profile = profile
  }

  updatePassword(){}

  async billingStatus() {
    const rawResponse = await this.api.getBillingStatus(this._queenClient)
    const billingStatus = AccountBillingStatus.decode(rawResponse)
    return billingStatus
  }

  async accountClients(nextToken=0) {
    const rawResponse = await this.api.listClients(this._queenClient, nextToken)
    return rawResponse
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
