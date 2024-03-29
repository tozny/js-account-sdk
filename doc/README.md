@toznysecure/account-sdk / [Exports](modules.md)

# Tozny JS Account SDK

[![Build Status](https://app.travis-ci.com/tozny/js-account-sdk.svg?branch=master)](https://app.travis-ci.com/tozny/js-account-sdk)

Javascript SDK for performing Tozny platform account level operations

[Documentation](doc/classes/Client.md)

## Approach

The Tozny platform client SDKs abstract over working with the Tozny platform as a client. In addition to client level operations, Tozny offers endpoints which perform various account level operations—they control how the overall account operates. This functionality is only useful to a very small subset of Tozny clients. For this reason it does not make sense to ship the full set of account operation in the client SDK. It also does not make sense to rewrite all of the request handling and cryptographic operations in another SDK for handling account operations. Especially as different cryptographic methods and target are defined. To reconcile this, the account SDK in this repository consumes a valid instance of a Tozny client implementation and layers functionality on top of it enabling account level operations. This allows the crypto to remain context specific while the account operations are defined in a single package.

## Getting Started

To use the SDK, first require it as well as the Tozny client SDK package.

```bash
npm install @toznysecure/sdk
npm install @toznysecure/account-sdk --production
```

The `--production` flag, though not necessary, installs the library without the any build & dev dependencies.

Create a new Account connection object -- this defines the API and specific client SDK in use.

```js
const { Account } = require('@toznysecure/account-sdk')
const Tozny = require('@toznysecure/sdk/node')

const account = new Account(Tozny, 'http://platform.local.tozny.com:8000') // where the second parameter is the API url for the Tozny platform instance
```

The `Account` instance provides methods for creating a account client in various ways. The client object returned from each is identical in use and operation, but the method matches a context specific means of creating the client. See the [`Account` class definition](src/account.js) for the full list of available methods and return values.

### Example

With the account object created above, you can use the login method as the standard means of getting a client instance for a pre-existing client. This is an asynchronous operation -- it returns a promise. This can be used in a promise chain, or in an async/await style function.

```javascript
let accountClient
async getClient() {
  if(!accountClient) {
    const email = process.env.ACCOUNT_EMAIL
    const password = process.env.ACCOUNT_PASSWORD
    accountClient = await account.login(email, password)
  }
  return accountClient
}

async getRealms() {
  const accountClient = await getClient()
   return accountClient.listRealms()
}

getRealms().then(console.log)
```

This caches the client connection in a scope variable so it doesn't need to log in each time. Application methods can then use the client whenever they need to run account-level transactions. This would typically be done as a state value, or stored in an object as a larger part of an application.

## Account Clients

Account clients provide managed access to account level operations. The actual HTTP request sequence, authentication method, etc. is hidden behind the higher level methods. This allows us to maintain a consistent API for use in account applications and change implementation details as needed (e.g. a new endpoint, a different auth method, etc.). These higher level methods should correspond with specific account actions (e.g. `createWebHook`, etc). The parameters will provide insight into what is required to perform those operations.

## Usage Examples

This is a limited set of operations that may be useful. Additional methods are available, review the [account object](./src/account.js) and [client object source](./src/client.js) to see the full list of methods available.

**Register a new account**

```js
const name = 'Jon Snow'
const email = 'jsnow@example.com'
const password = 'keep this secret'
const accountClient = await account.register(name, email, password)
```

**Log in to an existing account**

```js
const email = 'jsnow@example.com'
const password = 'keep this secret'
const accountClient = await account.login(email, password)
```

**Serialize account for string-based storage and recreate it from the serialization**

```js
const serializedString = JSON.stringify(accountClient.serialize())
accountClient = account.fromObject(JSON.parse(serializedString))
await accountClient.refreshProfile()
```

**Change the password for an account**

```js
const password = 'keep this secret'
const newPassword = 'hide this safely'
await accountClient.changePassword({ password, newPassword })
```

**Gather account billing information**

```js
const billingInfo = await accountClient.billingStatus()
console.log(billingInfo.accountActive)
console.log(billingInfo.isGoodStanding)
```

**List Registration tokens in the account**

```js
const tokens = await accountClient.registrationTokens()
for (let token of tokens) {
  console.log(token.name)
  console.log(token.token)
}
```

**Create a registration token**

```js
const name = 'example token'
const permissions = {
  enabled: true,
  allowed_types: ['general', 'identity'],
}
const token = await accountClient.newRegistrationToken(name, permissions)
```

**Delete a registration token**

```js
const tokenString = fetchedToken.token
await accountClient.deleteRegistrationToken(tokenString)
```

**List TozStore clients in the account**

```js
let clientList = await accountClient.listClientInfo()
for (let clientInfo of clientList.clients) {
  console.log(clientInfo.clientId)
}
// next page
clientList = await accountClient.listClientInfo(clientList.nextToken)
for (let clientInfo of clientList.clients) {
  console.log(clientInfo.clientId)
}
```

**Fetch an individual TozStore client's info**

```js
const clientId = '000000000000-0000-0000-0000-00000000'
const clientInfo = accountClient.getClientInfo(clientId)
console.log(clientInfo.publicKey)
console.log(clientInfo.enabled)
console.log(clientInfo.hasBackup)
```

**Disable/Enable a TozStore client**

```js
const clientId = '000000000000-0000-0000-0000-00000000'
// disable
accountClient.setClientEnabled(clientId, false)
// enable
accountClient.setClientEnabled(clientId, true)
```

**List Identity Realms**

```js
const realmList = await accountClient.listRealms()
for (let realm of realmList.realms) {
  console.log(realm.name)
}
```

**Create and Identity Realm and Realm Broker**

```js
// create a realm
const registrationToken = tokenInfo.token // Must have permissions to register 'broker' clients
const realmName = 'westeros'
const sovereignName = 'cersei'
const createdRealm = await accountClient.createRealm(realmName, sovereignName)
const realmBrokerIdentity = await accountClient.registerRealmBrokerIdentity(
  createdRealm.name,
  registrationToken
)
```

**Delete a realm**

```js
const realmName = 'westeros'
await accountClient.deleteRealm(realmName)
```

**Create a group**

```js
const realmName = 'westeros'
const myNewGroup = {
  name: 'WhiteWalkers',
}
const group = await accountClient.createRealmGroup(realmName, myNewGroup)
```

**Fetch an existing realm group**

```js
const realmName = 'westeros'
const groupId = '000000000000-0000-0000-0000-00000000'
const group = await accountClient.describeRealmGroup(realmName, groupId)
```

**Update a realm group**

```js
const realmName = 'westeros'
const groupId = '000000000000-0000-0000-0000-00000000'
const group = await accountClient.describeRealmGroup(realmName, groupId)

group.name = 'WhiteWalkers'
group.attributes.status = 'undead'
group.attributes.temperature = 'cold'
await accountClient.updateRealmGroup(realmName, group)
```

**List groups in a realm**

```js
const realmName = 'westeros'
const groups = await accountClient.listRealmGroups(realmName)
```

**Delete a realm group**

```js
const realmName = 'westeros'
const groupId = '000000000000-0000-0000-0000-00000000'
await accountClient.deleteRealmGroup(realmName, groupId)
```

**Create a realm role**

```js
const realmName = 'westeros'
const myNewRole = {
  name: 'NightsWatch',
  description: 'Offer protection from northern baddies.',
}
const role = await accountClient.createRealmRole(realmName, myNewRole)
```

**Fetch an existing realm role**

```js
const realmName = 'westeros'
const roleId = '000000000000-0000-0000-0000-00000000'
const role = await accountClient.describeRealmRole(realmName, roleId)
```

**Update a realm role**

```js
const realmName = 'westeros'
const roleId = '000000000000-0000-0000-0000-00000000'
const role = await accountClient.describeRealmRole(realmName, roleId)

role.name = 'WhiteWalkers'
role.description = 'Updated'
await accountClient.updateRealmRole(realmName, role)
```

**List roles in a realm**

```js
const realmName = 'westeros'
const roles = await accountClient.listRealmRoles(realmName)
```

**Delete a realm role**

```js
const realmName = 'westeros'
const roleId = '000000000000-0000-0000-0000-00000000'
await accountClient.deleteRealmRole(realmName, roleId)
```

**Create a new realm application role**

```js
const realmName = 'westeros'
const applicationId = '000000000000-0000-0000-0000-00000000'
const myNewRole = {
  name: 'NightsWatch',
  description: 'Offer protection from northern baddies.',
}
const role = await accountClient.createRealmApplicationRole(realmName, applicationId, myNewRole)
```

**Fetch an existing realm application role**

```js
const realmName = 'westeros'
const applicationId = '000000000000-0000-0000-0000-00000000'
const roleName = 'NightsWatch'
const role = await accountClient.describeRealmApplicationRole(realmName, applicationId, roleName)
```

**Update a realm application role**

```js
const realmName = 'westeros'
const applicationId = '000000000000-0000-0000-0000-00000000'
const roleName = 'NightsWatch'
const role = await accountClient.describeRealmApplicationRole(realmName, applicationId, roleName)

const originalRoleName = roleName
role.name = 'WhiteWalkers'
role.description = 'Updated'
await accountClient.updateRealmApplicationRole(realmName, applicationId, originalRoleName, role)
```

**List application roles in a realm**

```js
const realmName = 'westeros'
const applicationId = '000000000000-0000-0000-0000-00000000'
const roles = await accountClient.listRealmApplicationRoles(realmName, applicationId)
```

**Delete a realm application role**

```js
const realmName = 'westeros'
const applicationId = '000000000000-0000-0000-0000-00000000'
const roleName = 'NightsWatch'
await accountClient.deleteRealmApplicationRole(realmName, applicationId, roleName)
```

**List identities in a realm**

```js
const realmName = 'westeros'
// list identities in westeros 10 at a time
const max = 10
const idList = accountClient.listIdentities(realmName, max)
while (!idList.done) {
  const identities = await idList.next()
  for (let identity of identities) {
    console.log(identity.username)
  }
}
// Note: If the value of max is higher than the maximum allowed by the server, idList.next() will only return up to the number of identities allowed by the server
```

**Register an Identity in a Realm**

```js
// Note: Identities should be registered using Tozny's JS SDK (@toznysecure/sdk/node) instead of the account client. The account client's registerIdentity() is intended for internal use.

// Create a token
const token = await accountClient.newRegistrationToken(tokenName, permissions)

// Create a Realm object
const realmName = 'realmName'
const appName = 'account'
const brokerTargetUrl = 'https://id.tozny.com/example/recover'
const apiUrl = 'https://api.e3db.com'
const realm = new Tozny.identity.Realm(
  realmName,
  appName,
  brokerTargetUrl,
  apiUrl
)

// Register Identity
const username = 'user'
identity = await realm.register(
  username,
  'secure-password',
  token.token,
  'email@example.com'
)
```

**Delete Identity from Realm**

```js
// Get the identityId you wish to delete
const identity = accountClient.identityDetails(realmName, username)

// Delete identity
await accountClient.deleteIdentity(realmName, identity.toznyId)
```

**Get details about an identity in a realm**

```js
const realmName = 'westeros'
const username = 'jaime'
// get details about jaime, including roles and groups
const details = accountClient.identityDetails(realmName, username)
for (let group in details.groups) {
  console.log(group.name)
}
for (let realmRole in details.roles.realm) {
  console.log(realmRole.name)
}
// where 'kingGuard' is the name of a client application in the realm
for (let clientRole in details.roles.client.kingGuard) {
  console.log(clientRole.name)
}
```

**Get Identity Group membership**

```js
const identity = await accountClient.identityDetails(realmName, username)
const groupList = await client.groupMembership(realmName, identity.toznyId)
```

**Update Identity Group membership**

```js
const toznyEngineersGroup = await client.createRealmGroup(realmName, {
  name: 'ToznyEngineers',
})
await client.updateGroupMembership(realmName, identityId, {
  groups: [toznyEngineersGroup.id],
})
```

**Join Realm Groups**

```js
const toznyEngineersGroup = await client.createRealmGroup(realmName, {
  name: 'ToznyEngineers',
})
await client.joinGroups(realmName, identityId, {
  groups: [toznyEngineersGroup.id],
})
```

**Leave Realm Groups**

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

**Default Realm Groups**
When a new user is created in a realm they are added to each `defaultRealmGroup` _note: when default realm groups changed existing users groups are not updated_

**List Default Realm Groups**

```js
const groupList = await client.listDefaultRealmGroups(realmName)
```

**Replace Default Realm Groups**

```js
const toznyEngineersGroup = await client.createRealmGroup(realmName, {
  name: 'ToznyEngineers',
})
await client.replaceDefaultRealmGroups(realmName, {
  groups: [toznyEngineersGroup.id],
})
```

**Add Default Realm Groups**

```js
const toznyEngineersGroup = await client.createRealmGroup(realmName, {
  name: 'ToznyEngineers',
})
await client.addDefaultRealmGroups(realmName, {
  groups: [toznyEngineersGroup.id],
})
```

**Remove Default Realm Groups**

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

## Terms of Service

Your use of the Tozny JavaScript SDK must abide by our [Terms of Service](https://tozny.com/tozny-terms-of-service/), as detailed in the linked document.
