const { User } = require('../db/db.js')

const userMembershipStatusController = async (idUser, mbship) => {
  const allowedMemberships = ['standard', 'premium']
  if (!allowedMemberships.includes(mbship)) {
    throw new Error(`${mbship} not valid`)
  }

  const userFound = await User.findByPk(idUser)

  if (!userFound) throw Error('User not valid')

  userFound.membership = mbship

  await userFound.save()

  return userFound
}

const userStatusContoller = async (idUser, status) => {
  const allowedUserStatuses = ['active', 'inactive', 'paused', 'banned']
  if (!allowedUserStatuses.includes(status)) {
    throw new Error(`${status} not valid`)
  }

  const userFound = await User.findByPk(idUser)

  if (!userFound) throw Error('User not valid')

  userFound.status = status

  await userFound.save()

  return userFound
}

module.exports = {
  userStatusContoller,
  userMembershipStatusController
}
