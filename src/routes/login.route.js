const { Router } = require('express')
const router = Router()
const { login } = require('../controller/login.controller.js')
router.post('/', login)

module.exports = router
