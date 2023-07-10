const { User } = require('../db/db')

const isAdmin = (req, res, next) => {
  const { role } = req

  if (['sudo', 'admin'].includes(role)) next()
  else res.status(409).json({ error: 'User is not Authorized' })
}

const isSudo = (req, res, next) => {
  if (req.role === 'sudo') next()
  else res.status(409).json({ error: 'User is not Authorized' })
}

const isBannedUser = async (req, res, next) => {
  const uid = req.userId

  const user = await User.findOne({ where: { uid } })

  if (!user) next() // temporal ?
  else if (user.toJSON().status === 'banned') {
    res.status(403).json({ error: 'user is banned' })
  } else next()
}

module.exports = { isBannedUser, isSudo, isAdmin }
