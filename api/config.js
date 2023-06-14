require('dotenv').config()

const { DB_NAME, DB_USER, DB_PASSWORD, HOST, MODE, URL_PRUEBAS, URL_DEPLOY } =
  process.env

const PORT = 3001

module.exports = {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  HOST,
  MODE,
  PORT,
  URL_PRUEBAS,
  URL_DEPLOY
}
