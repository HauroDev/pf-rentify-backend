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
        type: DataTypes.TEXT,
        allowNull: true
      },
      membership: {
        type: DataTypes.ENUM(['basic', 'standard', 'premium']),
        defaultValue: 'basic'
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'banned'),
        defaultValue: 'active'
      },
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      role: {
        type: DataTypes.ENUM('sudo', 'admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
      }
    },
    {
      comment: 'Table containing information about users',
      tableName: 'users'
    }
  )
}
