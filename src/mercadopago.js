const mercadopago = require('mercadopago')
const { MP_ACCESS_TOKEN } = require('../config')

mercadopago.configure({
  access_token: MP_ACCESS_TOKEN
})

module.exports = mercadopago
