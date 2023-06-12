const express = require('express')
const { PORT } = require('./config')
const { sequelize } = require('../db/db')

const app = express()

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT)
  })
  .catch((error) => {
    console.error(error)
  })
