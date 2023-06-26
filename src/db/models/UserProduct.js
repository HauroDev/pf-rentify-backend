const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const User = sequelize.models.User
  const Product = sequelize.models.Product
  sequelize.define(
    'UserProduct',
    {
      type: {
        type: DataTypes.ENUM('renter', 'owner'),
        allowNull: false,
        defaultValue: 'owner'
      },
      idUser: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'idUser'
        }
      },
      idProd: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Product,
          key: 'idProd'
        }
      }
    },
    {
      comment: 'Table containing information about User & Product asociations',
      tableName: 'UserProduct'
    }
  )
}
