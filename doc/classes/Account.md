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
- [completeLogin](Account.md#completelogin)
- [fromObject](Account.md#fromobject)
- [initiateRecoverAccount](Account.md#initiaterecoveraccount)
- [login](Account.md#login)
- [loginWithMFA](Account.md#loginwithmfa)
- [register](Account.md#register)
- [verifyEmail](Account.md#verifyemail)
- [verifyRecoverAccountChallenge](Account.md#verifyrecoveraccountchallenge)
- [verifyTotp](Account.md#verifytotp)
- [verifyWebAuthn](Account.md#verifywebauthn)

## Constructors

### constructor

• **new Account**(`sdk`, `apiUrl?`)

Creates an Account object mixing the SDK and API URL together.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `sdk` | `Tozny` | `undefined` | An instance of a Tozny client SDK. |
| `apiUrl` | `string` | `DEFAULT_API_URL` | The URL of the Tozny Platform instance to connect to. |

#### Defined in

account.ts:31

## Accessors

### Identity

• `get` **Identity**(): `any`

Gets the Tozny Identity constructor provided by the Tozny client SDK.

#### Returns

`any`

#### Defined in

account.ts:59

___

### Storage

• `get` **Storage**(): `any`

Gets the Tozny Storage constructor provided by the Tozny client SDK.

#### Returns

`any`

The Storage constructor

#### Defined in

account.ts:50

___

### crypto

• `get` **crypto**(): `Crypto`

gets the current crypto implementation provided by the Tozny client SDK.

#### Returns

`Crypto`

#### Defined in

account.ts:41

___

### toznyTypes

• `get` **toznyTypes**(): `object`

Gets the Tozny types defined in the Tozny client SDK.

#### Returns

`object`

All of the Tozny client SDK defined types.

#### Defined in

account.ts:68

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

account.ts:415

___

### completeLogin

▸ **completeLogin**(`username`, `sigKeys`, `encKey`, `profile`): `Promise`<[`Client`](Client.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `username` | `any` |
| `sigKeys` | `any` |
| `encKey` | `any` |
| `profile` | `any` |

#### Returns

`Promise`<[`Client`](Client.md)\>

#### Defined in

account.ts:229

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

account.ts:556

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

account.ts:393

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

account.ts:81

___

### loginWithMFA

▸ **loginWithMFA**(`username`, `password`, `type?`): `Promise`<`any`\>

Use the normal login flow to create a connection to a Tozny account.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `username` | `string` | `undefined` | The username for the account. |
| `password` | `string` | `undefined` | The secret password for the account. |
| `type` | `string` | `'standard'` | Either standard or paper depending on the password type. |

#### Returns

`Promise`<`any`\>

??

#### Defined in

account.ts:180

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

account.ts:270

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

account.ts:540

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

account.ts:404

___

### verifyTotp

▸ **verifyTotp**(`username`, `sigKeys`, `challenge`, `totp`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `username` | `any` |
| `sigKeys` | `any` |
| `challenge` | `any` |
| `totp` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

account.ts:217

___

### verifyWebAuthn

▸ **verifyWebAuthn**(`username`, `payload`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `username` | `any` |
| `payload` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

account.ts:223
