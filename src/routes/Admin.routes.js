const { Router } = require('express')
const { getStatistics } = require('../controller/admin.controller')

const router = Router()

router.get('/statistics', getStatistics)

module.exports = router
