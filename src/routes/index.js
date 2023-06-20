const { Router } = require('express')
const productsRoutes = require('./products.route.js')
const usersRoutes = require('./users.route.js')
const commentsRoutes = require('./comment.route.js')
const categoriesRoutes = require('./categories.route.js')
const adminRoutes = require('./Admin.routes.js');
const router = Router()

router.use('/categories', categoriesRoutes)
router.use('/user', usersRoutes)
router.use('/products', productsRoutes)
router.use('/comment', commentsRoutes)
router.use('/admin', adminRoutes);

module.exports = router
