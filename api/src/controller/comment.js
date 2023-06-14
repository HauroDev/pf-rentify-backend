const { Comment, Product } = require("../db/db");

const newComment = async (req, res) => {
  const { id, comment, puntuation, commentStatus, idProduct } = req.query;
  try {
    const newComment = await Comment.create({
      id,
      comment,
      puntuation,
      commentStatus,
      idProduct,
    });
    await newComment.addPorduct(idProduct);
    const recordComment = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: Product,

          through: { attributes: [] },
        },
      ],
    });
    res.json(recordComment);
  } catch (error) {
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

module.exports = { newComment, updateComment, destroyComment };

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
