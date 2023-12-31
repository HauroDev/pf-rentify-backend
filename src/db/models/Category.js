const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Category',
    {
      idCategory: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        // ya arregle las categorias
        type: DataTypes.ENUM(
          'electronics',
          'fashion and accessories',
          'home and decoration',
          'sports and fitness / health and wellness',
          'books and entertainment',
          'cars and motorcycles',
          'toys and kids',
          'personal care',
          'arts and crafts'
        ),
        allowNull: false,
        unique: true
      }
    },
    {
      comment: 'Table containing information about categories',
      tableName: 'categories'
    }
  )
}
