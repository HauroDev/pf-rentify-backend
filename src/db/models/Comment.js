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
        type: DataTypes.STRING,
        allowNull: false
      },
      puntuation: {
        type: DataTypes.FLOAT,
        allowNull: false
        //  seria bueno cambiarlo a entero y añadir una validacion para limitar de 1 a 5 verificar el codigo de abajo :D
        // type: DataTypes.INTEGER,
        // allowNull: false,
        // validate: {
        //   min: 1,
        //   max: 5
        // }
      },
      commentStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
      // toca colocar en este modelo  el id del producto y id del usuario que comenta o que el usuario sea anonimo
      // para evitar que se actualice el producto cada vez que se comente
    },
    {
      comment: 'Table containing information about comments',
      tableName: 'comments'
    }
  )
}
