const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Product',
    {
      idProd: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: 'Unique identifier for the product'
      },
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Name is required'
          },
          len: {
            args: [3, 40],
            msg: 'Name must be between 3 and 40 characters'
          }
        },
        comment: 'Name of the product'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Description is required'
          }
        },
        comment: 'Description of the product'
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Image is required'
          },
          isUrl: {
            args: true,
            msg: 'Image must be a valid URL'
          }
        },
        comment: 'Image of the product'
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,

        comment: 'Price of the product'
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Location is required'
          }
        },
        comment: 'Location of the product'
      },
      statusPub: {
        type: DataTypes.ENUM('active', 'inactive', 'paused'),
        // allowNull: false,
        defaultValue: 'active',
        comment: 'Status of the publication'
      },
      statusProd: {
        type: DataTypes.ENUM('available', 'rented'),
        // allowNull: false,
        defaultValue: 'available',
        comment: 'Status of the product'
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is the product featured?'
      }
      // stock: {
      //     type:DataTypes.INTEGER,
      //     allowNull:false,
      //     comment:'Stock of the product'
      // }
    },
    {
      comment: 'Table containing information about product',
      tableName: 'products'
    }
  )
}
