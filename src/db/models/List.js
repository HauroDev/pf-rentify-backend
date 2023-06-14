const { DataTypes } = require('sequelize')

// cambiar nombre de list a HistoryRent o algo asi  ;D

// const User = require('../db.js')
// const Product
module.exports = (sequelize) => {
  sequelize.define(
    'List',
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false
        // ! referencia a la id de usuario(revisar)
        // references: {
        //   model: User,
        //   key: 'id'
        // }
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false
        // references: {
        //   // model: Product,
        //   key: 'id'
        // }
      },
      dateProduct: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      comment: 'Table containing information about lists',
      tableName: 'lists'
    }
  )
}
