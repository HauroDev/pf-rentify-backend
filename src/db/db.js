const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const { DB_NAME, DB_USER, DB_PASSWORD, HOST, MODE } = require("../../config");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: HOST,
  dialect: "postgres",
  // mostrara cada ves que se levante el servidor la respuesta de la base de datos mientras 'MODE' sea distinto de 'PRODUCTION'
  logging: MODE === "PRODUCTION" ? false : console.log,
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product

const entries = Object.entries(sequelize.models);
const capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  User,
  Product,
  Comment,
  Order,
  Suscription,
  Category,
  Country,
  UserProduct,
} = sequelize.models;

// un Usuario tiene muchas Ordenes/Pagos,y una Orden/Pago tiene un solo Usuario
User.hasMany(Order, { as: "orders", foreignKey: "idUser" });
Order.belongsTo(User, { foreignKey: "idUser" });

// un Usuario tiene una Suscripcion,y una Suscripcion tiene un solo Usuario
User.hasOne(Suscription, { as: "suscription", foreignKey: "idUser" });
Suscription.belongsTo(User, { foreignKey: "idUser" });

// un Usuario tiene muchos Productos (dueño o "comprador"), y un Producto tiene muchos Usuario
User.belongsToMany(Product, {
  through: UserProduct,
  as: "products",
  foreignKey: "idUser",
});
Product.belongsToMany(User, {
  through: UserProduct,
  as: "users",
  foreignKey: "idProd",
});

// un Producto tiene muchos Comentarios, y un Comentario tiene un Producto
Product.hasMany(Comment, { as: "comments", foreignKey: "idProd" });
Comment.belongsTo(Product, { foreignKey: "idProd" });

// una Categoria tiene muchos Productos, y un Productos tiene muchas Categorias
Category.belongsToMany(Product, {
  through: "CategoryProduct",
  as: "products",
  foreignKey: "idCategory",
});
Product.belongsToMany(Category, {
  through: "CategoryProduct",
  as: "categories",
  foreignKey: "idProd",
});

// un Usuario tiene muchos Comentarios, y un Comentario tiene un Usuario
User.hasMany(Comment, { as: "comments", foreignKey: "idUser" });
Comment.belongsTo(User, { as: "user", foreignKey: "idUser" });

// un Pais tiene muchos Productos, y un Producto tiene un Pais
Country.hasMany(Product, { as: "products", foreignKey: "idCountry" });
Product.belongsTo(Country, { as: "country", foreignKey: "idCountry" });

module.exports = {
  conn: sequelize,
  ...sequelize.models,
};
