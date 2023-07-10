const { Op } = require('sequelize')
const { User, Product, Order, Suscription } = require('../db/db.js')

const getStatisticsUsers = async () => {
  const promises = [
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

  const [active, inactive, banned] = await Promise.all(promises)

  return [
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
    Product.count({ where: { statusPub: 'active' } }),
    Product.count({ where: { statusPub: 'inactive' } }),
    Product.count({ where: { statusPub: 'deleted' } })
  ]

  const [active, inactive, deleted] = await Promise.all(promises)

  return [
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

const getStatisticsFeaturedProducts = async () => {
  const promises = [
    Product.count({ where: { isFeatured: true, statusPub: 'active' } }),
    Product.count({ where: { isFeatured: false, statusPub: 'active' } })
  ]

  const [feature, normal] = await Promise.all(promises)

  return [
    { name: 'feature', total: feature },
    { name: 'normal', total: normal }
  ]
}

const getStatisticsOrders = async () => {
  const promises = [
    Order.count({ where: { status: 'approved' } }),
    Order.count({ where: { status: 'pending' } }),
    Order.count({ where: { status: 'rejected' } })
  ]

  const [approved, pending, rejected] = await Promise.all(promises)

  return [
    { name: 'approved', total: approved },
    { name: 'pending', total: pending },
    { name: 'rejected', total: rejected }
  ]
}

const getStatisticsSuscriptions = async () => {
  const promises = [
    Suscription.count({ where: { status: 'pending' } }),
    Suscription.count({ where: { status: 'authorized' } })
  ]

  const [pending, authorized] = await Promise.all(promises)

  return [
    { name: 'pending', total: pending },
    { name: 'authorized', total: authorized }
  ]
}

module.exports = {
  getStatisticsProducts,
  getStatisticsUsers,
  getStatisticsUsersMembership,
  getStatisticsFeaturedProducts,
  getStatisticsOrders,
  getStatisticsSuscriptions
}
