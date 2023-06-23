/* eslint-disable camelcase */
const mp = require('../mercadopago.js')
const {
  urlApi
  // MODE,
  // URL_CLIENTE,
  // URL_CLIENTE_PRUEBAS
} = require('../../config.js')

const urlWebHook = urlApi + '/payments/feedback'

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

  let redirectUrl = 'http://localhost:5173/' + 'checkout/'

  if (status === 'approved') {
    redirectUrl += 'successfull'
  } else if (status === 'pending') {
    redirectUrl += 'pending'
  } else if (status === 'rejected') {
    redirectUrl += 'error'
  }

  const queryParams = new URLSearchParams({
    payment_id,
    status,
    merchant_order_id
  })

  return res.redirect(redirectUrl + '?' + queryParams.toString())
}

module.exports = { createOrder, redirectToWebSite }
