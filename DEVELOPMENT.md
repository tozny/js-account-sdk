# Development Guidelines

To contribute to the Tozny Platform Admin JS SDK, review these guidelines carefully.

## Writing Code

### Linting and coding style

Code linting is provided by ES Lint, and coding style is managed with Prettier. Ensure all code is lint free and formatted code before submitting it to the Tozny Platform Admin JS SDK.

### Types

In general, new types need to be added for any API return values. The exception is if the return is a collection of a defined type. In that instance, the return can be an array or typed objects. After defining a new type module, make sure it is added to the index.js file in the `/types/` folder so it is consumable by end users.

### Internal documentation

Internal documentation makes for a significantly superior developer experience when consuming the SDK. Most decent code editors will parse documentation comments and show hints to developers when they use the SDK methods. Newly added code to the SDK must have internal doc comments on all functions and files following the [JS Doc 3 style](https://devdocs.io/jsdoc/). If you work on another function that is missing inline documentation, add it the help out future users of the SDK.

### CommonJS

This SDK is written using CommonJS modules. The source code is the same code that is ultimately consumed via NPM. This is significantly cleaner for consuming libraries than code that goes through transpiling before use. If a consumer needs to compile the code for platforms that do not have the full ES6 feature set used, it can be run through something like webpack, babel, etc. by the consumer.

Most ES6 features are natively supported by the targeted Node versions, but ES6 module support is not generally available yet. Use the [node.green](https://node.green/) table to check if you are unsure if a feature is natively supported, and [CanIUse](https://caniuse.com/) to check for native browser support.

## Testing

Testing is with [Jest](https://jestjs.io/) and requires a version of Tozny Platform to run against. For any new endpoints make sure critical paths are added to the test matrix.

It is better to test locally as account cleanup is not currently available so testing creates new accounts in the environments used. With a local version, the entire install can be thrown away easily rather than a deployed environment.

### Test Integration environment

Test run against an instance of the Tozny API located at the value of the [env variable `API_URL`](./.env). By default this is set to run against a local instance of Tozny platform, but can be pointed at any deployed Tozny platform (i.e. `https://api.e3db.com` for the SaaS environment).

### Test Commands

Run all tests

```bash
npm run test
```

Run a specific test file

```bash
npm test -i realm.test.js
```

Run a specific test in a specific file

```bash
npm test -- -i realm.test.js -t 'can create a realm'
```

Run any tests containing a phrase in any file

```bash
npm test -- -t 'realm'
```

## NPM Link

To use this repo with npm link, for faster development iterations, do the npm link operations as normal

```
// within this locally checked out repo
$ npm link

// where you want to link the package
$ npm link @toznysecure/account-sdk
```

then the easiest way to proceed if you run into validation errors is to comment out these validation functions from src/utils/index.js

```
function validatePlatformSDK(sdk) {
  //   if (!(sdk instanceof Tozny)) {
  //     throw new Error(
  //       'sdk must be an instance of the Tozny class implementing the correct interface.'
  //     )
  //   }
  return sdk
}

function validateStorageClient(client) {
  if (!(client instanceof StorageClient)) {
    // throw new Error(
    //   'the storage client sent is not an instance of the Storage.Client class'
    // )
  }
  return client
}
```

they will likely fail the equality check because they're seen as 'from two different packages', but shouldn't affect the sdk as long as the the implementor satisfies the proper interface (make sure the js-sdk is at the right version).

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
