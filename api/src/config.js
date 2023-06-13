require('dotenv').config()

const { DB_NAME, DB_USER, DB_PASSWORD, HOST, MODE } = process.env

const PORT = 3001

module.exports = {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  HOST,
  MODE,
  PORT
}
