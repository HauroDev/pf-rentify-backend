const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Admin', {
    IdAdmin: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
}