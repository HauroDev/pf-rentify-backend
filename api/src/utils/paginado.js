const { MODE, URL_PRUEBAS, URL_DEPLOY } = require('../../config.js')

const obtenerNextPageProduct = (
  posicionPorPagina,
  limitePorPagina,
  limiteCantidad
) => {
  const offset = posicionPorPagina + limitePorPagina
  const limit = limitePorPagina

  return offset < limiteCantidad
    ? `${
        MODE === 'PRODUCTION' ? URL_DEPLOY : URL_PRUEBAS
      }/api-rentify/products?offset=${offset}&limit=${limit}`
    : null
}

module.exports = { obtenerNextPageProduct }
