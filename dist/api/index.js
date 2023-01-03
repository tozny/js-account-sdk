"use strict";
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck disable type-checking for now. turn me back on when feeling brave.
/**
 * Account level API request definitions.
 */
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const utils_1 = require("../utils");
const constants_1 = require("../utils/constants");
const defaultRealmGroups_1 = require("./defaultRealmGroups");
const groupMembership_1 = require("./groupMembership");
const groupRoleMappings_1 = require("./groupRoleMappings");
const identity_1 = require("./identity");
const pam_1 = require("./pam");
const realmApplication_1 = require("./realmApplication");
const realmApplicationRoles_1 = require("./realmApplicationRoles");
const realmGroups_1 = require("./realmGroups");
const realmRoles_1 = require("./realmRoles");
const realmSettings_1 = require("./realmSettings");
const token_1 = __importDefault(require("./token"));
/**
 * API abstracts over the actual API calls made for various account-level operations.
 */
class API {
    constructor(apiUrl = constants_1.DEFAULT_API_URL) {
        this.apiUrl = apiUrl;
    }
    /**
     * Validates a suspected instance of the API is actually an instance.
     *
     * @param {API} api The value to check type of
     * @return {API} the passed instance, only if it is valid.
     */
    static validateInstance(api) {
        if (!(api instanceof API)) {
            throw new Error('the api sent is not an instance of the API class');
        }
        return api;
    }
    /**
     * Gets a token, either cached, or if expired, from the refresh method.
     *
     * @return {Token} The token for use in account level requests.
     */
    token() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._token) {
                throw new Error('No token has been set for the API');
            }
            if (this._token.expired) {
                yield this._token.refresh();
            }
            return this._token;
        });
    }
    /**
     * Sets the token object for this API instance.
     *
     * @param {Token} token The token object to use in requests.
     * @return {undefined}
     */
    setToken(token) {
        if (!(token instanceof token_1.default)) {
            throw new Error('Tokens must be an instance of the token helper class');
        }
        this._token = token;
    }
    /**
     * Creates a new API instance copying this one.
     *
     * @return {API} The new API instance.
     */
    clone() {
        return new this.constructor(this.apiUrl);
    }
    /**
     * Takes a header object and injects the bearer auth header into it with the defined token.
     *
     * @return {object} the headers object with the Authorization bearer token added.
     */
    withToken(headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.token();
            const bearer = yield token.bearer;
            return Object.assign(headers, bearer);
        });
    }
    /**
     * Creates a serialized object that can be stored as a string if needed.
     *
     * @return {object} This API represented as a serialized JSON object.
     */
    serialize() {
        const serialized = {
            apiUrl: this.apiUrl,
        };
        if (this._token) {
            serialized.token = this._token.serialize();
        }
        return serialized;
    }
    /**
     * Get a challenge for an account, beginning the SRP log in flow.
     *
     * @param {string} username The username of the account logging in.
     * @return {Promise<object>} The fetched challenge information.
     */
    getChallenge(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify({
                email: username,
            });
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            return (0, utils_1.validateRequestAsJSON)(request);
        });
    }
    /**
     * Send back a signature asserting authentication for an account challenge.
     *
     * @param {string} username The username of the account logging in.
     * @param {string} challenge The challenge sent by the server.
     * @param {string} response The signed challenge to authenticate.
     * @param {string} keyType Either password or paper, depending on which seed is used to sign.
     * @return {Promise<object>} The account information when authenticated.
     */
    completeChallenge(username, challenge, response, keyType) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    challenge: challenge,
                    response: response,
                    keyid: keyType,
                }),
            });
            return (0, utils_1.validateRequestAsJSON)(request);
        });
    }
    /**
     * Send back a signature asserting authentication for an account challenge. Duplicate of completeChallenge for dashboard portal login
     *
     * @param {string} username The username of the account logging in.
     * @param {string} challenge The challenge sent by the server.
     * @param {string} response The signed challenge to authenticate.
     * @param {string} keyType Either password or paper, depending on which seed is used to sign.
     * @return {Promise<object>} The account information when authenticated.
     */
    completeChallengeForMFA(username, challenge, response, keyType) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/dashboard/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    challenge: challenge,
                    response: response,
                    keyid: keyType,
                }),
            });
            return (0, utils_1.validateRequestAsJSON)(request);
        });
    }
    verifyTotp(username, challenge, response, totp) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/dashboard/verifytotp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    challenge: challenge,
                    response: response,
                    keyid: 'totp',
                    totp: totp,
                }),
            });
            return (0, utils_1.validateRequestAsJSON)(request);
        });
    }
    verifyWebAuthn(username, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/dashboard/verifywebAuthn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.assign({ email: username }, payload)),
            });
            return (0, utils_1.validateRequestAsJSON)(request);
        });
    }
    /**
     * Get the profile metadata associated with an account
     *
     * @return Promise<object> The raw profile meta for an account.
     */
    getProfileMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/profile/meta', {
                method: 'GET',
                headers,
            });
            return (0, utils_1.validateRequestAsJSON)(request);
        });
    }
    /**
     * Overwrite the profile meta for an account.
     *
     * @return {Promise<undefined>} Nothing on success, throws on failure.
     */
    updateProfileMeta(metaMap) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/profile/meta', {
                method: 'PUT',
                headers,
                body: JSON.stringify(metaMap),
            });
            return (0, utils_1.checkStatus)(request);
        });
    }
    /**
     * Send a request with registration information to create a new account.
     *
     * @return {Promise<object>} The new account object for the created account.
     */
    register(profile, account) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify({
                profile: profile,
                account: account,
            });
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            return (0, utils_1.validateRequestAsJSON)(request);
        });
    }
    /**
     * backfillSigningKeys updates the existing v1 client credentials to include a
     * signing key
     *
     * @param {object} queenClient the client to be migrated from v1 to v2
     * @param {string} publicSigningKey the public signing key generated
     * @param {string} clientID the Tozny Client ID for the client
     *
     * @return {Promise<object>} The Client Object
     */
    backfillSigningKeys(queenClient, publicSigningKey, clientID) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify({
                signing_key: publicSigningKey,
            });
            const request = yield queenClient.authenticator.tokenFetch(this.apiUrl + '/v1/client/' + clientID + '/keys', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            });
            return (0, utils_1.validateRequestAsJSON)(request);
        });
    }
    /** requests email verification for a tozny account
     *
     *  Displays error to user if
     *     request fails
     *     account service is down
     *
     * @param {string} id Challenge ID sent to the email address
     * @param {string} otp One time password to validate the email address is accessible
     * @returns response
     */
    verifyEmail(id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/profile/verified?id=${id}&otp=${otp}`, {
                method: 'GET',
            });
            return (0, utils_1.checkStatus)(request);
        });
    }
    /** requests email verification for Tozny account be resent
     *
     * @param {string} email The Tozny account email
     * @returns response
     */
    resendVerificationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/profile', {
                method: 'PATCH',
                headers,
                body: JSON.stringify({
                    profile: {
                        email: email,
                    },
                }),
            });
            return (0, utils_1.checkStatus)(request);
        });
    }
    initiateRecoverAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/challenge/email/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                }),
            });
            return (0, utils_1.checkStatus)(response);
        });
    }
    verifyRecoverAccountChallenge(id, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/profile/authenticate?id=${id}&otp=${otp}`, {
                method: 'GET',
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    rollQueen(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/e3db/clients/queen`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ client }),
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    getBillingStatus(queenClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tokenFetch(this.apiUrl + '/v1/billing/subscription/status', {
                method: 'GET',
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    addBillingCoupon(queenClient, couponCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tokenFetch(this.apiUrl + '/v1/billing/coupon', {
                method: 'POST',
                'Content-Type': 'application/json',
                body: JSON.stringify({ coupon_code: couponCode }),
            });
            return (0, utils_1.checkStatus)(response);
        });
    }
    updateAccountBilling(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/profile', {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({
                    account: account,
                }),
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    subscribe(queenClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tokenFetch(this.apiUrl + '/v1/billing/resubscribe', {
                method: 'GET',
            });
            return (0, utils_1.checkStatus)(response);
        });
    }
    unsubscribe(queenClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tokenFetch(this.apiUrl + '/v1/billing/unsubscribe', {
                method: 'GET',
            });
            return (0, utils_1.checkStatus)(response);
        });
    }
    listClients(queenClient, nextToken, perPage = 50) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tokenFetch(`${this.apiUrl}/v1/client/admin?next=${nextToken}&limit=${perPage}`, {
                method: 'GET',
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    getClient(queenClient, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tokenFetch(this.apiUrl + `/v1/client/admin/${clientId}`, {
                method: 'GET',
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    setClientEnabled(queenClient, clientId, enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield queenClient.authenticator.tokenFetch(`${this.apiUrl}/v1/client/admin/${clientId}/enable`, {
                method: 'PATCH',
                body: JSON.stringify({ enabled }),
            });
            return (0, utils_1.checkStatus)(request);
        });
    }
    updateProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const request = yield (0, isomorphic_fetch_1.default)(this.apiUrl + '/v1/account/profile', {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ profile }),
            });
            return (0, utils_1.validateRequestAsJSON)(request);
        });
    }
    /**
     * Requests a list of tokens available for the account.
     *
     * @return {Array<object>} An array of token objects.
     */
    listTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/tokens`, {
                method: 'GET',
                headers,
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Requests the creation of a new registration token.
     *
     * @param {string} name A user defined name for the token.
     * @param {object} permissions A set of key-value permissions. Default: {}
     * @param {number} totalUsesAllowed The number of uses to allow for the token.
     *                                  If not defined, unlimited uses are allowed.
     *
     * @return {Promise<object>} The raw token object written
     */
    writeToken(name, permissions = {}, totalUsesAllowed) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify({
                name,
                permissions,
                total_uses_allowed: totalUsesAllowed,
            });
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/tokens`, {
                method: 'POST',
                headers,
                body,
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Requests a specific token is removed from the account by token value.
     *
     * @param {string} token The token value to delete from the server
     *
     * @return {Promise<boolean>} True if the operation is successful.
     */
    deleteToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(`${this.apiUrl}/v1/account/tokens/${token}`, {
                method: 'DELETE',
                headers,
            });
            yield (0, utils_1.checkStatus)(response);
            return true;
        });
    }
    /**
     * Requests TOTP QR info for MFA.
     *
     * @return {Promise<object>} The QRInfo Object
     */
    initiateTotp() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/mfa/totp/qrinfo`, {
                method: 'GET',
                headers,
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Registers TOTP.
     *
     */
    registerTotp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/mfa/totp`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            return response.ok ? response : response.json();
        });
    }
    /**
     * Get MFA devices.
     *
     * @return {Array<object>} An array of MFA object.
     */
    getMFA() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/mfa`, {
                method: 'GET',
                headers,
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Delete MFA.
     *
     * @return empty response with status code 200.
     */
    deleteMFA(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/mfa/` + id, {
                method: 'DELETE',
                headers,
            });
            return response;
        });
    }
    /**
     * Requests API to issue challenge.
     *
     * @return {Promise<object>} The challenge data Object
     */
    webAuthnChallenge() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/mfa/webauthn/challenge`, {
                method: 'GET',
                headers,
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    registerWebAuthnDevice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = yield this.withToken({
                'Content-Type': 'application/json',
            });
            const response = yield (0, isomorphic_fetch_1.default)(this.apiUrl + `/v1/account/mfa/webauthn/register`, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            return response;
        });
    }
    /**
     * Requests a list of webhooks available for the account.
     *
     * @return {Array<object>} An array of webhook objects.
     */
    listWebhooks(queenClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tokenFetch(this.apiUrl + `/v1/hook`, {
                method: 'GET',
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Requests the creation of a new webhook.
     *
     * @param {string} webhook_url A user defined name for the token.
     * @param {object} trigger A list of WebhookTrigger objects.
     *
     * @return {Promise<object>} The raw webhook object written
     */
    createWebhook(queenClient, webhook_url, triggers) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhookTriggers = triggers.map((eventString) => {
                return {
                    enabled: true,
                    api_event: eventString,
                };
            });
            const body = JSON.stringify({
                webhook_url,
                triggers: webhookTriggers,
            });
            const response = yield queenClient.authenticator.tokenFetch(this.apiUrl + `/v1/hook`, {
                method: 'POST',
                body,
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Requests a specific webhook be removed from the account by webhook id.
     *
     * @param {string} webhook_id The webhook id to delete from the server
     *
     * @return {Promise<boolean>} True if the operation is successful.
     */
    deleteWebhook(queenClient, webhookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tokenFetch(this.apiUrl + `/v1/hook/${webhookId}`, {
                method: 'DELETE',
            });
            yield (0, utils_1.checkStatus)(response);
            return true;
        });
    }
    getRequests(queenClient, accountId, startTime, endTime, nextToken, endpointsToExclude) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify({
                account_id: accountId,
                range: {
                    start_time: startTime,
                    end_time: endTime,
                },
                exclude: {
                    api_endpoints: endpointsToExclude,
                },
                next_token: nextToken,
            });
            const response = yield queenClient.authenticator.tokenFetch(this.apiUrl + `/v1/metric/requests`, {
                method: 'POST',
                body: body,
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Requests the creation of a new TozID Realm.
     *
     * @param {object} queenClient The queen client for the account to create the realm for.
     * @param {string} realmName The user defined name for the realm to create.
     * @param {string} sovereignName The user defined name for the ruler of the realm to create.
     *
     * @return {Promise<Realm>} The decoded create realm response returned by the server.
     */
    createRealm(queenClient, realmName, sovereignName, realmRegistrationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRealmRequest = {
                realm_name: realmName,
                sovereign_name: sovereignName,
                registration_token: realmRegistrationToken,
            };
            const response = yield queenClient.authenticator.tsv1Fetch(this.apiUrl + '/v1/identity/realm', {
                method: 'POST',
                body: JSON.stringify(createRealmRequest),
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Lists all Realms belonging to the account.
     *
     * @param {object} queenClient The queen client for the account to list the realms of.
     *
     * @return {Promise<ListedRealms>} The decoded listed realm representations returned by the server.
     */
    listRealms(queenClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tsv1Fetch(this.apiUrl + '/v1/identity/realm', {
                method: 'GET',
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Get the count of Identities in a Realm.
     *
     * @param queenClient The queen client for the account to get the count of Identities of a realm.
     * @param realmName The name of the realm to get the Identities count for.
     */
    getRealmUserCount(queenClient, realmName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tsv1Fetch(this.apiUrl + `/v1/identity/realm/${realmName}/identity/count`, {
                method: 'GET',
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Requests the creation of a new TozID Realm.
     *
     * @param {object} queenClient The queen client for the account to delete the realm from.
     * @param {string} realmName The name of the realm to delete.
     *
     * @return {Promise<object>} Empty object.
     */
    deleteRealm(queenClient, realmName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield queenClient.authenticator.tsv1Fetch(this.apiUrl + `/v1/identity/realm/${realmName}`, {
                method: 'DELETE',
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /** Updates the settings for the given realm. */
    updateRealmSettings(queenClient, realmName, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, realmSettings_1.updateRealmSettings)({ realmName, settings }, { apiUrl: this.apiUrl, queenClient });
            // no error means it worked
            return settings;
        });
    }
    getAggregations(queenClient, accountId, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = JSON.stringify({
                account_id: accountId,
                range: {
                    start_time: startTime,
                    end_time: endTime,
                },
            });
            const response = yield queenClient.authenticator.tokenFetch(this.apiUrl + `/v1/metric/requests/aggregations`, {
                method: 'POST',
                body: body,
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Creates a new group for the requested realm.
     */
    createRealmGroup(queenClient, realmName, group) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmGroups_1.createRealmGroup)({ realmName, group }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Updates an existing group for the requested realm.
     */
    updateRealmGroup(queenClient, realmName, groupId, group) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmGroups_1.updateRealmGroup)({ realmName, groupId, group }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Deletes a realm group by id.
     */
    deleteRealmGroup(queenClient, realmName, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, realmGroups_1.deleteRealmGroup)({ realmName, groupId }, { apiUrl: this.apiUrl, queenClient });
            return true;
        });
    }
    /**
     * Describe a single realm group by id.
     */
    describeRealmGroup(queenClient, realmName, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmGroups_1.describeRealmGroup)({ realmName, groupId }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Lists all groups for the request realm.
     */
    listRealmGroups(queenClient, realmName) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmGroups_1.listRealmGroups)({ realmName }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Creates a new role for the requested realm.
     */
    createRealmRole(queenClient, realmName, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmRoles_1.createRealmRole)({ realmName, role }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Updates an existing role for the requested realm.
     */
    updateRealmRole(queenClient, realmName, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmRoles_1.updateRealmRole)({ realmName, role }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Deletes a realm role by id.
     */
    deleteRealmRole(queenClient, realmName, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, realmRoles_1.deleteRealmRole)({ realmName, roleId }, { apiUrl: this.apiUrl, queenClient });
            return true;
        });
    }
    /**
     * Describe a single realm role by id.
     */
    describeRealmRole(queenClient, realmName, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmRoles_1.describeRealmRole)({ realmName, roleId }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Lists all roles for the request realm.
     */
    listRealmRoles(queenClient, realmName) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmRoles_1.listRealmRoles)({ realmName }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Creates a new role for the requested realm.
     */
    createRealmApplicationRole(queenClient, realmName, applicationId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmApplicationRoles_1.createRealmApplicationRole)({ realmName, applicationId, role }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Updates an existing application role for the requested realm.
     */
    updateRealmApplicationRole(queenClient, realmName, applicationId, originalRoleName, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmApplicationRoles_1.updateRealmApplicationRole)({ realmName, applicationId, originalRoleName, role }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Deletes a realm role by name.
     */
    deleteRealmApplicationRole(queenClient, realmName, applicationId, roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, realmApplicationRoles_1.deleteRealmApplicationRole)({ realmName, applicationId, roleName }, { apiUrl: this.apiUrl, queenClient });
            return true;
        });
    }
    /**
     * Describe a single realm role by name.
     */
    describeRealmApplicationRole(queenClient, realmName, applicationId, roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmApplicationRoles_1.describeRealmApplicationRole)({ realmName, applicationId, roleName }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Lists all roles for the request realm.
     */
    listRealmApplicationRoles(queenClient, realmName, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmApplicationRoles_1.listRealmApplicationRoles)({ realmName, applicationId }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * List all groups for an identity
     */
    groupMembership(queenClient, realmName, identityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, groupMembership_1.groupMembership)({ realmName, identityId }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * update group membership
     */
    updateGroupMembership(queenClient, realmName, identityId, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, groupMembership_1.updateGroupMembership)({ realmName, identityId, groups }, { apiUrl: this.apiUrl, queenClient });
            return true;
        });
    }
    /**
     * Join a list of groups for an identity
     */
    joinGroups(queenClient, realmName, identityId, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, groupMembership_1.joinGroups)({ realmName, identityId, groups }, { apiUrl: this.apiUrl, queenClient });
            return true;
        });
    }
    /**
     * Leave a list of Groups
     */
    leaveGroups(queenClient, realmName, identityId, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, groupMembership_1.leaveGroups)({ realmName, identityId, groups }, { apiUrl: this.apiUrl, queenClient });
            return true;
        });
    }
    /**
     *
     * Gets realm & client roles that are mapped to a particular realm group.
     */
    listGroupRoleMappings(queenClient, realmName, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, groupRoleMappings_1.listGroupRoleMappings)({ groupId, realmName }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Maps a particular realm group to a set of realm & client roles.
     */
    addGroupRoleMappings(queenClient, realmName, groupId, groupRoleMapping) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, groupRoleMappings_1.addGroupRoleMappings)({ realmName, groupId, groupRoleMapping }, { apiUrl: this.apiUrl, queenClient });
            return true;
        });
    }
    /**
     * Removes a set of realm/client roles from a group's role mapping.
     */
    removeGroupRoleMappings(queenClient, realmName, groupId, groupRoleMapping) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, groupRoleMappings_1.removeGroupRoleMappings)({ realmName, groupId, groupRoleMapping }, { apiUrl: this.apiUrl, queenClient });
            return true;
        });
    }
    /**
     * Lists all default groups for the request realm.
     */
    listDefaultRealmGroups(queenClient, realmName) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, defaultRealmGroups_1.listDefaultRealmGroups)({ realmName }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Replace default groups for the request realm.
     */
    replaceDefaultRealmGroups(queenClient, realmName, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, defaultRealmGroups_1.replaceDefaultRealmGroups)({ realmName, groups }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Add default groups for the request realm.
     */
    addDefaultRealmGroups(queenClient, realmName, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, defaultRealmGroups_1.addDefaultRealmGroups)({ realmName, groups }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Remove groups for the request realm.
     */
    removeDefaultRealmGroups(queenClient, realmName, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, defaultRealmGroups_1.removeDefaultRealmGroups)({ realmName, groups }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Registers a new identity with the realm
     */
    registerIdentity(realmName, realmRegistrationToken, identity) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, identity_1.registerIdentity)({ realmName, realmRegistrationToken, identity }, { apiUrl: this.apiUrl });
        });
    }
    /**
     * Remove an identity from a realm
     */
    deleteIdentity(queenClient, realmName, identityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, identity_1.deleteIdentity)({ realmName, identityId }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    /**
     * Gets the public info about the Tozny hosted broker
     *
     * @return {Promise<object>} The hosted broker public info.
     */
    getHostedBrokerInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, isomorphic_fetch_1.default)(`${this.apiUrl}/v1/identity/broker/info`);
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * registerRealmBrokerIdentity registers an identity to be the broker for a realm.
     * @param  {object} queenClient       The queen client for the account.
     * @param  {string} realmName         The name of the realm to register the broker identity with.
     * @param  {string} registrationToken A registration for the account that has permissions for registering clients of type broker.
     * @param  {Identity} brokerIdentity   Params for an identity to register as the realm's broker.
     * @return {Promise<Identity>} The broker identity for the realm.
     */
    registerRealmBrokerIdentity(queenClient, realmName, registrationToken, brokerIdentity) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerRealmBrokerRequest = {
                realm_registration_token: registrationToken,
                identity: brokerIdentity,
            };
            const response = yield queenClient.authenticator.tsv1Fetch(this.apiUrl + `/v1/identity/realm/${realmName}/broker/identity`, {
                method: 'POST',
                body: JSON.stringify(registerRealmBrokerRequest),
            });
            const requestResponse = (yield (0, utils_1.validateRequestAsJSON)(response));
            return requestResponse;
        });
    }
    /**
     * listIdentities queries the API to fetch a list of basic identity information
     * @param  {object} queenClient The queen client for the account.
     * @param  {string} realmName   The name of the realm to register the broker identity with.
     * @param  {number} max         The maximum number of identities to fetch at once, min 1, max 1000. Default 100.
     * @param  {number} first       The first (0-indexed) identity to fetch after offset. Default 0.
     * @return {Promise<Array<object>>} The list of basic identity information.
     */
    listIdentities(queenClient, realmName, max, first) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = [`${this.apiUrl}/v1/identity/realm/${realmName}/identity`];
            const query = { first, max };
            const queryString = Object.keys(query)
                .filter((k) => !!query[k])
                .map((k) => `${k}=${encodeURIComponent(query[k])}`)
                .join('&');
            if (queryString) {
                url.push(queryString);
            }
            const fullUrl = url.join('?');
            const response = yield queenClient.authenticator.tsv1Fetch(fullUrl, {
                method: 'GET',
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    /**
     * Fetches detailed identity information given a realm name and username
     * @param  {object} queenClient The queen client for the account.
     * @param  {string} realmName   The name of the realm to register the broker identity with.
     * @param  {string} username    The username to fetch details for.
     * @return {Promise<IdentityDetails>} The detailed information about the identity.
     */
    identityDetails(queenClient, realmName, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const encUsername = encodeURIComponent(username);
            const response = yield queenClient.authenticator.tsv1Fetch(`${this.apiUrl}/v1/identity/realm/${realmName}/identity/${encUsername}`, {
                method: 'GET',
            });
            return (0, utils_1.validateRequestAsJSON)(response);
        });
    }
    listAccessPoliciesForGroups(queenClient, realmName, groupIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, pam_1.listAccessPoliciesForGroups)({ realmName, groupIds }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    upsertAccessPoliciesForGroup(queenClient, realmName, groupId, accessPolicies) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, pam_1.upsertAccessPoliciesForGroup)({ realmName, groupId, accessPolicies }, { apiUrl: this.apiUrl, queenClient });
        });
    }
    listRealmApplications(queenClient, realmName) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, realmApplication_1.listRealmApplications)({ realmName }, { apiUrl: this.apiUrl, queenClient });
        });
    }
}
exports.default = API;
