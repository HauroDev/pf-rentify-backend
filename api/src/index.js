const express = require('express')
const { PORT } = require('./config')
const { conn } = require('../db/db.js')

const app = express()

conn
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log('estoy on en el puerto', PORT))
    console.log(conn.getDatabaseName(), conn.models)
  })
  .catch((error) => {
    console.error(error)
  })
