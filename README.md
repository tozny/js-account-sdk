# Tozny JS Account SDK

Javascript SDK for performing Tozny platform account level operations

## Approach

The Tozny platform client SDKs abstract over working with the Tozny platform as a client. In addition to client level operations, Tozny offers endpoints which perform various account level operations—they control how the overall account operates. This functionality is only useful to a very small subset of Tozny clients. For this reason it does not make sense to ship the full set of account operation in the client SDK. It also does not make sense to rewrite all of the request handling and cryptographic operations in another SDK for handling account operations. Especially as different cryptographic methods and target are defined. To reconcile this, the account SDK in this repository consumes a valid instance of a Tozny client implementation and layers functionality on top of it enabling account level operations. This allows the crypto to remain context specific while the account operations are defined in a single package.

### ES6

To avoid the complexity of babel, and the need to 'build' the code with each change, this repository is built using only the ES6 features that are natively available in Node 6+. This means that you will not find `import` syntax in the source files, but as of yet ES6 modules is the only ES6 feature that has been noticeably missing. Debugging the SDK is significantly easier when not transpiling the code using Babel. It als means we don't use generators for things like async/await, meaning the overall source package size is smaller.

When a consumer adds the package to a web application, the application will make use of something like babel and webpack to prepare the application. It is better to allow the application to manage the build settings. Otherwise Babel is running over code that has already run through babel, which then runs through Webpack. Using natively available node features only we avoid the headache.

## Getting Started

To use the SDK, first require it as well as a tozny client SDK pacakge.

```bash
npm install @tozny/account-sdk@alpha
npm install tozny-node-sdk@alpha
```

Create a new Account connection object -- this defines the API and specific client SDK in use.

```
const const { Account } = require('./src')
const Tozny = require('tozny-node-sdk').default

const account = new Account(Sodium, 'http://platform.local.tozny.com:8000')
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
    const client = await account.login(email, password)
    accountClient = client
  }
  return accountClient
}

async doAccountActions() {
  const client = await getClient()
  const first = await client.doSomeAction()
  return client.doSomeOtherAction(first)
}

doAccountActions()
```

This caches the client connection in a scope variable so it doesn't need to log in each time. Application methods can then use the client whenever they need to run account-level transactions.

## Account Clients

Account Clients provide managed access to account level operations. The actual HTTP request sequence, authentication method, etc. is hidden behind the higher level methods. This allows us to maintain a consistent API for use in account applications and change implementation details as needed (e.g. a new endpoint, a different auth method, etc.). These higher level methods should correspond with specific account actions (e.g. `createWebHook`, etc). The parameters will provide insight into what is required to perform those operations.

## Publishing

Checkout branch

Write code

Get code reviewed and approved

Use the npm build tool to automatically update package.json to the new version

```bash
# mainline release
npm version 1.0.1
# preview release
npm version 1.0.1-alpha.1
```

Use the npm build tool to make a new commit with the updated version, create a git tag to have as a github release, and push the package to npm for consumption

```bash
npm publish
```

If doing an alpha release,

```bash
npm publish --tag=alpha
```

Push the tag up to remote github repository

```bash
git push --tags --all
```

Lastly, merge and delete the branch
