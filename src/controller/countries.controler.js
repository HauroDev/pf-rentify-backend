const { CustomError } = require('../utils/customErrors.js')
const { Country } = require('../db/db.js')
const { default: axios } = require('axios')

const getCountries = async (_req, res) => {
  try {
    const countries = await Country.findAll()

    res.status(200).json(countries)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createCountry = async (req, res) => {
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
      throw new CustomError(
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
      throw new CustomError(
        409,
        `The request could not be completed, Country ${name} already exists`
      )
    }

    const CountryLength = await Country.count()

    if (CountryLength === allowedCountries.length) {
      throw new CustomError(
        409,
        'The request could not be completed, All Countries have already been created'
      )
    }

    const CountryCreated = await Country.create({ name, currency })

    res.status(201).json(CountryCreated)
  } catch (error) {
    res.status(error?.status || 500).json({ error: error.message })
  }
}
const API = (id) =>
  `http://api.geonames.org/childrenJSON?geonameId=${id}&username=gabriel`

const getChildrenGeoname = async (req, res) => {
  const { id } = req.params
  try {
    const { data } = await axios(API(id))
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Api geonames no responde' })
  }
}
module.exports = { getCountries, createCountry, getChildrenGeoname }
