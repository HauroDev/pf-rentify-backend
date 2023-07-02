const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Blacklist", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
  });
};
