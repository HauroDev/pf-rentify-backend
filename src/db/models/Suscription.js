const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Suscription',
    {
      idSuscription: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      preApprovalId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Subscription state information identifier'
      },
      status: {
        type: DataTypes.ENUM('authorized', 'pending'),
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('standard', 'premium'),
        allowNull: false
      }
    },
    {
      comment: 'Table containing information about suscriptions',
      tableName: 'suscriptions'
    }
  )
}
