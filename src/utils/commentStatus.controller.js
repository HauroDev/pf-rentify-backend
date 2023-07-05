// funcion para modificar Comments
const { Comment } = require('../db/db.js')

const commentStatusController = async (idComment) => {
  // si recibimos iddelcomentario
  // idComment --> tiene que ser number
  const commentFound = await Comment.findByPk(idComment)
  // se puede dar un return o manejar de otra forma si esta función se usa en la ruta de Comment
  if (!commentFound) throw Error('Comment not found')
  // cambia de true false
  commentFound.commentStatus = !commentFound.commentStatus

  await commentFound.save()

  return commentFound
}

module.exports = {
  commentStatusController
}
