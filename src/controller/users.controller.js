const { User } = require('../db/db')
const { CustomError } = require('../utils/customErrors')

// -- Obtener ususario por id (get userById)
// -- Crear nuevo usuario (post user)
// -- Actuliazar datos de usuario (put)
// -- Eliminar usuario (delete)
// -- Obtener usurio por memebresia (get)
// Crear nuevo usuario (POST /users)

const postUser = async (req, res) => {
  try {
    const regeexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // Obtén los datos del cuerpo de la solicitud
    const { name, email, phone, image, uid } = req.body
    // Verifica si el email ya existe en la base de datos
    const existingUser = await User.findOne({ where: { email } })
    const existingUid = await User.findOne({ where: { uid } })
    // const numbeUser = await User.findOne({ where: { phone } })
    // verificacion de formato de regeex para correo electronico

    if (!regeexEmail.test(email)) {
      throw new CustomError(400, 'formato de correo no valido ')
    } else if (existingUser) {
      // Si el email ya existe, devuelve una respuesta de error
      throw new CustomError(400, 'Error correo existente')
    } else if (existingUid) {
      // Si el email ya existe, devuelve una respuesta de error
      throw new CustomError(400, 'Error usuario registrado')
    }
    // else if (numbeUser) {
    //   throw new CustomError(400, 'Error number phone')
    // }

    // Crea un nuevo usuario en la base de datos
    const newUser = await User.create({
      name,
      email,
      phone,
      image,
      uid,
      membership:'standard',
      status:'active'
    })

    // Envía la respuesta con el usuario creado
    res.status(201).json(newUser)
  } catch (error) {
    console.log(error)
    // En caso de error, envía una respuesta de error
    res.status(error?.status || 500).json({ error: error?.message })
  }
}
// Obtener usuario por ID (GET)
const getUser = async (req, res) => {
  try {
    const { id } = req.params
    const userId = await User.findOne({
      where: {
        idUser: id
      }
    })
    if (!userId) throw new CustomError(404, 'usuario no existente')

    return res.status(200).json(userId)
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ error: error?.message || 'Error en la busqueda de users' })
  }
}

const getUsersByStatus = async (req, res) => {
    try {
      const { status } = req.query; // Obtén el parámetro de consulta 'status'
      const users = await User.findAll({
        where: {
          status: status // Filtrar por el estado proporcionado
        }
      });
  
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error en la búsqueda de usuarios por estado' });
    }
  };


// // Eliminar usuario (DELETE)
// const deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const deletedUser = await User.destroy({ where: { id } });

//         if (deletedUser === 1) {
//             res.json({ message: 'Usuario eliminado correctamente' });
//         } else {
//             res.status(404).json({ error: 'Usuario no encontrado' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error al eliminar el usuario' });
//     }
// }


<<<<<<< HEAD


module.exports = { postUser, getUser,getUsersByStatus
//   putUser, deleteUser, getUserMember
     };
