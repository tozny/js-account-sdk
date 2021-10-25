[@toznysecure/account-sdk](../README.md) / [Exports](../modules.md) / Account

# Class: Account

Account creates connections to a specific Tozny account

Mixing together a Tozny client SDK and an API URL, various methods for creating
an account level connection are made available. Each method returns an
account Client, which represents an active connection to the API for a
specific account. Actual account operations are performed using the returned
account Client.

## Table of contents

### Constructors

- [constructor](Account.md#constructor)

### Accessors

- [Identity](Account.md#identity)
- [Storage](Account.md#storage)
- [crypto](Account.md#crypto)
- [toznyTypes](Account.md#toznytypes)

### Methods

- [changeAccountPassword](Account.md#changeaccountpassword)
- [fromObject](Account.md#fromobject)
- [initiateRecoverAccount](Account.md#initiaterecoveraccount)
- [login](Account.md#login)
- [register](Account.md#register)
- [verifyEmail](Account.md#verifyemail)
- [verifyRecoverAccountChallenge](Account.md#verifyrecoveraccountchallenge)

## Constructors

### constructor

• **new Account**(`sdk`, `apiUrl?`)

Creates an Account object mixing the SDK and API URL together.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `sdk` | `any` | `undefined` | An instance of a Tozny client SDK. |
| `apiUrl` | `string` | `DEFAULT_API_URL` | The URL of the Tozny Platform instance to connect to. |

#### Defined in

[account.ts:30](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L30)

## Accessors

### Identity

• `get` **Identity**(): `Function`

Gets the Tozny Identity constructor provided by the Tozny client SDK.

#### Returns

`Function`

#### Defined in

[account.ts:58](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L58)

___

### Storage

• `get` **Storage**(): `Function`

Gets the Tozny Storage constructor provided by the Tozny client SDK.

#### Returns

`Function`

The Storage constructor

#### Defined in

[account.ts:49](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L49)

___

### crypto

• `get` **crypto**(): `Crypto`

gets the current crypto implementation provided by the Tozny client SDK.

#### Returns

`Crypto`

#### Defined in

[account.ts:40](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L40)

___

### toznyTypes

• `get` **toznyTypes**(): `object`

Gets the Tozny types defined in the Tozny client SDK.

#### Returns

`object`

All of the Tozny client SDK defined types.

#### Defined in

[account.ts:67](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L67)

## Methods

### changeAccountPassword

▸ **changeAccountPassword**(`password`, `accountToken`): `Promise`<`object`\>

Chance the account password to a new one with an account token.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` | The new password to set for the account. |
| `accountToken` | `string` | The token for making account requests. |

#### Returns

`Promise`<`object`\>

An object with the new queen client and paper key.

#### Defined in

[account.ts:325](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L325)

___

### fromObject

▸ **fromObject**(`obj`): [`Client`](Client.md)

Recreate an account client from one that was serialized to JSON.

After calling `Client.serialize()` plain javascript object is created with
all of the values needed to recreate that client. This can be safely stored
as JSON. This method is used to turn the object created by `Client.serialize()`
back into a Client instance with all of the available methods.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `object` | The serialized object created from an existing account client. |

#### Returns

[`Client`](Client.md)

A new Client created with all provided values from the object.

#### Defined in

[account.ts:466](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L466)

___

### initiateRecoverAccount

▸ **initiateRecoverAccount**(`email`): `Promise`<`any`\>

Begin to recover lost account access.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | The email address associate with the account. |

#### Returns

`Promise`<`any`\>

#### Defined in

[account.ts:303](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L303)

___

### login

▸ **login**(`username`, `password`, `type?`): `Promise`<[`Client`](Client.md)\>

Use the normal login flow to create a connection to a Tozny account.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `username` | `string` | `undefined` | The username for the account. |
| `password` | `string` | `undefined` | The secret password for the account. |
| `type` | `string` | `'standard'` | Either standard or paper depending on the password type. |

#### Returns

`Promise`<[`Client`](Client.md)\>

The Client instance for the provided credentials.

#### Defined in

[account.ts:80](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L80)

___

### register

▸ **register**(`name`, `email`, `password`): `Promise`<`object`\>

Creates a new account using the credentials provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name to use for the account. |
| `email` | `string` | The email address for the account. |
| `password` | `string` | The secret password for the account. |

#### Returns

`Promise`<`object`\>

An object containing the paper key generated at and
                          `object[paperKey]` and the client instance associated
                          with the new client at `object[client]`.

#### Defined in

[account.ts:180](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L180)

___

### verifyEmail

▸ **verifyEmail**(`id`, `otp`): `Promise`<`any`\>

Requests email verification for a Tozny account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id to identify the otp challenge |
| `otp` | `string` | otp secret to authenticate the challenge |

#### Returns

`Promise`<`any`\>

response

#### Defined in

[account.ts:450](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L450)

___

### verifyRecoverAccountChallenge

▸ **verifyRecoverAccountChallenge**(`id`, `otp`): `Promise`<`any`\>

Verify the recovery challenge information.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The recovery challenge ID |
| `otp` | `string` | The recovery one time password for recovery |

#### Returns

`Promise`<`any`\>

The recovery object for the account

#### Defined in

[account.ts:314](https://github.com/tozny/js-account-sdk/blob/330b749/src/account.ts#L314)
