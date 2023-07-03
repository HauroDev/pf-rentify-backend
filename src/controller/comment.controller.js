const { Op } = require('sequelize')
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

    const hasCommentedUser = await Comment.findOne({
      where: { [Op.and]: [{ idUser }, { idProd }] }
    })

    if (hasCommentedUser) {
      throw new CustomError(400, 'User has commented this product')
    }
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
    res.status(error.status || 500).json({ error: error.message })
  }
}

const getCommentsByProductId = async (req, res) => {
  const { idProduct } = req.params

  try {
    // Obtener comentarios del producto según el idProduct
    const comments = await Comment.findAll({
      where: { idProd: idProduct }
    })
    res.status(200).json(comments)
  } catch (error) {
    console.error('Error al obtener comentarios:', error)
    res.status(500).json({ error: 'Error al obtener comentarios' })
  }
}

const editComment = async (req, res) => {
  const { idUser, idProd, idComment, comment, puntuation } = req.body
  try {
    if (!idUser) throw new CustomError(400, 'idUser is required')
    if (!idProd) throw new CustomError(400, 'idProd is required')
    if (!idComment) throw new CustomError(400, 'idComment is required')
    if (!comment || !puntuation) {
      throw new CustomError(400, 'comment and puntutation is required')
    }
    const user = await User.findByPk(idUser)
    const product = await Product.findByPk(idProd)
    const commentUser = await Comment.findByPk(idComment)

    if (!user) throw new CustomError(404, 'User not exists')
    if (!product) throw new CustomError(404, 'Product not exists')
    if (!commentUser) throw new CustomError(404, 'Comment not exists')

    if (
      commentUser.idUser !== user.idUser ||
      commentUser.idProd !== product.idProd
    ) {
      throw new CustomError(400, 'user or product is can not edit this comment')
    }

    commentUser.comment = comment
    commentUser.puntuation = puntuation
    commentUser.save()

    res.json(commentUser)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const deletedComment = async (req, res) => {
  const { idUser, idProd, idComment, commentStatus } = req.body

  try {
    if (!idUser) throw new CustomError(400, 'idUser is required')
    if (!idProd) throw new CustomError(400, 'idProd is required')
    if (!idComment) throw new CustomError(400, 'idComment is required')
    if (!commentStatus) throw new CustomError(400, 'commentStatus is required')

    const user = await User.findByPk(idUser)
    const product = await Product.findByPk(idProd)
    const commentUser = await Comment.findByPk(idComment)

    if (!user) throw new CustomError(404, 'User not exists')
    if (!product) throw new CustomError(404, 'Product not exists')
    if (!commentUser) throw new CustomError(404, 'Comment not exists')

    if (
      commentUser.idUser !== user.idUser ||
      commentUser.idProd !== product.idProd
    ) {
      throw new CustomError(400, 'user or product is can not edit this comment')
    }

    commentUser.commentStatus = commentStatus

    commentUser.save()

    res.json(commentStatus)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

module.exports = {
  newComment,
  getCommentsByProductId,
  editComment,
  deletedComment
}
