const { Router } = require("express");
const productsRoutes = require("./products.route.js");
const usersRoutes = require("./users.route.js");
const commentsRoutes = require("./comment.route.js");
const categoriesRoutes = require("./categories.route.js");
const countriesRoutes = require("./countries.route.js");

//const adminRoutes = require('./Admin.routes.js');

const router = Router();

// volver plurales a futuro

router.use("/categories", categoriesRoutes);
router.use("/countries", countriesRoutes);
router.use("/user", usersRoutes);
router.use("/products", productsRoutes);
router.use("/comment", commentsRoutes);
//router.use('/admin', adminRoutes);

module.exports = router;
