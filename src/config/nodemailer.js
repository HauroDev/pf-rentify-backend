const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
require("dotenv").config()

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const pass = process.env.EMAIL_PASS;
const email = process.env.EMAIL_RENTIFY;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: email,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: oAuth2Client.getAccessToken(),
  },
});

const logoPath = path.join(__dirname, 'logo.png');

const sendWelcomeEmail = async (userEmail) => {
    try {
      console.log('userEmail:', userEmail);
  
      await transporter.sendMail({
        subject: 'Welcome to Rent-ify!',
        from: "Rent-ify <rent.ify.contact@gmail.com>",
        to: userEmail,
        html: `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Welcome to Rent-ify!</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Estilos generales */
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
              color: #333333;
              background-color: #f0f0f0;
              margin: 0;
              padding: 0;
            }
  
            /* Contenedor principal */
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 5%;
              background-color: #ffffff;
              border: 1px solid #dddddd;
              border-radius: 4px;
              text-align: center;
            }
  
            /* Logotipo */
            .logo {
              max-width: 200px;
              margin-bottom: 20px;
            }
  
            /* Encabezado */
            h1 {
              font-size: 24px;
              font-weight: bold;
              color: #333333;
              margin: 20px 0;
            }
  
            /* Párrafos */
            p {
              margin-bottom: 20px;
            }
  
            /* Firma */
            .signature {
              margin-top: 20px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="cid:logo" alt="Rent-ify Logo" class="logo">
            <h1>Welcome to Rent-ify, ${userEmail}!</h1>
            <p>Thank you for joining Rent-ify. We are excited to have you as a new member of our community.</p>
            <p>Rent-ify is here to help you find the perfect rental options that suit your needs.</p>
            <p>We hope you have a great experience using our platform and finding your ideal product to rent.</p>
            <p>If you have any questions or need assistance, feel free to <a href="mailto:rent.ify.contact@gmail.com">reach out to us</a>. Our team is always ready to help.</p>
            <p>Once again, Welcome to Rent-ify!</p>
            <p class="signature">Best regards,<br>The Rent-ify Team</p>
          </div>
        </body>
        </html>
        `,
        attachments: [{
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }]
      });
  
      console.log('Correo electrónico enviado correctamente');
    } catch (error) {
      console.log('Error al enviar el correo electrónico:', error);
      // Enviar una respuesta de error al cliente
      throw new Error('Error al enviar el correo electrónico');
    }
  };
  
  const sendProductCreatedEmail = async (userEmail, product) => {
    try {
      console.log('userEmail:', userEmail);
  
      await transporter.sendMail({
        subject: 'Product Created - Rent-ify',
        from: "Rent-ify <rent.ify.contact@gmail.com>",
        to: userEmail,
        html: `<!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Product Created - Rent-ify</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* Estilos generales */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                color: #333333;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
              }
  
              /* Contenedor principal */
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 5%;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 4px;
                text-align: center;
              }
  
              /* Logotipo */
              .logo {
                max-width: 200px;
                margin-bottom: 20px;
              }
  
              /* Encabezado */
              h1 {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                margin: 20px 0;
              }
  
              /* Tarjeta */
              .card {
                display: inline-block;
                max-width: 300px;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 4px;
                padding: 10px;
                margin-right: 10px;
                margin-bottom: 10px;
                text-align: center;
              }
  
              /* Párrafos */
              p {
                margin-bottom: 20px;
                color: #333333;
              }
  
              /* Firma */
              .signature {
                margin-top: 20px;
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="cid:logo" alt="Rent-ify Logo" class="logo">
              <h1>Your product has been created!</h1>
              <p>Thank you for creating a product on Rent-ify. Your product has been successfully created and is now available for others to rent.</p>
              <p>We hope you have a great experience using our platform and connecting with potential renters.</p>
              <p>Here are the details of your product:</p>
              <div class="card">
                <img src="${product.image}" alt="Product Image" style="max-width: 100%; height: auto;">
                <h2>${product.name}</h2>
                <p>Price: $${product.price}</p>
                
                
              </div>
              <p>If you have any questions or need assistance, feel free to <a href="mailto:rent.ify.contact@gmail.com">reach out to us</a>. Our team is always ready to help.</p>
              <p>Once again, thank you for choosing Rent-ify!</p>
              <p class="signature">Best regards,<br>The Rent-ify Team</p>
            </div>
          </body>
          </html>
        `,
        attachments: [{
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }]
      });
  
      console.log('Correo electrónico enviado correctamente');
    } catch (error) {
      console.log('Error al enviar el correo electrónico:', error);
      // Enviar una respuesta de error al cliente
      throw new Error('Error al enviar el correo electrónico');
    }
  };
  
  const sendPaymentConfirmationEmail = async (userEmail, paymentAmount, itemCount, paymentStatus) => {
    try {
      console.log('userEmail:', userEmail);
  
      await transporter.sendMail({
        subject: 'Payment Confirmation - Rent-ify',
        from: "Rent-ify <rent.ify.contact@gmail.com>",
        to: userEmail,
        html: `<!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Payment Confirmation - Rent-ify</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* Estilos generales */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                color: #333333;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
              }
  
              /* Contenedor principal */
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 5%;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 4px;
                text-align: center;
              }
  
              /* Logotipo */
              .logo {
                max-width: 200px;
                margin-bottom: 20px;
              }
  
              /* Encabezado */
              h1 {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                margin: 20px 0;
              }
  
              /* Párrafos */
              p {
                margin-bottom: 20px;
                color: #333333;
              }
  
              /* Firma */
              .signature {
                margin-top: 20px;
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="cid:logo" alt="Rent-ify Logo" class="logo">
              <h1>Payment Confirmation</h1>
              <p>Thank you for your payment on Rent-ify.</p>
              <p>Payment details:</p>
              <ul>
                <li>Number of items: ${itemCount}</li>
                <li>Total payment amount: $${paymentAmount}</li>
                <li>Payment status: ${paymentStatus}</li>
              </ul>
              <p>We appreciate your business and hope you continue to enjoy our services.</p>
              <p>If you have any questions or concerns, feel free to <a href="mailto:rent.ify.contact@gmail.com">contact us</a>. Our team is always ready to assist you.</p>
              <p>Thank you for choosing Rent-ify!</p>
              <p class="signature">Best regards,<br>The Rent-ify Team</p>
            </div>
          </body>
          </html>
        `,
        attachments: [{
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }]
      });
  
      console.log('Correo electrónico enviado correctamente');
    } catch (error) {
      console.log('Error al enviar el correo electrónico:', error);
      // Enviar una respuesta de error al cliente
      throw new Error('Error al enviar el correo electrónico');
    }
  };
  const sendUserStatusChangeEmail = async (userEmail, newStatus) => {
    try {
      console.log('userEmail:', userEmail);
  
      await transporter.sendMail({
        subject: 'User Status Change - Rent-ify',
        from: "Rent-ify <rent.ify.contact@gmail.com>",
        to: userEmail,
        html: `<!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>User Status Change - Rent-ify</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* Estilos generales */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                color: #333333;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
              }
  
              /* Contenedor principal */
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 5%;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 4px;
                text-align: center;
              }
  
              /* Logotipo */
              .logo {
                max-width: 200px;
                margin-bottom: 20px;
              }
  
              /* Encabezado */
              h1 {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                margin: 20px 0;
              }
  
              /* Párrafos */
              p {
                margin-bottom: 20px;
                color: #333333;
              }
  
              /* Firma */
              .signature {
                margin-top: 20px;
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="cid:logo" alt="Rent-ify Logo" class="logo">
              <h1>User Status Change</h1>
              <p>Your status on Rent-ify has been changed.</p>
              <p>New status: ${newStatus}</p>
              <p>If you have any questions or concerns, feel free to <a href="mailto:rent.ify.contact@gmail.com">contact us</a>. Our team is always ready to assist you.</p>
              <p>Thank you for using Rent-ify!</p>
              <p class="signature">Best regards,<br>The Rent-ify Team</p>
            </div>
          </body>
          </html>
        `,
        attachments: [{
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }]
      });
  
      console.log('Correo electrónico enviado correctamente');
    } catch (error) {
      console.log('Error al enviar el correo electrónico:', error);
      // Enviar una respuesta de error al cliente
      throw new Error('Error al enviar el correo electrónico');
    }
  };
  
  
  
  module.exports = {
    sendWelcomeEmail,
    sendProductCreatedEmail,
    sendPaymentConfirmationEmail,
    sendUserStatusChangeEmail
  };
  
