const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Orders', {
    idOrder: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    payment_id: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM('approved', 'pending', 'rejected', null)
    },
    merchant_order_id: {
      type: DataTypes.INTEGER
    }
  }) /// falta completar cosas
}
