const { Router } = require('express')

const {
  getCategories,
  createCategories
} = require('../controller/categories.controller.js')

const categoriesRoutes = Router()

categoriesRoutes.get('/', getCategories)
categoriesRoutes.post('/', createCategories)

module.exports = categoriesRoutes
