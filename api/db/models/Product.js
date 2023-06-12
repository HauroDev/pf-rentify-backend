const { DataTypes } = require('sequelize')
const { sequelize } = require('../db.js')

module.exports = 
    sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: 'Unique identifier for the product',
        }, 
        name: {
            type: DataTypes.STRING(40),
            allowNull: false,
            comment: 'Name of the product',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Description of the product',
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Image of the product',
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false, 
            defaultValue: 0,
            comment: 'Price of the product',
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Location of the product',     
        },
        statusPub: {
          type: DataTypes.ENUM('active', 'inactive', 'paused'),
          allowNull: false,
          comment: 'Status of the publication',
        },
        statusProd: {
            type: DataTypes.ENUM('available', 'rented'),
            allowNull: false,
            comment: 'Status of the product',
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            comment: 'Is the product featured?',
        },
       
        }, {
          comment: 'Table containing information about product',
          tableName: 'product',
          timestamps: false,
        });    
    