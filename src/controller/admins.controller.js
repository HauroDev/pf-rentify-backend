const { Op } = require('sequelize')
const { User, Order } = require('../db/db.js')
const {
  getStatisticsUsers,
  getStatisticsProducts,
  getStatisticsUsersMembership,
  getStatisticsFeaturedProducts,
  getStatisticsOrders,
  getStatisticsSuscriptions
} = require('../utils/adminStatistics')
const { CustomError } = require('../utils/customErrors.js')
const { getNextPage } = require('../utils/paginado.js')

const getStatistics = async (req, res) => {
  const roleUser = req.role

  try {
    if (roleUser !== 'admin' || roleUser !== 'sudo') {
      throw new CustomError(400, 'No eres un admin')
    }
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

  try {
    if (roleUser !== 'admin' || roleUser !== 'sudo') {
      throw new CustomError(400, 'No eres un admin')
    }
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
  const { search, role } = req.query
  let { offset, limit } = req.query

  offset = offset ? +offset : 0
  limit = limit ? +limit : 12

  try {
    const { rows, count } = await User.findAndCountAll({
      where: {
        role: role || ['admin', 'sudo'],
        [Op.or]: [
          { name: { [Op.iLike]: search ? `%${search}%` : '%%' } },
          { email: { [Op.iLike]: search ? `%${search}%` : '%%' } }
        ]
      },
      order: [['email', 'ASC']],
      limit,
      offset
    })

    let nextPage = getNextPage('admin/admins-sudo', offset, limit, count)

    if (nextPage) {
      let queryParams = ''

      if (role) queryParams += `&role=${role}`
      if (search) queryParams += `&search=${search}`

      nextPage += queryParams
    }

    res.status(200).json({
      count,
      next: nextPage,
      results: rows
    })
  } catch (error) {
    console.error('Error al obtener los usuarios:', error)
    throw error
  }
}

const updateNameAdmin = async (req, res) => {
  const roleUser = req.role

  const { idUser, name } = req.body

  try {
    if (roleUser !== 'admin' || roleUser !== 'sudo') {
      throw new CustomError(400, 'No eres un admin')
    }
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

  const { idUser, phone } = req.body

  try {
    if (roleUser !== 'admin' || roleUser !== 'sudo') {
      throw new CustomError(400, 'No eres un admin')
    }
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

const updateRoleAdmin = async (req, res) => {
  const roleUser = req.role

  const { idUser, role } = req.body

  try {
    if (roleUser !== 'admin' || roleUser !== 'sudo') {
      throw new CustomError(400, 'No eres un admin')
    }

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

const updateImageAdmin = async (req, res) => {
  const roleUser = req.role

  const { idUser, image } = req.body

  try {
    if (roleUser !== 'admin' || roleUser !== 'sudo') {
      throw new CustomError(400, 'No eres un admin')
    }
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

const getOrdersByIdUser = async (req, res) => {
  const { idUser } = req.params
  const { status } = req.query
  let { offset, limit } = req.query

  offset = offset ? +offset : 0
  limit = limit ? +limit : 12

  const whereOption = { idUser }

  if (['approved', 'pending', 'rejected'].includes(status)) {
    whereOption.status = status
  }

  try {
    const hasUser = await User.count({ where: { idUser } })

    if (!hasUser) throw new CustomError(404, 'uses is not found')

    const { rows, count } = await Order.findAndCountAll({
      where: whereOption,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    })

    let nextPage = getNextPage(
      `admin/order/user/${idUser}`,
      offset,
      limit,
      count
    )

    if (nextPage) {
      let queryParams = ''

      if (status) queryParams += `&status=${status}`

      nextPage = nextPage + queryParams
    }
    res.status(200).json({
      count,
      next: nextPage,
      results: rows
    })
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}

module.exports = {
  getOrdersByIdUser,
  updateImageAdmin,
  updateRoleAdmin,
  updatePhoneAdmin,
  updateNameAdmin,
  getStatistics,
  createAdmin,
  getAdminsSudo
}
