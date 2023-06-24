const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Orders', {
    idOrder: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('approved', 'pending', 'rejected', 'null'),
      
    },
    merchant_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
}
