
const Tozny = require('e3db-client-interface').default
const { Storage } = require('e3db-client-interface')

console.log(Tozny)

// TODO: Use a more globally accessible version of this helper...
function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  let error = new Error(response.statusText)
  error.response = response
  throw error
}

function validateRequestAsJSON (response) {
  return checkStatus(response).json()
}

function validatePlatformSDK(sdk) {
  if ( ! sdk instanceof Tozny ) {
    throw new Error('sdk must be an instance of the Tozny class implementing the correct interface.')
  }
  return sdk
}

function validateStorageClient(client) {
  if ( ! client instanceof Storage.Client ) {
    throw new Error('the storage client sent is not an instance of the Storage.Client class')
  }
  return client
}

function validateEmail(inputEmail) {
  const acceptableEmail = /^[a-zA-Z0-9+_.,-]+@([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/
  const email = acceptableEmail.test(inputEmail.trim())
  if (!email) {
    throw new Error(`${ipnutEmail} is not an acceptable email address`)
  }
  return email
}

module.exports = {
  checkStatus,
  validateRequestAsJSON,
  validatePlatformSDK,
  validateStorageClient,
  validateEmail
}
