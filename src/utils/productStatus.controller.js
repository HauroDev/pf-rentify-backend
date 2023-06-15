const { Product } = require('../db/db.js')

// ! todas la funciones reciben id , pub o pordel producto como argumento
const productStatusPubController = async (idProd, stPub) => {
  const allowedStatuses = ['active', 'inactive', 'paused']
  if (!allowedStatuses.includes(stPub)) {
    throw new Error(`${stPub} not valid`)
  }

  const productFound = await Product.findByPk(idProd)

  if (!productFound) throw Error('Product not found')

  productFound.statusPub = stPub

  await productFound.save()

  return productFound
}

const productStatusController = async (idProd, stProduct) => {
  const allowedStatuses = ['available', 'rented']
  if (!allowedStatuses.includes(stProduct)) {
    throw new Error(`${stProduct} not valid`)
  }

  const productFound = await Product.findByPk(idProd)

  if (!productFound) throw Error('Product not found')

  productFound.statusProd = stProduct

  await productFound.save()

  return productFound
}

const productIsFeaturedStatusController = async (idProd) => {
  const productFound = await Product.findByPk(idProd)

  if (!productFound) throw Error('Product not found')

  productFound.isFeatured = !productFound.isFeatured

  await productFound.save()

  return productFound
}

module.exports = {
  productStatusPubController,
  productStatusController,
  productIsFeaturedStatusController
}
