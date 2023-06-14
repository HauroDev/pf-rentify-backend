const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('User', {
    idUser: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
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
