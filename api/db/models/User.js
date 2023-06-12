const { DataTypes } = require('sequelize')
const { sequelize } = require('../db.js')

const User = sequelize.define('User', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true // consultar
  },
  membership: {
    type: DataTypes.ENUM(['normal', 'silver']),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pause', 'ban')
  }
})

module.exports = User
