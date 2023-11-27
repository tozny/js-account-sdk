const Tozny = require('@toznysecure/sdk/lib/tozny')
const StorageClient = require('@toznysecure/sdk/lib/storage/client')

// TODO: Use a more globally accessible version of this helper...
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const statusTexts = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    // Add more status codes and default texts as needed
  }
  if (
    response.statusText === '' ||
    response.statusText === 'Internal Server Error'
  ) {
    response.statusText = statusTexts[response.status] || 'Unknown Error'
  }

  let error
  if (response.status >= 500 && response.status < 600) {
    // Server error
    error = new Error('Server Error')
  } else {
    error = new Error(response.statusText)
  }

  error.response = response
  throw error
}

function validateRequestAsJSON(response) {
  return checkStatus(response).json()
}

function validatePlatformSDK(sdk) {
  if (!(sdk instanceof Tozny)) {
    throw new Error(
      'sdk must be an instance of the Tozny class implementing the correct interface.'
    )
  }
  return sdk
}

function validateStorageClient(client) {
  if (!(client instanceof StorageClient)) {
    throw new Error(
      'the storage client sent is not an instance of the Storage.Client class'
    )
  }
  return client
}

function validateEmail(inputEmail) {
  const acceptableEmail =
    /^[a-zA-Z0-9+_.,-]+@([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/
  const email = acceptableEmail.test(inputEmail.trim())
  if (!email) {
    throw new Error(`${inputEmail} is not an acceptable email address`)
  }
  return email
}

module.exports = {
  checkStatus,
  validateRequestAsJSON,
  validatePlatformSDK,
  validateStorageClient,
  validateEmail,
}
