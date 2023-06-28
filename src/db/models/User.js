const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'User',
    {
      idUser: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image: {
        type: DataTypes.TEXT, // !cambie
        allowNull: true // consultar
      },
      membership: {


        type: DataTypes.ENUM('standard', 'premium'), //
        allowNull: false

        type: DataTypes.ENUM(['standard', 'premium']), //
        defaultValue: 'standard'

        type: DataTypes.ENUM(['standard', 'premium']), //
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'paused', 'banned'), // !cambie
        defaultValue: 'active'
      },
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      comment: 'Table containing information about users',
      tableName: 'users'
    }
  )
}
