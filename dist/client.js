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
const { validateStorageClient } = require('./utils');
const API = require('./api').default;
const { KEY_HASH_ROUNDS } = require('./utils/constants');
const { AccountBillingStatus, RegistrationToken, Realm, Realms, Identity, ClientInfo, ClientInfoList, Role, Group, GroupRoleMapping, } = require('./types');
const Refresher = require('./api/refresher');
const Token = require('./api/token');
const BasicIdentity = require('./types/basicIdentity').default;
const ListIdentitiesResult = require('./types/listIdentitiesResult');
const DetailedIdentity = require('./types/detailedIdentity');
class Client {
    constructor(api, account, profile, queenClient) {
        this.api = API.validateInstance(api);
        this._queenClient = validateStorageClient(queenClient);
        this.account = account;
        this.profile = profile;
    }
    get queenClient() {
        return this._queenClient;
    }
    validatePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const crypto = this._queenClient.crypto;
            const authSalt = yield crypto.platform.b64URLDecode(this.profile.auth_salt);
            const keypair = yield crypto.deriveSigningKey(password, authSalt, KEY_HASH_ROUNDS);
            const signingKey = this.profile.signing_key;
            return keypair.publicKey === signingKey.ed25519;
        });
    }
    changePassword({ password, newPassword, type = 'standard' }) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
             *  If the type is paper, the password is the user's backup paperkey.
             *  In this case, the paperkey has already been validated.
             */
            const passwordChecksOut = type === 'paper' ? true : yield this.validatePassword(password);
            if (passwordChecksOut) {
                // The profile to be re-encrypted.
                const crypto = this._queenClient.crypto;
                // Generate new salts and keys
                const encSalt = yield crypto.randomBytes(16);
                const authSalt = yield crypto.randomBytes(16);
                const encKey = yield crypto.deriveSymmetricKey(newPassword, encSalt, KEY_HASH_ROUNDS);
                const authKeypair = yield crypto.deriveSigningKey(newPassword, authSalt, KEY_HASH_ROUNDS);
                // Make new Profile and update existing profile.
                const b64AuthSalt = yield crypto.platform.b64URLEncode(authSalt);
                const b64EncSalt = yield crypto.platform.b64URLEncode(encSalt);
                const newProfileInfo = {
                    auth_salt: b64AuthSalt,
                    enc_salt: b64EncSalt,
                    signing_key: {
                        ed25519: authKeypair.publicKey,
                    },
                };
                const response = yield this.api.updateProfile(newProfileInfo);
                // Re-encrypt the queen client's credentials and update profile meta.
                const currentProfileMeta = yield this.api.getProfileMeta();
                const serializedQueenClientConfig = this._queenClient.config.serialize();
                const encQueenCreds = yield crypto.encryptString(JSON.stringify(serializedQueenClientConfig), encKey);
                yield this.api.updateProfileMeta({
                    backupEnabled: currentProfileMeta.backupEnabled,
                    backupClient: encQueenCreds,
                    paperBackup: currentProfileMeta.paperBackup,
                });
                // Update the refresher with new signing keys
                const clientToken = new Token(this.api._token._token);
                const clientApi = this.api.clone();
                const username = this.profile.email;
                clientToken.refresher = new Refresher(clientApi, this._queenClient.crypto, authKeypair, username);
                this.api.setToken(clientToken);
                // Return the updated profile.
                return response;
            }
            else {
                throw new Error('Current password incorrect.');
            }
        });
    }
    billingStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.getBillingStatus(this._queenClient);
            return AccountBillingStatus.decode(rawResponse);
        });
    }
    updateAccountBilling(stripeToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = { cc_token: stripeToken.id };
            return this.api.updateAccountBilling(account);
        });
    }
    addBillingCoupon(couponCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.addBillingCoupon(this.queenClient, couponCode);
        });
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.subscribe(this.queenClient);
        });
    }
    unsubscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.unsubscribe(this.queenClient);
        });
    }
    listClientInfo(nextToken = 0, perPage = 50) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.listClients(this.queenClient, nextToken, perPage);
            return ClientInfoList.decode(rawResponse);
        });
    }
    getClientInfo(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.getClient(this.queenClient, clientId);
            return ClientInfo.decode(rawResponse);
        });
    }
    setClientEnabled(clientId, enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.api.setClientEnabled(this.queenClient, clientId, enabled);
            return enabled;
        });
    }
    /*
    Allows user to update the name and email on their account.
    Profile param contains a name and email for the user.
  */
    updateProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.updateProfile(profile);
            return response;
        });
    }
    /**
     * Get a list of the current registration tokens for an account.
     *
     * @return {Promise<Array.<RegistrationToken>>}
     */
    registrationTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.api.listTokens();
            return tokens.map(RegistrationToken.decode);
        });
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
    newRegistrationToken(name, permissions = {}, totalUsesAllowed) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.api.writeToken(name, permissions, totalUsesAllowed);
            return RegistrationToken.decode(token);
        });
    }
    /**
     * Removes a token object from the accounts available tokens.
     * @param {Token} token The token to remove from the account.
     *
     * @returns {Promise<boolean>} True if the operation succeeds.
     */
    deleteRegistrationToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.deleteToken(token.token);
        });
    }
    /**
     * Get a list of the current webhooks for an account.
     *
     * @return {Promise<Array.<Webhook>>}
     */
    webhooks() {
        return __awaiter(this, void 0, void 0, function* () {
            const webhooks = yield this.api.listWebhooks(this.queenClient);
            // TODO: Add type and type checking
            return webhooks;
        });
    }
    /**
     * Create a new webhook for the account.
     * @param {string} webhook_url The payload url
     * @param {object} triggers A list of triggers to associate with the webhook
     *                                  not set, unlimited uses are allowed.
     *
     * @return {Promise<Webhook>} The created webhook.
     */
    newWebhook(webhook_url, triggers) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = yield this.api.createWebhook(this.queenClient, webhook_url, triggers);
            // To Do: Add type and type checking
            return webhook;
        });
    }
    /**
     * Removes a webhook object from the accounts available webhooks.
     * @param {Webhook} webhook The webhook to remove from the account.
     *
     * @returns {Promise<boolean>} True if the operation succeeds.
     */
    deleteWebhook(webhookId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.deleteWebhook(this.queenClient, webhookId);
        });
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
    getRequests(startTime, endTime, nextToken, endpointsToExclude) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = this.profile.id;
            return this.api.getRequests(this.queenClient, accountId, startTime, endTime, nextToken, endpointsToExclude);
        });
    }
    /**
     * Gets aggregations for the api calls made in a given time frame.
     * @param {String} startTime Start time for range of requests
     *  @param {String} endTime End time for range of requests
     *
     * @returns {Object} aggregations response object
     */
    getAggregations(startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = this.profile.id;
            return this.api.getAggregations(this.queenClient, accountId, startTime, endTime);
        });
    }
    /**
     * Requests the creation of a new TozID Realm.
     *
     * @param {string} realmName The user defined name for the realm to create.
     * @param {string} sovereignName The user defined name for the ruler of the realm to create.
     *
     * @returns {Promise<Realm>} The representation of the created realm returned by the server.
     */
    createRealm(realmName, sovereignName, realmRegistrationToken = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.createRealm(this.queenClient, realmName, sovereignName, realmRegistrationToken);
            return Realm.decode(rawResponse);
        });
    }
    /**
     * Lists all Realms belonging to the account.
     *
     * @returns {Promise<Realms>} The listed realm representations returned by the server.
     */
    listRealms() {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.listRealms(this.queenClient);
            return Realms.decode(rawResponse);
        });
    }
    /**
     * Requests the deletion of a named TozID Realm belonging to the account.
     *
     * @param {string} realmName The name for the realm to delete.
     *
     * @returns {Promise<Object>} Empty object.
     */
    deleteRealm(realmName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.deleteRealm(this.queenClient, realmName);
        });
    }
    /**
     * Creates a new group in the realm.
     *
     * @param {string} realmName Name of realm.
     * @param {object} group     Object containing `name` of group.
     * @returns {Promise<Group>} The newly created group.
     */
    createRealmGroup(realmName, group) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.createRealmGroup(this.queenClient, realmName, group);
            return Group.decode(rawResponse);
        });
    }
    /**
     * Describe a realm group by id.
     *
     * @param {string} realmName Name of realm.
     * @param {string} groupId   Id of group to describe.
     * @returns {Promise<Group>}
     */
    describeRealmGroup(realmName, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.describeRealmGroup(this.queenClient, realmName, groupId);
        });
    }
    /**
     * Lists all realm groups for a realm.
     *
     * @param {string} realmName  Name of realm.
     * @returns {Promise<Group[]>} List of all groups at realm.
     */
    listRealmGroups(realmName) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.listRealmGroups(this.queenClient, realmName);
            return rawResponse.map(Group.decode);
        });
    }
    /**
     * Deletes a group in the named realm by id.
     *
     * @param {string} realmName   The name of the realm containing the group.
     * @param {string} groupId     The id of the group to delete.
     * @returns {Promise<boolean>} True if successful.
     */
    deleteRealmGroup(realmName, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.deleteRealmGroup(this.queenClient, realmName, groupId);
        });
    }
    /**
     * Creates a new role for a realm.
     *
     * @param {string} realmName  Name of realm.
     * @param {object} role       Object with `name` and `description` of role.
     * @returns {Promise<Role>}   The newly created role.
     */
    createRealmRole(realmName, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.createRealmRole(this.queenClient, realmName, role);
            return Role.decode(rawResponse);
        });
    }
    /**
     * Update an existing role in the realm given a role id.
     *
     * @param {string} realmName Name of realm.
     * @param {role} role        Updated attributes of the role.
     * @returns {Promise<Role>}
     */
    updateRealmRole(realmName, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.updateRealmRole(this.queenClient, realmName, role);
            return Role.decode(rawResponse);
        });
    }
    /**
     * Deletes a realm role by id.
     *
     * @param {string} realmName Name of realm.
     * @param {string} roleId Id of role to delete.
     * @returns {Promise<boolean>} True if successful.
     */
    deleteRealmRole(realmName, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.deleteRealmRole(this.queenClient, realmName, roleId);
        });
    }
    /**
     * Describe a realm role by id.
     *
     * @param {string} realmName Name of realm.
     * @param {string} roleId    Id of role to describe.
     * @returns {Promise<Role>}
     */
    describeRealmRole(realmName, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.describeRealmRole(this.queenClient, realmName, roleId);
        });
    }
    /**
     * Lists all realm roles for a realm.
     *
     * @param {string} realmName  Name of realm.
     * @returns {Promise<Role[]>} List of all roles at realm.
     */
    listRealmRoles(realmName) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.listRealmRoles(this.queenClient, realmName);
            return rawResponse.map(Role.decode);
        });
    }
    /**
     * Creates a new application role for a realm.
     *
     * @param {string} realmName      Name of realm.
     * @param {string} applicationId  Id of client application.
     * @param {object} role           Object with `name` and `description` of role.
     * @returns {Promise<Role>}       The newly created role.
     */
    createRealmApplicationRole(realmName, applicationId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.createRealmApplicationRole(this.queenClient, realmName, applicationId, role);
            return Role.decode(rawResponse);
        });
    }
    /**
     * Deletes a realm application role by id.
     *
     * @param {string} realmName      Name of realm.
     * @param {string} applicationId  Id of client application.
     * @param {string} roleName       Name of role to delete.
     * @returns {Promise<boolean>}    True if successful.
     */
    deleteRealmApplicationRole(realmName, applicationId, roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.deleteRealmApplicationRole(this.queenClient, realmName, applicationId, roleName);
        });
    }
    /**
     * Describe a realm application role by id.
     *
     * @param {string} realmName      Name of realm.
     * @param {string} applicationId  Id of client application.
     * @param {string} roleName       Name of role to describe.
     * @returns {Promise<Role>}
     */
    describeRealmApplicationRole(realmName, applicationId, roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.describeRealmApplicationRole(this.queenClient, realmName, applicationId, roleName);
        });
    }
    /**
     * Lists all realm application roles for a realm.
     *
     * @param {string} realmName      Name of realm.
     * @param {string} applicationId  Id of client application.
     * @returns {Promise<Role[]>}     List of all roles for application.
     */
    listRealmApplicationRoles(realmName, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.listRealmApplicationRoles(this.queenClient, realmName, applicationId);
            return rawResponse.map(Role.decode);
        });
    }
    /**
     * Gets realm & client (application) roles that are mapped to a particular realm group.
     *
     * @param {string} realmName            Name of realm.
     * @param {string} groupId              Id of group for which to list role mappings.
     * @returns {Promise<GroupRoleMapping>} List of all roles at realm.
     */
    listGroupRoleMappings(realmName, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.listGroupRoleMappings(this.queenClient, realmName, groupId);
            return GroupRoleMapping.decode(rawResponse);
        });
    }
    /**
     * Adds a set of realm/client roles to a group's role mapping
     *
     * @param {string} realmName Name of realm.
     * @param {string} groupId Id of realm group.
     * @param {GroupRoleMapping} groupRoleMapping The map of roles to add to group's mapping.
     * @returns {Promise<boolean>} True if successful
     *
     * @example
     * const realmName = 'kitchen'
     * const chefGroup = await client.createRealmGroup(realmName, { name: 'Chefs' })
     * const fridgeAccessRole = await client.createRealmRole(realmName, {
     *   name: 'FridgeAccess',
     *   description: 'Grants access to the secrets of the fridge.',
     * })
     *
     * // map the "Chefs" realm group to the "FridgeAccess" realm role
     * // returns true on success
     * await client.addGroupRoleMappings(
     *   realmName,
     *   chefGroup.id,
     *   { realm: [fridgeAccessRole] }
     * )
     */
    addGroupRoleMappings(realmName, groupId, groupRoleMapping) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.addGroupRoleMappings(this.queenClient, realmName, groupId, groupRoleMapping);
        });
    }
    /**
     * Removes a set of realm/client roles from a group's role mapping.
     *
     * @param {string} realmName Name of realm.
     * @param {string} groupId Id of realm group.
     * @param {GroupRoleMapping} groupRoleMapping The map of roles to remove to group's mapping.
     * @returns {Promise<boolean>} True if successful
     */
    removeGroupRoleMappings(realmName, groupId, groupRoleMapping) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.removeGroupRoleMappings(this.queenClient, realmName, groupId, groupRoleMapping);
        });
    }
    /**
     * List all realm groups for an identity
     *
     *
     * @param {string} realmName Name of realm.
     * @param {string} identityId Id of identity
     *
     * @returns {Promise<Group>}  If successful
     */
    groupMembership(realmName, identityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.groupMembership(this.queenClient, realmName, identityId);
            return rawResponse.map(Group.decode);
        });
    }
    /**
     * Update group membership
     *
     * @param {string} realmName Name of realm.
     *  @param {string} identityId Id of identity
     * @param {Group} groups The map of groupIds to update.
     * @returns {Promise<boolean>} True if successful
     */
    updateGroupMembership(realmName, identityId, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.updateGroupMembership(this.queenClient, realmName, identityId, groups);
        });
    }
    /**
     * Join a list of Realm groups for an identity
     *
     * @param {string} realmName Name of realm.
     * @param {string} identityId Id of identity
     * @param {Group} groups The map of groupIds to join.
     * @returns {Promise<boolean>} True if successful
     */
    joinGroups(realmName, identityId, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.joinGroups(this.queenClient, realmName, identityId, groups);
        });
    }
    /**
     * Leave a list of Realm Groups for an identity
     *
     * @param {string} realmName Name of realm.
     * @param {string} identityId Id of identity
     * @param {Group} groups The map of groupIds to leave.
     * @returns {Promise<boolean>} True if successful
     */
    leaveGroups(realmName, identityId, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.leaveGroups(this.queenClient, realmName, identityId, groups);
        });
    }
    /**
     * Lists all default groups for the request realm.
     *
     * @param {string} realmName  Name of realm.
     * @returns {Promise<Group[]>} List of all groups at realm.
     */
    listDefaultRealmGroups(realmName) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawResponse = yield this.api.listDefaultRealmGroups(this.queenClient, realmName);
            return rawResponse.map(Group.decode);
        });
    }
    /**
     * Replace default groups for the request realm.
     *
     * @param {string} realmName  Name of realm.
     * @param {Group} groups The map of groupIds to set as new default.
     * @returns {Promise<void>}
     */
    replaceDefaultRealmGroups(realmName, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.replaceDefaultRealmGroups(this.queenClient, realmName, groups);
        });
    }
    /**
     * Add default groups for the request realm.
     *
     * @param {string} realmName  Name of realm.
     * @param {Group} groups The map of groupIds to add.
     * @returns {Promise<void>}
     */
    addDefaultRealmGroups(realmName, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.addDefaultRealmGroups(this.queenClient, realmName, groups);
        });
    }
    /**
     * Remove groups for the request realm.
     *
     * @param {string} realmName  Name of realm.
     * @param {Group} groups The map of groupIds to remove.
     * @returns {Promise<void>}
     */
    removeDefaultRealmGroups(realmName, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.removeDefaultRealmGroups(this.queenClient, realmName, groups);
        });
    }
    /**
     * Registers an identity with the specified realm using the specified parameters,returning the created identity and error (if any).
     *
     * @param {string} realmName Name of realm.
     * @param {string} registrationToken the token for the realm
     * @param {ToznyAPIIdentity} identity Configuration for the new identity
     * @returns {Promise<Identity>}
     */
    registerIdentity(realmName, registrationToken, identity) {
        return __awaiter(this, void 0, void 0, function* () {
            const crypto = this._queenClient.crypto;
            const encryptionKeyPair = yield crypto.generateKeypair();
            const signingKeyPair = yield crypto.generateSigningKeypair();
            (identity.public_key = { curve25519: encryptionKeyPair.publicKey }),
                (identity.signing_key = { ed25519: signingKeyPair.publicKey });
            return this.api.registerIdentity(realmName, registrationToken, identity);
        });
    }
    /**
     * Removes an identity in the given realm.
     *
     * @param {string} realmName Name of realm.
     * @param {string} identityId Id of identity
     * @returns {Promise<boolean>} True if successful
     */
    deleteIdentity(realmName, identityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.deleteIdentity(this.queenClient, realmName, identityId);
        });
    }
    /**
     * registerRealmBrokerIdentity registers an identity to be the broker for a realm.
     * @param  {string} realmName         The name of the realm to register the broker identity with.
     * @param  {string} registrationToken A registration for the account that has permissions for registering clients of type broker.
     * @return {Promise<Identity>} The broker identity for the realm.
     */
    registerRealmBrokerIdentity(realmName, registrationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate key material for the broker Identity
            const crypto = this.queenClient.crypto;
            const encryptionKeyPair = yield crypto.generateKeypair();
            const signingKeyPair = yield crypto.generateSigningKeypair();
            const brokerIdentity = {
                name: `realm_${realmName}_broker_tozny_client`,
                public_key: { curve25519: encryptionKeyPair.publicKey },
                signing_key: { ed25519: signingKeyPair.publicKey },
            };
            // register the broker for the realm
            const rawResponse = yield this.api.registerRealmBrokerIdentity(this.queenClient, realmName, registrationToken, brokerIdentity);
            // populate the client side held key material so the
            // full broker configuration can be persisted and reused
            rawResponse.identity.private_key = {
                curve25519: encryptionKeyPair.privateKey,
            };
            rawResponse.identity.private_signing_key = {
                ed25519: signingKeyPair.privateKey,
            };
            return Identity.decode(rawResponse.identity);
        });
    }
    /**
     * Gets the public info about the Tozny hosted broker
     *
     * @return {Promise<object>} The hosted broker public info.
     */
    hostedBrokerInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.getHostedBrokerInfo();
        });
    }
    /**
     * Set up the pagination result for listing identities
     *
     * @return {ListIdentitiesResult} A object usable for making paginated queries.
     */
    listIdentities(realmName, max, next) {
        return new ListIdentitiesResult(this, realmName, max, next);
    }
    /**
     * Internal method which queries to get a specific page of basic identities
     *
     * @return {Promise<Array<BasicIdentity>>} A list of basic identity info.
     */
    _listIdentities(realmName, max, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.listIdentities(this.queenClient, realmName, max, next);
            // Make sure that identities has come back as an array
            if (!Array.isArray(response.identities)) {
                response.identities = [];
            }
            // Do this async to speed it up just slightly.
            response.identities = yield Promise.all(response.identities.map((i) => __awaiter(this, void 0, void 0, function* () { return BasicIdentity.decode(i); })));
            return response;
        });
    }
    /**
     * Set up the pagination result for listing identities
     *
     * @return {ListIdentitiesResult} A object usable for making paginated queries.
     */
    identityDetails(realmName, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.identityDetails(this.queenClient, realmName, username);
            return DetailedIdentity.decode(response);
        });
    }
    /*
      refreshProfile users internal logic in the api token refresher
      to update the user's profile info from the backend.
      Currently, this is used to allow a user to verify their email,
      hit refresh in an already open window, and continue with an
      updated accountClient on the frontend.
  
      This will likely be replaced by a call to GET the account profile.
    */
    refreshProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetched = yield this.api._token._refresher.profile();
            this.account = fetched.account;
            this.profile = fetched.profile;
        });
    }
    /**
     * Requests Tozny account email verification be resent.
     */
    resendVerificationEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            const email = this.profile.email;
            return this.api.resendVerificationEmail(email);
        });
    }
    serialize() {
        return {
            api: this.api.serialize(),
            account: this.account,
            profile: this.profile,
            storageClient: this._queenClient.config.serialize(),
        };
    }
}
module.exports = Client;
