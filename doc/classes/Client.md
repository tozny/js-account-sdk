[@toznysecure/account-sdk](../README.md) / [Exports](../modules.md) / Client

# Class: Client

The client for Tozny's Account API.

This documentation is automatically generated from the code. It is currently a work in progress
as we refine our type definitions & document more and more of the API.

**`example`**
```js
const { Account } = require('@toznysecure/account-sdk')
const Tozny = require('@toznysecure/sdk/node')

const accountFactory = new Account(Tozny, TOZNY_PLATFORM_API_URL)

// must be used inside an async function for access to `await`
const account = await accountFactory.login(USERNAME, PASSWORD)
const accountClient = account.client
```

## Table of contents

### Constructors

- [constructor](Client.md#constructor)

### Properties

- [account](Client.md#account)
- [api](Client.md#api)

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
- [listAccessPoliciesForGroups](Client.md#listaccesspoliciesforgroups)
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
- [updateRealmSettings](Client.md#updaterealmsettings)
- [upsertAccessPoliciesForGroup](Client.md#upsertaccesspoliciesforgroup)
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

[client.ts:55](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L55)

## Properties

### account

• **account**: [`Account`](Account.md)

#### Defined in

[client.ts:52](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L52)

___

### api

• **api**: `API`

#### Defined in

[client.ts:51](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L51)

## Accessors

### queenClient

• `get` **queenClient**(): `any`

#### Returns

`any`

#### Defined in

[client.ts:62](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L62)

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

[client.ts:157](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L157)

___

### addDefaultRealmGroups

▸ **addDefaultRealmGroups**(`realmName`, `groups`): `Promise`<`void`\>

Add default groups for the request realm.
_note: when default realm groups change, existing users groups are not updated_

**`example`**
```js
const toznyEngineersGroup = await client.createRealmGroup(realmName, {
  name: 'ToznyEngineers',
})
await client.addDefaultRealmGroups(realmName, {
  groups: [toznyEngineersGroup.id],
})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groups` | `GroupsInput` | List of groups or group ids in an object on the `groups` key |

#### Returns

`Promise`<`void`\>

#### Defined in

[client.ts:892](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L892)

___

### addGroupRoleMappings

▸ **addGroupRoleMappings**(`realmName`, `groupId`, `groupRoleMapping`): `Promise`<`boolean`\>

Adds a set of realm/client roles to a group's role mapping

**`example`**
```js
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
```

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

[client.ts:690](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L690)

___

### billingStatus

▸ **billingStatus**(): `Promise`<`fn`\>

#### Returns

`Promise`<`fn`\>

#### Defined in

[client.ts:147](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L147)

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

[client.ts:78](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L78)

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

[client.ts:328](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L328)

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

[client.ts:545](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L545)

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

[client.ts:385](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L385)

___

### createRealmRole

▸ **createRealmRole**(`realmName`, `role`): `Promise`<`Role`\>

Creates a new role for a realm.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `role` | `MinimumRoleData` | Object with `name` and `description` of role. |

#### Returns

`Promise`<`Role`\>

The newly created role.

#### Defined in

[client.ts:467](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L467)

___

### deleteIdentity

▸ **deleteIdentity**(`realmName`, `identityId`): `Promise`<`boolean`\>

Removes an identity in the given realm.

**`example`**
```js
// Get the identityId you wish to delete
const identity = accountClient.identityDetails(realmName, username)

// Delete identity
await accountClient.deleteIdentity(realmName, identity.toznyId)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `identityId` | `string` | Id of Tozny identity |

#### Returns

`Promise`<`boolean`\>

True if successful

#### Defined in

[client.ts:985](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L985)

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

[client.ts:359](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L359)

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

[client.ts:592](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L592)

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

[client.ts:454](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L454)

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

[client.ts:508](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L508)

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

[client.ts:232](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L232)

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

[client.ts:272](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L272)

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

[client.ts:613](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L613)

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

[client.ts:401](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L401)

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

[client.ts:519](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L519)

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

[client.ts:311](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L311)

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

[client.ts:178](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L178)

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

[client.ts:286](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L286)

___

### groupMembership

▸ **groupMembership**(`realmName`, `identityId`): `Promise`<`Group`[]\>

List all realm groups for an identity

**`example`**
```js
const identity = await accountClient.identityDetails(realmName, username)
const groupList = await client.groupMembership(realmName, identity.toznyId)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `identityId` | `string` | Id of Tozny identity |

#### Returns

`Promise`<`Group`[]\>

#### Defined in

[client.ts:736](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L736)

___

### hostedBrokerInfo

▸ **hostedBrokerInfo**(): `Promise`<`object`\>

Gets the public info about the Tozny hosted broker

#### Returns

`Promise`<`object`\>

The hosted broker public info.

#### Defined in

[client.ts:1033](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L1033)

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

[client.ts:1106](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L1106)

___

### joinGroups

▸ **joinGroups**(`realmName`, `identityId`, `groups`): `Promise`<`boolean`\>

Join a list of Realm groups for an identity

**`example`**
```js
const toznyEngineersGroup = await client.createRealmGroup(realmName, {
  name: 'ToznyEngineers',
})
await client.joinGroups(realmName, identityId, {
  groups: [toznyEngineersGroup.id],
})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `identityId` | `string` | Id of Tozny identity |
| `groups` | `GroupsInput` | List of groups or group ids to join in an object on the `groups` key |

#### Returns

`Promise`<`boolean`\>

True if successful

#### Defined in

[client.ts:794](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L794)

___

### leaveGroups

▸ **leaveGroups**(`realmName`, `identityId`, `groups`): `Promise`<`boolean`\>

Leave a list of Realm Groups for an identity

**`example`**
```js
const toznyEngineersGroup = await client.createRealmGroup(realmName, {
  name: 'ToznyEngineers',
})
await client.joinGroups(realmName, identityId, {
  groups: [toznyEngineersGroup.id],
})
await client.leaveGroups(realmName, identityId, {
  groups: [toznyEngineersGroup.id],
})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `identityId` | `string` | Id of Tozny identity |
| `groups` | `GroupsInput` | List of groups or group ids to leave in an object on the `groups` key |

#### Returns

`Promise`<`boolean`\>

True if successful

#### Defined in

[client.ts:822](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L822)

___

### listAccessPoliciesForGroups

▸ **listAccessPoliciesForGroups**(`realmName`, `groupIds`): `Promise`<`ListAccessPoliciesResponse`\>

Lists the Current Access Policies for the Group Ids sent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groupIds` | `string`[] | The IDs for the Tozny Groups |

#### Returns

`Promise`<`ListAccessPoliciesResponse`\>

#### Defined in

[client.ts:1147](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L1147)

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

[client.ts:169](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L169)

___

### listDefaultRealmGroups

▸ **listDefaultRealmGroups**(`realmName`): `Promise`<`Group`[]\>

Lists all default groups for the request realm.

**`example`**
```js
const groupList = await client.listDefaultRealmGroups(realmName)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |

#### Returns

`Promise`<`Group`[]\>

List of all groups at realm.

#### Defined in

[client.ts:839](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L839)

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

[client.ts:652](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L652)

___

### listIdentities

▸ **listIdentities**(`realmName`, `max`, `next`): `ListIdentitiesResult`

Set up the pagination result for listing identities

Each page is returned when the next() function is invoked on the
ListIdentitiesResult object.

**`example`**
```js
const realmName = 'westeros'
// list identities in westeros 10 at a time
const idList = accountClient.listIdentities(realmName, 10)
// Must call idList.next() to receive results
while (!idList.done) {
   const identities = await idList.next()
   for (let identity of identities) {
       console.log(identity.username)
   }
}
```
Note: If the value of max is higher than the maximum allowed by
the server, idList.next() will only return up to the number of
identities allowed by the server

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `max` | `number` | The maximum number of identities per page. Up to the max allowed by the server. |
| `next` | `number` | The next token, used for paging. Default is 0. |

#### Returns

`ListIdentitiesResult`

A object usable for making paginated queries.

#### Defined in

[client.ts:1066](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L1066)

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

[client.ts:633](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L633)

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

[client.ts:439](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L439)

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

[client.ts:529](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L529)

___

### listRealms

▸ **listRealms**(): `Promise`<`Realms`\>

Lists all Realms belonging to the account.

#### Returns

`Promise`<`Realms`\>

The listed realm representations returned by the server.

#### Defined in

[client.ts:347](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L347)

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

[client.ts:217](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L217)

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

[client.ts:256](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L256)

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

[client.ts:1125](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L1125)

___

### registerIdentity

▸ **registerIdentity**(`realmName`, `registrationToken`, `identity`): `Promise`<`Identity`\>

Registers an identity with the specified realm using the specified parameters,returning the created identity and error (if any).

Note that the `identity` input takes snake_case values.

**`example`**
```js
// Create a token
const token = await accountClient.newRegistrationToken(tokenName, permissions)
const identity = {
  name: 'identityName',
  email: 'identity@example.com',
  first_name: 'firstName',
  last_name: 'lastName',
}
// Register Identity
const identityResponse = await accountClient.registerIdentity(
  realmName,
  token.token,
  identity
)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `registrationToken` | `string` | the token for the realm |
| `identity` | `any` | Configuration for the new identity |

#### Returns

`Promise`<`Identity`\>

#### Defined in

[client.ts:957](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L957)

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

[client.ts:997](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L997)

___

### registrationTokens

▸ **registrationTokens**(): `Promise`<`RegistrationToken`[]\>

Get a list of the current registration tokens for an account.

#### Returns

`Promise`<`RegistrationToken`[]\>

#### Defined in

[client.ts:203](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L203)

___

### removeDefaultRealmGroups

▸ **removeDefaultRealmGroups**(`realmName`, `groups`): `Promise`<`void`\>

Remove groups for the request realm.

**`example`**
```js
const toznyEngineersGroup = await client.createRealmGroup(realmName, {
  name: 'ToznyEngineers',
})
await client.addDefaultRealmGroups(realmName, {
  groups: [toznyEngineersGroup.id],
})
await client.removeDefaultRealmGroups(realmName, {
  groups: [toznyEngineersGroup.id],
})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groups` | `GroupsInput` | List of groups or group ids in an object on the `groups` key |

#### Returns

`Promise`<`void`\>

#### Defined in

[client.ts:918](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L918)

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

[client.ts:711](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L711)

___

### replaceDefaultRealmGroups

▸ **replaceDefaultRealmGroups**(`realmName`, `groups`): `Promise`<`void`\>

Replace default groups for the request realm.
_note: when default realm groups changed existing users groups are not updated_

**`example`**
```js
const toznyEngineersGroup = await client.createRealmGroup(realmName, {
  name: 'ToznyEngineers',
})
await client.replaceDefaultRealmGroups(realmName, {
  groups: [toznyEngineersGroup.id],
})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groups` | `GroupsInput` | List of groups or group ids to leave in an object on the `groups` key |

#### Returns

`Promise`<`void`\>

#### Defined in

[client.ts:864](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L864)

___

### resendVerificationEmail

▸ **resendVerificationEmail**(): `Promise`<`any`\>

Requests Tozny account email verification be resent.

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:1135](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L1135)

___

### serialize

▸ **serialize**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `account` | [`Account`](Account.md) |
| `api` | `Object` |
| `api.apiUrl` | `string` |
| `profile` | `any` |
| `storageClient` | `any` |

#### Defined in

[client.ts:1184](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L1184)

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

[client.ts:183](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L183)

___

### subscribe

▸ **subscribe**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:161](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L161)

___

### unsubscribe

▸ **unsubscribe**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:165](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L165)

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

[client.ts:152](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L152)

___

### updateGroupMembership

▸ **updateGroupMembership**(`realmName`, `identityId`, `groups`): `Promise`<`boolean`\>

Update group membership

**`example`**
```js
  const toznyEngineersGroup = await client.createRealmGroup(realmName, {
  name: 'ToznyEngineers',
})
await client.updateGroupMembership(realmName, identityId, {
  groups: [toznyEngineersGroup.id],
})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `identityId` | `string` | Id of Tozny identity |
| `groups` | `GroupsInput` | List of groups or group ids to update in an object on the `groups` key |

#### Returns

`Promise`<`boolean`\>

True if successful

#### Defined in

[client.ts:764](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L764)

___

### updateProfile

▸ **updateProfile**(`profile`): `Promise`<`any`\>

Allows user to update the name and email on their account.
Profile param contains a name and email for the user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `profile` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[client.ts:192](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L192)

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

[client.ts:568](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L568)

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

[client.ts:419](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L419)

___

### updateRealmRole

▸ **updateRealmRole**(`realmName`, `role`): `Promise`<`Role`\>

Update an existing role in the realm given a role id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `role` | `MinimumRoleWithId` | Updated attributes of the role. |

#### Returns

`Promise`<`Role`\>

The updated role

#### Defined in

[client.ts:489](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L489)

___

### updateRealmSettings

▸ **updateRealmSettings**(`realmName`, `settings`): `Promise`<`RealmSettings`\>

Updates settings for the realm.
Some of these features enabled by these settings are experimental and may be subject
to change.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `settings` | `RealmSettings` | Object containing settings to enable. |

#### Returns

`Promise`<`RealmSettings`\>

Updated realm settings.

#### Defined in

[client.ts:371](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L371)

___

### upsertAccessPoliciesForGroup

▸ **upsertAccessPoliciesForGroup**(`realmName`, `groupId`, `accessPolicies`): `Promise`<`GroupAccessPolicies`\>

 Creating or Updating an Access Policy for a Group

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `realmName` | `string` | Name of realm. |
| `groupId` | `string` | The ID of the Group in Tozny |
| `accessPolicies` | `AccessPolicyData`[] | Configuration for the new identity |

#### Returns

`Promise`<`GroupAccessPolicies`\>

#### Defined in

[client.ts:1167](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L1167)

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

[client.ts:66](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L66)

___

### webhooks

▸ **webhooks**(): `Promise`<`any`[]\>

Get a list of the current webhooks for an account.

#### Returns

`Promise`<`any`[]\>

#### Defined in

[client.ts:242](https://github.com/tozny/js-account-sdk/blob/4cea62b/src/client.ts#L242)
