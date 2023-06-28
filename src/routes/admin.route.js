const { Router } = require('express')
const { getStatistics } = require('../controller/admins.controller.js')

const router = Router()

router.get('/statistics', getStatistics)

module.exports = router
