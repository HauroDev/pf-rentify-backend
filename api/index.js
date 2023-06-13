const express = require('express')
const { PORT } = require('./config')
const { conn } = require('./src/db/db.js')

const app = express()

conn
  .sync({ force: true })
  .then(() => {
    app.listen(PORT, () => console.log('estoy on en el puerto', PORT))
  })
  .catch((error) => {
    console.error(error)
  })
