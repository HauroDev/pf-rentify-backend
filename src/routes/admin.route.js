const { Router } = require('express')
const { getStatistics,
    getAdminsSudo
 } = require('../controller/admins.controller.js')

const router = Router()

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
