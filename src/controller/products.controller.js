const { Product, Category, User, Comment } = require('../db/db.js')
const { Op } = require('sequelize')
const { obtenerNextPageProduct } = require('../utils/paginado.js')

const getProducts = async (req, res) => {
  // agregar price entre un rango a futuro
  let { name, offset, limit, orderAlpha, orderPrice, orderDate } = req.query;
  const {categories} = req.body
  //categories:[{idCategory,name}]
  const whereOptions = name
    ? {
        name: {
          [Op.iLike]: `%${name}%`
        }
      }
    : {}
  

  const orderOptions = []

  if (orderPrice && (orderPrice === 'ASC' || orderPrice === 'DESC')) {
    orderOptions.push(['price', orderPrice])
  }

  if (orderAlpha && (orderAlpha === 'ASC' || orderAlpha === 'DESC')) {
    orderOptions.push(['name', orderAlpha])
  }

  if (orderDate && (orderDate === 'ASC' || orderDate === 'DESC')) {
    orderOptions.push(['createdAt', orderDate])
  }



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
      order: orderOptions.length ? orderOptions : undefined
    })

    offset = offset || offset > 0 ? +offset : 0
    limit = limit ? +limit : 12

    let productsJSON = products.toJSON();
    let productResponse = [];
    if(categories.length){
      for (const prod of productsJSON) {
        for (const catg of categories) {
          if(prod.Categories.include(catg) && productResponse.some(p=>p.idProd === prod.idProd)){
            productResponse.push(prod)
          }
        }
      }
    }


    res.status(200).json({
      count,
      next: obtenerNextPageProduct(offset, limit, count),
      products: productResponse.length ? productResponse : productsJSON
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
