const { Product, Category, User, Comment } = require('../db/db.js')
const { Op } = require('sequelize')
const { obtenerNextPageProduct } = require('../utils/paginado.js')
const { createCustomError } = require('../utils/customErrors')

const getProducts = async (req, res) => {
  // agregar price entre un rango a futuro
  let { name, offset, limit, orderBy, orderType, idCategory } = req.query

  const whereOptions = name
    ? {
        name: {
          [Op.iLike]: `%${name}%`
        }
      }
    : {}

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
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereOptions,
      include: [
        {
          model: Category,
          through: { attributes: [] },
          as: 'categories',
          where: idCategory ? { idCategory: +idCategory } : {}
        }
      ],
      distinct: true,
      offset: offset || 0,
      limit: limit || 12,
      order: orderOptions
    })

    offset = offset || offset > 0 ? +offset : 0
    limit = limit ? +limit : 12

    let queryExtend = obtenerNextPageProduct(offset, limit, count)
    if (queryExtend) {
      queryExtend += name ? `&name=${name}` : ''
      queryExtend += orderBy ? `&orderBy=${orderBy}` : ''
      queryExtend += orderType ? `&orderType=${orderType}` : ''
      queryExtend += idCategory ? `&idCategory=${idCategory}` : ''
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
  const { idUser, ...product } = req.body

  try {
    const categoriesDb = await Category.findAll({
      where: { name: product.categories?.map((cat) => cat.name) }
    })
    // Validaciones
    if (!categoriesDb.length) {
      throw createCustomError(
        404,
        'The request could not be completed, Categories not found'
      )
    }
    // categoriesDb = await Category.bulkCreate(product?.categories)

    if (!idUser) {
      throw createCustomError(
        404,
        'The request could not be completed, idUser is required to create a product.'
      )
    }

    const user = await User.findByPk(idUser)

    if (!user) {
      throw createCustomError(
        404,
        'The request could not be completed, User is not found.'
      )
    }
    // fin de Validaciones

    const productDb = await Product.create(product)
    await productDb.addUser(user)

    await productDb.addCategories(categoriesDb)

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
    if (!id) {
      throw createCustomError(
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
      throw createCustomError(
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
