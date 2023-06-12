const { DataTypes } = require('sequelize')
const { sequelize } = require('../db.js')

const Usuario = sequelize.define('Usuario', {
  Id: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false
  },
  nombre: {
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
  membresia: {
    type: DataTypes.ENUM(['normal', 'plata']),
    allowNull: false
  }
})

module.exports = Usuario
