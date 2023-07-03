const isAdmin = (req, res, next) => {
  const { role } = req

  if (['sudo', 'admin'].includes(role)) next()
  else res.status(409).json({ error: 'User not Authorized' })
}

const isSudo = (req, res, next) => {
  if (req.role === 'sudo') next()
  else res.status(409).json({ error: 'User is not Authorized' })
}

module.exports = { isSudo, isAdmin }
