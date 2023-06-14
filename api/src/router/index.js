const { Router } = require('express')
const productRoutes = require('./products.route.js')
const Users = require('./users.router')

//aqui va categories
const categoriesRoutes = require('./categories.route.js')

const router = Router()

/* routas en use */
router.use('/categories', categoriesRoutes)

router.use('/user', Users)
router.use('/products', productRoutes)


module.exports = router
