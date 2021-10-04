# Development Guidelines

To contribute to the Tozny Platform Admin JS SDK, review these guidelines carefully.

## Writing Code

### Linting and coding style

Code linting is provided by ES Lint, and coding style is managed with Prettier. Ensure all code is lint free and formatted code before submitting it to the Tozny Platform Admin JS SDK.

In addition to automated linting, some things should be kept in mind when designing new APIs:
* use `camelCase` for all object keys
  * though the underlying web api uses snake_case, we should do our best to not expose this in our js abstraction. we've adopted camelCase as our coding style, and we should avoid mixing case types whenever possible. camelCase should be converted to snake_case at the request layer, and responses should be converted back to camelCase before being returned.

### Types

In general, new types need to be added for any API return values. The exception is if the return is a collection of a defined type. In that instance, the return can be an array or typed objects. After defining a new type module, make sure it is added to the index.js file in the `/types/` folder so it is consumable by end users.

### Internal documentation

Internal documentation makes for a significantly superior developer experience when consuming the SDK. Most decent code editors will parse documentation comments and show hints to developers when they use the SDK methods. Newly added code to the SDK must have internal doc comments on all functions and files following the [JS Doc 3 style](https://devdocs.io/jsdoc/). If you work on another function that is missing inline documentation, add it the help out future users of the SDK.

### Migration to Typescript

Originally, this project used vanilla ES6 javascript that is natively available in Node 6+. Beginning in July 2021, we started a process of migrating to typescript for the added type safety and error checking. Transition to to typescript is a work in progress. All new code added to this library should be written in typescript. Existing modules are converted as needed.

Source code in `src/` is compiled from ts/js to ES6 js in `dist/`. The compiled files are committed into source control in an effort to allow consumers to install only production dependencies. The `package.json` points to `dist/index.js`, so no build/compilation on install is required. Eventually this might not be the case (see below), but for now **you must compile the code & commit the compiled code in `dist`.

To compile updated or altered code from js/ts to the build directory, ensure all build dependencies are installed:
```sh
npm i
```
and compile code with
```sh
npm run build
```

The javascript target of our typescript compilation is ES6 for backwards compatibility. Most ES6 features are natively supported by the targeted Node versions, but ES6 module support is not generally available yet. Use the [node.green](https://node.green/) table to check if you are unsure if a feature is natively supported, and [CanIUse](https://caniuse.com/) to check for native browser support.


#### TS Migration Path
The migration is an iterative process of betterment! Here's a rough sketch of the goal of migration:

* **Version 0** (You are here) - we as a team can develop in typescript. New code can be written in ts & be imported into existing js files. Code gets compiled and the compiled files are committed to source control for outside consumption.
* **Verison 0.5** - migration of existing js is completed. most of this work can be accomplished with automated code tools: a combination of [`5to6`](https://github.com/5to6/5to6-codemod) (for migrating `require`/`module` -> `import`/`export`) & [`ts-migrate`](https://github.com/airbnb/ts-migrate). if not this, simply creating `*.d.ts` declarations for our js code would go a long way for external consumption.
* **Version 1** - typescript files are built on install & `dist` is removed from source code tracking. this allows external applications written in typescript to have the type safety guaranteed by our library being in ts.

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

if these checks fail it is likely because you have installed node_modules in this repository. due to node package resolution, `Tozny` & `StorageClient` are loaded from this internal node_modules folder but the instances being passed in are coming from the parent project's `sdk`. they are thus 'two different packages' despite likely being the same. this shouldn't affect the sdk as long as the the implementor satisfies the proper interface (make sure the js-sdk is at the right version).

## Publishing

Checkout branch

Write code

Ensure you have compiles source code into `dist`

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
