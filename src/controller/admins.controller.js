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

module.exports = { getStatistics }
