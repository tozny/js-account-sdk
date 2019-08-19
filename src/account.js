const Client = require('./client')
const API = require('./api')
const Token = require('./api/token')
const Refresher = require('./api/refresher')
const {validatePlatformSDK, validateEmail} = require('./utils')
const { DEFAULT_API_URL, KEY_HASH_ROUNDS } = require('./utils/constants')
const niceware = require('niceware')

class Account {
  constructor(sdk, apiUrl = DEFAULT_API_URL) {
    this.api = new API(apiUrl)
    this._sdk = validatePlatformSDK(sdk)
  }

  get crypto() {
    return this._sdk.crypto
  }

  get Storage() {
    return this._sdk.Storage
  }

  get Identity() {
    return this._sdk.Identity
  }

  get toznyTypes() {
    return this._sdk.types
  }

  async login(username, password, type = 'standard') {
    const challenge = await this.api.getChallenge(username)
    const b64AuthSalt = type === 'paper' ? challenge.paper_auth_salt : challenge.auth_salt
    const authSalt = await this.crypto.b64decode(b64AuthSalt)
    const sigKeys = await this.crypto.deriveSigningKey(
      password,
      authSalt,
      KEY_HASH_ROUNDS
    )
    const signature = await this.crypto.signDetached(
      challenge.challenge,
      sigKeys.privateKey
    )
    const profile = await this.api.completeChallenge(
      username,
      challenge.challenge,
      signature,
      type === 'paper' ? 'paper' : 'password'
    )
    // Set up client API with token an refresh
    const clientToken = new Token(profile.token)
    const clientApi = this.api.clone()
    clientToken.refresher = new Refresher(clientApi, this.crypto, sigKeys, username)
    clientApi.setToken(clientToken)

    // Set up queen client
    const meta = await clientApi.getProfileMeta()
    const encClient = type === 'paper' ? meta.paperBackup : meta.backupClient
    const b64EncSalt = type === 'paper' ? profile.profile.paper_enc_salt : profile.profile.enc_salt
    const encSalt = await this.crypto.b64decode(b64EncSalt)
    const encKey = await this.crypto.deriveSymmetricKey(password, encSalt, KEY_HASH_ROUNDS)
    const clientCreds = await this.crypto.decryptString(encClient, encKey)
    const storageClient =  new this.Storage.Client(this.Storage.Config.fromObject(clientCreds))
    return new Client(clientApi, profile.account, profile.profile, storageClient)
  }

  async register(name, email, password) {
    validateEmail(email)
    const encSalt = await this.crypto.randomBytes(16)
    const authSalt = await this.crypto.randomBytes(16)
    const paperEncSalt = await this.crypto.randomBytes(16)
    const paperAuthSalt = await this.crypto.randomBytes(16)

    const paperKey = niceware.generatePassphrase(12).join('-')
    const encKey = await this.crypto.deriveSymmetricKey(
      password,
      encSalt,
      KEY_HASH_ROUNDS)
    const authKeypair = await this.crypto.deriveSigningKey(
      password,
      authSalt,
      KEY_HASH_ROUNDS
    )
    const paperEncKey = await this.crypto.deriveSymmetricKey(
      paperKey,
      paperEncSalt,
      KEY_HASH_ROUNDS
    )
    const paperAuthKeypair = await this.crypto.deriveSigningKey(
      paperKey,
      paperAuthSalt,
      KEY_HASH_ROUNDS
    )

    // Set up user profile
    let profile = {
      name,
      email,
      auth_salt: await this.crypto.b64encode(authSalt),
      enc_salt: await this.crypto.b64encode(encSalt),
      paper_auth_salt: await this.crypto.b64encode(paperAuthSalt),
      paper_enc_salt: await this.crypto.b64encode(paperEncSalt),
      signing_key: {
        ed25519: authKeypair.publicKey
      },
      paper_signing_key: {
        ed25519: paperAuthKeypair.publicKey
      }
    }

    // backup client
    const clientEncKeys = await this.crypto.generateKeypair()
    const clientSigKeys = await this.crypto.generateSigningKeypair()
    // Set up the user account
    let account = {
      company: '',
      plan: 'free0',
      public_key: {
        curve25519: clientEncKeys.publicKey
      },
      signing_key: {
        ed25519: clientSigKeys.publicKey
      }
    }

    const registration = await this.api.register(profile, account)
    // Set up client API with token an refresh
    const clientToken = new Token(registration.token)
    const clientApi = this.api.clone()
    clientToken.refresher = new Refresher(clientApi, this.crypto, authKeypair, name)
    clientApi.setToken(clientToken)

    // Set up client config and client
    const clientConfig = new this.Storage.Config(
      registration.account.client.client_id,
      registration.account.client.api_key_id,
      registration.account.client.api_secret,
      clientEncKeys.publicKey,
      clientEncKeys.privateKey,
      this.api.apiUrl,
      clientSigKeys.publicKey,
      clientSigKeys.privateKey
    )
    const storageClient = new this.Storage.Client(clientConfig)

    // Back up queen client credentials to meta
    const serializedConfig = clientConfig.serialize()
    const encQueenCreds = await this.crypto.encryptString(JSON.stringify(serializedConfig), encKey)
    const paperEncQueenCreds = await this.crypto.encryptString(JSON.stringify(serializedConfig), paperEncKey)
    await clientApi.updateProfileMeta({
      backupEnabled: 'enabled',
      backupClient: encQueenCreds,
      paperBackup: paperEncQueenCreds
    })

    // Return the client object and the paper key
    const client = new Client(clientApi, registration.account, registration.profile, storageClient)
    return {
      paperKey,
      client
    }
  }

  fromObject(obj) {
    let token, api
    if ( obj.api && typeof obj.api === 'object' ) {
      if (obj.api.token && obj.api.token === 'object' ) {
        token = new Token(obj.api.token.token, obj.api.token.created )
      }
      api = new API(api.apiUrl)
      api.token = token
    }
    const clientConfig = this.Storage.Config.fromObject( obj.storageClient )
    const queenClient = new this.Storage.Client(clientConfig)
    return new Client(api, obj.account, obj.profile, queenClient)
  }
}

module.exports = Account
