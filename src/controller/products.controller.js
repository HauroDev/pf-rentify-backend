const { Product, Category, User, Comment, Country } = require('../db/db.js')
const { Op } = require('sequelize')
const { obtenerNextPageProduct } = require('../utils/paginado.js')
const { CustomError } = require('../utils/customErrors.js')

const getProducts = async (req, res) => {
  // agregar price entre un rango a futuro
  let { name, offset, limit, orderBy, orderType, idCategory, idCountry } =
    req.query

  const whereOptions = {}

  if (name) {
    whereOptions.name = {
      [Op.iLike]: `%${name}%`
    }
  }

  const orderOptions = [['isFeatured', 'DESC']]

  orderType = orderType || 'ASC'

  switch (orderBy) {
    case 'price':
      orderOptions.push(['price', orderType])
      break
    case 'name':
      orderOptions.push(['name', orderType])
      break
    case 'date':
    default:
      orderOptions.push(['updatedAt', orderType])
  }

  try {
    const count = await Product.count({ where: whereOptions })

    const products = await Product.findAll({
      where: whereOptions,
      include: [
        {
          model: Category,
          through: { attributes: [] },
          as: 'categories',
          where: idCategory ? { idCategory: +idCategory } : {}
        },
        {
          model: Country,
          as: 'country',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: idCountry ? { idCountry: +idCountry } : {}
        }
      ],
      offset: offset || 0,
      limit: limit || 12,
      order: orderOptions
    })

    offset = offset || offset > 0 ? +offset : 0
    limit = limit ? +limit : 12

    let queryExtend = obtenerNextPageProduct(offset, limit, count)
    if (queryExtend) {
      const params = []

      if (name) {
        params.push(`name=${name}`)
      }

      if (orderBy) {
        params.push(`orderBy=${orderBy}`)
      }

      if (orderType) {
        params.push(`orderType=${orderType}`)
      }

      if (idCategory) {
        params.push(`idCategory=${idCategory}`)
      }

      if (idCategory) {
        params.push(`idCategory=${idCategory}`)
      }

      queryExtend += params.length > 0 ? `&${params.join('&')}` : ''
    }

    res.status(200).json({
      count,
      next: queryExtend,
      results: products
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// faltan hacer verificaciones para que no cree productos si no se cumplen ciertas reglas
const createProduct = async (req, res) => {
  const { idUser, idCountry, ...product } = req.body

  try {
    const categoriesDb = await Category.findAll({
      where: { name: product.categories?.map((cat) => cat.name) }
    })
    // Validaciones
    if (!categoriesDb.length) {
      throw new CustomError(
        404,
        'The request could not be completed, Categories not found'
      )
    }

    if (!idUser) {
      throw new CustomError(
        404,
        'The request could not be completed, idUser is required to create a product.'
      )
    }

    const user = await User.findByPk(idUser)

    if (!user) {
      throw new CustomError(
        404,
        'The request could not be completed, User is not found.'
      )
    }

    const country = await Country.findByPk(idCountry)

    if (!country) {
      throw new CustomError(
        404,
        'The request could not be completed, Country not found.'
      )
    }

    // fin de Validaciones

    const productDb = await Product.create(product)
    await productDb.addUser(user)
    await productDb.addCategories(categoriesDb)

    await productDb.setCountry(country)

    let categoriesSearch = await productDb.getCategories()
    const countrySearch = (await productDb.getCountry()).toJSON()

    categoriesSearch = categoriesSearch.map(({ idCategory, name }) => ({
      idCategory,
      name
    }))

    delete countrySearch.createdAt
    delete countrySearch.updatedAt

    res.status(200).json({
      ...productDb.toJSON(),
      categories: categoriesSearch,
      country: countrySearch
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

const getProductById = async (req, res) => {
  const { id } = req.params

  try {
    if (!id) {
      throw new CustomError(
        404,
        'The request could not be completed, You need an ID to obtain a product.'
      )
    }
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'categories', through: { attributes: [] } },
        { model: Comment, as: 'comments' }
      ]
    })

    if (!product) {
      throw new CustomError(
        404,
        `The request could not be completed, Product id:${id} is not found`
      )
    }

    const userCreator = await product.getUsers({
      order: [['createdAt', 'DESC']],
      limit: 1
    })

    // no me dejo de otra sequelize que mutar los objetos del array
    userCreator[0] = userCreator[0].toJSON()

    delete userCreator[0]?.UserProduct

    res.status(200).json({ ...product.toJSON(), users: userCreator })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getProducts,
  createProduct,
  getProductById
}
