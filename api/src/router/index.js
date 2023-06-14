const { Router } = require("express");
const productRoutes = require("./products.route.js");
const Users = require("./users.router");
const comment = require("./comment.router.js");

const router = Router()

/* routas en use */
router.use('/categories', categoriesRoutes)

router.use("/user", Users);
router.use("/products", productRoutes);
router.use("/comment", comment);

module.exports = router
