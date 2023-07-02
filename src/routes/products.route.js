const { Router } = require('express')
const verifyAuthToken = require('../utils/verifyToken')
const {
  getAllProducts,
  createProduct,
  getProductById,
  getUserProducts,
  updateProductstatusPub,
  updateProductName,
  updateProductPrice,
  updateProductIsFeatured,
  getProductByFeature,
  getFilterProducts
} = require('../controller/products.controller.js')
const { isAdmin } = require('@firebase/util')

const router = Router()

// Schema Product
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *           format: uri
 *         price:
 *           type: number
 *           format: float
 *         location:
 *           type: string
 *         state:
 *           type: string
 *         isFeatured:
 *           type: boolean
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         idUser:
 *           type: string
 *           format: uuid
 *         idCountry:
 *           type: number
 *       required:
 *         - name
 *         - description
 *         - image
 *         - price
 *         - location
 *         - state
 *         - isFeatured
 *         - categories
 *         - idUser
 *         - idCountry
 *     Category:
 *       type: object
 *       properties:
 *         idCategory:
 *           type: integer
 *         name:
 *           type: string
 *       required:
 *         - idCategory
 *         - name
 */
// Get All Products
/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: Obtén todos los productos con paginación
 *     description: Obtiene una lista de todos los productos con paginación
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Número de registros a omitir (desplazamiento)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de registros a devolver
 *     responses:
 *       '200':
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Número total de productos
 *                 next:
 *                   type: string
 *                   description: Enlace para obtener la siguiente página de resultados (opcional)
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       '500':
 *         description: Error interno del servidor
 */
router.get('/all', verifyAuthToken, isAdmin, getAllProducts) // ADMIN
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene todos los productos
 *     description: Obtiene la lista de todos los productos disponibles
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: name
 *         description: Filtrar por nombre de usuario
 *         schema:
 *           type: string
 *       - in: query
 *         name: offset
 *         description: Número de resultados a omitir
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: query
 *         name: limit
 *         description: Número máximo de resultados a retornar
 *         schema:
 *           type: integer
 *       - in: query
 *         name: orderBy
 *         description: Ordenar por campo específico
 *         schema:
 *           type: string
 *           enum:
 *             - price
 *             - name
 *             - date
 *       - in: query
 *         name: orderType
 *         description: Tipo de orden (ascendente o descendente)
 *         schema:
 *           type: string
 *           enum:
 *             - ASC
 *             - DESC
 *           default: ASC
 *       - in: query
 *         name: idCategory
 *         description: Filtrar por ID de categoría
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idCountry
 *         description: Filtrar por ID de país
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: location
 *         description: Filtrar por Ciudad
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         description: Filtrar por Estado/Provincia
 *         schema:
 *           type: string
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.get('/', getFilterProducts)
/**
 * @swagger
 * /products/isFeatured:
 *   get:
 *     summary: Obtén productos por característica
 *     description: Obtén una lista de productos filtrados por característica
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filtro opcional por característica (true, false)
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor
 */

router.get('/isFeatured/', verifyAuthToken, isAdmin, getProductByFeature) // ADMIN
// Post product
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto
 *     description: Crea un nuevo producto con la información proporcionada
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error en los parámetros de entrada
 */
router.post('/', verifyAuthToken, createProduct)

/**
 * @swagger
 * /products/update-status:
 *   put:
 *     summary: Actualiza el estado de publicación de un producto
 *     description: Puedes cambiar el estado de publicación de un producto
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProd:
 *                 type: string
 *                 format: string
 *               statusPub:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive
 *                   - delete
 *     responses:
 *       200:
 *         description: Estado de publicación de producto actualizado exitosamente
 *       400:
 *         description: Error de validación o valor de estado de publicación inválido
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/update-status', verifyAuthToken, updateProductstatusPub)
/**
 * @swagger
 * /products/update-name:
 *   put:
 *     summary: Actualiza el nombre de un producto
 *     description: Puedes cambiar el nombre de un producto
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProd:
 *                 type: string
 *                 format: number
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nombre de producto actualizado exitosamente
 *       400:
 *         description: Error de validación o valor de nombre inválido
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/update-name', verifyAuthToken, updateProductName)
/**
 * @swagger
 * /products/update-price:
 *   put:
 *     summary: Actualiza el precio de un producto
 *     description: Puedes cambiar el precio de un producto
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProd:
 *                 type: string
 *                 format: number
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Precio de producto actualizado exitosamente
 *       400:
 *         description: Error de validación o valor de precio inválido
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/update-price', verifyAuthToken, updateProductPrice)
/**
 * @swagger
 * /products/update-featured:
 *   put:
 *     summary: Actualiza la propiedad "isFeatured" de un producto
 *     description: Puedes cambiar la propiedad "isFeatured" de un producto
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProd:
 *                 type: string
 *                 format: number
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Propiedad "isFeatured" de producto actualizada exitosamente
 *       400:
 *         description: Error de validación o valor de propiedad "isFeatured" inválido
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/update-featured', verifyAuthToken, updateProductIsFeatured) //**PREMIUM - STANDARD */

// Get IdProduct
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     description: Obtiene los detalles de un producto por su ID
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del producto a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del producto obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', getProductById)
/**
 * @swagger
 * /products/user/{id}:
 *   get:
 *     summary: Obtén los productos de un usuario
 *     description: Obtén una lista de productos asociados a un usuario
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Usuario no válido
 *       500:
 *         description: Error interno del servidor
 */

router.get('/user/:id', verifyAuthToken, getUserProducts)
module.exports = router
