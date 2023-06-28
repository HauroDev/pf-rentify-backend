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
        comment: 'Subscription state information identifier'
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM(['basic', 'standard', 'premium']),
        allowNull: false
      }
    },
    {
      comment: 'Table containing information about suscriptions',
      tableName: 'suscriptions'
    }
  )
}
