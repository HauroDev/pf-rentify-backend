const {
  getStatisticsUsers,
  getStatisticsProducts,
  getStatisticsUsersMembership,
  getStatisticsFeaturedProducts,
  getStatisticsOrders,
  getStatisticsSuscriptions
} = require('../utils/adminStatistics')

const getStatistics = async (_req, res) => {
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

const getAdminsSudo = async (req, res) => {
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
module.exports = { getStatistics, getAdminsSudo }
