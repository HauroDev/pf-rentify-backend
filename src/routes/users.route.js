const { Router } = require("express");

const {
  postUser,
  getUser,
  getAllUsers,
  getUsersByName,
  getUsersByStatus,
  updateUserName,
  updateUserPhone,
  updateUserEmail,
  updateUserStatus,
  updateUserMembership,
  getUsersByMembership,
  updateUserImage,
  // deleteUser, getUserMember
} = require("../controller/users.controller.js");

const router = Router();

// Swagger Schema
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         image:
 *           type: string
 *         membership:
 *           type: string
 *         status:
 *           type: string
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - image
 *         - membership
 *         - status
 *       example:
 *         name: Gonzalo
 *         email: falso123@gmail.com
 *         phone: "123456"
 *         image: image.jpg
 *         membership: standard
 *         status: active
 */
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtén usuarios por estado
 *     description: Obtén una lista de usuarios filtrados por estado
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtro opcional por estado (active, inactive, paused, banned)
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Valor de estado inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getUsersByStatus);
/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Obtén todos los usuarios
 *     description: Obtiene una lista de todos los usuarios
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/all", getAllUsers);
/**
 * @swagger
 * /user/name:
 *   get:
 *     summary: Obtén usuarios por nombre
 *     description: Obtén una lista de usuarios filtrados por nombre
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
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
router.get("/name", getUsersByName);

/**
 * @swagger
 * /user/membership:
 *   get:
 *     summary: Obtén usuarios por membresía
 *     description: Obtén una lista de usuarios filtrados por membresía
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: membership
 *         schema:
 *           type: string
 *         description: Filtro opcional por membresía (standard, premium)
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Valor de membresía inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get("/membership/", getUsersByMembership);
// router.get('/ aca iria  qry  de esta manera en testeo /users?membership=standard'  ,getUserMember);

// metodos post

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Crea un nuevo usuario con la información proporcionada
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en los parámetros de entrada
 */
router.post("/", postUser);
// metodos put
/**
 * @swagger
 * /user/update-name:
 *   put:
 *     summary: Actualiza el nombre de un usuario
 *     description: Puedes cambiar el nombre de tu usuario
 *     tags:
 *       - User
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
 *         description: Nombre de usuario actualizado exitosamente
 *       400:
 *         description: Error de validación o nombre de usuario vacío
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/update-name", updateUserName);
/**
 * @swagger
 * /user/update-phone:
 *   put:
 *     summary: Actualiza el número de teléfono de un usuario
 *     description: Puedes cambiar el número de teléfono de tu usuario
 *     tags:
 *       - User
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
 *         description: Número de teléfono de usuario actualizado exitosamente
 *       400:
 *         description: Error de validación o número de teléfono inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/update-phone", updateUserPhone);
/**
 * @swagger
 * /user/update-email:
 *   put:
 *     summary: Actualiza el correo electrónico de un usuario
 *     description: Puedes cambiar el correo electrónico de tu usuario
 *     tags:
 *       - User
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
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Correo electrónico de usuario actualizado exitosamente
 *       400:
 *         description: Error de validación o formato de correo electrónico inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/update-email", updateUserEmail);
/**
 * @swagger
 * /user/update-status:
 *   put:
 *     summary: Actualiza el estado de un usuario
 *     description: Puedes cambiar el estado de un usuario
 *     tags:
 *       - User
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
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive
 *                   - paused
 *                   - banned
 *     responses:
 *       200:
 *         description: Estado de usuario actualizado exitosamente
 *       400:
 *         description: Error de validación o valor de estado inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/update-status", updateUserStatus);
/**
 * @swagger
 * /user/update-membership:
 *   put:
 *     summary: Actualiza la membresía de un usuario
 *     description: Puedes cambiar la membresía de un usuario
 *     tags:
 *       - User
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
 *               membership:
 *                 type: string
 *                 enum:
 *                   - standard
 *                   - premium
 *     responses:
 *       200:
 *         description: Membresía de usuario actualizada exitosamente
 *       400:
 *         description: Error de validación o valor de membresía inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/update-membership", updateUserMembership);
/**
 * @swagger
 * /user/update-image:
 *   put:
 *     summary: Actualiza la imagen de un usuario
 *     description: Puedes cambiar la imagen de un usuario
 *     tags:
 *       - User
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
 *                 format: url
 *     responses:
 *       200:
 *         description: Imagen de usuario actualizada exitosamente
 *       400:
 *         description: Error de validación o URL de imagen inválida
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/update-image", updateUserImage);

// metodos delete
// router.delete('/:id', deleteUser);
// metodos get
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     description: Obtiene los detalles de un usuario por su ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del usuario a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */

router.get("/:id", getUser);
module.exports = router;
