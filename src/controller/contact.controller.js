const { sendContactEmail, sendOwnerEmail } = require('../config/nodemailer')
const { CustomError } = require('../utils/customErrors.js')

const contactOwner = async (req, res) => {
  try {
    const { emailUser, nameUser, ownerEmail, product } = req.body

    if (!emailUser || !nameUser || !ownerEmail || !product) {
      throw new CustomError(400, 'Required fields are missing')
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(emailUser)) {
      throw new CustomError(400, 'Invalid email format')
    }

    // Nodemailer
    await sendOwnerEmail(nameUser, emailUser, ownerEmail, product)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Error sending the email' })
  }
}

const contactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      throw new CustomError(400, 'Required fields are missing')
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      throw new CustomError(400, 'Invalid email format')
    }

    // Nodemailer
    await sendContactEmail(name, email, message)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Error sending the email' })
  }
}

module.exports = { contactOwner, contactUs }
