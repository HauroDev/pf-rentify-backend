const { Router } = require('express')

const {
  createOrder,
  redirectToWebSite,
  verificationCountryMercadoPago
} = require('../controller/payments.controller.js')
const mercadopago = require('mercadopago')

const router = Router()

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
 *        idCountry: number
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

router.post(
  '/suscription',
  verificationCountryMercadoPago,
  async (req, res) => {
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
      const suscription = await mercadopago.preapproval.create(payload)
      res.json({ url: suscription.body.init_point })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
)

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

router.post('/order', verificationCountryMercadoPago, createOrder)
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
 *         description: ID del pago de MercadoPago.
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         description: estado del pago de MercadoPago.
 *         required: true
 *         schema:
 *           enum:
 *            - approved
 *            - pending
 *            - rejected
 *            - null
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
 *                   description: ID del pago de mercadopago.
 *                   example: "1234567890"
 *                 status:
 *                   type: string
 *                   description: estado del pago.
 *                   example: "pending"
 */
router.get('/feedback', redirectToWebSite)

module.exports = router
