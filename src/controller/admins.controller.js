const { Op } = require('sequelize')
const { User } = require('../db/db.js')
const {
  getStatisticsUsers,
  getStatisticsProducts,
  getStatisticsUsersMembership,
  getStatisticsFeaturedProducts,
  getStatisticsOrders,
  getStatisticsSuscriptions
} = require('../utils/adminStatistics')
const { CustomError } = require('../utils/customErrors.js')

const getStatistics = async (_req, res) => {
  const roleUser = req.role

  if(roleUser !== "admin"||roleUser !=="sudo") throw new CustomError(400, "No eres un admin")
  try {
    const [users, products, usersMembership, featured, orders, suscriptions] =
      await Promise.all([
        getStatisticsUsers(),
        getStatisticsProducts(),
        getStatisticsUsersMembership(),
        getStatisticsFeaturedProducts(),
        getStatisticsOrders(),
        getStatisticsSuscriptions()
      ])

    res.json({
      users,
      'user-membership': usersMembership,
      products,
      'products-featured': featured,
      orders,
      suscriptions
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createAdmin = async (req, res) => {
  const roleUser = req.role

  if(roleUser !== "admin"||roleUser !=="sudo") throw new CustomError(400, "No eres un admin")

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
      uid,
      membership: 'premium',
      role: 'admin'
    })

    res.status(201).json(newUser)
  } catch (error) {
    res.status(error?.status || 500).json({ error: error?.message })
  }
}

const getAdminsSudo = async (req, res) => {
  const roleUser = req.role

  if(roleUser !== "admin"||roleUser !=="sudo") throw new CustomError(400, "No eres un admin")

  const { name, role } = req.query
  try {
    const whereClause = {}

    if (name) {
      whereClause.name = { [Op.iLike]: `%${name}%` }
    }

    if (role === 'admin' || role === 'sudo') {
      whereClause.role = role
    } else {
      whereClause.role = ['admin', 'sudo']
    }

    const users = await User.findAll({
      where: whereClause
    })

    // Hacer algo con los usuarios obtenidos
    console.log(users)

    // Retornar los usuarios si necesitas utilizarlos fuera de esta función
    return res.status(200).json(users)
  } catch (error) {
    console.error('Error al obtener los usuarios:', error)
    throw error
  }
}

const updateNameAdmin = async (req, res) => {
  const roleUser = req.role

  if(roleUser !== "admin"||roleUser !=="sudo") throw new CustomError(400, "No eres un admin")

  const { idUser, name } = req.body

  try {
    const user = await User.findByPk(idUser)

    if (!user) throw new CustomError(404, 'user is not exists')

    if (!name) throw new CustomError(400, 'name is required')

    user.name = name

    user.save()

    res.json(user)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const updatePhoneAdmin = async (req, res) => {
  const roleUser = req.role

  if(roleUser !== "admin"||roleUser !=="sudo") throw new CustomError(400, "No eres un admin")

  const { idUser, phone } = req.body

  try {
    const user = await User.findByPk(idUser)

    if (!user) throw new CustomError(404, 'user is not exists')

    if (!phone) throw new CustomError(400, 'phone is required')

    user.phone = phone

    user.save()

    res.json(user)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const updateEmailAdmin = async (req, res) => {
  const roleUser = req.role

  if(roleUser !== "admin"||roleUser !=="sudo") throw new CustomError(400, "No eres un admin")
  const { idUser, email } = req.body

  try {
    const user = await User.findByPk(idUser)

    if (!user) throw new CustomError(404, 'user is not exists')

    if (!email) throw new CustomError(400, 'email is required')

    user.email = email

    user.save()

    res.json(user)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const updateStatusAdmin = async (req, res) => {
  const roleUser = req.role

  if(roleUser !== "admin"||roleUser !=="sudo") throw new CustomError(400, "No eres un admin")

  const { idUser, status } = req.body

  try {
    const user = await User.findByPk(idUser)

    if (!user) throw new CustomError(404, 'user is not exists')

    if (!status) throw new CustomError(400, 'status is required')

    if (!['active', 'inactive', 'banned'].includes(status)) {
      throw new CustomError(
        400,
        'status should have been "active", "inactive" or "banned"'
      )
    }

    user.status = status

    user.save()

    res.json(user)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const updateRoleAdmin = async (req, res) => {
  const roleUser = req.role

  if(roleUser !== "admin"||roleUser !=="sudo") throw new CustomError(400, "No eres un admin")

  const { idUser, role } = req.body

  try {
    const user = await User.findByPk(idUser)

    if (!user) throw new CustomError(404, 'user is not exists')

    if (!role) throw new CustomError(400, 'role is required')

    if (!['admin', 'sudo'].includes(role)) {
      throw new CustomError(400, 'role should have been "admin" or "sudo"')
    }

    user.role = role

    user.save()

    res.json(user)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const updateMembershipAdmin = async (req, res) => {
  const roleUser = req.role

  if(roleUser !== "admin"||roleUser !=="sudo") throw new CustomError(400, "No eres un admin")

  const { idUser, membership } = req.body

  try {
    const user = await User.findByPk(idUser)

    if (!user) throw new CustomError(404, 'user is not exists')

    if (!membership) throw new CustomError(400, 'membership is required')

    if (!['basic', 'standard', 'premium'].includes(membership)) {
      throw new CustomError(
        400,
        'membership should have been "basic", "standard" or "premium"'
      )
    }

    user.membership = membership

    user.save()

    res.json(user)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

const updateImageAdmin = async (req, res) => {
  const roleUser = req.role

  if(roleUser !== "admin"||roleUser !=="sudo") throw new CustomError(400, "No eres un admin")
  
  const { idUser, image } = req.body

  try {
    const user = await User.findByPk(idUser)

    if (!user) throw new CustomError(404, 'user is not exists')

    if (!image) throw new CustomError(400, 'image is required')

    user.image = image

    user.save()

    res.json(user)
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

module.exports = {
  updateImageAdmin,
  updateMembershipAdmin,
  updateRoleAdmin,
  updateStatusAdmin,
  updateEmailAdmin,
  updatePhoneAdmin,
  updateNameAdmin,
  getStatistics,
  createAdmin,
  getAdminsSudo
}
