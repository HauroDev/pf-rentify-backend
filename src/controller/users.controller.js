const { User } = require('../db/db')
const { CustomError } = require('../utils/customErrors')
const { Op } = require('sequelize')
const { getNextPage } = require('../utils/paginado')

// -- Obtener ususario por id (get userById)
// -- Crear nuevo usuario (post user)
// -- Actuliazar datos de usuario (put)
// -- Eliminar usuario (delete)
// -- Obtener usurio por memebresia (get)
// Crear nuevo usuario (POST /users)

const postUser = async (req, res) => {
  try {
    const { name, email, phone, image, uid } = req.body

    const existingUser = await User.findOne({ where: { email } })
    const existingUid = await User.findOne({ where: { uid } })
    if (existingUser) {
      throw new CustomError(400, 'Error correo existente')
    }
    if (existingUid) {
      throw new CustomError(400, 'Error usuario registrado')
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      image,
      uid
    })

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

// Llama todos los usuarios

const getAllUsers = async (req, res) => {
  let { offset, limit } = req.query

  offset = offset ? +offset : 0
  limit = limit ? +limit : 12

  try {
    const { rows, count } = await User.findAndCountAll({
      where: {
        role: 'user'
      },
      order: [['name', 'ASC']],
      offset,
      limit
    })

    const nextPage = getNextPage('user/all', offset, limit, count)

    return res.status(200).json({
      count,
      next: nextPage,
      results: rows
    })
  } catch (error) {
    console.error('Error updating user email:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const getUsersByName = async (req, res) => {
  const { name } = req.query
  let { offset, limit } = req.query

  offset = offset ? +offset : 0
  limit = limit ? +limit : 12

  try {
    const { rows, count } = await User.findAndCountAll({
      where: {
        name: { [Op.iLike]: `%${name}%` },
        role: 'user'
      },
      order: [['name', 'ASC']],
      offset,
      limit
    })

    let nextPage = getNextPage('user/name', offset, limit, count)

    if (nextPage) {
      nextPage = nextPage + `&name=${name}`
    }

    res.status(200).json({
      count,
      next: nextPage,
      results: rows
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getUsersByStatus = async (req, res) => {
  const { status } = req.query // Obtén el parámetro de consulta 'status'
  let { offset, limit } = req.query

  offset = offset ? +offset : 0
  limit = limit ? +limit : 12
  try {
    const { rows, count } = await User.findAndCountAll({
      where: {
        status, // Filtrar por el estado proporcionado
        role: 'user'
      },
      order: [['name', 'ASC']],
      offset,
      limit
    })
    // estaria genial si cambiaramos el endpoint a /user/state
    let nextPage = getNextPage('user', offset, limit, count)

    if (nextPage) {
      nextPage = nextPage + `&status=${status}`
    }
    res.status(200).json({
      count,
      next: nextPage,
      results: rows
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'Error en la búsqueda de usuarios por estado' })
  }
}

const getUsersByMembership = async (req, res) => {
  const { membership } = req.query // Obtén el parámetro de consulta 'membership'

  let { offset, limit } = req.query

  offset = offset ? +offset : 0
  limit = limit ? +limit : 12

  try {
    const allowedMemberships = ['basic', 'standard', 'premium']
    if (membership && !allowedMemberships.includes(membership)) {
      throw new CustomError(400, 'Invalid membership value')
    }

    const { count, rows } = await User.findAndCountAll({
      where: {
        membership, // Filtrar por la membresía proporcionada
        role: 'user'
      },
      order: [['name', 'ASC']],
      offset,
      limit
    })

    let nextPage = getNextPage('user/membership', offset, limit, count)

    if (nextPage) {
      nextPage = nextPage + `&membership=${membership}`
    }

    return res.status(200).json({
      count,
      next: nextPage,
      results: rows
    })
  } catch (error) {
    console.error('Error getting users by membership:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const updateUserName = async (req, res) => {
  const { idUser, name } = req.body

  try {
    const user = await User.findByPk(idUser)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Validar que el nuevo nombre no esté vacío
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' })
    }

    // Validar que el nuevo nombre tenga al menos 3 caracteres
    if (name.trim().length < 3) {
      return res
        .status(400)
        .json({ error: 'Name must have at least 3 characters' })
    }
    // Actualizar el nombre del usuario
    user.name = name
    await user.save()

    return res.status(200).json({ message: 'User name updated successfully' })
  } catch (error) {
    console.error('Error updating user name:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const updateUserPhone = async (req, res) => {
  const { idUser, phone } = req.body

  try {
    const user = await User.findByPk(idUser)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Validar que el número de teléfono sea un valor válido
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ error: 'Phone number is required' })
    }

    // Validar que el número de teléfono tenga al menos 6 dígitos
    if (phone.length < 5) {
      return res
        .status(400)
        .json({ error: 'Phone number must have at least 6 digits' })
    }

    // Validar que el número de teléfono tenga máximo 20 dígitos
    if (phone.length > 21) {
      return res
        .status(400)
        .json({ error: 'Phone number must have at most 20 digits' })
    }
    // Validar que el número de teléfono solo contenga números
    if (!/^\d+$/.test(phone)) {
      return res
        .status(400)
        .json({ error: 'Phone number must contain only digits' })
    }
    // Actualizar el número de teléfono del usuario
    user.phone = phone
    await user.save()

    return res
      .status(200)
      .json({ message: 'User phone number updated successfully' })
  } catch (error) {
    console.error('Error updating user phone number:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const updateUserEmail = async (req, res) => {
  const { idUser, email } = req.body
  const regeexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  try {
    const user = await User.findByPk(idUser)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Validar que el correo electrónico sea un valor válido
    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Validar que el correo electrónico tenga un formato válido
    if (!regeexEmail.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Actualizar el correo electrónico del usuario
    user.email = email
    await user.save()

    return res.status(200).json({ message: 'User email updated successfully' })
  } catch (error) {
    console.error('Error updating user email:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const updateUserStatus = async (req, res) => {
  const { idUser, status } = req.body

  try {
    const user = await User.findByPk(idUser)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Validar que el estado sea un valor válido
    const allowedStatus = ['active', 'inactive', 'paused', 'banned']
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' })
    }
    // Validar que el estado no sea igual al valor actual en la base de datos
    if (status === user.status) {
      return res
        .status(400)
        .json({ error: 'Status is already set to the provided value' })
    }
    // Actualizar el estado del usuario
    user.status = status
    await user.save()

    return res.status(200).json({ message: 'User status updated successfully' })
  } catch (error) {
    console.error('Error updating user status:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
const updateUserMembership = async (req, res) => {
  const { idUser, membership } = req.body

  try {
    const user = await User.findByPk(idUser)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Validar que el estado sea un valor válido
    const allowedMembership = ['basic', 'standard', 'premium']
    if (!membership || !allowedMembership.includes(membership)) {
      return res.status(400).json({ error: 'Invalid membership value' })
    }
    // Validar que el estado no sea igual al valor actual en la base de datos
    if (membership === user.membership) {
      return res
        .status(400)
        .json({ error: 'Status is already set to the provided value' })
    }
    // Actualizar el estado del usuario
    user.membership = membership
    await user.save()

    return res.status(200).json({ message: 'User status updated successfully' })
  } catch (error) {
    console.error('Error updating user status:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
const updateUserImage = async (req, res) => {
  const { idUser, image } = req.body

  try {
    const user = await User.findByPk(idUser)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Validar que la imagen sea una URL válida
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
    if (!urlRegex.test(image)) {
      return res.status(400).json({ error: 'Invalid image URL' })
    }

    // Actualizar la imagen del usuario
    user.image = image
    await user.save()

    return res.status(200).json({ message: 'User image updated successfully' })
  } catch (error) {
    console.error('Error updating user image:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  postUser,
  getAllUsers,
  getUser,
  getUsersByName,
  getUsersByStatus,
  getUsersByMembership,
  updateUserName,
  updateUserPhone,
  updateUserEmail,
  updateUserStatus,
  updateUserMembership,
  updateUserImage
}
