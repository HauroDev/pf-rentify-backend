const { Router } = require('express')
const verifyAuthToken = require('../utils/verifyToken')
const {
  newComment,
  getCommentsByProductId
} = require('../controller/comment.controller.js')
const { isAdmin } = require('@firebase/util')

const router = Router()
// schema Comment
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *         puntuation:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         commentStatus:
 *           type: boolean
 *         idProd:
 *           type: integer
 *         idUser:
 *           type: string
 *           format: uuid
 *       required:
 *         - comment
 *         - puntuation
 *         - idProd
 *         - idUser
 */

// metodos post
/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Crea un nuevo comentario
 *     description: Crea un nuevo comentario utilizando los datos proporcionados
 *     tags:
 *       - Comentarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

router.post('/', verifyAuthToken, newComment)

// Get Comments product
/**
 * @swagger
 * /comment/{idProduct}:
 *   get:
 *     summary: Obtiene todos los comentarios para un producto específico
 *     description: Obtiene una lista de todos los comentarios asociados a un producto según su ID
 *     tags:
 *       - Comentarios
 *     parameters:
 *       - in: path
 *         name: idProduct
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get('/:idProduct', verifyAuthToken, isAdmin, getCommentsByProductId) // ADMIN

module.exports = router
