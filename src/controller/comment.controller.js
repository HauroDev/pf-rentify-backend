// const { Op } = require('sequelize')
const { Comment, Product, User } = require('../db/db')
const { CustomError } = require('../utils/customErrors')

const validarUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}
const newComment = async (req, res) => {
  const { comment, puntuation, idProd, idUser } = req.body
  try {
    // Validations  //
    if (!idProd || !idUser) {
      throw new CustomError(
        409,
        'The request could not be completed, User or Product is null'
      )
    }
    const product = await Product.findByPk(idProd)
    if (!product) {
      throw new CustomError(
        409,
        'The request could not be completed, idProd does not exist'
      )
    }
    if (!validarUUID(idUser)) {
      throw new CustomError(
        409,
        'The request could not be completed, Username not format'
      )
    }
    const userToComment = await User.findByPk(idUser)

    if (!userToComment) {
      throw new CustomError(
        409,
        'The request could not be completed, Username does not exist'
      )
    }

    // const hasCommentedUser = await Comment.findOne({
    //   where: { [Op.and]: [{ idUser }, { idProd }] }
    // })

    // if (hasCommentedUser) {
    //   throw new CustomError(400, 'User has commented this product')
    // }
    // fin validaciones //

    const newComment = await Comment.create({
      comment,
      puntuation
    })

    await product.addComment(newComment)
    await userToComment.addComment(newComment)

    const recordComment = await Comment.findByPk(newComment.idComment)

    res.json(recordComment)
  } catch (error) {
    res.status(error?.status || 500).json({ error: error?.message })
  }
}

const getCommentsByProductId = async (req, res) => {
  const { idProduct } = req.params

  try {
    // Obtener comentarios del producto según el idProduct
    const comments = await Comment.findAll({
      where: { idProd: idProduct }
    })
    console.log(comments)
    res.status(200).json(comments)
  } catch (error) {
    console.error('Error al obtener comentarios:', error)
    res.status(500).json({ error: 'Error al obtener comentarios' })
  }
}

module.exports = { newComment, getCommentsByProductId }
