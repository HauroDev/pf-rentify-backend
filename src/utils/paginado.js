const { MODE, URL_PRUEBAS, URL_DEPLOY } = require('../../config.js')

const getNextPage = (path, index, limitForPage, countTotal) => {
  const offset = index + limitForPage
  const limit = limitForPage

  return offset < countTotal
    ? `${
        MODE === 'PRODUCTION' ? URL_DEPLOY : URL_PRUEBAS
      }/api-rentify/${path}?offset=${offset}&limit=${limit}`
    : null
}

module.exports = { getNextPage }
