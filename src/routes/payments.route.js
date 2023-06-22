/* eslint-disable camelcase */
const { Router } = require('express')
const mp = require('../mercadopago.js')
const { urlApi } = require('../../config.js')

const router = Router()

const urlWebHook = urlApi + '/payments/feedback'

/**
 * @swagger
 * components:
 *   schemas:
 *    Order:
 *      type: object
 *      properties:
 *        items:
 *          type: array
 *      required:
 *        - items
 *    Item:
 *      type:
 */
router.post('/order', async (req, res) => {
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

    res.json(info)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get(
  '/feedback',
  async (req, res, next) => {
    const { payment_id } = req.query

    const payment = await mp.payment.findById(payment_id)
    console.log(payment)
    next()
  },
  (req, res) => {
    console.log(req.query)
    res.json(req.query)
  }
)

module.exports = router
