const { Router } = require('express')
const { contactOwner, contactUs } = require('../controller/contact.controller')
const verifyAuthToken = require('../utils/verifyToken')

const router = Router()

// Contactar al propietario
router.post('/contact-owner', verifyAuthToken, contactOwner)

// Formulario de contacto
router.post('/contact-us', contactUs)

module.exports = router
