[@toznysecure/account-sdk](../README.md) / [Exports](../modules.md) / Client

# Class: Client

The client for Tozny's Account API.

## Table of contents

### Constructors

- [constructor](Client.md#constructor)

### Accessors

- [queenClient](Client.md#queenclient)

### Methods

- [addBillingCoupon](Client.md#addbillingcoupon)
- [addDefaultRealmGroups](Client.md#adddefaultrealmgroups)
- [addGroupRoleMappings](Client.md#addgrouprolemappings)
- [billingStatus](Client.md#billingstatus)
- [changePassword](Client.md#changepassword)
- [createRealm](Client.md#createrealm)
- [createRealmApplicationRole](Client.md#createrealmapplicationrole)
- [createRealmGroup](Client.md#createrealmgroup)
- [createRealmRole](Client.md#createrealmrole)
- [deleteIdentity](Client.md#deleteidentity)
- [deleteRealm](Client.md#deleterealm)
- [deleteRealmApplicationRole](Client.md#deleterealmapplicationrole)
- [deleteRealmGroup](Client.md#deleterealmgroup)
- [deleteRealmRole](Client.md#deleterealmrole)
- [deleteRegistrationToken](Client.md#deleteregistrationtoken)
- [deleteWebhook](Client.md#deletewebhook)
- [describeRealmApplicationRole](Client.md#describerealmapplicationrole)
- [describeRealmGroup](Client.md#describerealmgroup)
- [describeRealmRole](Client.md#describerealmrole)
- [getAggregations](Client.md#getaggregations)
- [getClientInfo](Client.md#getclientinfo)
- [getRequests](Client.md#getrequests)
- [groupMembership](Client.md#groupmembership)
- [hostedBrokerInfo](Client.md#hostedbrokerinfo)
- [identityDetails](Client.md#identitydetails)
- [joinGroups](Client.md#joingroups)
- [leaveGroups](Client.md#leavegroups)
- [listClientInfo](Client.md#listclientinfo)
- [listDefaultRealmGroups](Client.md#listdefaultrealmgroups)
- [listGroupRoleMappings](Client.md#listgrouprolemappings)
- [listIdentities](Client.md#listidentities)
- [listRealmApplicationRoles](Client.md#listrealmapplicationroles)
- [listRealmGroups](Client.md#listrealmgroups)
- [listRealmRoles](Client.md#listrealmroles)
- [listRealms](Client.md#listrealms)
- [newRegistrationToken](Client.md#newregistrationtoken)
- [newWebhook](Client.md#newwebhook)
- [refreshProfile](Client.md#refreshprofile)
- [registerIdentity](Client.md#registeridentity)
- [registerRealmBrokerIdentity](Client.md#registerrealmbrokeridentity)
- [registrationTokens](Client.md#registrationtokens)
- [removeDefaultRealmGroups](Client.md#removedefaultrealmgroups)
- [removeGroupRoleMappings](Client.md#removegrouprolemappings)
- [replaceDefaultRealmGroups](Client.md#replacedefaultrealmgroups)
- [resendVerificationEmail](Client.md#resendverificationemail)
- [serialize](Client.md#serialize)
- [setClientEnabled](Client.md#setclientenabled)
- [subscribe](Client.md#subscribe)
- [unsubscribe](Client.md#unsubscribe)
- [updateAccountBilling](Client.md#updateaccountbilling)
- [updateGroupMembership](Client.md#updategroupmembership)
- [updateProfile](Client.md#updateprofile)
- [updateRealmApplicationRole](Client.md#updaterealmapplicationrole)
- [updateRealmGroup](Client.md#updaterealmgroup)
- [updateRealmRole](Client.md#updaterealmrole)
- [validatePassword](Client.md#validatepassword)
- [webhooks](Client.md#webhooks)

## Constructors

### constructor

• **new Client**(`api`, `account`, `profile`, `queenClient`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |
| `account` | `any` |
| `profile` | `any` |
| `queenClient` | `any` |

#### Defined in

[client.ts:27](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L27)

## Accessors

### queenClient

• `get` **queenClient**(): `any`

#### Returns

`any`

#### Defined in

[client.ts:34](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L34)

## Methods

### addBillingCoupon

▸ **addBillingCoupon**(`couponCode`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `couponCode` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:129](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L129)

___

### addDefaultRealmGroups

▸ **addDefaultRealmGroups**(`realmName`, `groups`): `Promise`<`void`\>

Add default groups for the request realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groups` | `Group` | The map of groupIds to add. |

#### Returns

`Promise`<`void`\>

#### Defined in

[client.ts:771](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L771)

___

### addGroupRoleMappings

▸ **addGroupRoleMappings**(`realmName`, `groupId`, `groupRoleMapping`): `Promise`<`boolean`\>

Adds a set of realm/client roles to a group's role mapping

**`example`**
const realmName = 'kitchen'
const chefGroup = await client.createRealmGroup(realmName, { name: 'Chefs' })
const fridgeAccessRole = await client.createRealmRole(realmName, {
  name: 'FridgeAccess',
  description: 'Grants access to the secrets of the fridge.',
})

// map the "Chefs" realm group to the "FridgeAccess" realm role
// returns true on success
await client.addGroupRoleMappings(
  realmName,
  chefGroup.id,
  { realm: [fridgeAccessRole] }
)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groupId` | `string` | Id of realm group. |
| `groupRoleMapping` | `GroupRoleMapping` | The map of roles to add to group's mapping. |

#### Returns

`Promise`<`boolean`\>

True if successful

#### Defined in

[client.ts:634](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L634)

___

### billingStatus

▸ **billingStatus**(): `Promise`<`fn`\>

#### Returns

`Promise`<`fn`\>

#### Defined in

[client.ts:119](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L119)

___

### changePassword

▸ **changePassword**(`__namedParameters`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:50](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L50)

___

### createRealm

▸ **createRealm**(`realmName`, `sovereignName`, `realmRegistrationToken?`): `Promise`<`Realm`\>

Requests the creation of a new TozID Realm.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `realmName` | `string` | `undefined` | The user defined name for the realm to create. |
| `sovereignName` | `string` | `undefined` | The user defined name for the ruler of the realm to create. |
| `realmRegistrationToken` | `string` | `''` | - |

#### Returns

`Promise`<`Realm`\>

The representation of the created realm returned by the server.

#### Defined in

[client.ts:300](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L300)

___

### createRealmApplicationRole

▸ **createRealmApplicationRole**(`realmName`, `applicationId`, `role`): `Promise`<`Role`\>

Creates a new application role for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `applicationId` | `string` | Id of client application. |
| `role` | `object` | Object with `name` and `description` of role. |

#### Returns

`Promise`<`Role`\>

The newly created role.

#### Defined in

[client.ts:491](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L491)

___

### createRealmGroup

▸ **createRealmGroup**(`realmName`, `group`): `Promise`<`Group`\>

Creates a new group in the realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `group` | `object` | Object containing `name` of group. |

#### Returns

`Promise`<`Group`\>

The newly created group.

#### Defined in

[client.ts:342](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L342)

___

### createRealmRole

▸ **createRealmRole**(`realmName`, `role`): `Promise`<`Role`\>

Creates a new role for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `role` | `object` | Object with `name` and `description` of role. |

#### Returns

`Promise`<`Role`\>

The newly created role.

#### Defined in

[client.ts:422](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L422)

___

### deleteIdentity

▸ **deleteIdentity**(`realmName`, `identityId`): `Promise`<`boolean`\>

Removes an identity in the given realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `identityId` | `string` | Id of identity |

#### Returns

`Promise`<`boolean`\>

True if successful

#### Defined in

[client.ts:820](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L820)

___

### deleteRealm

▸ **deleteRealm**(`realmName`): `Promise`<`object`\>

Requests the deletion of a named TozID Realm belonging to the account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | The name for the realm to delete. |

#### Returns

`Promise`<`object`\>

Empty object.

#### Defined in

[client.ts:331](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L331)

___

### deleteRealmApplicationRole

▸ **deleteRealmApplicationRole**(`realmName`, `applicationId`, `roleName`): `Promise`<`boolean`\>

Deletes a realm application role by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `applicationId` | `string` | Id of client application. |
| `roleName` | `string` | Name of role to delete. |

#### Returns

`Promise`<`boolean`\>

True if successful.

#### Defined in

[client.ts:538](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L538)

___

### deleteRealmGroup

▸ **deleteRealmGroup**(`realmName`, `groupId`): `Promise`<`boolean`\>

Deletes a group in the named realm by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | The name of the realm containing the group. |
| `groupId` | `string` | The id of the group to delete. |

#### Returns

`Promise`<`boolean`\>

True if successful.

#### Defined in

[client.ts:411](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L411)

___

### deleteRealmRole

▸ **deleteRealmRole**(`realmName`, `roleId`): `Promise`<`boolean`\>

Deletes a realm role by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `roleId` | `string` | Id of role to delete. |

#### Returns

`Promise`<`boolean`\>

True if successful.

#### Defined in

[client.ts:454](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L454)

___

### deleteRegistrationToken

▸ **deleteRegistrationToken**(`token`): `Promise`<`boolean`\>

Removes a token object from the accounts available tokens.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `Token` | The token to remove from the account. |

#### Returns

`Promise`<`boolean`\>

True if the operation succeeds.

#### Defined in

[client.ts:204](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L204)

___

### deleteWebhook

▸ **deleteWebhook**(`webhookId`): `Promise`<`boolean`\>

Removes a webhook object from the accounts available webhooks.

#### Parameters

| Name | Type |
| :------ | :------ |
| `webhookId` | `any` |

#### Returns

`Promise`<`boolean`\>

True if the operation succeeds.

#### Defined in

[client.ts:244](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L244)

___

### describeRealmApplicationRole

▸ **describeRealmApplicationRole**(`realmName`, `applicationId`, `roleName`): `Promise`<`Role`\>

Describe a realm application role by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `applicationId` | `string` | Id of client application. |
| `roleName` | `string` | Name of role to describe. |

#### Returns

`Promise`<`Role`\>

#### Defined in

[client.ts:559](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L559)

___

### describeRealmGroup

▸ **describeRealmGroup**(`realmName`, `groupId`): `Promise`<`Group`\>

Describe a realm group by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groupId` | `string` | Id of group to describe. |

#### Returns

`Promise`<`Group`\>

#### Defined in

[client.ts:358](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L358)

___

### describeRealmRole

▸ **describeRealmRole**(`realmName`, `roleId`): `Promise`<`Role`\>

Describe a realm role by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `roleId` | `string` | Id of role to describe. |

#### Returns

`Promise`<`Role`\>

#### Defined in

[client.ts:465](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L465)

___

### getAggregations

▸ **getAggregations**(`startTime`, `endTime`): `object`

Gets aggregations for the api calls made in a given time frame.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startTime` | `string` | Start time for range of requests |
| `endTime` | `string` | End time for range of requests |

#### Returns

`object`

aggregations response object

#### Defined in

[client.ts:283](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L283)

___

### getClientInfo

▸ **getClientInfo**(`clientId`): `Promise`<`fn`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientId` | `any` |

#### Returns

`Promise`<`fn`\>

#### Defined in

[client.ts:150](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L150)

___

### getRequests

▸ **getRequests**(`startTime`, `endTime`, `nextToken`, `endpointsToExclude`): `object`

Gets the api request history using provided params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startTime` | `string` | Start time for range of requests |
| `endTime` | `string` | End time for range of requests |
| `nextToken` | `number` | allows backend to paginate requests |
| `endpointsToExclude` | `any` | - |

#### Returns

`object`

request response object

#### Defined in

[client.ts:258](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L258)

___

### groupMembership

▸ **groupMembership**(`realmName`, `identityId`): `Promise`<`Group`\>

List all realm groups for an identity

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `identityId` | `string` | Id of identity |

#### Returns

`Promise`<`Group`\>

If successful

#### Defined in

[client.ts:676](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L676)

___

### hostedBrokerInfo

▸ **hostedBrokerInfo**(): `Promise`<`object`\>

Gets the public info about the Tozny hosted broker

#### Returns

`Promise`<`object`\>

The hosted broker public info.

#### Defined in

[client.ts:868](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L868)

___

### identityDetails

▸ **identityDetails**(`realmName`, `username`): `ListIdentitiesResult`

Set up the pagination result for listing identities

#### Parameters

| Name | Type |
| :------ | :------ |
| `realmName` | `any` |
| `username` | `any` |

#### Returns

`ListIdentitiesResult`

A object usable for making paginated queries.

#### Defined in

[client.ts:913](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L913)

___

### joinGroups

▸ **joinGroups**(`realmName`, `identityId`, `groups`): `Promise`<`boolean`\>

Join a list of Realm groups for an identity

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `identityId` | `string` | Id of identity |
| `groups` | `Group` | The map of groupIds to join. |

#### Returns

`Promise`<`boolean`\>

True if successful

#### Defined in

[client.ts:712](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L712)

___

### leaveGroups

▸ **leaveGroups**(`realmName`, `identityId`, `groups`): `Promise`<`boolean`\>

Leave a list of Realm Groups for an identity

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `identityId` | `string` | Id of identity |
| `groups` | `Group` | The map of groupIds to leave. |

#### Returns

`Promise`<`boolean`\>

True if successful

#### Defined in

[client.ts:727](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L727)

___

### listClientInfo

▸ **listClientInfo**(`nextToken?`, `perPage?`): `Promise`<`fn`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `nextToken` | `number` | `0` |
| `perPage` | `number` | `50` |

#### Returns

`Promise`<`fn`\>

#### Defined in

[client.ts:141](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L141)

___

### listDefaultRealmGroups

▸ **listDefaultRealmGroups**(`realmName`): `Promise`<`Group`[]\>

Lists all default groups for the request realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |

#### Returns

`Promise`<`Group`[]\>

List of all groups at realm.

#### Defined in

[client.ts:740](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L740)

___

### listGroupRoleMappings

▸ **listGroupRoleMappings**(`realmName`, `groupId`): `Promise`<`GroupRoleMapping`\>

Gets realm & client (application) roles that are mapped to a particular realm group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groupId` | `string` | Id of group for which to list role mappings. |

#### Returns

`Promise`<`GroupRoleMapping`\>

List of all roles at realm.

#### Defined in

[client.ts:598](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L598)

___

### listIdentities

▸ **listIdentities**(`realmName`, `max`, `next`): `ListIdentitiesResult`

Set up the pagination result for listing identities

#### Parameters

| Name | Type |
| :------ | :------ |
| `realmName` | `any` |
| `max` | `any` |
| `next` | `any` |

#### Returns

`ListIdentitiesResult`

A object usable for making paginated queries.

#### Defined in

[client.ts:877](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L877)

___

### listRealmApplicationRoles

▸ **listRealmApplicationRoles**(`realmName`, `applicationId`): `Promise`<`Role`[]\>

Lists all realm application roles for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `applicationId` | `string` | Id of client application. |

#### Returns

`Promise`<`Role`[]\>

List of all roles for application.

#### Defined in

[client.ts:579](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L579)

___

### listRealmGroups

▸ **listRealmGroups**(`realmName`): `Promise`<`Group`[]\>

Lists all realm groups for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |

#### Returns

`Promise`<`Group`[]\>

List of all groups at realm.

#### Defined in

[client.ts:396](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L396)

___

### listRealmRoles

▸ **listRealmRoles**(`realmName`): `Promise`<`Role`[]\>

Lists all realm roles for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |

#### Returns

`Promise`<`Role`[]\>

List of all roles at realm.

#### Defined in

[client.ts:475](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L475)

___

### listRealms

▸ **listRealms**(): `Promise`<`Realms`\>

Lists all Realms belonging to the account.

#### Returns

`Promise`<`Realms`\>

The listed realm representations returned by the server.

#### Defined in

[client.ts:319](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L319)

___

### newRegistrationToken

▸ **newRegistrationToken**(`name`, `permissions?`, `totalUsesAllowed`): `Promise`<`RegistrationToken`\>

Create a new registration token for the account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The user defined name for the new token. Not unique. |
| `permissions` | `object` | A set of key-value pair of permissions for the token. |
| `totalUsesAllowed` | `number` | The number of uses the token is allowed. If                                  not set, unlimited uses are allowed. |

#### Returns

`Promise`<`RegistrationToken`\>

The created registration token.

#### Defined in

[client.ts:189](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L189)

___

### newWebhook

▸ **newWebhook**(`webhook_url`, `triggers`): `Promise`<`any`\>

Create a new webhook for the account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `webhook_url` | `string` | The payload url |
| `triggers` | `object` | A list of triggers to associate with the webhook                                  not set, unlimited uses are allowed. |

#### Returns

`Promise`<`any`\>

The created webhook.

#### Defined in

[client.ts:228](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L228)

___

### refreshProfile

▸ **refreshProfile**(): `Promise`<`void`\>

refreshProfile users internal logic in the api token refresher
to update the user's profile info from the backend.
Currently, this is used to allow a user to verify their email,
hit refresh in an already open window, and continue with an
updated accountClient on the frontend.

This will likely be replaced by a call to GET the account profile.

#### Returns

`Promise`<`void`\>

#### Defined in

[client.ts:932](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L932)

___

### registerIdentity

▸ **registerIdentity**(`realmName`, `registrationToken`, `identity`): `Promise`<`Identity`\>

Registers an identity with the specified realm using the specified parameters,returning the created identity and error (if any).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `registrationToken` | `string` | the token for the realm |
| `identity` | `any` | Configuration for the new identity |

#### Returns

`Promise`<`Identity`\>

#### Defined in

[client.ts:800](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L800)

___

### registerRealmBrokerIdentity

▸ **registerRealmBrokerIdentity**(`realmName`, `registrationToken`): `Promise`<`Identity`\>

registerRealmBrokerIdentity registers an identity to be the broker for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | The name of the realm to register the broker identity with. |
| `registrationToken` | `string` | A registration for the account that has permissions for registering clients of type broker. |

#### Returns

`Promise`<`Identity`\>

The broker identity for the realm.

#### Defined in

[client.ts:832](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L832)

___

### registrationTokens

▸ **registrationTokens**(): `Promise`<`RegistrationToken`[]\>

Get a list of the current registration tokens for an account.

#### Returns

`Promise`<`RegistrationToken`[]\>

#### Defined in

[client.ts:175](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L175)

___

### removeDefaultRealmGroups

▸ **removeDefaultRealmGroups**(`realmName`, `groups`): `Promise`<`void`\>

Remove groups for the request realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groups` | `Group` | The map of groupIds to remove. |

#### Returns

`Promise`<`void`\>

#### Defined in

[client.ts:781](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L781)

___

### removeGroupRoleMappings

▸ **removeGroupRoleMappings**(`realmName`, `groupId`, `groupRoleMapping`): `Promise`<`boolean`\>

Removes a set of realm/client roles from a group's role mapping.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groupId` | `string` | Id of realm group. |
| `groupRoleMapping` | `GroupRoleMapping` | The map of roles to remove to group's mapping. |

#### Returns

`Promise`<`boolean`\>

True if successful

#### Defined in

[client.ts:655](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L655)

___

### replaceDefaultRealmGroups

▸ **replaceDefaultRealmGroups**(`realmName`, `groups`): `Promise`<`void`\>

Replace default groups for the request realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groups` | `Group` | The map of groupIds to set as new default. |

#### Returns

`Promise`<`void`\>

#### Defined in

[client.ts:754](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L754)

___

### resendVerificationEmail

▸ **resendVerificationEmail**(): `Promise`<`any`\>

Requests Tozny account email verification be resent.

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:942](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L942)

___

### serialize

▸ **serialize**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `account` | `any` |
| `api` | `any` |
| `profile` | `any` |
| `storageClient` | `any` |

#### Defined in

[client.ts:947](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L947)

___

### setClientEnabled

▸ **setClientEnabled**(`clientId`, `enabled`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientId` | `any` |
| `enabled` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:155](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L155)

___

### subscribe

▸ **subscribe**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:133](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L133)

___

### unsubscribe

▸ **unsubscribe**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:137](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L137)

___

### updateAccountBilling

▸ **updateAccountBilling**(`stripeToken`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stripeToken` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:124](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L124)

___

### updateGroupMembership

▸ **updateGroupMembership**(`realmName`, `identityId`, `groups`): `Promise`<`boolean`\>

Update group membership

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `identityId` | `string` | Id of identity |
| `groups` | `Group` | The map of groupIds to update. |

#### Returns

`Promise`<`boolean`\>

True if successful

#### Defined in

[client.ts:692](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L692)

___

### updateProfile

▸ **updateProfile**(`profile`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `profile` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:164](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L164)

___

### updateRealmApplicationRole

▸ **updateRealmApplicationRole**(`realmName`, `applicationId`, `originalRoleName`, `role`): `Promise`<`Role`\>

Update an existing application role in the realm given the original role name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `applicationId` | `string` | Id of client application. |
| `originalRoleName` | `string` | Name of the role being updated. |
| `role` | `any` | Updated attributes of the role. |

#### Returns

`Promise`<`Role`\>

#### Defined in

[client.ts:514](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L514)

___

### updateRealmGroup

▸ **updateRealmGroup**(`realmName`, `groupId`, `group`): `Promise`<`Group`\>

Update an existing group in the realm given a group id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groupId` | `string` | Id of group to update. |
| `group` | `Group` | Updated attributes of the group |

#### Returns

`Promise`<`Group`\>

#### Defined in

[client.ts:376](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L376)

___

### updateRealmRole

▸ **updateRealmRole**(`realmName`, `role`): `Promise`<`Role`\>

Update an existing role in the realm given a role id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `role` | `any` | Updated attributes of the role. |

#### Returns

`Promise`<`Role`\>

#### Defined in

[client.ts:438](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L438)

___

### validatePassword

▸ **validatePassword**(`password`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `any` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[client.ts:38](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L38)

___

### webhooks

▸ **webhooks**(): `Promise`<`any`[]\>

Get a list of the current webhooks for an account.

#### Returns

`Promise`<`any`[]\>

#### Defined in

[client.ts:214](https://github.com/tozny/js-account-sdk/blob/3434a0c/src/client.ts#L214)
