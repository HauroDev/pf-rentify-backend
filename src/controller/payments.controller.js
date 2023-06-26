/* eslint-disable camelcase */
const { mercadopago: mp, configMercadoPago } = require('../mercadopago.js')
const {
  urlApi,
  MODE,
  URL_CLIENTE,
  URL_CLIENTE_PRUEBAS
} = require('../../config.js')

const urlWebHook = urlApi + '/payments/feedback'

const verificationCountryMercadoPago = (req, res, next) => {
  // const { idCountry } = req.body // por defecto el idCountry es 1 en configMercadoPago

  configMercadoPago() // cuando este habilitado en el front la seleccion de paises, entonces se podra hacer esto
    .then(() => next())
    .catch((e) => res.status(e?.status || 500).json({ error: e.message }))
}

const createOrder = async (req, res) => {
  const { items } = req.body

  try {
    const info = await mp.preferences.create({
      items,
      back_urls: {
        pending: urlWebHook,
        failure: urlWebHook,
        success: urlWebHook
      },
      auto_return: 'approved'
    })

    console.log(info)

    res.json({ preferenceId: info.body.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const redirectToWebSite = (req, res) => {
  const { payment_id, status, merchant_order_id } = req.query

  let redirectUrl = MODE === 'PRODUCTION' ? URL_CLIENTE : URL_CLIENTE_PRUEBAS
  // let redirectUrl = URL_CLIENTE_PRUEBAS
  redirectUrl += '/checkout'

  if (status === 'approved') {
    redirectUrl += '/successfull'
  } else if (status === 'pending') {
    redirectUrl += '/pending'
  } else if (status === 'rejected') {
    redirectUrl += '/error'
  }

  const queryParams = new URLSearchParams({
    payment_id,
    status,
    merchant_order_id
  })

  return res.redirect(redirectUrl + '?' + queryParams.toString())
}

module.exports = {
  verificationCountryMercadoPago,
  createOrder,
  redirectToWebSite
}
