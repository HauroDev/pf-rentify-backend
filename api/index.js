const express = require('express')
const { PORT } = require('./config')
const { conn } = require('./src/db/db.js')
const morgan = require('morgan')
const router= require('./src/router/index.js')

const app = express()

app.use(express.json())

app.use(morgan('dev'))

/*
  Agregen sus rutas
*/
app.use('/api-rentify',router)
conn
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log('estoy on en el puerto', PORT))
  })
  .catch((error) => {
    console.error(error)
  })
