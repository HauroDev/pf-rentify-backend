const { Router } = require('express')

const {
  getProducts,
  createProduct,
  getProductById
} = require('../controller/products.controller.js')

const router = Router()

router.get('/', getProducts)
router.post('/', createProduct)
router.get('/:id', getProductById)

module.exports = router