const { Router } = require('express')
const router = Router()
const { logout } = require('../controller/logout.controller')
const verifyAuthToken = require('../utils/verifyToken')

router.get('/', verifyAuthToken, logout)

module.exports = router
