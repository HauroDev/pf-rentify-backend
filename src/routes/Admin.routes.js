const express = require("express");
const adminController = require("../controllers/Admin.controller");

const router = express.Router();

// Endpoint para cambiar el estado de un usuario por ID
router.put(
  "/users/:userId/status/:newStatus",
  adminController.changeUserStatusById
);

// Endpoint para cambiar el estado de un producto por ID
router.put(
  "/products/:productId/status/:newStatus",
  adminController.changeProductStatusById
);

module.exports = router;
