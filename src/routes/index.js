const { Router } = require('express')
const productRoutes = require('./products.route.js')
const Users = require('./users.route.js')
const comment = require('./comment.route.js')
const categoriesRoutes = require('./categories.route.js')

const router = Router()

/* routas en use */

router.use('/categories', categoriesRoutes)
router.use('/user', Users)
router.use('/products', productRoutes)
router.use('/comment', comment)

module.exports = router
