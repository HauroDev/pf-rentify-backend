const { Router } = require('express')
const verifyAuthToken = require('../utils/verifyToken')
const {
  createCountry,
  getCountries,
  getChildrenGeoname,
  getCountryByIp
} = require('../controller/countries.controler')

const { isBannedUser, isAdmin } = require('../utils/usersVerify')

const router = Router()

// Get Comments product
/**
 * @swagger
 * /countries :
 *   get:
 *     summary: Obtiene todos los Paises asociados
 *     description: Obtiene una lista de Paises con informacion de la moneda y un id de una Api para busquedas personalizadas
 *     tags:
 *       - Paises
 *     responses:
 *       200:
 *         description: Lista de Paises obtenida exitosamente
 */
router.get('/', getCountries)

router.post('/', verifyAuthToken, isBannedUser, isAdmin, createCountry) // ADMINS

/**
 * @swagger
 * /countries/childrens/{id}:
 *   get:
 *     summary: Obtiene los hijos de un país.
 *     description: Obtiene una lista de los países hijos asociados a un país específico mediante su ID.
 *     tags:
 *       - Paises
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del país para obtener los hijos (provincias/estados/departamentos).
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de provincias/estados/departamentos obtenida exitosamente.
 *       404:
 *         description: No se encontraron hijos.
 *       500:
 *         description: Error interno del servidor.
 */

router.get('/childrens/:id', getChildrenGeoname)

/**
 * @swagger
 * /countries/geolocation/{ip}:
 *   get:
 *     summary: Obtiene la información de geolocalización de un país basado en una dirección IP.
 *     description: Obtiene la información de geolocalización de un país utilizando una dirección IP específica. Devuelve el país correspondiente a la dirección IP proporcionada para devolver informacion de un pais registrado en la base de datos.
 *     tags:
 *       - Paises
 *     parameters:
 *       - in: path
 *         name: ip
 *         required: true
 *         description: Dirección IP para obtener la información de geolocalización.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información de geolocalización obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *       404:
 *         description: País no registrado en la base de datos.
 *       500:
 *         description: Error interno del servidor.
 */

router.get('/geolocation/:ip', getCountryByIp)

module.exports = router
