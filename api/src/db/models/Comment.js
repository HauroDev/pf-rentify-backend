const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    puntuation: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    commentStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  })
}
