// @ts-nocheck disable type-checking for now. turn me back on when feeling brave.
import { validateStorageClient } from './utils'
import API from './api'
import { KEY_HASH_ROUNDS } from './utils/constants'
import {
  AccountBillingStatus,
  RegistrationToken,
  Realm,
  Realms,
  Identity,
  ClientInfo,
  ClientInfoList,
  Role,
  Group,
  GroupRoleMapping,
  ListAccessPoliciesResponse,
} from './types'
import { GroupsInput } from './types/group'
import Refresher from './api/refresher'
import Token from './api/token'
import BasicIdentity from './types/basicIdentity'
import ListIdentitiesResult from './types/listIdentitiesResult'
import DetailedIdentity from './types/detailedIdentity'
import Account from '.'
import AccessPolicy, {
  AccessPolicyData,
  GroupAccessPolicies,
} from './types/accessPolicy'
import RealmSettings from './types/realmSettings'
import { MinimumRoleData, MinimumRoleWithId } from './types/role'

/**
 * The client for Tozny's Account API.
 *
 * This documentation is automatically generated from the code. It is currently a work in progress
 * as we refine our type definitions & document more and more of the API.
 *
 * @example
 * ```js
 * const { Account } = require('@toznysecure/account-sdk')
 * const Tozny = require('@toznysecure/sdk/node')
 *
 * const accountFactory = new Account(Tozny, TOZNY_PLATFORM_API_URL)
 *
 * // must be used inside an async function for access to `await`
 * const account = await accountFactory.login(USERNAME, PASSWORD)
 * const accountClient = account.client
 * ```
 */
class Client {
  api: API
  account: Account
  private _queenClient: any

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
    const authSalt = await crypto.platform.b64URLDecode(this.profile.auth_salt)
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
      const b64AuthSalt = await crypto.platform.b64URLEncode(authSalt)
      const b64EncSalt = await crypto.platform.b64URLEncode(encSalt)
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
      const clientToken = new Token(this.api._token._token)
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
    return this.api.addBillingCoupon(this.queenClient, couponCode)
  }

  async subscribe() {
    return this.api.subscribe(this.queenClient)
  }

  async unsubscribe() {
    return this.api.unsubscribe(this.queenClient)
  }

  async listClientInfo(nextToken = 0, perPage = 50) {
    const rawResponse = await this.api.listClients(
      this.queenClient,
      nextToken,
      perPage
    )
    return ClientInfoList.decode(rawResponse)
  }

  async getClientInfo(clientId) {
    const rawResponse = await this.api.getClient(this.queenClient, clientId)
    return ClientInfo.decode(rawResponse)
  }

  async setClientEnabled(clientId, enabled) {
    await this.api.setClientEnabled(this.queenClient, clientId, enabled)
    return enabled
  }

  /**
   * Allows user to update the name and email on their account.
   * Profile param contains a name and email for the user.
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

  async registrationTokens(): Promise<Array<RegistrationToken>> {
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
  async newRegistrationToken(
    name: string,
    permissions: object = {},
    totalUsesAllowed: number
  ): Promise<RegistrationToken> {
    const token = await this.api.writeToken(name, permissions, totalUsesAllowed)
    return RegistrationToken.decode(token)
  }

  /**
   * Removes a token object from the accounts available tokens.
   * @param {Token} token The token to remove from the account.
   *
   * @returns {Promise<boolean>} True if the operation succeeds.
   */
  async deleteRegistrationToken(token: Token): Promise<boolean> {
    return this.api.deleteToken(token.token)
  }

  /**
   * Get a list of the current webhooks for an account.
   *
   * @return {Promise<Array.<Webhook>>}
   */

  async webhooks(): Promise<Array<Webhook>> {
    const webhooks = await this.api.listWebhooks(this.queenClient)
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
  async newWebhook(webhook_url: string, triggers: object): Promise<Webhook> {
    const webhook = await this.api.createWebhook(
      this.queenClient,
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
  async deleteWebhook(webhookId): Promise<boolean> {
    return this.api.deleteWebhook(this.queenClient, webhookId)
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

  async getRequests(
    startTime: string,
    endTime: string,
    nextToken: number,
    endpointsToExclude
  ): object {
    const accountId = this.profile.id
    return this.api.getRequests(
      this.queenClient,
      accountId,
      startTime,
      endTime,
      nextToken,
      endpointsToExclude
    )
  }

  /**
   * Gets aggregations for the api calls made in a given time frame.
   * @param {String} startTime Start time for range of requests
   *  @param {String} endTime End time for range of requests
   *
   * @returns {Object} aggregations response object
   */

  async getAggregations(startTime: string, endTime: string): object {
    const accountId = this.profile.id
    return this.api.getAggregations(
      this.queenClient,
      accountId,
      startTime,
      endTime
    )
  }
  /**
   * Requests the creation of a new TozID Realm.
   *
   * @param {string} realmName The user defined name for the realm to create.
   * @param {string} sovereignName The user defined name for the ruler of the realm to create.
   *
   * @returns {Promise<Realm>} The representation of the created realm returned by the server.
   */
  async createRealm(
    realmName: string,
    sovereignName: string,
    realmRegistrationToken = ''
  ): Promise<Realm> {
    const rawResponse = await this.api.createRealm(
      this.queenClient,
      realmName,
      sovereignName,
      realmRegistrationToken
    )
    return Realm.decode(rawResponse)
  }

  /**
   * Lists all Realms belonging to the account.
   *
   * @returns {Promise<Realms>} The listed realm representations returned by the server.
   */
  async listRealms(): Promise<Realms> {
    const rawResponse = await this.api.listRealms(this.queenClient)
    return Realms.decode(rawResponse)
  }

  /**
   * Requests the deletion of a named TozID Realm belonging to the account.
   *
   * @param {string} realmName The name for the realm to delete.
   *
   * @returns {Promise<Object>} Empty object.
   */
  async deleteRealm(realmName: string): Promise<object> {
    return this.api.deleteRealm(this.queenClient, realmName)
  }

  /**
   * Updates settings for the realm.
   * Some of these features enabled by these settings are experimental and may be subject
   * to change.
   * @param {string} realmName Name of realm.
   * @param {RealmSettings} settings Object containing settings to enable.
   * @returns Updated realm settings.
   */
  async updateRealmSettings(
    realmName: string,
    settings: RealmSettings
  ): Promise<RealmSettings> {
    return this.api.updateRealmSettings(this.queenClient, realmName, settings)
  }

  /**
   * Creates a new group in the realm.
   *
   * @param {string} realmName Name of realm.
   * @param {object} group     Object containing `name` of group.
   * @returns {Promise<Group>} The newly created group.
   */
  async createRealmGroup(realmName: string, group: object): Promise<Group> {
    const rawResponse = await this.api.createRealmGroup(
      this.queenClient,
      realmName,
      group
    )
    return Group.decode(rawResponse)
  }

  /**
   * Describe a realm group by id.
   *
   * @param {string} realmName Name of realm.
   * @param {string} groupId   Id of group to describe.
   * @returns {Promise<Group>}
   */
  async describeRealmGroup(realmName: string, groupId: string): Promise<Group> {
    const rawResponse = await this.api.describeRealmGroup(
      this.queenClient,
      realmName,
      groupId
    )

    return Group.decode(rawResponse)
  }

  /**
   * Update an existing group in the realm given a group id.
   *
   * @param {string} realmName Name of realm.
   * @param {string} groupId   Id of group to update.
   * @param {Group} group      Updated attributes of the group
   * @returns {Promise<Group>}
   */
  async updateRealmGroup(
    realmName: string,
    groupId: string,
    group: Group
  ): Promise<Group> {
    const rawResponse = await this.api.updateRealmGroup(
      this.queenClient,
      realmName,
      groupId,
      group
    )
    return Group.decode(rawResponse)
  }

  /**
   * Lists all realm groups for a realm.
   *
   * @param {string} realmName  Name of realm.
   * @returns {Promise<Group[]>} List of all groups at realm.
   */
  async listRealmGroups(realmName: string): Promise<Group[]> {
    const rawResponse = await this.api.listRealmGroups(
      this.queenClient,
      realmName
    )
    return rawResponse.map(Group.decode)
  }

  /**
   * Deletes a group in the named realm by id.
   *
   * @param {string} realmName   The name of the realm containing the group.
   * @param {string} groupId     The id of the group to delete.
   * @returns {Promise<boolean>} True if successful.
   */
  async deleteRealmGroup(realmName: string, groupId: string): Promise<boolean> {
    return this.api.deleteRealmGroup(this.queenClient, realmName, groupId)
  }

  /**
   * Creates a new role for a realm.
   *
   * @param {string} realmName Name of realm.
   * @param {MinimumRoleData} role Object with `name` and `description` of role.
   * @param {string} role.name Name of new role.
   * @param {string} role.description Description of new role.
   * @returns {Promise<Role>} The newly created role.
   */
  async createRealmRole(
    realmName: string,
    role: MinimumRoleData
  ): Promise<Role> {
    const rawResponse = await this.api.createRealmRole(
      this.queenClient,
      realmName,
      role
    )
    return Role.decode(rawResponse)
  }

  /**
   * Update an existing role in the realm given a role id.
   *
   * @param {string} realmName Name of realm.
   * @param {MinimumRoleWithId} role Updated attributes of the role.
   * @param {string} role.id Id of the role.
   * @param {string} role.name Updated name of role.
   * @param {string} role.description Updated description of the role.
   * @returns {Promise<Role>} The updated role
   */
  async updateRealmRole(
    realmName: string,
    role: MinimumRoleWithId
  ): Promise<Role> {
    const rawResponse = await this.api.updateRealmRole(
      this.queenClient,
      realmName,
      role
    )
    return Role.decode(rawResponse)
  }

  /**
   * Deletes a realm role by id.
   *
   * @param {string} realmName Name of realm.
   * @param {string} roleId Id of role to delete.
   * @returns {Promise<boolean>} True if successful.
   */
  async deleteRealmRole(realmName: string, roleId: string): Promise<boolean> {
    return this.api.deleteRealmRole(this.queenClient, realmName, roleId)
  }

  /**
   * Describe a realm role by id.
   *
   * @param {string} realmName Name of realm.
   * @param {string} roleId    Id of role to describe.
   * @returns {Promise<Role>}
   */
  async describeRealmRole(realmName: string, roleId: string): Promise<Role> {
    return this.api.describeRealmRole(this.queenClient, realmName, roleId)
  }

  /**
   * Lists all realm roles for a realm.
   *
   * @param {string} realmName  Name of realm.
   * @returns {Promise<Role[]>} List of all roles at realm.
   */
  async listRealmRoles(realmName: string): Promise<Role[]> {
    const rawResponse = await this.api.listRealmRoles(
      this.queenClient,
      realmName
    )
    return rawResponse.map(Role.decode)
  }

  /**
   * Creates a new application role for a realm.
   *
   * @param {string} realmName      Name of realm.
   * @param {string} applicationId  Id of client application.
   * @param {object} role           Object with `name` and `description` of role.
   * @returns {Promise<Role>}       The newly created role.
   */
  async createRealmApplicationRole(
    realmName: string,
    applicationId: string,
    role: object
  ): Promise<Role> {
    const rawResponse = await this.api.createRealmApplicationRole(
      this.queenClient,
      realmName,
      applicationId,
      role
    )
    return Role.decode(rawResponse)
  }

  /**
   * Update an existing application role in the realm given the original role name.
   *
   * @param {string} realmName Name of realm.
   * @param {string} applicationId  Id of client application.
   * @param {string} originalRoleName Name of the role being updated.
   * @param {role} role        Updated attributes of the role.
   * @returns {Promise<Role>}
   */
  async updateRealmApplicationRole(
    realmName: string,
    applicationId: string,
    originalRoleName: string,
    role: role
  ): Promise<Role> {
    const rawResponse = await this.api.updateRealmApplicationRole(
      this.queenClient,
      realmName,
      applicationId,
      originalRoleName,
      role
    )
    return Role.decode(rawResponse)
  }

  /**
   * Deletes a realm application role by id.
   *
   * @param {string} realmName      Name of realm.
   * @param {string} applicationId  Id of client application.
   * @param {string} roleName       Name of role to delete.
   * @returns {Promise<boolean>}    True if successful.
   */
  async deleteRealmApplicationRole(
    realmName: string,
    applicationId: string,
    roleName: string
  ): Promise<boolean> {
    return this.api.deleteRealmApplicationRole(
      this.queenClient,
      realmName,
      applicationId,
      roleName
    )
  }

  /**
   * Describe a realm application role by id.
   *
   * @param {string} realmName      Name of realm.
   * @param {string} applicationId  Id of client application.
   * @param {string} roleName       Name of role to describe.
   * @returns {Promise<Role>}
   */
  async describeRealmApplicationRole(
    realmName: string,
    applicationId: string,
    roleName: string
  ): Promise<Role> {
    return this.api.describeRealmApplicationRole(
      this.queenClient,
      realmName,
      applicationId,
      roleName
    )
  }

  /**
   * Lists all realm application roles for a realm.
   *
   * @param {string} realmName      Name of realm.
   * @param {string} applicationId  Id of client application.
   * @returns {Promise<Role[]>}     List of all roles for application.
   */
  async listRealmApplicationRoles(
    realmName: string,
    applicationId: string
  ): Promise<Role[]> {
    const rawResponse = await this.api.listRealmApplicationRoles(
      this.queenClient,
      realmName,
      applicationId
    )
    return rawResponse.map(Role.decode)
  }

  /**
   * Gets realm & client (application) roles that are mapped to a particular realm group.
   *
   * @param {string} realmName            Name of realm.
   * @param {string} groupId              Id of group for which to list role mappings.
   * @returns {Promise<GroupRoleMapping>} List of all roles at realm.
   */
  async listGroupRoleMappings(
    realmName: string,
    groupId: string
  ): Promise<GroupRoleMapping> {
    const rawResponse = await this.api.listGroupRoleMappings(
      this.queenClient,
      realmName,
      groupId
    )
    return GroupRoleMapping.decode(rawResponse)
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
   * ```js
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
   * ```
   */
  async addGroupRoleMappings(
    realmName: string,
    groupId: string,
    groupRoleMapping: GroupRoleMapping
  ): Promise<boolean> {
    return this.api.addGroupRoleMappings(
      this.queenClient,
      realmName,
      groupId,
      groupRoleMapping
    )
  }

  /**
   * Removes a set of realm/client roles from a group's role mapping.
   *
   * @param {string} realmName Name of realm.
   * @param {string} groupId Id of realm group.
   * @param {GroupRoleMapping} groupRoleMapping The map of roles to remove to group's mapping.
   * @returns {Promise<boolean>} True if successful
   */
  async removeGroupRoleMappings(
    realmName: string,
    groupId: string,
    groupRoleMapping: GroupRoleMapping
  ): Promise<boolean> {
    return this.api.removeGroupRoleMappings(
      this.queenClient,
      realmName,
      groupId,
      groupRoleMapping
    )
  }
  /**
   * List all realm groups for an identity
   *
   * @example
   * ```js
   * const identity = await accountClient.identityDetails(realmName, username)
   * const groupList = await client.groupMembership(realmName, identity.toznyId)
   * ```
   *
   * @param {string} realmName Name of realm.
   * @param {string} identityId Id of Tozny identity
   * @returns {Promise<Group[]>}
   */
  async groupMembership(
    realmName: string,
    identityId: string
  ): Promise<Group[]> {
    const rawResponse = await this.api.groupMembership(
      this.queenClient,
      realmName,
      identityId
    )
    return rawResponse.map(Group.decode)
  }
  /**
   * Update group membership
   *
   * @example
   * ```js
   *   const toznyEngineersGroup = await client.createRealmGroup(realmName, {
   *   name: 'ToznyEngineers',
   * })
   * await client.updateGroupMembership(realmName, identityId, {
   *   groups: [toznyEngineersGroup.id],
   * })
   * ```
   * @param {string} realmName Name of realm.
   * @param {string} identityId Id of Tozny identity
   * @param {GroupsInput} groups List of groups or group ids to update in an object on the `groups` key
   * @returns {Promise<boolean>} True if successful
   */
  async updateGroupMembership(
    realmName: string,
    identityId: string,
    groups: GroupsInput
  ): Promise<boolean> {
    return this.api.updateGroupMembership(
      this.queenClient,
      realmName,
      identityId,
      groups
    )
  }
  /**
   * Join a list of Realm groups for an identity
   *
   * @example
   * ```js
   * const toznyEngineersGroup = await client.createRealmGroup(realmName, {
   *   name: 'ToznyEngineers',
   * })
   * await client.joinGroups(realmName, identityId, {
   *   groups: [toznyEngineersGroup.id],
   * })
   * ```
   *
   * @param {string} realmName Name of realm.
   * @param {string} identityId Id of Tozny identity
   * @param {GroupsInput} groups List of groups or group ids to join in an object on the `groups` key
   * @returns {Promise<boolean>} True if successful
   */
  async joinGroups(
    realmName: string,
    identityId: string,
    groups: GroupsInput
  ): Promise<boolean> {
    return this.api.joinGroups(this.queenClient, realmName, identityId, groups)
  }
  /**
   * Leave a list of Realm Groups for an identity
   *
   * @example
   * ```js
   * const toznyEngineersGroup = await client.createRealmGroup(realmName, {
   *   name: 'ToznyEngineers',
   * })
   * await client.joinGroups(realmName, identityId, {
   *   groups: [toznyEngineersGroup.id],
   * })
   * await client.leaveGroups(realmName, identityId, {
   *   groups: [toznyEngineersGroup.id],
   * })
   * ```
   *
   * @param {string} realmName Name of realm.
   * @param {string} identityId Id of Tozny identity
   * @param {GroupsInput} groups List of groups or group ids to leave in an object on the `groups` key
   * @returns {Promise<boolean>} True if successful
   */
  async leaveGroups(
    realmName: string,
    identityId: string,
    groups: GroupsInput
  ): Promise<boolean> {
    return this.api.leaveGroups(this.queenClient, realmName, identityId, groups)
  }
  /**
   * Lists all default groups for the request realm.
   *
   * @example
   * ```js
   * const groupList = await client.listDefaultRealmGroups(realmName)
   * ```
   * @param {string} realmName  Name of realm.
   * @returns {Promise<Group[]>} List of all groups at realm.
   */
  async listDefaultRealmGroups(realmName: string): Promise<Group[]> {
    const rawResponse = await this.api.listDefaultRealmGroups(
      this.queenClient,
      realmName
    )
    return rawResponse.map(Group.decode)
  }
  /**
   * Replace default groups for the request realm.
   * _note: when default realm groups changed existing users groups are not updated_
   *
   * @example
   * ```js
   * const toznyEngineersGroup = await client.createRealmGroup(realmName, {
   *   name: 'ToznyEngineers',
   * })
   * await client.replaceDefaultRealmGroups(realmName, {
   *   groups: [toznyEngineersGroup.id],
   * })
   * ```
   *
   * @param {string} realmName  Name of realm.
   * @param {GroupsInput} groups List of groups or group ids to leave in an object on the `groups` key
   * @returns {Promise<void>}
   */
  async replaceDefaultRealmGroups(
    realmName: string,
    groups: GroupsInput
  ): Promise<void> {
    return this.api.replaceDefaultRealmGroups(
      this.queenClient,
      realmName,
      groups
    )
  }
  /**
   * Add default groups for the request realm.
   * _note: when default realm groups change, existing users groups are not updated_
   *
   * @example
   * ```js
   * const toznyEngineersGroup = await client.createRealmGroup(realmName, {
   *   name: 'ToznyEngineers',
   * })
   * await client.addDefaultRealmGroups(realmName, {
   *   groups: [toznyEngineersGroup.id],
   * })
   * ```
   *
   * @param {string} realmName  Name of realm.
   * @param {GroupsInput} groups List of groups or group ids in an object on the `groups` key
   * @returns {Promise<void>}
   */
  async addDefaultRealmGroups(
    realmName: string,
    groups: GroupsInput
  ): Promise<void> {
    return this.api.addDefaultRealmGroups(this.queenClient, realmName, groups)
  }
  /**
   * Remove groups for the request realm.
   *
   * @example
   * ```js
   * const toznyEngineersGroup = await client.createRealmGroup(realmName, {
   *   name: 'ToznyEngineers',
   * })
   * await client.addDefaultRealmGroups(realmName, {
   *   groups: [toznyEngineersGroup.id],
   * })
   * await client.removeDefaultRealmGroups(realmName, {
   *   groups: [toznyEngineersGroup.id],
   * })
   * ```
   *
   * @param {string} realmName  Name of realm.
   * @param {GroupsInput} groups List of groups or group ids in an object on the `groups` key
   * @returns {Promise<void>}
   */
  async removeDefaultRealmGroups(
    realmName: string,
    groups: GroupsInput
  ): Promise<void> {
    return this.api.removeDefaultRealmGroups(
      this.queenClient,
      realmName,
      groups
    )
  }

  /**
   * Registers an identity with the specified realm using the specified parameters,returning the created identity and error (if any).
   *
   * Note that the `identity` input takes snake_case values.
   *
   * @example
   * ```js
   * // Create a token
   * const token = await accountClient.newRegistrationToken(tokenName, permissions)
   * const identity = {
   *   name: 'identityName',
   *   email: 'identity@example.com',
   *   first_name: 'firstName',
   *   last_name: 'lastName',
   * }
   * // Register Identity
   * const identityResponse = await accountClient.registerIdentity(
   *   realmName,
   *   token.token,
   *   identity
   * )
   * ```
   *
   * @param {string} realmName Name of realm.
   * @param {string} registrationToken the token for the realm
   * @param identity Configuration for the new identity
   * @returns {Promise<Identity>}
   */
  async registerIdentity(
    realmName: string,
    registrationToken: string,
    identity
  ): Promise<Identity> {
    const crypto = this._queenClient.crypto
    const encryptionKeyPair = await crypto.generateKeypair()
    const signingKeyPair = await crypto.generateSigningKeypair()
    ;(identity.public_key = { curve25519: encryptionKeyPair.publicKey }),
      (identity.signing_key = { ed25519: signingKeyPair.publicKey })
    return this.api.registerIdentity(realmName, registrationToken, identity)
  }

  /**
   * Removes an identity in the given realm.
   *
   * @example
   * ```js
   * // Get the identityId you wish to delete
   * const identity = accountClient.identityDetails(realmName, username)
   *
   * // Delete identity
   * await accountClient.deleteIdentity(realmName, identity.toznyId)
   * ```
   * @param {string} realmName Name of realm.
   * @param {string} identityId Id of Tozny identity
   * @returns {Promise<boolean>} True if successful
   */
  async deleteIdentity(
    realmName: string,
    identityId: string
  ): Promise<boolean> {
    return this.api.deleteIdentity(this.queenClient, realmName, identityId)
  }
  /**
   * registerRealmBrokerIdentity registers an identity to be the broker for a realm.
   * @param  {string} realmName         The name of the realm to register the broker identity with.
   * @param  {string} registrationToken A registration for the account that has permissions for registering clients of type broker.
   * @return {Promise<Identity>} The broker identity for the realm.
   */
  async registerRealmBrokerIdentity(
    realmName: string,
    registrationToken: string
  ): Promise<Identity> {
    // Generate key material for the broker Identity
    const crypto = this.queenClient.crypto
    const encryptionKeyPair = await crypto.generateKeypair()
    const signingKeyPair = await crypto.generateSigningKeypair()
    const brokerIdentity = {
      name: `realm_${realmName}_broker_tozny_client`,
      public_key: { curve25519: encryptionKeyPair.publicKey },
      signing_key: { ed25519: signingKeyPair.publicKey },
    }
    // register the broker for the realm
    const rawResponse = await this.api.registerRealmBrokerIdentity(
      this.queenClient,
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
    return Identity.decode(rawResponse.identity)
  }

  /**
   * Gets the public info about the Tozny hosted broker
   *
   * @return {Promise<object>} The hosted broker public info.
   */
  async hostedBrokerInfo(): Promise<object> {
    return this.api.getHostedBrokerInfo()
  }

  /**
   * Set up the pagination result for listing identities
   *
   * Each page is returned when the next() function is invoked on the
   * ListIdentitiesResult object.

   *
   * @example
   * ```js
   * const realmName = 'westeros'
   * // list identities in westeros 10 at a time
   * const idList = accountClient.listIdentities(realmName, 10)
   * // Must call idList.next() to receive results
   * while (!idList.done) {
   *    const identities = await idList.next()
   *    for (let identity of identities) {
   *        console.log(identity.username)
   *    }
   * }
   * ```
   * Note: If the value of max is higher than the maximum allowed by
   * the server, idList.next() will only return up to the number of
   * identities allowed by the server
   *
   * @param {string} realmName            Name of realm.
   * @param {number} max                  The maximum number of identities per page. Up to the max allowed by the server.
   * @param {number} next                 The next token, used for paging. Default is 0.
   * @return {ListIdentitiesResult}       A object usable for making paginated queries.
   */
  listIdentities(
    realmName: string,
    max: number,
    next: number
  ): ListIdentitiesResult {
    return new ListIdentitiesResult(this, realmName, max, next)
  }

  /**
   * Internal method which queries to get a specific page of basic identities
   *
   * @return {Promise<Array<BasicIdentity>>} A list of basic identity info.
   */
  private async _listIdentities(
    realmName,
    max,
    next
  ): Promise<Array<BasicIdentity>> {
    const response = await this.api.listIdentities(
      this.queenClient,
      realmName,
      max,
      next
    )
    // Make sure that identities has come back as an array
    if (!Array.isArray(response.identities)) {
      response.identities = []
    }
    // Do this async to speed it up just slightly.
    response.identities = await Promise.all(
      response.identities.map(async i => BasicIdentity.decode(i))
    )
    return response
  }

  /**
   * Set up the pagination result for listing identities
   *
   * @return {ListIdentitiesResult} A object usable for making paginated queries.
   */
  async identityDetails(realmName, username): ListIdentitiesResult {
    const response = await this.api.identityDetails(
      this.queenClient,
      realmName,
      username
    )
    return DetailedIdentity.decode(response)
  }

  /**
   * refreshProfile users internal logic in the api token refresher
   * to update the user's profile info from the backend.
   * Currently, this is used to allow a user to verify their email,
   * hit refresh in an already open window, and continue with an
   * updated accountClient on the frontend.
   *
   * This will likely be replaced by a call to GET the account profile.
   */

  async refreshProfile() {
    const fetched = await this.api._token._refresher.profile()
    this.account = fetched.account
    this.profile = fetched.profile
  }

  /**
   * Requests Tozny account email verification be resent.
   */

  async resendVerificationEmail() {
    const email = this.profile.email
    return this.api.resendVerificationEmail(email)
  }

  /**
   * Lists the Current Access Policies for the Group Ids sent.
   *
   * @param {string} realmName Name of realm.
   * @param {string[]} groupIds The IDs for the Tozny Groups
   * @returns {Promise<ListAccessPoliciesResponse>}
   */
  async listAccessPoliciesForGroups(
    realmName: string,
    groupIds: string[]
  ): Promise<ListAccessPoliciesResponse> {
    const res = await this.api.listAccessPoliciesForGroups(
      this.queenClient,
      realmName,
      groupIds
    )
    return ListAccessPoliciesResponse.decode(res)
  }

  /**
   *  Creating or Updating an Access Policy for a Group
   *
   * @param {string} realmName Name of realm.
   * @param {string} groupId The ID of the Group in Tozny
   * @param {AccessPolicy[]} accessPolicies Configuration for the new identity
   * @returns {Promise<ListAccessPolicyResponse>}
   */
  async upsertAccessPoliciesForGroup(
    realmName: string,
    groupId: string,
    accessPolicies: AccessPolicyData[]
  ): Promise<GroupAccessPolicies> {
    const res = await this.api.upsertAccessPoliciesForGroup(
      this.queenClient,
      realmName,
      groupId,
      accessPolicies
    )
    return {
      id: res.id,
      accessPolicies: res.access_policies.map(AccessPolicy.decode),
    }
  }

  serialize() {
    return {
      api: this.api.serialize(),
      account: this.account,
      profile: this.profile,
      storageClient: this._queenClient.config.serialize(),
    }
  }
}

export default Client
