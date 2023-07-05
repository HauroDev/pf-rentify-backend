const { Router } = require('express')
const verifyAuthToken = require("../utils/verifyToken");
const {
  createCountry,
  getCountries,
  getChildrenGeoname
} = require('../controller/countries.controler')

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
router.get('/',verifyAuthToken, getCountries)

router.post('/',verifyAuthToken, createCountry)//ADMINS

router.get('/childrens/:id',verifyAuthToken, getChildrenGeoname)

module.exports = router
