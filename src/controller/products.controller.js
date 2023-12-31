const {
  Product,
  Category,
  User,
  Comment,
  Country,
  UserProduct
} = require('../db/db')
const { Op } = require('sequelize')
const { getNextPage } = require('../utils/paginado.js')
const { CustomError } = require('../utils/customErrors.js')
// Configuración de Nodemailer
const { sendProductCreatedEmail } = require('../config/nodemailer')

const getFilterProducts = async (req, res) => {
  let {
    name,
    offset,
    limit,
    orderBy,
    orderType,
    idCategory,
    idCountry,
    location,
    state
  } = req.query

  const whereOptions = {
    statusPub: 'active'
  }

  if (name) {
    whereOptions.name = {
      [Op.iLike]: `%${name}%`
    }
  }

  if (idCountry) {
    whereOptions.idCountry = +idCountry
    if (state) {
      whereOptions.state = {
        [Op.iLike]: `%${state}%`
      }

      if (location) {
        whereOptions.location = {
          [Op.iLike]: `%${location}%`
        }
      }
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

  offset = offset || offset > 0 ? +offset : 0
  limit = limit ? +limit : 12

  try {
    const result = await Product.findAndCountAll({
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
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ],
      distinct: true,
      offset,
      limit,
      order: orderOptions
    })

    const { rows: products, count } = result

    let queryExtend = getNextPage('products', offset, limit, count)
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

      if (idCountry) {
        params.push(`idCountry=${idCountry}`)
        if (state) {
          params.push(`state=${state}`)
          if (location) {
            params.push(`location=${location}`)
          }
        }
      }

      queryExtend += params.length > 0 ? `&${params.join('&')}` : ''
    }

    res.status(200).json({
      count,
      next: queryExtend,
      results: products
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

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

    categoriesSearch = categoriesSearch.map((cat) => {
      // cada categoria encontrada en la asociacion
      // es un objeto JSON por lo que es necesario
      // para editarlo correctamente hacer esto
      cat = cat.toJSON()

      delete cat.createdAt
      delete cat.updatedAt
      delete cat.CategoryProduct

      return cat
    })

    delete countrySearch.createdAt
    delete countrySearch.updatedAt

    // Envío del correo electrónico
    const { name, price, image } = productDb.toJSON()
    const userEmail = user.email
    await sendProductCreatedEmail(userEmail, { name, price, image })

    res.status(200).json({
      ...productDb.toJSON(),
      categories: categoriesSearch,
      country: countrySearch
    })
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const getAllProducts = async (req, res) => {
  let { offset, limit, name } = req.query

  const whereOptions = {}

  if (name) {
    whereOptions.name = {
      [Op.iLike]: `%${name}%`
    }
  }

  try {
    offset = offset ? +offset : 0
    limit = limit ? +limit : 12

    // Realiza la consulta para obtener todos los productos con paginación
    const { rows, count } = await Product.findAndCountAll({
      where: whereOptions,
      order: [['createdAt', 'DESC']],
      offset,
      limit
    })

    // Construir la URL de la siguiente página
    const nextPage = getNextPage('products/all', offset, limit, count)

    // Devuelve los productos encontrados y la URL de la siguiente página como respuesta
    return res.json({
      count,
      next: nextPage,
      results: rows
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
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
        {
          model: Country,
          as: 'country',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ]
    })

    if (!product) {
      throw new CustomError(
        404,
        `The request could not be completed, Product id:${id} is not found`
      )
    }

    // cambiarlo usando la tabla UserProduct y el type 'owner'

    const userOwner = await UserProduct.findOne({
      where: { [Op.and]: [{ idProd: id }, { type: 'owner' }] }
    })

    const infoUser = await User.findByPk(userOwner.idUser)

    // agregar comentarios

    const { count: total, rows: comments } = await Comment.findAndCountAll({
      where: { idProd: id, commentStatus: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    const promises = [1, 2, 3, 4, 5].map((puntuation) =>
      Comment.count({
        where: { idProd: id, commentStatus: true, puntuation }
      })
    )

    const [s1, s2, s3, s4, s5] = await Promise.all(promises)

    const totalPuntuation = await Comment.sum('puntuation', {
      where: { idProd: id, commentStatus: true }
    })

    const average = totalPuntuation / total

    res.status(200).json({
      ...product.toJSON(),
      users: [infoUser],
      reviews: { total, average, stars: { s1, s2, s3, s4, s5 }, comments }
    })
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const getUserProducts = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findByPk(id)

    if (!user) {
      throw new CustomError(404, 'User not valid')
    }

    const products = await user.getProducts({
      include: [{ model: Category, as: 'categories' }],
      through: { attributes: [] }
    })

    const filteredProducts = products.filter(
      (product) =>
        product.statusPub !== 'deleted' && product.UserProduct.type === 'owner'
    )

    res.status(200).json(filteredProducts)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

// Controlador para actualizar el statusProd de un producto
const updateProductstatusPub = async (req, res) => {
  const { idProd, statusPub } = req.body // Suponiendo que recibes el ID del producto como parámetro en la URL

  try {
    // Buscar el producto por su ID
    const product = await Product.findByPk(idProd)

    if (!product) {
      throw new Error(404, 'Product is not exists')
    }

    // Validar que statusPub sea uno de los valores permitidos
    const allowedStatus = ['active', 'inactive', 'deleted']
    if (!allowedStatus.includes(statusPub)) {
      throw new CustomError(
        400,
        'Invalid value for statusPub. It must be one of: active, inactive, delete'
      )
    }
    // Validar que el estado no sea igual al valor actual en la base de datos
    if (statusPub === product.statusPub) {
      throw new CustomError(400, 'Status is already set to the provided value')
    }

    // Actualizar el statusProd del producto
    product.statusPub = statusPub
    await product.save()

    res.json({ message: 'Product status updated successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const updateProductName = async (req, res) => {
  const { idProd, name } = req.body

  try {
    // Buscar el producto por su ID
    const product = await Product.findByPk(idProd)

    if (!product) {
      throw new CustomError(404, 'Product not found')
    }

    // Actualizar el nombre del producto
    product.name = name
    await product.save()

    res.status(200).json({ message: 'Product name updated successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const updateProductPrice = async (req, res) => {
  const { idProd, price } = req.body

  try {
    if (isNaN(price)) {
      throw new CustomError(400, 'Price must be a number')
    }
    // Buscar el producto por su ID
    const product = await Product.findByPk(idProd)

    if (!product) {
      throw new CustomError(404, 'Product not found')
    }

    // Actualizar el precio del producto
    product.price = price
    await product.save()

    res.json({ message: 'Product price updated successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateProductIsFeatured = async (req, res) => {
  const { idProd, isFeatured } = req.body

  try {
    const product = await Product.findByPk(idProd)
    if (!product) {
      throw new CustomError(404, 'Product not found')
    }

    if (typeof isFeatured !== 'boolean') {
      throw new CustomError(
        400,
        'Invalid value for isFeatured. It must be a boolean.'
      )
    }
    // Actualizar el campo isFeatured del producto
    product.isFeatured = isFeatured
    await product.save()

    res.status(200).json({ message: 'Product isFeatured updated successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const getProductByFeature = async (req, res) => {
  try {
    const { isFeatured } = req.query // Obtén el parámetro de consulta 'feature'

    // Realizar la búsqueda de productos por característica
    const products = await Product.findAll({
      where: {
        isFeatured // Filtrar por la característica proporcionada
      }
    })

    return res.status(200).json(products)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error en la búsqueda de productos por característica' })
  }
}

module.exports = {
  getFilterProducts,
  getAllProducts,
  createProduct,
  getProductById,
  getUserProducts,
  updateProductstatusPub,
  updateProductName,
  updateProductPrice,
  updateProductIsFeatured,
  getProductByFeature
}
