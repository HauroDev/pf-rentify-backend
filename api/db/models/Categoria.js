const { DataTypes } = require('sequelize')
const { sequelize } = require('../db.js')

const Categoria = sequelize.define('Categoria', {
  Id: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false
  },
  nameCategoria: {
    // FALTA COLORCAR LAS CATEGORIAS
    type: DataTypes.STRING,
    allowNull: false
  },
})

module.exports = Categoria
