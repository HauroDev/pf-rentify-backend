const { Router } = require("express");

const {
  getProducts,
  createProduct,
  getProductById,
  getUserProducts,
} = require("../controller/products.controller.js");

const router = Router();

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

router.get("/", getProducts);
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
router.post("/", createProduct);
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
router.get("/:id", getProductById);
router.get("/user/:id", getUserProducts);

module.exports = router;
