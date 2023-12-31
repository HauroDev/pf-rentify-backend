const { DataTypes } = require('sequelize')
// const { Product, User } = require('../db.js')

module.exports = (sequelize) => {
  sequelize.define(
    'Comment',
    {
      idComment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      puntuation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      commentStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      comment: 'Table containing information about comments',
      tableName: 'comments'
    }
  )
}
