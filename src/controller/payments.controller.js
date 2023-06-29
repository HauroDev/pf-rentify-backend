/* eslint-disable camelcase */
const { mercadopago: mp, configMercadoPago } = require('../mercadopago.js')
const { User, Order } = require('../db/db.js')
const {
  urlApi,
  MODE,
  URL_CLIENTE,
  URL_CLIENTE_PRUEBAS
} = require('../../config.js')
const { CustomError } = require('../utils/customErrors.js')

const urlWebHook = urlApi + '/payments/feedback'

const verificationCountryMercadoPago = (req, res, next) => {
  // const { idCountry } = req.body // por defecto el idCountry es 1 en configMercadoPago

  configMercadoPago() // cuando este habilitado en el front la seleccion de paises, entonces se podra hacer esto
    .then(() => next())
    .catch((e) => {
      console.log(e)
      res.status(e?.status || 500).json({ error: e.message })
    })
}

// agregar propiedad type, para identificar y guardad en la db el tipo de suscription del usuario

const createSuscription = async (req, res) => {
  const { email, price, backUrl, reason } = req.body

  const payload = {
    reason,
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      currency_id: 'ARS',
      transaction_amount: price
    },
    payer_email: email,
    back_url: backUrl,
    status: 'pending'
  }

  try {
    const suscription = await mp.preapproval.create(payload)
    res.json({ url: suscription.body.init_point })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createOrder = async (req, res) => {
  const { items, idUser } = req.body

  try {
    const user = await User.findByPk(idUser)

    console.log(idUser)

    console.log(user)

    if (!user) throw new CustomError(404, 'user not exist')

    const { response: info } = await mp.preferences.create({
      items,
      back_urls: {
        pending: urlWebHook,
        failure: urlWebHook,
        success: urlWebHook
      },
      auto_return: 'approved'
    })

    console.log(idUser)

    const newOrder = await Order.create({ preferenceId: info.id })
    await newOrder.setUser(user)

    res.json({ preferenceId: info.id })
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
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
  createSuscription,
  createOrder,
  redirectToWebSite
}
