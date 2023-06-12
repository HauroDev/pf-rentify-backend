const { DataTypes } = require('sequelize')
const { sequelize } = require('../db.js')

const Comment = sequelize.define('Comentario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  punctuation: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  commentStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
})

module.exports = Comment
