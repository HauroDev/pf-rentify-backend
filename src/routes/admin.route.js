const { Router } = require('express')
const { getStatistics } = require('../controller/admin.controller.js')

const router = Router()

router.get('/statistics', getStatistics)

module.exports = router
