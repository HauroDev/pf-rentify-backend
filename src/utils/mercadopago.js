/* eslint-disable camelcase */
const { Country } = require('../db/db.js')
const mercadopago = require('mercadopago')
const {
  MP_ACCESS_TOKEN_AR,
  MP_ACCESS_TOKEN_CO,
  MP_ACCESS_TOKEN_PE,
  MP_ACCESS_TOKEN_CL,
  MP_ACCESS_TOKEN_MX,
  MP_ACCESS_TOKEN_BR,
  MP_ACCESS_TOKEN_UY
} = require('../../config.js')
const { CustomError } = require('./customErrors.js')

const configMercadoPago = async (idCountry = 1) => {
  const country = await Country.findByPk(idCountry)

  if (!country) throw new CustomError(404, 'idCountry no existente')

  let access_token

  switch (country.currency.code) {
    case 'COP':
      access_token = MP_ACCESS_TOKEN_CO
      break
    case 'PEN':
      access_token = MP_ACCESS_TOKEN_PE
      break
    case 'CLP':
      access_token = MP_ACCESS_TOKEN_CL
      break
    case 'MXN':
      access_token = MP_ACCESS_TOKEN_MX
      break
    case 'BRL':
      access_token = MP_ACCESS_TOKEN_BR
      break
    case 'UYU':
      access_token = MP_ACCESS_TOKEN_UY
      break
    case 'ARS':
    default:
      access_token = MP_ACCESS_TOKEN_AR
  }
  mercadopago.configure({ access_token })
}

module.exports = { configMercadoPago, mercadopago }
