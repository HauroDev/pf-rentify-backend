const { Comment, Product, User } = require("../db/db");

const validarUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
const newComment = async (req, res) => {
  const { comment, puntuation, commentStatus, idProd, idUser } = req.body;
  try {
    //Validations/////////////////
    if (!idProd || !idUser) throw new Error("User or product is null");

    const product = await Product.findByPk(idProd);
    if (!product) throw new Error("The Product does not exist");

    if (!validarUUID(idUser)) throw new Error("Username not format");

    const userToComment = await User.findByPk(idUser);

    if (!userToComment) throw new Error("Username does not exist");
    /////////////////////

    const newComment = await Comment.create({
      comment,
      puntuation,
      commentStatus,
    });

    await product.addComment(newComment);
    await userToComment.addComment(newComment);
    const recordComment = await Comment.findByPk(newComment.idComment, {
      include: [
        {
          model: Product,
        },
        {
          model: User,
        },
      ],
    });

    res.json(recordComment);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// const updateComment = async (req, res) => {
//   await Comment.update(
//     { id: id },
//     {
//       where: {
//         comment: null,
//       },
//     }
//   );
// };

// const destroyComment = async (req, res) => {
//   await Comment.destroy({
//     where: {
//       id: id,
//     },
//   });
// };

module.exports = { newComment };

// Definición del modelo de Comentario
// const Comentario = {
//   obtenerComentarios: async () => {
//     const query = 'SELECT * FROM comentarios';
//     const { rows } = await NewComment.query(query);
//     return rows;
//   },

//   obtenerComentarioPorId: async (comentarioId) => {
//     const query = 'SELECT * FROM comentarios WHERE id = $1';
//     const values = [comentarioId];
//     const { rows } = await NewComment.query(query, values);
//     return rows[0];
//   },

//   crearComentario: async (contenido, calificacion) => {
//     const query = 'INSERT INTO comentarios (contenido, calificacion) VALUES ($1, $2) RETURNING *';
//     const values = [contenido, calificacion];
//     const { rows } = await NewComment.query(query, values);
//     return rows[0];
//   },

//   actualizarComentario: async (comentarioId, contenido, calificacion) => {
//     const query = 'UPDATE comentarios SET contenido = $1, calificacion = $2 WHERE id = $3 RETURNING *';
//     const values = [contenido, calificacion, comentarioId];
//     const { rows } = await NewComment.query(query, values);
//     return rows[0];
//   },

//   eliminarComentario: async (comentarioId) => {
//     const query = 'DELETE FROM comentarios WHERE id = $1';
//     const values = [comentarioId];
//     await NewComment.query(query, values);
//   }
// };
