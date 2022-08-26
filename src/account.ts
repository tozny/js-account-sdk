// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck disable type-checking for now. turn me back on when feeling brave.
/**
 * Account connection operations, including setting up the SDK and API URL
 */

import Client from './client'
import API from './api'
import Token from './api/token'
import Refresher from './api/refresher'
import { validatePlatformSDK, validateEmail } from './utils'
import { DEFAULT_API_URL, KEY_HASH_ROUNDS } from './utils/constants'
import niceware from 'niceware'

/**
 * Account creates connections to a specific Tozny account
 *
 * Mixing together a Tozny client SDK and an API URL, various methods for creating
 * an account level connection are made available. Each method returns an
 * account Client, which represents an active connection to the API for a
 * specific account. Actual account operations are performed using the returned
 * account Client.
 */
class Account {
  /**
   * Creates an Account object mixing the SDK and API URL together.
   *
   * @param {Tozny} sdk An instance of a Tozny client SDK.
   * @param {string} apiUrl The URL of the Tozny Platform instance to connect to.
   */
  constructor(sdk: Tozny, apiUrl: string = DEFAULT_API_URL) {
    this.api = new API(apiUrl)
    this._sdk = validatePlatformSDK(sdk)
  }

  /**
   * gets the current crypto implementation provided by the Tozny client SDK.
   *
   * @return {Crypto}
   */
  get crypto(): Crypto {
    return this._sdk.crypto
  }

  /**
   * Gets the Tozny Storage constructor provided by the Tozny client SDK.
   *
   * @return {any} The Storage constructor
   */
  get Storage(): any {
    return this._sdk.storage
  }

  /**
   * Gets the Tozny Identity constructor provided by the Tozny client SDK.
   *
   * @return {any}
   */
  get Identity(): any {
    return this._sdk.identity
  }

  /**
   * Gets the Tozny types defined in the Tozny client SDK.
   *
   * @return {Object} All of the Tozny client SDK defined types.
   */
  get toznyTypes(): object {
    return this._sdk.types
  }

  /**
   * Use the normal login flow to create a connection to a Tozny account.
   *
   * @param {string} username The username for the account.
   * @param {string} password The secret password for the account.
   * @param {string} type Either standard or paper depending on the password type.
   *
   * @return {Promise<Client>} The Client instance for the provided credentials.
   */
  async login(
    username: string,
    password: string,
    type = 'standard'
  ): Promise<Client> {
    const challenge = await this.api.getChallenge(username)
    const b64AuthSalt =
      type === 'paper' ? challenge.paper_auth_salt : challenge.auth_salt
    const authSalt = await this.crypto.platform.b64URLDecode(b64AuthSalt)
    const sigKeys = await this.crypto.deriveSigningKey(
      password,
      authSalt,
      KEY_HASH_ROUNDS
    )
    const signature = await this.crypto.sign(
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
    clientToken.refresher = new Refresher(
      clientApi,
      this.crypto,
      sigKeys,
      username
    )
    clientApi.setToken(clientToken)

    // Set up queen client
    const meta = await clientApi.getProfileMeta()
    const encClient = type === 'paper' ? meta.paperBackup : meta.backupClient
    const b64EncSalt =
      type === 'paper'
        ? profile.profile.paper_enc_salt
        : profile.profile.enc_salt
    const encSalt = await this.crypto.platform.b64URLDecode(b64EncSalt)
    const encKey = await this.crypto.deriveSymmetricKey(
      password,
      encSalt,
      KEY_HASH_ROUNDS
    )
    const clientCreds = await this.crypto.decryptString(encClient, encKey)
    let storageConfig = this.Storage.Config.fromObject(clientCreds)
    storageConfig.apiUrl = this.api.apiUrl
    let storageClient = new this.Storage.Client(storageConfig)
    // Admin Client Migration for Version 1 Clients
    if (!storageConfig.publicSigningKey) {
      // If they dont have a public signing key, then we need to generate a signing key pair and store the public key
      const signingKeypair = await this.crypto.generateSigningKeypair()
      // Backfill to Client service
      const publicSigningKey = { ed25519: signingKeypair.publicKey }
      await clientApi.backfillSigningKeys(
        storageClient,
        publicSigningKey,
        storageConfig.clientId
      )
      // Update the storage config
      const serializedV1QueenClient = storageConfig.serialize()
      serializedV1QueenClient.public_signing_key = signingKeypair.publicKey
      serializedV1QueenClient.private_signing_key = signingKeypair.privateKey
      storageConfig = this.Storage.Config.fromObject(serializedV1QueenClient)
      // Create an encrypted back up client with new signing key pair
      const encQueenCreds = await this.crypto.encryptString(
        JSON.stringify(serializedV1QueenClient),
        encKey
      )
      // Replace V1 Profile Meta
      await clientApi.updateProfileMeta({
        backupEnabled: meta.backupEnabled,
        backupClient: encQueenCreds,
        paperBackup: meta.paperBackup,
      })
      // If we updated the storage config, update the storage client
      storageClient = new this.Storage.Client(storageConfig)
    }
    return new Client(
      clientApi,
      profile.account,
      profile.profile,
      storageClient
    )
  }

  /**
   * Use the normal login flow to create a connection to a Tozny account.
   *
   * @param {string} username The username for the account.
   * @param {string} password The secret password for the account.
   * @param {string} type Either standard or paper depending on the password type.
   *
   * @return ??
   */
  async loginWithMFA(
    username: string,
    password: string,
    type = 'standard'
  ): Promise<any> {
    const challenge = await this.api.getChallenge(username)
    const b64AuthSalt =
      type === 'paper' ? challenge.paper_auth_salt : challenge.auth_salt
    const authSalt = await this.crypto.platform.b64URLDecode(b64AuthSalt)
    const sigKeys = await this.crypto.deriveSigningKey(
      password,
      authSalt,
      KEY_HASH_ROUNDS
    )
    const signature = await this.crypto.sign(
      challenge.challenge,
      sigKeys.privateKey
    )
    const profile = await this.api.completeChallengeForMFA(
      username,
      challenge.challenge,
      signature,
      type === 'paper' ? 'paper' : 'password'
    )
    const b64EncSalt =
      type === 'paper'
        ? profile.profile.paper_enc_salt
        : profile.profile.enc_salt
    const encSalt = await this.crypto.platform.b64URLDecode(b64EncSalt)
    const encKey = await this.crypto.deriveSymmetricKey(
      password,
      encSalt,
      KEY_HASH_ROUNDS
    )
    return { sigKeys, encKey, profile }
  }

  async verifyTotp(username, sigKeys, challenge, totp) {
    //If totp is enabled. It will return profile.
    const signature = await this.crypto.sign(challenge, sigKeys.privateKey)
    const profile = await this.api.verifyTotp(
      username,
      challenge,
      signature,
      totp
    )
  }

  async completeLogin(username, sigKeys, encKey, profile) {
    //Continue setting login values.

    // Set up client API with token an refresh
    const clientToken = new Token(profile.token)
    console.log('profile', profile)
    console.log('token', profile.token)
    const clientApi = this.api.clone()
    clientToken.refresher = new Refresher(
      clientApi,
      this.crypto,
      sigKeys,
      username
    )
    clientApi.setToken(clientToken)

    // Set up queen keys
    const meta = await clientApi.getProfileMeta()
    //const encClient = type === 'paper' ? meta.paperBackup : meta.backupClient
    const encClient = meta.backupClient
    const clientCreds = await this.crypto.decryptString(encClient, encKey)
    const storageConfig = this.Storage.Config.fromObject(clientCreds)
    storageConfig.apiUrl = this.api.apiUrl
    const storageClient = new this.Storage.Client(storageConfig)

    return new Client(
      clientApi,
      profile.account,
      profile.profile,
      storageClient
    )
  }

  /**
   * Creates a new account using the credentials provided.
   * @param {string} name The name to use for the account.
   * @param {string} email The email address for the account.
   * @param {string} password The secret password for the account.
   *
   * @return {Promise<Object>} An object containing the paper key generated at and
   *                           `object[paperKey]` and the client instance associated
   *                           with the new client at `object[client]`.
   */
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<object> {
    validateEmail(email)
    const encSalt = await this.crypto.randomBytes(16)
    const authSalt = await this.crypto.randomBytes(16)
    const paperEncSalt = await this.crypto.randomBytes(16)
    const paperAuthSalt = await this.crypto.randomBytes(16)

    const paperKey = niceware.generatePassphrase(12).join('-')
    const encKey = await this.crypto.deriveSymmetricKey(
      password,
      encSalt,
      KEY_HASH_ROUNDS
    )
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
    const profile = {
      name,
      email,
      auth_salt: await this.crypto.platform.b64URLEncode(authSalt),
      enc_salt: await this.crypto.platform.b64URLEncode(encSalt),
      paper_auth_salt: await this.crypto.platform.b64URLEncode(paperAuthSalt),
      paper_enc_salt: await this.crypto.platform.b64URLEncode(paperEncSalt),
      signing_key: {
        ed25519: authKeypair.publicKey,
      },
      paper_signing_key: {
        ed25519: paperAuthKeypair.publicKey,
      },
    }

    // backup client
    const clientEncKeys = await this.crypto.generateKeypair()
    const clientSigKeys = await this.crypto.generateSigningKeypair()
    // Set up the user account
    const account = {
      company: '',
      plan: 'free0',
      public_key: {
        curve25519: clientEncKeys.publicKey,
      },
      signing_key: {
        ed25519: clientSigKeys.publicKey,
      },
    }

    const registration = await this.api.register(profile, account)
    // Set up client API with token and refresh
    const clientToken = new Token(registration.token)
    const clientApi = this.api.clone()
    clientToken.refresher = new Refresher(
      clientApi,
      this.crypto,
      authKeypair,
      email
    )
    clientApi.setToken(clientToken)

    // Set up client config and client
    const clientConfig = new this.Storage.Config(
      registration.account.client.client_id,
      registration.account.client.api_key_id,
      registration.account.client.api_secret,
      clientEncKeys.publicKey,
      clientEncKeys.privateKey,
      clientSigKeys.publicKey,
      clientSigKeys.privateKey,
      this.api.apiUrl
    )
    const storageClient = new this.Storage.Client(clientConfig)

    // Back up queen client credentials to meta
    const serializedConfig = clientConfig.serialize()
    const encQueenCreds = await this.crypto.encryptString(
      JSON.stringify(serializedConfig),
      encKey
    )
    const paperEncQueenCreds = await this.crypto.encryptString(
      JSON.stringify(serializedConfig),
      paperEncKey
    )
    await clientApi.updateProfileMeta({
      backupEnabled: 'enabled',
      backupClient: encQueenCreds,
      paperBackup: paperEncQueenCreds,
    })

    // Return the client object and the paper key
    const client = new Client(
      clientApi,
      registration.account,
      registration.profile,
      storageClient
    )
    return {
      paperKey,
      client,
    }
  }

  /**
   * Begin to recover lost account access.
   *
   * @param {string} email The email address associate with the account.
   */
  async initiateRecoverAccount(email: string) {
    return this.api.initiateRecoverAccount(email)
  }

  /**
   * Verify the recovery challenge information.
   *
   * @param {string} id The recovery challenge ID
   * @param {string} otp The recovery one time password for recovery
   * @return The recovery object for the account
   */
  async verifyRecoverAccountChallenge(id: string, otp: string) {
    return this.api.verifyRecoverAccountChallenge(id, otp)
  }

  /**
   * Chance the account password to a new one with an account token.
   *
   * @param {string} password The new password to set for the account.
   * @param {string} accountToken The token for making account requests.
   * @return {Promise<object>} An object with the new queen client and paper key.
   */
  async changeAccountPassword(
    password: string,
    accountToken: string
  ): Promise<object> {
    const tok = new Token(accountToken)

    const clientApi = this.api.clone()
    clientApi.setToken(tok)

    const encSalt = await this.crypto.randomBytes(16)
    const authSalt = await this.crypto.randomBytes(16)
    const paperEncSalt = await this.crypto.randomBytes(16)
    const paperAuthSalt = await this.crypto.randomBytes(16)

    const paperKey = niceware.generatePassphrase(12).join('-')
    const encKey = await this.crypto.deriveSymmetricKey(
      password,
      encSalt,
      KEY_HASH_ROUNDS
    )
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
    const profile = {
      auth_salt: await this.crypto.platform.b64URLEncode(authSalt),
      enc_salt: await this.crypto.platform.b64URLEncode(encSalt),
      paper_auth_salt: await this.crypto.platform.b64URLEncode(paperAuthSalt),
      paper_enc_salt: await this.crypto.platform.b64URLEncode(paperEncSalt),
      signing_key: {
        ed25519: authKeypair.publicKey,
      },
      paper_signing_key: {
        ed25519: paperAuthKeypair.publicKey,
      },
    }

    const updatedProfile = await clientApi.updateProfile(profile)

    tok.refresher = new Refresher(
      clientApi,
      this.crypto,
      authKeypair,
      updatedProfile.profile.email
    )
    clientApi.setToken(tok)

    // backup client
    const clientEncKeys = await this.crypto.generateKeypair()
    const clientSigKeys = await this.crypto.generateSigningKeypair()

    const client = {
      name: 'Backup Client',
      public_key: {
        curve25519: clientEncKeys.publicKey,
      },
      signing_key: {
        ed25519: clientSigKeys.publicKey,
      },
    }

    const newQueen = await clientApi.rollQueen(client)

    const backupConfig = new this.Storage.Config(
      newQueen.client_id,
      newQueen.api_key_id,
      newQueen.api_secret,
      clientEncKeys.publicKey,
      clientEncKeys.privateKey,
      clientSigKeys.publicKey,
      clientSigKeys.privateKey,
      this.api.apiUrl
    )
    const storageClient = new this.Storage.Client(backupConfig)

    const serializedConfig = backupConfig.serialize()
    const encQueenCreds = await this.crypto.encryptString(
      JSON.stringify(serializedConfig),
      encKey
    )
    const paperEncQueenCreds = await this.crypto.encryptString(
      JSON.stringify(serializedConfig),
      paperEncKey
    )

    await clientApi.updateProfileMeta({
      backupEnabled: 'enabled',
      backupClient: encQueenCreds,
      paperBackup: paperEncQueenCreds,
    })

    const newQueenClient = new Client(
      clientApi,
      updatedProfile.account,
      updatedProfile.profile,
      storageClient
    )

    return {
      paperKey,
      newQueenClient,
    }
  }

  /**
   * Requests email verification for a Tozny account.
   *
   * @param {string} id - id to identify the otp challenge
   * @param {string} otp - otp secret to authenticate the challenge
   *
   * @returns response
   */
  async verifyEmail(id: string, otp: string) {
    return this.api.verifyEmail(id, otp)
  }

  /**
   * Recreate an account client from one that was serialized to JSON.
   *
   * After calling `Client.serialize()` plain javascript object is created with
   * all of the values needed to recreate that client. This can be safely stored
   * as JSON. This method is used to turn the object created by `Client.serialize()`
   * back into a Client instance with all of the available methods.
   *
   * @param {object} obj The serialized object created from an existing account client.
   *
   * @return {Client} A new Client created with all provided values from the object.
   */
  fromObject(obj: object): Client {
    let token, api
    // If an API is available, create it.
    if (obj.api && typeof obj.api === 'object') {
      api = new API(obj.api.apiUrl)
      // If a token for the API is available, create it.
      if (obj.api.token && typeof obj.api.token === 'object') {
        token = new Token(obj.api.token.token, obj.api.token.created)
        // If a refresher for the token is available, create it.
        if (
          obj.api.token.refresher &&
          typeof obj.api.token.refresher === 'object'
        ) {
          token.refresher = new Refresher(
            api,
            this.crypto,
            obj.api.token.refresher.keys,
            obj.api.token.refresher.username
          )
        }
        api.setToken(token)
      }
    } else {
      // fall back to using a clone of this API if not defined.
      api = this.api.clone()
    }
    // Create the queen client.
    const clientConfig = this.Storage.Config.fromObject(obj.storageClient)
    const queenClient = new this.Storage.Client(clientConfig)
    // Create a new client object with the provided values.
    return new Client(api, obj.account, obj.profile, queenClient)
  }
}

export default Account
