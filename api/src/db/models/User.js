const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('User', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.TEXT, // !cambie
      allowNull: true // consultar
    },
    membership: {
      type: DataTypes.ENUM(['standard', 'premium']), //
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'paused', 'banned') // !cambie
    }
  })
}
