const { Sequelize } = require('sequelize')
const fs = require('fs')
const path = require('path')

const { DB_NAME, DB_USER, DB_PASSWORD, HOST, MODE } = require('../../config')

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: HOST,
  dialect: 'postgres',
  logging: MODE === 'PRODUCTION' ? false : console.log, // mostrara cada ves que se levante el servidor la respuesta de la base de datos
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  dialectOptions: {
    ssl: {
      require: true
    }
  }
})

const basename = path.basename(__filename)

const modelDefiners = []

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)))
  })

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize))
// Capitalizamos los nombres de los modelos ie: product => Product

const entries = Object.entries(sequelize.models)
const capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1]
])
sequelize.models = Object.fromEntries(capsEntries)

const { User, Product, Comment, Category } = sequelize.models

// un usuario crea muchos productos (vendedor)
User.belongsToMany(Product, {
  through: 'UserProduct',
  as: 'products',
  foreignKey: 'idProd'
})
Product.belongsToMany(User, {
  through: 'UserProduct',
  as: 'users',
  foreignKey: 'idUser'
})

// un producto tiene muchos comentarios
Product.hasMany(Comment, { as: 'comments', foreignKey: 'idComment' })
Comment.belongsTo(Product, { foreignKey: 'idProd' })

// una categoria tiene muchos productos

Category.belongsToMany(Product, {
  through: 'CategoryProduct',
  as: 'products',
  foreignKey: 'idProd'
})
Product.belongsToMany(Category, {
  through: 'CategoryProduct',
  as: 'categories',
  foreignKey: 'idCategory'
})

// un usuario tiene muchos comentarios

User.hasMany(Comment, { as: 'comments', foreignKey: 'idUser' })
Comment.belongsTo(User, { foreignKey: 'idUser' })

module.exports = {
  conn: sequelize,
  ...sequelize.models
}
