const Account = require('../account')
const Tozny = require('tozny-node-sdk').default
const uuidv4 = require('uuid/v4')

const accountFactory = new Account(Tozny, process.env.API_URL)
const tokenShape = expect.stringMatching(/[0-9a-fA-F]{64}/)
let client = null

beforeAll(async() => {
  const seed = uuidv4()
  const name = `Test Account ${seed}`
  const email = `test+${seed}@tozny.com`
  const password = uuidv4()
  const registration = await accountFactory.register(name, email, password)
  client = registration.client
})

describe('Account Client', () => {
  test('can manage basic tokens', async () => {
    // Ensure the list starts empty
    const list1 = await client.registrationTokens()
    expect(list1.length).toBe(0)
    // Write a single basic token to validate basic write
    const token = await client.newRegistrationToken()
    expect(token.token).toEqual(tokenShape)
    expect(token.name).toBeFalsy()
    // Check the list now has one token which is the token we wrote
    const list2 = await client.registrationTokens()
    expect(list2.length).toBe(1)
    expect(list2[0]).toMatchObject(token)
    // Remove the token and check it has been removed
    const deletion = await client.deleteRegistrationToken(token)
    expect(deletion).toBe(true)
    const list3 = await client.registrationTokens()
    expect(list3.length).toBe(0)
  })

  test('can create a token with a name', async () => {
    const tokenName = uuidv4()
    const token = await client.newRegistrationToken(tokenName)
    expect(token.name).toBe(tokenName)
    expect(token.token).toEqual(tokenShape)
    await client.deleteRegistrationToken(token)
  })

  test('can create a token with specific permissions', async () => {
    const permissions = {one_time: true}
    const token = await client.newRegistrationToken(undefined, permissions)
    expect(token.token).toEqual(tokenShape)
    expect(token.permissions).toMatchObject(permissions)
    await client.deleteRegistrationToken(token)
  })

  test('can create a token a use count', async () => {
    const token = await client.newRegistrationToken(undefined, {}, 2)
    expect(token.token).toEqual(tokenShape)
    expect(token.totalUsesAllowed).toBe(2)
    await client.deleteRegistrationToken(token)
  })
})
