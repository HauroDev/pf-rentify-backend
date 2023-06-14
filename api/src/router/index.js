const { Router } = require('express')
const productRoutes = require('./products.route.js')
const Users = require('./users.router')

const router = Router()

/* routas en use */

router.use('/user', Users)
router.use('/products', productRoutes)

module.exports = router
