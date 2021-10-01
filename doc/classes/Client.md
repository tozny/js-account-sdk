[@toznysecure/account-sdk](../README.md) / [Exports](../modules.md) / Client

# Class: Client

The client for Tozny's Account API.

## Table of contents

### Constructors

- [constructor](Client.md#constructor)

### Accessors

- [queenClient](Client.md#queenclient)

### Methods

- [\_listIdentities](Client.md#_listidentities)
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

[client.ts:27](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L27)

## Accessors

### queenClient

• `get` **queenClient**(): `any`

#### Returns

`any`

#### Defined in

[client.ts:34](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L34)

## Methods

### \_listIdentities

▸ **_listIdentities**(`realmName`, `max`, `next`): `Promise`<`any`\>

Internal method which queries to get a specific page of basic identities

#### Parameters

| Name | Type |
| :------ | :------ |
| `realmName` | `any` |
| `max` | `any` |
| `next` | `any` |

#### Returns

`Promise`<`any`\>

A list of basic identity info.

#### Defined in

[client.ts:815](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L815)

___

### addBillingCoupon

▸ **addBillingCoupon**(`couponCode`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `couponCode` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:129](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L129)

___

### addDefaultRealmGroups

▸ **addDefaultRealmGroups**(`realmName`, `groups`): `Promise`<`any`\>

Add default groups for the request realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `groups` | `any` | The map of groupIds to add. |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:713](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L713)

___

### addGroupRoleMappings

▸ **addGroupRoleMappings**(`realmName`, `groupId`, `groupRoleMapping`): `Promise`<`any`\>

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
| `realmName` | `any` | Name of realm. |
| `groupId` | `any` | Id of realm group. |
| `groupRoleMapping` | `any` | The map of roles to add to group's mapping. |

#### Returns

`Promise`<`any`\>

True if successful

#### Defined in

[client.ts:599](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L599)

___

### billingStatus

▸ **billingStatus**(): `Promise`<`fn`\>

#### Returns

`Promise`<`fn`\>

#### Defined in

[client.ts:119](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L119)

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

[client.ts:50](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L50)

___

### createRealm

▸ **createRealm**(`realmName`, `sovereignName`, `realmRegistrationToken?`): `Promise`<`fn`\>

Requests the creation of a new TozID Realm.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `realmName` | `any` | `undefined` | The user defined name for the realm to create. |
| `sovereignName` | `any` | `undefined` | The user defined name for the ruler of the realm to create. |
| `realmRegistrationToken` | `string` | `''` | - |

#### Returns

`Promise`<`fn`\>

The representation of the created realm returned by the server.

#### Defined in

[client.ts:291](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L291)

___

### createRealmApplicationRole

▸ **createRealmApplicationRole**(`realmName`, `applicationId`, `role`): `Promise`<`Role`\>

Creates a new application role for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `applicationId` | `any` | Id of client application. |
| `role` | `any` | Object with `name` and `description` of role. |

#### Returns

`Promise`<`Role`\>

The newly created role.

#### Defined in

[client.ts:474](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L474)

___

### createRealmGroup

▸ **createRealmGroup**(`realmName`, `group`): `Promise`<`Group`\>

Creates a new group in the realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `group` | `any` | Object containing `name` of group. |

#### Returns

`Promise`<`Group`\>

The newly created group.

#### Defined in

[client.ts:329](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L329)

___

### createRealmRole

▸ **createRealmRole**(`realmName`, `role`): `Promise`<`Role`\>

Creates a new role for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `role` | `any` | Object with `name` and `description` of role. |

#### Returns

`Promise`<`Role`\>

The newly created role.

#### Defined in

[client.ts:405](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L405)

___

### deleteIdentity

▸ **deleteIdentity**(`realmName`, `identityId`): `Promise`<`any`\>

Removes an identity in the given realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `identityId` | `any` | Id of identity |

#### Returns

`Promise`<`any`\>

True if successful

#### Defined in

[client.ts:755](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L755)

___

### deleteRealm

▸ **deleteRealm**(`realmName`): `Promise`<`any`\>

Requests the deletion of a named TozID Realm belonging to the account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | The name for the realm to delete. |

#### Returns

`Promise`<`any`\>

Empty object.

#### Defined in

[client.ts:318](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L318)

___

### deleteRealmApplicationRole

▸ **deleteRealmApplicationRole**(`realmName`, `applicationId`, `roleName`): `Promise`<`any`\>

Deletes a realm application role by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `applicationId` | `any` | Id of client application. |
| `roleName` | `any` | Name of role to delete. |

#### Returns

`Promise`<`any`\>

True if successful.

#### Defined in

[client.ts:517](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L517)

___

### deleteRealmGroup

▸ **deleteRealmGroup**(`realmName`, `groupId`): `Promise`<`any`\>

Deletes a group in the named realm by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | The name of the realm containing the group. |
| `groupId` | `any` | The id of the group to delete. |

#### Returns

`Promise`<`any`\>

True if successful.

#### Defined in

[client.ts:394](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L394)

___

### deleteRealmRole

▸ **deleteRealmRole**(`realmName`, `roleId`): `Promise`<`any`\>

Deletes a realm role by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `roleId` | `any` | Id of role to delete. |

#### Returns

`Promise`<`any`\>

True if successful.

#### Defined in

[client.ts:437](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L437)

___

### deleteRegistrationToken

▸ **deleteRegistrationToken**(`token`): `Promise`<`any`\>

Removes a token object from the accounts available tokens.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `any` | The token to remove from the account. |

#### Returns

`Promise`<`any`\>

True if the operation succeeds.

#### Defined in

[client.ts:200](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L200)

___

### deleteWebhook

▸ **deleteWebhook**(`webhookId`): `Promise`<`any`\>

Removes a webhook object from the accounts available webhooks.

#### Parameters

| Name | Type |
| :------ | :------ |
| `webhookId` | `any` |

#### Returns

`Promise`<`any`\>

True if the operation succeeds.

#### Defined in

[client.ts:240](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L240)

___

### describeRealmApplicationRole

▸ **describeRealmApplicationRole**(`realmName`, `applicationId`, `roleName`): `Promise`<`any`\>

Describe a realm application role by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `applicationId` | `any` | Id of client application. |
| `roleName` | `any` | Name of role to describe. |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:534](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L534)

___

### describeRealmGroup

▸ **describeRealmGroup**(`realmName`, `groupId`): `Promise`<`Group`\>

Describe a realm group by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `groupId` | `any` | Id of group to describe. |

#### Returns

`Promise`<`Group`\>

#### Defined in

[client.ts:345](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L345)

___

### describeRealmRole

▸ **describeRealmRole**(`realmName`, `roleId`): `Promise`<`any`\>

Describe a realm role by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `roleId` | `any` | Id of role to describe. |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:448](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L448)

___

### getAggregations

▸ **getAggregations**(`startTime`, `endTime`): `Promise`<`any`\>

Gets aggregations for the api calls made in a given time frame.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startTime` | `any` | Start time for range of requests |
| `endTime` | `any` | End time for range of requests |

#### Returns

`Promise`<`any`\>

aggregations response object

#### Defined in

[client.ts:274](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L274)

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

[client.ts:150](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L150)

___

### getRequests

▸ **getRequests**(`startTime`, `endTime`, `nextToken`, `endpointsToExclude`): `Promise`<`any`\>

Gets the api request history using provided params.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startTime` | `any` | Start time for range of requests |
| `endTime` | `any` | End time for range of requests |
| `nextToken` | `any` | allows backend to paginate requests |
| `endpointsToExclude` | `any` | - |

#### Returns

`Promise`<`any`\>

request response object

#### Defined in

[client.ts:254](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L254)

___

### groupMembership

▸ **groupMembership**(`realmName`, `identityId`): `Promise`<`any`\>

List all realm groups for an identity

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `identityId` | `any` | Id of identity |

#### Returns

`Promise`<`any`\>

If successful

#### Defined in

[client.ts:633](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L633)

___

### hostedBrokerInfo

▸ **hostedBrokerInfo**(): `Promise`<`any`\>

Gets the public info about the Tozny hosted broker

#### Returns

`Promise`<`any`\>

The hosted broker public info.

#### Defined in

[client.ts:797](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L797)

___

### identityDetails

▸ **identityDetails**(`realmName`, `username`): `Promise`<`fn`\>

Set up the pagination result for listing identities

#### Parameters

| Name | Type |
| :------ | :------ |
| `realmName` | `any` |
| `username` | `any` |

#### Returns

`Promise`<`fn`\>

A object usable for making paginated queries.

#### Defined in

[client.ts:838](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L838)

___

### joinGroups

▸ **joinGroups**(`realmName`, `identityId`, `groups`): `Promise`<`any`\>

Join a list of Realm groups for an identity

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `identityId` | `any` | Id of identity |
| `groups` | `any` | The map of groupIds to join. |

#### Returns

`Promise`<`any`\>

True if successful

#### Defined in

[client.ts:665](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L665)

___

### leaveGroups

▸ **leaveGroups**(`realmName`, `identityId`, `groups`): `Promise`<`any`\>

Leave a list of Realm Groups for an identity

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `identityId` | `any` | Id of identity |
| `groups` | `any` | The map of groupIds to leave. |

#### Returns

`Promise`<`any`\>

True if successful

#### Defined in

[client.ts:676](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L676)

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

[client.ts:141](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L141)

___

### listDefaultRealmGroups

▸ **listDefaultRealmGroups**(`realmName`): `Promise`<`any`\>

Lists all default groups for the request realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |

#### Returns

`Promise`<`any`\>

List of all groups at realm.

#### Defined in

[client.ts:685](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L685)

___

### listGroupRoleMappings

▸ **listGroupRoleMappings**(`realmName`, `groupId`): `Promise`<`GroupRoleMapping`\>

Gets realm & client (application) roles that are mapped to a particular realm group.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `groupId` | `any` | Id of group for which to list role mappings. |

#### Returns

`Promise`<`GroupRoleMapping`\>

List of all roles at realm.

#### Defined in

[client.ts:566](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L566)

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

[client.ts:806](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L806)

___

### listRealmApplicationRoles

▸ **listRealmApplicationRoles**(`realmName`, `applicationId`): `Promise`<`any`\>

Lists all realm application roles for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `applicationId` | `any` | Id of client application. |

#### Returns

`Promise`<`any`\>

List of all roles for application.

#### Defined in

[client.ts:550](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L550)

___

### listRealmGroups

▸ **listRealmGroups**(`realmName`): `Promise`<`any`\>

Lists all realm groups for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |

#### Returns

`Promise`<`any`\>

List of all groups at realm.

#### Defined in

[client.ts:379](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L379)

___

### listRealmRoles

▸ **listRealmRoles**(`realmName`): `Promise`<`any`\>

Lists all realm roles for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |

#### Returns

`Promise`<`any`\>

List of all roles at realm.

#### Defined in

[client.ts:458](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L458)

___

### listRealms

▸ **listRealms**(): `Promise`<`fn`\>

Lists all Realms belonging to the account.

#### Returns

`Promise`<`fn`\>

The listed realm representations returned by the server.

#### Defined in

[client.ts:306](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L306)

___

### newRegistrationToken

▸ **newRegistrationToken**(`name`, `permissions?`, `totalUsesAllowed`): `Promise`<`fn`\>

Create a new registration token for the account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `any` | The user defined name for the new token. Not unique. |
| `permissions` | `Object` | A set of key-value pair of permissions for the token. |
| `totalUsesAllowed` | `any` | The number of uses the token is allowed. If                                  not set, unlimited uses are allowed. |

#### Returns

`Promise`<`fn`\>

The created registration token.

#### Defined in

[client.ts:189](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L189)

___

### newWebhook

▸ **newWebhook**(`webhook_url`, `triggers`): `Promise`<`any`\>

Create a new webhook for the account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `webhook_url` | `any` | The payload url |
| `triggers` | `any` | A list of triggers to associate with the webhook                                  not set, unlimited uses are allowed. |

#### Returns

`Promise`<`any`\>

The created webhook.

#### Defined in

[client.ts:224](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L224)

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

[client.ts:857](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L857)

___

### registerIdentity

▸ **registerIdentity**(`realmName`, `registrationToken`, `identity`): `Promise`<`any`\>

Registers an identity with the specified realm using the specified parameters,returning the created identity and error (if any).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `registrationToken` | `any` | the token for the realm |
| `identity` | `any` | Configuration for the new identity |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:739](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L739)

___

### registerRealmBrokerIdentity

▸ **registerRealmBrokerIdentity**(`realmName`, `registrationToken`): `Promise`<`Identity`\>

registerRealmBrokerIdentity registers an identity to be the broker for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | The name of the realm to register the broker identity with. |
| `registrationToken` | `any` | A registration for the account that has permissions for registering clients of type broker. |

#### Returns

`Promise`<`Identity`\>

The broker identity for the realm.

#### Defined in

[client.ts:764](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L764)

___

### registrationTokens

▸ **registrationTokens**(): `Promise`<`any`\>

Get a list of the current registration tokens for an account.

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:175](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L175)

___

### removeDefaultRealmGroups

▸ **removeDefaultRealmGroups**(`realmName`, `groups`): `Promise`<`any`\>

Remove groups for the request realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `groups` | `any` | The map of groupIds to remove. |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:723](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L723)

___

### removeGroupRoleMappings

▸ **removeGroupRoleMappings**(`realmName`, `groupId`, `groupRoleMapping`): `Promise`<`any`\>

Removes a set of realm/client roles from a group's role mapping.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `groupId` | `any` | Id of realm group. |
| `groupRoleMapping` | `any` | The map of roles to remove to group's mapping. |

#### Returns

`Promise`<`any`\>

True if successful

#### Defined in

[client.ts:616](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L616)

___

### replaceDefaultRealmGroups

▸ **replaceDefaultRealmGroups**(`realmName`, `groups`): `Promise`<`any`\>

Replace default groups for the request realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `groups` | `any` | The map of groupIds to set as new default. |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:699](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L699)

___

### resendVerificationEmail

▸ **resendVerificationEmail**(): `Promise`<`any`\>

Requests Tozny account email verification be resent.

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:867](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L867)

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

[client.ts:872](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L872)

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

[client.ts:155](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L155)

___

### subscribe

▸ **subscribe**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:133](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L133)

___

### unsubscribe

▸ **unsubscribe**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:137](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L137)

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

[client.ts:124](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L124)

___

### updateGroupMembership

▸ **updateGroupMembership**(`realmName`, `identityId`, `groups`): `Promise`<`any`\>

Update group membership

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `identityId` | `any` | Id of identity |
| `groups` | `any` | The map of groupIds to update. |

#### Returns

`Promise`<`any`\>

True if successful

#### Defined in

[client.ts:649](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L649)

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

[client.ts:164](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L164)

___

### updateRealmApplicationRole

▸ **updateRealmApplicationRole**(`realmName`, `applicationId`, `originalRoleName`, `role`): `Promise`<`Role`\>

Update an existing application role in the realm given the original role name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `applicationId` | `any` | Id of client application. |
| `originalRoleName` | `any` | Name of the role being updated. |
| `role` | `any` | Updated attributes of the role. |

#### Returns

`Promise`<`Role`\>

#### Defined in

[client.ts:493](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L493)

___

### updateRealmGroup

▸ **updateRealmGroup**(`realmName`, `groupId`, `group`): `Promise`<`Group`\>

Update an existing group in the realm given a group id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `groupId` | `any` | Id of group to update. |
| `group` | `any` | Updated attributes of the group |

#### Returns

`Promise`<`Group`\>

#### Defined in

[client.ts:363](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L363)

___

### updateRealmRole

▸ **updateRealmRole**(`realmName`, `role`): `Promise`<`Role`\>

Update an existing role in the realm given a role id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `any` | Name of realm. |
| `role` | `any` | Updated attributes of the role. |

#### Returns

`Promise`<`Role`\>

#### Defined in

[client.ts:421](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L421)

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

[client.ts:38](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L38)

___

### webhooks

▸ **webhooks**(): `Promise`<`any`\>

Get a list of the current webhooks for an account.

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:210](https://github.com/tozny/js-account-sdk/blob/da7eb1a/src/client.ts#L210)
