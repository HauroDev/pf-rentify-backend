const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.js');
const User = require('../models/Usuario.js')
//const Product
const List = sequelize.define('List',{
    userId:{
        type: DataTypes.UUID,
        allowNull: false,
        // ! referencia a la id de usuario(revisar)
        references: {
            model: User,
            key: 'id'
        }
    },
    productId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            //model: Product,
            key: 'id'
        }
    },
    dateProduct:{
        type: DataTypes.DATEONLY,
        allowNull: false
    }
    
})

module.exports = Comment;