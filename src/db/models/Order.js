const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  // const User = sequelize.models.User

  sequelize.define(
    'Order',
    {
      idOrder: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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
    },
    {
      comment: 'Table containing information about orders',
      tableName: 'orders'
    }
  )
}
