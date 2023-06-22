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
 *          items:
 *            $ref: '#/components/schemas/Item'
 *      required:
 *        - items
 *    Item:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *        unit_price:
 *          type: number
 *        quantity:
 *          type: number
 */

/**
 * @swagger
 * /payments/order:
 *   post:
 *     summary: Genera la orden de pago
 *     description: Este endpoint recibe un objeto con una propiedad "items" que es un array que contiene los productos que se están alquilando.
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Orden de pago generada exitosamente.
 *       400:
 *         description: Error en la solicitud. Por favor, revise los parámetros enviados.
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
/**
 * @swagger
 * /payments/feedback:
 *   get:
 *     summary: Recibe información de feedback
 *     description: Este webhook recibe información de feedback relacionada con un pago específico.
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: query
 *         name: payment_id
 *         description: ID del pago relacionado con el feedback.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información de feedback recibida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment_id:
 *                   type: string
 *                   description: ID del pago relacionado con el feedback.
 *                   example: "1234567890"
 */
router.get(
  '/feedback',
  async (req, res, next) => {
    const { payment_id } = req.query

    try {
      const payment = await mp.payment.findById(payment_id)
      console.log(payment)
      next()
    } catch (error) {
      res.sendStatus(400)
    }
  },
  (req, res) => {
    console.log(req.query)
    res.json(req.query)
  }
)

module.exports = router
