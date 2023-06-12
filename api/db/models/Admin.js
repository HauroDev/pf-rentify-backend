const { DataTypes } = require('sequelize')
const { sequelize } = require('../db.js')

const Admin = sequelize.define('Admin', {
  IdAdmin: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
})

module.exports = Admin
