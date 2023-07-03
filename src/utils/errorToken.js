/* eslint-disable no-useless-computed-key */
const errorsToken = (message) => {
  const errors = {
    ['jwt malformed']: 'Invalid token format',
    ['invalid token']: 'invalid token',
    ['jwt expired']: 'expired token',
    ['invalid signature']: 'The token signature is not valid',
    ['No Bearer']: 'Use the Bearer format',
    ['No token']: 'No token sent'
  }

  return errors[message]
    ? errors[message]
    : 'An unexpected error occurred in token validation'
}

module.exports = { errorsToken }
