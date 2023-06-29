const { Router } = require('express')
const {
  getStatistics,
  getAdminsSudo
} = require('../controller/admins.controller.js')

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

router.get('/statistics', getStatistics)
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtro por nombre de usuario
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

router.get('/admins-sudo', getAdminsSudo)

module.exports = router
