const { Router } = require('express')

const { getCategories } = require('../controller/categories.controller.js')

const categoriesRoutes = Router()


categoriesRoutes.get('/', getCategories)

module.exports = categoriesRoutes;