const { Router } = require('express')
const verifyAuthToken = require('../utils/verifyToken')
const {
  getStatistics,
  getAdminsSudo,
  createAdmin,
  updateNameAdmin,
  updatePhoneAdmin,
  updateRoleAdmin,
  updateImageAdmin,
  getOrdersByIdUser
} = require('../controller/admins.controller.js')
const { isSudo, isAdmin } = require('../utils/isAdmin')

const router = Router()
/**
 * @swagger
 * /admin/statistics:
 *   get:
 *     summary: Obtiene las estadísticas de la página
 *     description: Este endpoint devuelve las estadísticas de la página para diferentes categorías.
 *     tags:
 *       - Admins
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   description: Estadísticas de usuarios.
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nombre de la categoría de usuarios.
 *                       total:
 *                         type: integer
 *                         description: Total de usuarios en esa categoría.
 *                 user-membership:
 *                   type: array
 *                   description: Estadísticas de membresía de usuarios.
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nombre de la categoría de membresía de usuarios.
 *                       total:
 *                         type: integer
 *                         description: Total de usuarios en esa categoría de membresía.
 *                       active:
 *                         type: integer
 *                         description: Total de usuarios activos en esa categoría de membresía.
 *                       inactive:
 *                         type: integer
 *                         description: Total de usuarios inactivos en esa categoría de membresía.
 *                       banned:
 *                         type: integer
 *                         description: Total de usuarios baneados en esa categoría de membresía.
 *                 products:
 *                   type: array
 *                   description: Estadísticas de productos.
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nombre de la categoría de productos.
 *                       total:
 *                         type: integer
 *                         description: Total de productos en esa categoría.
 *                 products-featured:
 *                   type: array
 *                   description: Estadísticas de productos destacados.
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nombre de la categoría de productos destacados.
 *                       total:
 *                         type: integer
 *                         description: Total de productos en esa categoría de destacados.
 *                 orders:
 *                   type: array
 *                   description: Estadísticas de pedidos.
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nombre de la categoría de pedidos.
 *                       total:
 *                         type: integer
 *                         description: Total de pedidos en esa categoría.
 *                 suscriptions:
 *                   type: array
 *                   description: Estadísticas de suscripciones.
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nombre de la categoría de suscripciones.
 *                       total:
 *                         type: integer
 *                         description: Total de suscripciones en esa categoría.
 */

router.get('/statistics', verifyAuthToken, isAdmin, getStatistics)
/**
 * @swagger
 * /admin/admins-sudo:
 *   get:
 *     summary: Obtén administradores y usuarios con permisos de superusuario
 *     description: Obtén una lista de usuarios filtrados por nombre y/o rol de administrador o superusuario
 *     tags:
 *       - Admins
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtro por nombre y email de usuario
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filtro por rol de usuario (admin, sudo)
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: Error interno del servidor
 */

router.get('/admins-sudo', verifyAuthToken, isAdmin, getAdminsSudo)

/**
 * @swagger
 * /admin/create-admin:
 *   post:
 *     summary: Crea un usuario administrador
 *     description: Este endpoint crea un nuevo usuario administrador. Los campos "image" y "phone" son opcionales.
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario administrador.
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario administrador.
 *                 required: true
 *               uid:
 *                 type: string
 *                 description: Identificador único del usuario administrador.
 *                 required: true
 *               image:
 *                 type: string
 *                 description: (Opcional) URL de la imagen del usuario administrador.
 *               phone:
 *                 type: string
 *                 description: (Opcional) Número de teléfono del usuario administrador.
 *     responses:
 *       201:
 *         description: Usuario administrador creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idUser:
 *                   type: string
 *                   description: ID del usuario administrador creado.
 *                 status:
 *                   type: string
 *                   description: Estado del usuario administrador.
 *                 name:
 *                   type: string
 *                   description: Nombre del usuario administrador.
 *                 email:
 *                   type: string
 *                   description: Correo electrónico del usuario administrador.
 *                 phone:
 *                   type: string
 *                   description: (Opcional) Número de teléfono del usuario administrador.
 *                 image:
 *                   type: string
 *                   description: (Opcional) URL de la imagen del usuario administrador.
 *                 uid:
 *                   type: string
 *                   description: Identificador único del usuario administrador.
 *                 membership:
 *                   type: string
 *                   description: Membresía del usuario administrador.
 *                 role:
 *                   type: string
 *                   description: Rol del usuario administrador.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha y hora de la última actualización del usuario administrador.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha y hora de creación del usuario administrador.
 */

router.post('/create-admin', verifyAuthToken, isSudo, createAdmin)

/**
 * @swagger
 * /admin/update-name:
 *   patch:
 *     summary: Actualiza el nombre del perfil de un administrador
 *     description: Puedes cambiar el nombre del perfil de un administrador
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: nombre de perfil actualizado exitosamente
 */

router.patch('/update-name', verifyAuthToken, isAdmin, updateNameAdmin)

/**
 * @swagger
 * /admin/update-phone:
 *   patch:
 *     summary: Actualiza el número de teléfono de un administrador
 *     description: Puedes cambiar el número de teléfono de un administrador
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 format: uuid
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Número de teléfono actualizado exitosamente
 */

router.patch('/update-phone', verifyAuthToken, isAdmin, updatePhoneAdmin)

/**
 * @swagger
 * /admin/update-role:
 *   patch:
 *     summary: Actualiza el Rol de un administrador
 *     description: Puedes cambiar el Rol de un administrador
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - sudo
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 */

router.patch('/update-role', verifyAuthToken, isAdmin, updateRoleAdmin)

/**
 * @swagger
 * /admin/update-image:
 *   patch:
 *     summary: Actualiza el número de teléfono de un administrador
 *     description: Puedes cambiar el número de teléfono de un administrador
 *     tags:
 *       - Admins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 format: uuid
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Número de teléfono de usuario actualizado exitosamente
 */

router.patch('/update-image', verifyAuthToken, isAdmin, updateImageAdmin)

/**
 * @swagger
 * /admin/order/user/{idUser}:
 *   get:
 *     summary: Obtener órdenes de un usuario
 *     tags:
 *      - Admins
 *     parameters:
 *       - name: idUser
 *         in: path
 *         description: ID del usuario de la Base de datos
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: status
 *         in: query
 *         description: Estado de las órdenes (approved, pending, rejected)
 *         schema:
 *           type: string
 *           enum:
 *             - approved
 *             - pending
 *             - rejected
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Número total de órdenes
 *                 next:
 *                   type: string
 *                   description: URL de la siguiente página de resultados
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idOrder:
 *                         type: integer
 *                         description: ID de la orden
 *                       preferenceId:
 *                         type: string
 *                         description: ID de preferencia
 *                       paymentId:
 *                         type: string
 *                         description: ID de pago
 *                       status:
 *                         type: string
 *                         description: Estado de la orden
 *                       merchantOrderId:
 *                         type: string
 *                         description: ID del pedido del comerciante
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha y hora de creación
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha y hora de actualización
 *                       idUser:
 *                         type: string
 *                         format: uuid
 *                         description: ID del usuario
 */

router.get('/order/user/:idUser', verifyAuthToken, isAdmin, getOrdersByIdUser)

module.exports = router
