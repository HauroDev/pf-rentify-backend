const { Op } = require('sequelize')
const { User, Product } = require('../db/db.js')

const getStatisticsUsers = async () => {
  const promises = [
    User.count(),
    User.count({
      where: {
        status: 'active'
      }
    }),
    User.count({
      where: {
        status: 'inactive'
      }
    }),
    User.count({
      where: {
        status: 'banned'
      }
    })
  ]

  const [total, active, inactive, banned] = await Promise.all(promises)

  return [
    {
      name: 'total',
      total
    },
    {
      name: 'active',
      total: active
    },
    {
      name: 'inactive',
      total: inactive
    },
    {
      name: 'banned',
      total: banned
    }
  ]
}

const getStatisticsProducts = async () => {
  const promises = [
    Product.count(),
    Product.count({ where: { statusPub: 'active' } }),
    Product.count({ where: { statusPub: 'inactive' } }),
    Product.count({ where: { statusPub: 'deleted' } })
  ]

  const [total, active, inactive, deleted] = await Promise.all(promises)

  return [
    {
      name: 'total',
      total
    },
    {
      name: 'active',
      total: active
    },
    {
      name: 'inactive',
      total: inactive
    },
    {
      name: 'deleted',
      total: deleted
    }
  ]
}

const getStatisticsUsersMembership = async () => {
  const promises = [
    User.count(),
    User.count({ where: { membership: 'basic' } }),
    User.count({
      where: { [Op.and]: [{ membership: 'basic' }, { status: 'active' }] }
    }),
    User.count({
      where: { [Op.and]: [{ membership: 'basic' }, { status: 'inactive' }] }
    }),
    User.count({
      where: { [Op.and]: [{ membership: 'basic' }, { status: 'banned' }] }
    }),
    User.count({ where: { membership: 'standard' } }),
    User.count({
      where: { [Op.and]: [{ membership: 'standard' }, { status: 'active' }] }
    }),
    User.count({
      where: { [Op.and]: [{ membership: 'standard' }, { status: 'inactive' }] }
    }),
    User.count({
      where: { [Op.and]: [{ membership: 'standard' }, { status: 'banned' }] }
    }),
    User.count({ where: { membership: 'premium' } }),
    User.count({
      where: { [Op.and]: [{ membership: 'premium' }, { status: 'active' }] }
    }),
    User.count({
      where: { [Op.and]: [{ membership: 'premium' }, { status: 'inactive' }] }
    }),
    User.count({
      where: { [Op.and]: [{ membership: 'premium' }, { status: 'banned' }] }
    })
  ]

  const [
    total,
    basic,
    basicActive,
    basicInactive,
    basicBanned,
    standard,
    standardActive,
    standardInactive,
    standardBanned,
    premium,
    premiumActive,
    premiumInactive,
    premiumBanned
  ] = await Promise.all(promises)

  return [
    {
      name: 'total',
      total
    },
    {
      name: 'basic',
      total: basic,
      active: basicActive,
      inactive: basicInactive,
      banned: basicBanned
    },
    {
      name: 'standard',
      total: standard,
      active: standardActive,
      inactive: standardInactive,
      banned: standardBanned
    },
    {
      name: 'premium',
      total: premium,
      active: premiumActive,
      inactive: premiumInactive,
      banned: premiumBanned
    }
  ]
}

const getStatistics = async (_req, res) => {
  try {
    const [users, products, usersMembership] = await Promise.all([
      getStatisticsUsers(),
      getStatisticsProducts(),
      getStatisticsUsersMembership()
    ])

    res.json({ users, products, usersMembership })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { getStatistics }
