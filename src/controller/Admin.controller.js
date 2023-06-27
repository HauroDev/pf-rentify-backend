const { User, Product } = require('../db/db.js')

const getStatisticsUsers = async () => {
  const total = await User.count()
  const active = await User.count({
    where: {
      status: 'active'
    }
  })
  const inactive = await User.count({
    where: {
      status: 'inactive'
    }
  })
  const banned = await User.count({
    where: {
      status: 'banned'
    }
  })

  return { total, active, inactive, banned }
}

const getStatisticsProducts = async () => {
  const total = await Product.count()
  const active = await Product.count({ where: { statusPub: 'active' } })
  const inactive = await Product.count({ where: { statusPub: 'inactive' } })
  const deleted = await Product.count({ where: { statusPub: 'deleted' } })

  return { total, active, inactive, deleted }
}

const getStatistics = async (_req, res) => {
  try {
    const [users, products, comments] = await Promise.all([
      getStatisticsUsers(),
      getStatisticsProducts()
    ])

    res.json({ users, products, comments })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getStatistics }
