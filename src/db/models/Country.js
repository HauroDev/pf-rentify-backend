const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define(
    'Country',
    {
      idCountry: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.ENUM([
          'Argentina',
          'Perú',
          'México',
          'Colombia',
          'Brasil',
          'Chile',
          'Uruguay'
        ]),
        allowNull: false,
        unique: true
      },
      currency: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          isRespectObject (value) {
            if (!value.code || !value.name || !value.symbol) {
              throw new Error(
                'The object is missing "code", "name", or "symbol".'
              )
            }
          }
        }
      }
    },
    {
      comment: 'Table containing information about countries',
      tableName: 'countries'
    }
  )
}
