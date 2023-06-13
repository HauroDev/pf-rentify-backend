const { Router } = require('express')
const productRoutes = require('./products.route.js')

const router = Router()

router.use('/products', productRoutes)

module.exports = router
