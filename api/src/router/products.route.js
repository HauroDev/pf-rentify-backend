const { Router } = require('express')

const { Product } = require('../db/db.js')

const router = Router()

router.get('/products', async (req, res) => {
  const queries = req.query

  try {
    const searchOption = {}

    for (const prop in queries) {
      searchOption[prop] = prop
    }

    const products = await Product.findAll({ where: { ...searchOption } })
  } catch (error) {}
})
router.get('/products/search/:name')

router.post('/products')

router.get('/products/:id')
