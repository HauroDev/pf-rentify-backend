const { Router } = require('express')
const productsRoutes = require('./products.route.js')
const usersRoutes = require('./users.route.js')
const commentsRoutes = require('./comment.route.js')
const categoriesRoutes = require('./categories.route.js')
const countriesRoutes = require('./countries.route.js')
const paymentsRoutes = require('./payments.route.js')
const adminRoutes = require('./admin.route.js')
const login = require('./login.route.js')
const contactRoutes = require('./contact.route.js') //agregue

const router = Router()

// volver plurales a futuro

router.use('/categories', categoriesRoutes)
router.use('/countries', countriesRoutes)
router.use('/user', usersRoutes)
router.use('/products', productsRoutes)
router.use('/comment', commentsRoutes)
router.use('/payments', paymentsRoutes)
router.use('/admin', adminRoutes)
router.use('/login-google', login)
router.use('/form-contact', contactRoutes) //agregue

module.exports = router
