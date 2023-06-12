const { Sequelize } = require('sequelize')
const { DB_NAME, DB_USER, DB_PASSWORD, HOST, MODE } = require('../src/config')

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: HOST,
  dialect: 'postgres',
  logging: MODE === 'PRODUCTION' ? false : console.log
})
