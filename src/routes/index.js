const { Router } = require('express')
const productsRoutes = require('./products.route.js')
const usersRoutes = require('./users.route.js')
const commentsRoutes = require('./comment.route.js')
const categoriesRoutes = require('./categories.route.js')

const router = Router()

// volver plurales a futuro

router.use('/categories', categoriesRoutes)
router.use('/user', Users)
router.use('/products', productRoutes)
router.use('/comment', comment)

module.exports = router
