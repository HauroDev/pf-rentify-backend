const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

//Lo agregue para probar NODEMAILER
const path = require('path');
//-----------------------------

const { conn } = require('./src/db/db.js')
const { PORT, urlApi, urlDoc, URL_CLIENTE } = require('./config')
const routerManager = require('./src/routes/index.js')

const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Api-Rentify',
      version: '1.1.0'
    },
    servers: [
      {
        url: urlApi
      }
    ]
  },
  apis: ['./src/routes/*.js']
}

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.name = 'api-rentify'

//Para probar NODEMAILER
// app.use (require('./src/config/nodemailer.js'))
app.use(express.static(path.join(__dirname, "public")));

//----------------------------//


app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use((req, res, next) => {
  const allowedOrigins = [URL_CLIENTE, 'http://localhost:5173']
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

app.use('/api-rentify', routerManager)
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))
console.log(urlDoc + '---> documentacion')

conn
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () =>
      console.log('Api funcionando en el puerto', PORT, urlApi)
    )
  })
  .catch((error) => {
    console.error(error)
  })
