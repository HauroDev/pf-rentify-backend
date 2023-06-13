const { DataTypes } = require('sequelize')
const { sequelize } = require('../db.js')

const Categoria = sequelize.define('Categoria', {
  Id: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false
  },
  nameCategoria: {
    // FALTA COLORCAR LAS CATEGORIAS
<<<<<<< HEAD
=======
    type: DataTypes.ENUM('electronico','moda y accesorios','hogar y decoración','deportes y fitness / salud y bienestar','libros y entretenimiento','automovil y motocicletas','jueguetes y niños','cuidado personal','artes y manualidades'),
    allowNull: false,
>>>>>>> FABIAN
  },
})

module.exports = Categoria
