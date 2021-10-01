"use strict";
// @ts-nocheck disable type-checking for now. turn me back on when feeling brave.
/**
 * Account connection operations, including setting up the SDK and API URL
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("./client"));
// a quirk of importing ts into js is that it exports as an object with a `default` property
const API = require('./api').default;
const token_1 = __importDefault(require("./api/token"));
const refresher_1 = __importDefault(require("./api/refresher"));
const utils_1 = require("./utils");
const constants_1 = require("./utils/constants");
const niceware_1 = __importDefault(require("niceware"));
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
    constructor(sdk, apiUrl = constants_1.DEFAULT_API_URL) {
        this.api = new API(apiUrl);
        this._sdk = utils_1.validatePlatformSDK(sdk);
    }
    /**
     * gets the current crypto implementation provided by the Tozny client SDK.
     *
     * @return {Crypto}
     */
    get crypto() {
        return this._sdk.crypto;
    }
    /**
     * Gets the Tozny Storage constructor provided by the Tozny client SDK.
     *
     * @return {Function} The Storage constructor
     */
    get Storage() {
        return this._sdk.storage;
    }
    /**
     * Gets the Tozny Identity constructor provided by the Tozny client SDK.
     *
     * @return {Function}
     */
    get Identity() {
        return this._sdk.identity;
    }
    /**
     * Gets the Tozny types defined in the Tozny client SDK.
     *
     * @return {Object} All of the Tozny client SDK defined types.
     */
    get toznyTypes() {
        return this._sdk.types;
    }
    /**
     * Use the normal login flow to create a connection to a Tozny account.
     *
     * @param {string} username The username for the account.
     * @param {string} password The secrete password for the account.
     * @param {string} type Either standard or paper depending on the password type.
     *
     * @return {Promise<Client>} The Client instance for the provided credentials.
     */
    login(username, password, type = 'standard') {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = yield this.api.getChallenge(username);
            const b64AuthSalt = type === 'paper' ? challenge.paper_auth_salt : challenge.auth_salt;
            const authSalt = yield this.crypto.platform.b64URLDecode(b64AuthSalt);
            const sigKeys = yield this.crypto.deriveSigningKey(password, authSalt, constants_1.KEY_HASH_ROUNDS);
            const signature = yield this.crypto.sign(challenge.challenge, sigKeys.privateKey);
            const profile = yield this.api.completeChallenge(username, challenge.challenge, signature, type === 'paper' ? 'paper' : 'password');
            // Set up client API with token an refresh
            const clientToken = new token_1.default(profile.token);
            const clientApi = this.api.clone();
            clientToken.refresher = new refresher_1.default(clientApi, this.crypto, sigKeys, username);
            clientApi.setToken(clientToken);
            // Set up queen client
            const meta = yield clientApi.getProfileMeta();
            const encClient = type === 'paper' ? meta.paperBackup : meta.backupClient;
            const b64EncSalt = type === 'paper'
                ? profile.profile.paper_enc_salt
                : profile.profile.enc_salt;
            const encSalt = yield this.crypto.platform.b64URLDecode(b64EncSalt);
            const encKey = yield this.crypto.deriveSymmetricKey(password, encSalt, constants_1.KEY_HASH_ROUNDS);
            const clientCreds = yield this.crypto.decryptString(encClient, encKey);
            let storageConfig = this.Storage.Config.fromObject(clientCreds);
            storageConfig.apiUrl = this.api.apiUrl;
            let storageClient = new this.Storage.Client(storageConfig);
            // Admin Client Migration for Version 1 Clients
            if (!storageConfig.publicSigningKey) {
                // If they dont have a public signing key, then we need to generate a signing key pair and store the public key
                const signingKeypair = yield this.crypto.generateSigningKeypair();
                // Backfill to Client service
                const publicSigningKey = { ed25519: signingKeypair.publicKey };
                yield clientApi.backfillSigningKeys(storageClient, publicSigningKey, storageConfig.clientId);
                // Update the storage config
                const serializedV1QueenClient = storageConfig.serialize();
                serializedV1QueenClient.public_signing_key = signingKeypair.publicKey;
                serializedV1QueenClient.private_signing_key = signingKeypair.privateKey;
                storageConfig = this.Storage.Config.fromObject(serializedV1QueenClient);
                // Create an encrypted back up client with new signing key pair
                const encQueenCreds = yield this.crypto.encryptString(JSON.stringify(serializedV1QueenClient), encKey);
                // Replace V1 Profile Meta
                yield clientApi.updateProfileMeta({
                    backupEnabled: meta.backupEnabled,
                    backupClient: encQueenCreds,
                    paperBackup: meta.paperBackup,
                });
                // If we updated the storage config, update the storage client
                storageClient = new this.Storage.Client(storageConfig);
            }
            return new client_1.default(clientApi, profile.account, profile.profile, storageClient);
        });
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
    register(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            utils_1.validateEmail(email);
            const encSalt = yield this.crypto.randomBytes(16);
            const authSalt = yield this.crypto.randomBytes(16);
            const paperEncSalt = yield this.crypto.randomBytes(16);
            const paperAuthSalt = yield this.crypto.randomBytes(16);
            const paperKey = niceware_1.default.generatePassphrase(12).join('-');
            const encKey = yield this.crypto.deriveSymmetricKey(password, encSalt, constants_1.KEY_HASH_ROUNDS);
            const authKeypair = yield this.crypto.deriveSigningKey(password, authSalt, constants_1.KEY_HASH_ROUNDS);
            const paperEncKey = yield this.crypto.deriveSymmetricKey(paperKey, paperEncSalt, constants_1.KEY_HASH_ROUNDS);
            const paperAuthKeypair = yield this.crypto.deriveSigningKey(paperKey, paperAuthSalt, constants_1.KEY_HASH_ROUNDS);
            // Set up user profile
            let profile = {
                name,
                email,
                auth_salt: yield this.crypto.platform.b64URLEncode(authSalt),
                enc_salt: yield this.crypto.platform.b64URLEncode(encSalt),
                paper_auth_salt: yield this.crypto.platform.b64URLEncode(paperAuthSalt),
                paper_enc_salt: yield this.crypto.platform.b64URLEncode(paperEncSalt),
                signing_key: {
                    ed25519: authKeypair.publicKey,
                },
                paper_signing_key: {
                    ed25519: paperAuthKeypair.publicKey,
                },
            };
            // backup client
            const clientEncKeys = yield this.crypto.generateKeypair();
            const clientSigKeys = yield this.crypto.generateSigningKeypair();
            // Set up the user account
            let account = {
                company: '',
                plan: 'free0',
                public_key: {
                    curve25519: clientEncKeys.publicKey,
                },
                signing_key: {
                    ed25519: clientSigKeys.publicKey,
                },
            };
            const registration = yield this.api.register(profile, account);
            // Set up client API with token and refresh
            const clientToken = new token_1.default(registration.token);
            const clientApi = this.api.clone();
            clientToken.refresher = new refresher_1.default(clientApi, this.crypto, authKeypair, email);
            clientApi.setToken(clientToken);
            // Set up client config and client
            const clientConfig = new this.Storage.Config(registration.account.client.client_id, registration.account.client.api_key_id, registration.account.client.api_secret, clientEncKeys.publicKey, clientEncKeys.privateKey, clientSigKeys.publicKey, clientSigKeys.privateKey, this.api.apiUrl);
            const storageClient = new this.Storage.Client(clientConfig);
            // Back up queen client credentials to meta
            const serializedConfig = clientConfig.serialize();
            const encQueenCreds = yield this.crypto.encryptString(JSON.stringify(serializedConfig), encKey);
            const paperEncQueenCreds = yield this.crypto.encryptString(JSON.stringify(serializedConfig), paperEncKey);
            yield clientApi.updateProfileMeta({
                backupEnabled: 'enabled',
                backupClient: encQueenCreds,
                paperBackup: paperEncQueenCreds,
            });
            // Return the client object and the paper key
            const client = new client_1.default(clientApi, registration.account, registration.profile, storageClient);
            return {
                paperKey,
                client,
            };
        });
    }
    /**
     * Begin to recover lost account access.
     *
     * @param {string} email The email address associate with the account.
     */
    initiateRecoverAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.initiateRecoverAccount(email);
        });
    }
    /**
     * Verify the recovery challenge information.
     *
     * @param {string} id The recovery challenge ID
     * @param {string} otp The recovery one time password for recovery
     * @return The recovery object for the account
     */
    verifyRecoverAccountChallenge(id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.verifyRecoverAccountChallenge(id, otp);
        });
    }
    /**
     * Chance the account password to a new one with an account token.
     *
     * @param {string} password The new password to set for the account.
     * @param {string} accountToken The token for making account requests.
     * @return {Promise<object>} An object with the new queen client and paper key.
     */
    changeAccountPassword(password, accountToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tok = new token_1.default(accountToken);
            const clientApi = this.api.clone();
            clientApi.setToken(tok);
            const encSalt = yield this.crypto.randomBytes(16);
            const authSalt = yield this.crypto.randomBytes(16);
            const paperEncSalt = yield this.crypto.randomBytes(16);
            const paperAuthSalt = yield this.crypto.randomBytes(16);
            const paperKey = niceware_1.default.generatePassphrase(12).join('-');
            const encKey = yield this.crypto.deriveSymmetricKey(password, encSalt, constants_1.KEY_HASH_ROUNDS);
            const authKeypair = yield this.crypto.deriveSigningKey(password, authSalt, constants_1.KEY_HASH_ROUNDS);
            const paperEncKey = yield this.crypto.deriveSymmetricKey(paperKey, paperEncSalt, constants_1.KEY_HASH_ROUNDS);
            const paperAuthKeypair = yield this.crypto.deriveSigningKey(paperKey, paperAuthSalt, constants_1.KEY_HASH_ROUNDS);
            // Set up user profile
            let profile = {
                auth_salt: yield this.crypto.platform.b64URLEncode(authSalt),
                enc_salt: yield this.crypto.platform.b64URLEncode(encSalt),
                paper_auth_salt: yield this.crypto.platform.b64URLEncode(paperAuthSalt),
                paper_enc_salt: yield this.crypto.platform.b64URLEncode(paperEncSalt),
                signing_key: {
                    ed25519: authKeypair.publicKey,
                },
                paper_signing_key: {
                    ed25519: paperAuthKeypair.publicKey,
                },
            };
            const updatedProfile = yield clientApi.updateProfile(profile);
            tok.refresher = new refresher_1.default(clientApi, this.crypto, authKeypair, updatedProfile.profile.email);
            clientApi.setToken(tok);
            // backup client
            const clientEncKeys = yield this.crypto.generateKeypair();
            const clientSigKeys = yield this.crypto.generateSigningKeypair();
            let client = {
                name: 'Backup Client',
                public_key: {
                    curve25519: clientEncKeys.publicKey,
                },
                signing_key: {
                    ed25519: clientSigKeys.publicKey,
                },
            };
            let newQueen = yield clientApi.rollQueen(client);
            const backupConfig = new this.Storage.Config(newQueen.client_id, newQueen.api_key_id, newQueen.api_secret, clientEncKeys.publicKey, clientEncKeys.privateKey, clientSigKeys.publicKey, clientSigKeys.privateKey, this.api.apiUrl);
            const storageClient = new this.Storage.Client(backupConfig);
            const serializedConfig = backupConfig.serialize();
            const encQueenCreds = yield this.crypto.encryptString(JSON.stringify(serializedConfig), encKey);
            const paperEncQueenCreds = yield this.crypto.encryptString(JSON.stringify(serializedConfig), paperEncKey);
            yield clientApi.updateProfileMeta({
                backupEnabled: 'enabled',
                backupClient: encQueenCreds,
                paperBackup: paperEncQueenCreds,
            });
            const newQueenClient = new client_1.default(clientApi, updatedProfile.account, updatedProfile.profile, storageClient);
            return {
                paperKey,
                newQueenClient,
            };
        });
    }
    /**
     * Requests email verification for a Tozny account.
     *
     * @param {string} id - id to identify the otp challenge
     * @param {string} otp - otp secret to authenticate the challenge
     *
     * @returns response
     */
    verifyEmail(id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.verifyEmail(id, otp);
        });
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
    fromObject(obj) {
        let token, api;
        // If an API is available, create it.
        if (obj.api && typeof obj.api === 'object') {
            api = new API(obj.api.apiUrl);
            // If a token for the API is available, create it.
            if (obj.api.token && typeof obj.api.token === 'object') {
                token = new token_1.default(obj.api.token.token, obj.api.token.created);
                // If a refresher for the token is available, create it.
                if (obj.api.token.refresher &&
                    typeof obj.api.token.refresher === 'object') {
                    token.refresher = new refresher_1.default(api, this.crypto, obj.api.token.refresher.keys, obj.api.token.refresher.username);
                }
                api.setToken(token);
            }
        }
        else {
            // fall back to using a clone of this API if not defined.
            api = this.api.clone();
        }
        // Create the queen client.
        const clientConfig = this.Storage.Config.fromObject(obj.storageClient);
        const queenClient = new this.Storage.Client(clientConfig);
        // Create a new client object with the provided values.
        return new client_1.default(api, obj.account, obj.profile, queenClient);
    }
}
exports.default = Account;
