const { Router } = require("express");
const {
  getCategories,
  createCategories,
} = require("../controller/categories.controller.js");

const categoriesRoutes = Router();
//schema Categories
/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryPost:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *       required:
 *         - name
 */

//Get All Categories
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtiene todas las categorías
 *     description: Obtiene una lista de todas las categorías disponibles
 *     tags:
 *       - Categorías
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

categoriesRoutes.get("/", getCategories);

//Post Category
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crea una nueva categoría
 *     description: Crea una nueva categoría utilizando el nombre proporcionado
 *     tags:
 *       - Categorías
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryPost'
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */

categoriesRoutes.post("/", createCategories);

module.exports = categoriesRoutes;
