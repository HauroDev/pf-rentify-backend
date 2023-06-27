const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Product",
    {
      idProd: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: "Unique identifier for the product",
      },
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Name is required",
          },
          len: {
            args: [3, 40],
            msg: "Name must be between 3 and 40 characters",
          },
        },
        comment: "Name of the product",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Description is required",
          },
        },
        comment: "Description of the product",
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Image is required",
          },
          isUrl: {
            args: true,
            msg: "Image must be a valid URL",
          },
        },
        comment: "Image of the product",
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
        comment: "Price of the product",
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Location is required",
          },
        },
        comment: "Location of the product",
      },
      state: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "State is required",
          },
        },
      },
      statusPub: {
        type: DataTypes.ENUM("active", "inactive", "delete"),
        defaultValue: "active",
        comment: "Status of the publication",
      },
      statusProd: {
        type: DataTypes.ENUM("available", "rented"),
        defaultValue: "available",
        comment: "NO USADO",
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Is the product featured?",
      },
      // stock: {
      //     type:DataTypes.INTEGER,
      //     allowNull:false,
      //     comment:'Stock of the product'
      // }
    },
    {
      comment: "Table containing information about product",
      tableName: "products",
    }
  );
};
