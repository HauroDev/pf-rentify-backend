const { CustomError } = require('../utils/customErrors.js')
const { Country } = require('../db/db.js')
const { default: axios } = require('axios')
const { API_KEY_GEO } = require('../../config.js')

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
    res.status(error.status || 500).json({ error: error.message })
  }
}

const getChildrenGeoname = async (req, res) => {
  const API = (id) =>
    `http://api.geonames.org/childrenJSON?geonameId=${id}&username=${GEONAMES_USER}`

  const { id } = req.params
  try {
    const { data } = await axios(API(id))
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Api geonames no responde' })
  }
}

const getCountryByIp = async (req, res) => {
  const { ip } = req.params
  try {
    const {
      data: { country_geoname_id: geonameId }
    } = await axios.get(
      `https://ipgeolocation.abstractapi.com/v1/?fields=country_geoname_id&api_key=${API_KEY_GEO}&ip_address=${ip}`
    )

    const country = await Country.findOne({ where: { geonameId } })

    if (!country) throw new CustomError(404, 'Country is not register')

    res.json(country)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}
module.exports = {
  getCountryByIp,
  getCountries,
  createCountry,
  getChildrenGeoname
}
