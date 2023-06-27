const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Suscription',
    {
      preApprovalId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Subscription state information identifier'
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      comment: 'Table containing information about suscriptions',
      tableName: 'suscriptions'
    }
  )
}
