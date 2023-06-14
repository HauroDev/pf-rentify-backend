const { Product, Category, User, Comment } = require('../db/db.js')
const { Op } = require('sequelize')
const { obtenerNextPageProduct } = require('../utils/paginado.js')

const getProducts = async (req, res) => {
  let { name, offset, limit, order } = req.query

  // agregar offset, limit, order = por fecha y condicional solo disponible cuando el usuario lo pida

  const whereOptions = name
    ? {
        name: {
          [Op.iLike]: `%${name}%`
        }
      }
    : {}

  try {
    const count = await Product.count(whereOptions)

    const products = await Product.findAll({
      where: whereOptions,
      include: [
        {
          model: Category,
          attributes: ['idCategory', 'name'],
          through: { attributes: [] }
        }
      ],
      offset: offset || 0,
      limit: limit || 12,
      order: order || undefined
    })

    offset = offset || offset > 0 ? +offset : 0
    limit = limit ? +limit : 12

    res.status(200).json({
      count,
      next: obtenerNextPageProduct(offset, limit, count),
      products
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createProduct = async (req, res) => {
  const product = { ...req.body }
  try {
    let categoriesDb = await Category.findAll({
      where: { name: product.categories?.map((cat) => cat.name) }
    })

    if (!categoriesDb.length) {
      categoriesDb = await Category.bulkCreate(product?.categories)
      // throw new Error('No product categories were found')
    }
    const productDb = await Product.create(product)

    await productDb.setCategories(categoriesDb)

    let categoriesSeach = await productDb.getCategories()

    categoriesSeach = categoriesSeach.map(({ idCategory, name }) => ({
      idCategory,
      name
    }))

    res.status(200).json({
      ...productDb.toJSON(),
      categories: categoriesSeach
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

const getProductById = async (req, res) => {
  const { id } = req.params

  try {
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, attributes: {} },
        { model: Comment, attributes: {} },
        { model: User, attributes: {} }
      ]
    })

    if (!product) {
      const customError = new Error(`Product id:${id} is not found`)
      customError.status = 404
      throw customError
    }

    // if()// condicion de busqueda statusPub =  active

    res.status(200).json(product)
  } catch (error) {
    res.status(error?.status || 500).json({ message: error.message })
  }
}

module.exports = {
  getProducts,
  createProduct,
  getProductById
}
