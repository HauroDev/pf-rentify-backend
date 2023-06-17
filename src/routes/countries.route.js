const { Router } = require('express')
const {
  createCountry,
  getCountries
} = require('../controller/countries.controler')

const router = Router()

router.get('/', getCountries)

router.post('/', createCountry)

module.exports = router
