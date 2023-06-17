const { Router } = require('express')
const { createCustomError } = require('../utils/customErrors')
const { Country } = require('../db/db.js')

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const countries = await Country.findAll()

    res.status(200).json(countries)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, currency } = req.body

    const allowedCountries = [
      'Argentina',
      'Perú',
      'México',
      'Colombia',
      'Brasil',
      'Chile',
      'Uruguay'
    ]

    if (!allowedCountries.includes(name)) {
      throw createCustomError(
        409,
        `The request could not be completed, Invalid Country: ${name}`
      )
    }

    const existingCountry = await Country.findOne({
      where: {
        name
      }
    })

    if (existingCountry) {
      throw createCustomError(
        409,
        `The request could not be completed, Country ${name} already exists`
      )
    }

    const CountryLength = await Country.count()

    if (CountryLength === allowedCountries.length) {
      throw createCustomError(
        409,
        'The request could not be completed, All Countries have already been created'
      )
    }

    const CountryCreated = await Country.create({ name, currency })

    res.status(201).json(CountryCreated)
  } catch (error) {
    res.status(error?.status || 500).json({ error: error.message })
  }
})

module.exports = router
