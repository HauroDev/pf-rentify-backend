const { User } = require('../db/db')
const { Op } = require('sequelize')
const { generateToken } = require('../utils/generateToken')
const login = async (req, res) => {
  const { uid, email } = req.body

  try {
    const user = await User.findOne({
      where: { [Op.and]: [{ uid }, { email }] }
    })

    // cuando el usuario se loguea y esta baneado , mandar un error

    if (!user) {
      throw new Error(402, 'Email or Password not valid')
    }
    const { role } = user.dataValues

    const { token, expireIn } = generateToken(uid, email, role, res)

    return res.status(200).json({
      user,
      auth_token: {
        token,
        expireIn
      }
    })
  } catch (error) {
    console.error('Credential not validated:', error)
    res.status(401).json({ error: 'Credential not validated' })
  }
}

module.exports = { login }
