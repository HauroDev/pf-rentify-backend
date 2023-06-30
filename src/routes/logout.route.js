const { Router } = require('express')
const router = Router()
const { logout } = require("../controller/logout.controller")
router.get('/', logout)

module.exports = router
