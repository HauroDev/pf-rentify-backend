const { Router } = require('express')
const verifyAuthToken = require('../utils/verifyToken')
const {
  newComment,
  getCommentsByProductId,
  editComment,
  deletedComment
} = require('../controller/comment.controller.js')
const { isBannedUser, isAdmin } = require('../utils/usersVerify.js')

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

// metodos patch y put

/**
 * @swagger
 * /comment/visual:
 *   patch:
 *     summary: Actualiza el estado de visibilidad de un comentario
 *     description: Actualiza el estado de visibilidad de un comentario específico
 *     tags:
 *       - Comentarios
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
 *               idProd:
 *                 type: integer
 *               idComment:
 *                 type: integer
 *               commentStatus:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado de visibilidad del comentario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 */

router.patch('/visual', verifyAuthToken, isBannedUser, deletedComment)

/**
 * @swagger
 * /comment/edit:
 *   put:
 *     summary: Edita un comentario existente
 *     description: Edita un comentario existente utilizando los datos proporcionados
 *     tags:
 *       - Comentarios
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
 *               idProd:
 *                 type: integer
 *               idComment:
 *                 type: integer
 *               comment:
 *                 type: string
 *               puntuation:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Comentario editado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */

router.put('/edit', verifyAuthToken, isBannedUser, editComment)

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

router.post('/', verifyAuthToken, isBannedUser, newComment)

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
router.get(
  '/:idProduct',
  verifyAuthToken,
  isBannedUser,
  isAdmin,
  getCommentsByProductId
) // ADMIN

module.exports = router
