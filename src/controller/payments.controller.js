/* eslint-disable camelcase */
const { mercadopago: mp, configMercadoPago } = require('../mercadopago.js')
const { User, Order, Suscription } = require('../db/db.js')
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
  const { email, price, reason, type, idUser } = req.body

  const back_url = urlApi + '/payments/confirm-suscription'

  const payload = {
    reason,
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      currency_id: 'ARS',
      transaction_amount: price
    },
    payer_email: email,
    back_url,
    status: 'pending'
  }

  try {
    const allowedTypes = ['standard', 'premium']

    if (!type) throw new CustomError(400, 'type is required')

    if (!allowedTypes.includes(type)) {
      throw new CustomError(400, 'type should be standard or premium')
    }

    const user = await User.findByPk(idUser)

    if (!user) throw new CustomError(404, 'user is not exists')

    const { body: suscript } = await mp.preapproval.create(payload)

    const newSuscription = await Suscription.create({
      preApprovalId: suscript.id,
      status: suscript.status,
      type
    })

    await newSuscription.setUser(user)

    res.json({ url: suscript.init_point })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createOrder = async (req, res) => {
  const { items, idUser } = req.body

  try {
    const user = await User.findByPk(idUser)

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

    const newOrder = await Order.create({ preferenceId: info.id })
    await newOrder.setUser(user)

    res.json({ preferenceId: info.id })
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const redirectToWebSiteCheckOut = (req, res) => {
  const { payment_id, status, merchant_order_id } = req.query

  let redirectUrl = MODE === 'PRODUCTION' ? URL_CLIENTE : URL_CLIENTE_PRUEBAS
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

const redirectToWebSiteHome = (req, res) => {
  const { preapproval_id } = req.query

  const redirectUrl = MODE === 'PRODUCTION' ? URL_CLIENTE : URL_CLIENTE_PRUEBAS
  res.redirect(redirectUrl + '?' + new URLSearchParams({ preapproval_id }))
}

const confirmOrder = async (req, res, next) => {
  const { payment_id, preference_id, merchant_order_id } = req.query

  try {
    if (!preference_id) {
      throw new CustomError(404, 'preference_id is required')
    }

    if (!payment_id) {
      throw new CustomError(400, 'payment_id is null')
    }

    // mercado pago envia su error propio
    const { response: payment } = await mp.payment.findById(payment_id)

    const hasFound = await Order.findOne({
      where: { preferenceId: preference_id }
    })

    if (hasFound) {
      await Order.update(
        {
          merchantOrderId: merchant_order_id,
          paymentId: payment_id,
          status: payment.status
        },
        {
          where: { preferenceId: preference_id }
        }
      )
    }

    next()
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const confirmSuscription = async (req, res, next) => {
  const { preapproval_id } = req.query

  try {
    const { body: info } = await mp.preapproval.findById(preapproval_id)

    const hasSuscription = await Suscription.findOne({
      where: { preApprovalId: preapproval_id }
    })

    if (hasSuscription) {
      await Suscription.update(
        { status: info.status },
        { where: { preApprovalId: preapproval_id } }
      )
    }

    next()
  } catch (error) {
    res.status(500).json({ error })
  }
}

module.exports = {
  verificationCountryMercadoPago,
  createSuscription,
  createOrder,
  redirectToWebSiteCheckOut,
  redirectToWebSiteHome,
  confirmOrder,
  confirmSuscription
}
