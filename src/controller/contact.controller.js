const { sendContactEmail, sendOwnerEmail } = require('../config/nodemailer');

const contactOwner = async (req, res) => {
  try {
    const { emailUser, nameUser, ownerEmail, product } = req.body;
    console.log('userEmail:', emailUser);
    console.log('userName:', nameUser);
    console.log('ownerEmail:', ownerEmail);
    console.log('product:', product);

    if (!emailUser || !nameUser || !ownerEmail || !product) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(emailUser)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Nodemailer
    await sendOwnerEmail(nameUser, emailUser, ownerEmail, product);

    res.json({ success: true });
  } catch (error) {
    console.log('Error sending the email:', error);
    res.status(500).json({ error: 'Error sending the email' });
  }
};

const contactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log('name:', name);
    console.log('email:', email);
    console.log('message:', message);

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Nodemailer
    await sendContactEmail(name, email, message);

    res.json({ success: true });
  } catch (error) {
    console.log('Error sending the email:', error);
    res.status(500).json({ error: 'Error sending the email' });
  }
};

module.exports = { contactOwner, contactUs };
