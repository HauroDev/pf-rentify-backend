const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  // const User = sequelize.models.User

  sequelize.define(
    'Order',
    {
      preferenceId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      paymentId: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.ENUM('approved', 'pending', 'rejected')
      },
      merchantOrderId: {
        type: DataTypes.STRING
      }
      // idUser: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      //   references: {
      //     model: User,
      //     key: 'idUser'
      //   }
      // }
    },
    {
      comment: 'Table containing information about orders',
      tableName: 'orders'
    }
  )
}
