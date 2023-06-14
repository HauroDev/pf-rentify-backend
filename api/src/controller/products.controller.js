const { Product, Category, User, Comment } = require('../db/db.js')
const { Op } = require('sequelize')

const getProducts = async (req, res) => {
  const { name, statusPub, statusProd, isFeatured, location } = req.query
  // agregar offset, limit, order = por fecha y condicional solo disponible cuando el usuario lo pida
  try {
    /*
      objeto de configuracion de busqueda
      si no se manda ninguna query,
      envia todos los productos
    */
    const searchOption = {
      name: {
        [Op.iLike]: `%${name}%`
      },
      statusProd,
      statusPub,
      isFeatured,
      location
    }

    const products = await Product.findAll({
      where: searchOption,
      include: [
        { model: Category, attributes: {} },
        { model: Comment, attributes: {} },
        { model: User, attributes: {} }
      ]
    })

    /*
      en la carpeta mocks hay un ejemplo de lo que tendria que devolver
      "list_products.json"
    */

    res.status(200).json({ products })
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

    const categoriesDb = await Category.findAll({
      where: { id: categories.map((cat) => cat.id) }
    })

    if (!categoriesDb.length) {
      throw new Error('No product categories were found')
    }

    await productDb.setCategories(categoriesDb)

    res
      .status(200)
      .json({ ...productDb, categories: categoriesDb.map((cat) => cat.name) })
  } catch (error) {
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
