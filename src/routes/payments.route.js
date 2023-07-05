/* eslint-disable camelcase */
const { Router } = require('express')
const verifyAuthToken = require('../utils/verifyToken')
const {
  createOrder,
  redirectToWebSiteCheckOut,
  verificationCountryMercadoPago,
  createSuscription,
  confirmOrder,
  confirmSuscription,
  redirectToWebSiteHome,
  cancelSuscription
} = require('../controller/payments.controller.js')
const { isBannedUser } = require('../utils/usersVerify')
const router = Router()

/**
 * @swagger
 * /payments/subscription:
 *   post:
 *     summary: Crea una suscripción de pago
 *     description: Este endpoint crea una suscripción de pago y devuelve un enlace de pago.
 *     tags:
 *       - Payments
 *     requestBody:
 *       description: Datos de la suscripción
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 description: Precio de la suscripción.
 *               reason:
 *                 type: string
 *                 description: Razón de la suscripción.
 *               type:
 *                 type: string
 *                 description: Tipo de suscripción.
 *                 enum:
 *                   - standard
 *                   - premium
 *               idUser:
 *                 type: string
 *                 description: ID del usuario obtenido de la base de datos.
 *             example:
 *               price: 9.99
 *               reason: Suscripción mensual
 *               type: premium
 *               idUser: 1234567890
 *     responses:
 *       200:
 *         description: Suscripción creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Enlace de pago de la suscripción.
 *                   example: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_id=2c93808488fc9b7701890526a7bd036c"
 */

router.post(
  '/suscription',
  verifyAuthToken,
  isBannedUser,
  verificationCountryMercadoPago,
  createSuscription
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
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: Título del producto.
 *                     unit_price:
 *                       type: number
 *                       description: Precio unitario del producto.
 *                     quantity:
 *                       type: integer
 *                       description: Cantidad del producto.
 *               idUser:
 *                 type: string
 *                 description: Identificador del usuario que genera la orden de pago.
 *     responses:
 *       201:
 *         description: Orden de pago generada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 preferenceId:
 *                   type: string
 *                   description: ID de preferencia generado para la orden de pago.
 *       400:
 *         description: Error en la solicitud. Por favor, revise los parámetros enviados.
 */

router.post(
  '/order',
  verifyAuthToken,
  isBannedUser,
  verificationCountryMercadoPago,
  createOrder
)
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
router.get(
  '/feedback',
  verificationCountryMercadoPago,
  confirmOrder,
  redirectToWebSiteCheckOut
)

router.get(
  '/confirm-suscription',
  verificationCountryMercadoPago,
  confirmSuscription,
  redirectToWebSiteHome
)

/**
 * @swagger
 * /payments/cancel-suscription:
 *   get:
 *     summary: Cancela la suscripcion del usuario
 *     description: permite cancelar la suscripcion de un usuario. este lo devuelve a la membresia 'basic'
 *     tags:
 *       - Payments
 *     parameters:
 *         name: idUser
 *         description: ID del usuario de la base de datos.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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

router.get(
  '/cancel-suscription/:idUser',
  verificationCountryMercadoPago,
  cancelSuscription
)

module.exports = router
