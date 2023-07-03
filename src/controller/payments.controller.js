/* eslint-disable camelcase */
const {
  mercadopago: mp,
  configMercadoPago
} = require('../utils/mercadopago.js')
const { User, Product, Order, Suscription } = require('../db/db.js')
const {
  urlApi,
  MODE,
  URL_CLIENTE,
  URL_CLIENTE_PRUEBAS
} = require('../../config.js')
const { CustomError } = require('../utils/customErrors.js')

// Configuración de Nodemailer
const { sendPaymentPendingEmail } = require('../config/nodemailer.js')
const { sendPaymentConfirmationEmail } = require('../config/nodemailer.js')

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

const createSuscription = async (req, res) => {
  const { price, reason, type, idUser } = req.body

  // solo funciona si esta en una url con https,
  // ngrok con usuario autenticado permite hacer pruebas
  // podes remplazar urlApi con la url que te proporcione el mismo
  // recorda que las url son temporales, asi que cambialas cuando termines de trabajar
  const back_url = urlApi + '/payments/confirm-suscription'
  // const back_url =
  //   'https://c2f9-2800-810-4fc-84a8-a549-3be9-b552-4227.ngrok-free.app/api-rentify' +
  //   '/payments/confirm-suscription'

  const payload = {
    reason,
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      currency_id: 'ARS',
      transaction_amount: price
    },
    payer_email: 'test_user_533353129@testuser.com',
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

    console.log(info)

    /*
    {
      additional_info: '',
      auto_return: 'approved',
      back_urls: {
        failure: 'http://localhost:3001/api-rentify/payments/feedback',
        pending: 'http://localhost:3001/api-rentify/payments/feedback',
        success: 'http://localhost:3001/api-rentify/payments/feedback'
      },
      binary_mode: false,
      client_id: '5756748749183069',
      collector_id: 1396294482,
      coupon_code: null,
      coupon_labels: null,
      date_created: '2023-06-30T13:51:45.001-04:00',
      date_of_expiration: null,
      expiration_date_from: null,
      expiration_date_to: null,
      expires: false,
      external_reference: '',
      id: '1396294482-6c28cdc9-ff17-43d6-8c26-2b796dd5edee',
      init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1396294482-6c28cdc9-ff17-43d6-8c26-2b796dd5edee',
      internal_metadata: null,
      items: [
        {
          id: '',
          category_id: '',
          currency_id: 'ARS',
          description: '',
          title: 'lata',
          quantity: 2,
          unit_price: 1234
        }
      ],
      marketplace: 'NONE',
      marketplace_fee: 0,
      metadata: {},
      notification_url: null,
      operation_type: 'regular_payment',
      payer: {
        phone: { area_code: '', number: '' },
        address: { zip_code: '', street_name: '', street_number: null },
        email: '',
        identification: { number: '', type: '' },
        name: '',
        surname: '',
        date_created: null,
        last_purchase: null
      },
      payment_methods: {
        default_card_id: null,
        default_payment_method_id: null,
        excluded_payment_methods: [ [Object] ],
        excluded_payment_types: [ [Object] ],
        installments: null,
        default_installments: null
      },
      processing_modes: null,
      product_id: null,
      redirect_urls: { failure: '', pending: '', success: '' },
      sandbox_init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1396294482-6c28cdc9-ff17-43d6-8c26-2b796dd5edee',
      site_id: 'MLA',
      shipments: {
        default_shipping_method: null,
        receiver_address: {
          zip_code: '',
          street_name: '',
          street_number: null,
          floor: '',
          apartment: '',
          city_name: null,
          state_name: null,
          country_name: null
        }
      },
      total_amount: null,// no se actualiza hasta que se ingresa a pagar, por eso el calculo se tiene que hacer a parte o despues de comprar
      last_updated: null
    }
    */

    const newOrder = await Order.create({ preferenceId: info.id })
    await newOrder.setUser(user)

    console.log('items:', items)

    // Nodemailer
    // const preference = await mp.preferences.findByPk(info.id)
    // const paymentStatus = preference.status
    // const itemCount = items.length
    const totalAmount = items.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0
    )
    await sendPaymentPendingEmail(
      user.email,
      totalAmount,
      items.length,
      'pending'
    )

    console.log('correo enviado')

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
  res.redirect(
    redirectUrl + '?' + new URLSearchParams({ preapproval_id }).toString()
  )
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
    const { response: preference } = await mp.preferences.findById(
      preference_id
    )

    console.log(payment)

    let hasFound = await Order.findOne({
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
    hasFound = hasFound.toJSON()
    const user = await User.findByPk(hasFound.idUser)

    if (payment.status === 'approved') {
      const idProds = preference.items?.map((item) => item.id)
      let promise = idProds.map((idProd) => Product.findByPk(idProd))
      const products = await Promise.all(promise)

      promise = products.map((product) =>
        user.addProduct(product, { through: { type: 'renter' } })
      )

      await Promise.all(promise)
    }
    console.log(user)
    /* esto es lo que devuelve user.toJSON()
    {
      idUser: 'd89a1a1c-c415-4a38-9f22-d5e4fbe34a21',
      name: '',
      email: 'victormas208@outlook.com',
      phone: null,
      image: null,
      membership: 'basic',
      status: 'active',
      uid: 'gdjbJnIEBUPHl7NNXi7Mj0JYDLW2',
      role: 'user',
      createdAt: 2023-06-30T15:28:15.747Z,
      updatedAt: 2023-06-30T15:28:15.747Z
    }
    */
    // Nodemailer
    if (payment.status !== 'pending') {
      // Enviar correo de confirmación de pago
      const userEmail = user.email
      const paymentAmount = payment.transaction_amount
      const itemCount = payment.additional_info.items.length

      await sendPaymentConfirmationEmail(userEmail, paymentAmount, itemCount)
    }

    console.log(payment)
    /* esto es lo que devuelve payment
      {
        accounts_info: null,
        acquirer_reconciliation: [],
        additional_info: {
          authentication_code: null,
          available_balance: null,
          ip_address: '181.45.123.217',
          items: [ [Object] ],
          nsu_processadora: null
        },
        authorization_code: null,
        barcode: {
          content: '3335008800000000006003601106101594500231810310',
          height: 30,
          type: 'Code128C',
          width: 1
        },
        binary_mode: false,
        brand_id: null,
        build_version: '3.5.0-rc-2',
        call_for_authorize_id: null,
        captured: true,
        card: {},
        charges_details: [],
        collector_id: 1396294482,
        corporation_id: null,
        counter_currency: null,
        coupon_amount: 0,
        currency_id: 'ARS',
        date_approved: null,
        date_created: '2023-06-30T13:37:54.295-04:00',
        date_last_updated: '2023-06-30T13:37:54.295-04:00',
        date_of_expiration: '2023-07-03T22:59:59.000-04:00',
        deduction_schema: null,
        description: 'TEsting',
        differential_pricing_id: null,
        external_reference: null,
        fee_details: [],
        financing_group: null,
        id: 1316173857,
        installments: 1,
        integrator_id: null,
        issuer_id: '11',
        live_mode: false,
        marketplace_owner: null,
        merchant_account_id: null,
        merchant_number: null,
        metadata: {},
        money_release_date: null,
        money_release_schema: null,
        money_release_status: null,
        notification_url: null,
        operation_type: 'regular_payment',
        order: { id: '10132931975', type: 'mercadopago' },
        payer: { // no estamos usando esto pero se puede usar a futuro
          first_name: null,
          last_name: null,
          email: 'test_user_80507629@testuser.com',
          identification: { number: '32659430', type: 'DNI' },
          phone: { area_code: null, number: null, extension: null },
          type: null,
          entity_type: null,
          id: '1396294720'
        },
        payment_method: {
          data: {},
          forward_data: { agreement_number: '', ticket_number: '' },
          id: 'pagofacil',
          issuer_id: '11',
          type: 'ticket'
        },
        payment_method_id: 'pagofacil',
        payment_type_id: 'ticket',
        platform_id: null,
        point_of_interaction: {
          business_info: { sub_unit: 'checkout_pro', unit: 'online_payments' },
          transaction_data: { e2e_id: null },
          type: 'CHECKOUT'
        },
        pos_id: null,
        processing_mode: 'aggregator',
        refunds: [],
        shipping_amount: 0,
        sponsor_id: null,
        statement_descriptor: null,
        status: 'pending',
        status_detail: 'pending_waiting_payment',
        store_id: null,
        tags: null,
        taxes_amount: 0,
        transaction_amount: 15945,
        transaction_amount_refunded: 0,
        transaction_details: {
          acquirer_reference: '',
          external_resource_url: 'https://www.mercadopago.com.ar/sandbox/payments/1316173857/ticket?caller_id=1396294720&payment_method_id=pagofacil&payment_id=1316173857&payment_method_reference_id=6003601106&hash=f6e8b26e-7df3-4017-886b-288eda3c7d33',
          financial_institution: '',
          installment_amount: 0,
          net_received_amount: 0,
          overpaid_amount: 0,
          payable_deferral_period: null,
          payment_method_reference_id: '6003601106',
          total_paid_amount: 15945,
          verification_code: '6003601106'
        }
      }
    */

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
      hasSuscription.status = info.status
      hasSuscription.save()
    }

    if (hasSuscription.toJSON().status === 'authorized') {
      await User.update(
        { membership: hasSuscription.type },
        { where: { idUser: hasSuscription.idUser } }
      )
    }

    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
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
