const { Router } = require('express')

const router = Router()

/* pongan su ruta aqui */
const Users=require('./users.router');

/* routas en use*/
router.use('/user',Users);

module.exports = router
