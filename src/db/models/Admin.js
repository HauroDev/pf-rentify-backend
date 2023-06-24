const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Admin',
    {
      idAdmin: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false
      },

      uid: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      comment: 'Table containing information about admins',
      tableName: 'admins'
    }
  )
}
