const { Product, Category, User, Comment } = require('../db/db.js')
const { Op } = require('sequelize')

const getProducts = async (req, res) => {
  const { name, offset, limit, order } = req.query

  // agregar offset, limit, order = por fecha y condicional solo disponible cuando el usuario lo pida

  try {
    const count = await Product.count({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      }
    })

    const products = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      },
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

    /*
      en la carpeta mocks hay un ejemplo de lo que tendria que devolver
      "list_products.json"
    */

    res.status(200).json({
      count,
      next: '',
      products
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createProduct = async (req, res) => {
  const {
    name,
    description,
    image,
    price,
    location,
    statusPub,
    statusProd,
    isFeatured,
    categories
  } = req.body
  try {
    const product = {
      name,
      description,
      image,
      price,
      location,
      statusPub,
      statusProd,
      isFeatured
    }

    const productDb = await Product.create(product) // hacer un include, investigar

    let categoriesDb = await Category.findAll({
      where: { name: categories.map((cat) => cat.name) }
    })

    if (!categoriesDb.length) {
      categoriesDb = await Category.bulkCreate(categories)
      // throw new Error('No product categories were found')
    }

    await productDb.setCategories(categoriesDb)

    const categoriesSeach = await productDb.getCategories()

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
