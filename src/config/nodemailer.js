const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const path = require('path')
const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  EMAIL_RENTIFY,
  REFRESH_TOKEN,
  MODE,
  URL_CLIENTE,
  URL_CLIENTE_PRUEBAS
} = require('../../config')

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const baseUrl = MODE === 'PRODUCTION' ? URL_CLIENTE : URL_CLIENTE_PRUEBAS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: EMAIL_RENTIFY,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: oAuth2Client.getAccessToken()
  }
})

const logoPath = path.join(__dirname, 'logo.png')

const sendWelcomeEmail = async (userEmail) => {
  try {
    console.log('userEmail:', userEmail)

    await transporter.sendMail({
      subject: 'Welcome to Rent-ify!',
      from: 'Rent-ify <rent.ify.contact@gmail.com>',
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
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }
      ]
    })

    console.log('Email sent successfully')
  } catch (error) {
    console.log('Error sending email:', error)
    throw new Error('Error sending email')
  }
}

const sendProductCreatedEmail = async (userEmail, product) => {
  try {
    console.log('userEmail:', userEmail)

    await transporter.sendMail({
      subject: 'Product Created - Rent-ify',
      from: 'Rent-ify <rent.ify.contact@gmail.com>',
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
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }
      ]
    })

    console.log('Email sent successfully')
  } catch (error) {
    console.log('Error sending email:', error)
    throw new Error('Error sending email')
  }
}

const sendPaymentPendingEmail = async (
  userEmail,
  paymentAmount,
  itemCount,
  paymentStatus
) => {
  try {
    console.log('userEmail:', userEmail)

    await transporter.sendMail({
      subject: 'Payment Confirmation - Rent-ify',
      from: 'Rent-ify <rent.ify.contact@gmail.com>',
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
                <p>Your order has been received and is currently being processed.</p>
                <h3>Payment Details:</h3>
                <p>Number of items: ${itemCount}</p>
                <p>Total payment amount: $${paymentAmount}</p>
                <p>Payment status: Pending</p>
                <p>We are currently processing your payment, and we will notify you as soon as it is confirmed.</p>
                <p>We appreciate your business and hope you continue to enjoy our services.</p>
                <p>If you have any questions or concerns, feel free to <a href="mailto:rent.ify.contact@gmail.com">contact us</a>. Our team is always ready to assist you.</p>
                <p class="signature">Best regards,<br>The Rent-ify Team</p>
            </div> 
          </body>
          </html>
        `,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }
      ]
    })

    console.log('Email sent successfully')
  } catch (error) {
    console.log('Error sending email:', error)
    throw new Error('Error sending email')
  }
}

const sendPaymentConfirmationEmail = async (
  userEmail,
  paymentAmount,
  itemCount
) => {
  try {
    console.log('userEmail:', userEmail)

    await transporter.sendMail({
      subject: 'Payment Confirmation - Rent-ify',
      from: 'Rent-ify <rent.ify.contact@gmail.com>',
      to: userEmail,
      html: `<!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Payment Confirmation - Rent-ify</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* General styles */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                color: #333333;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
              }
  
              /* Main container */
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 5%;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 4px;
                text-align: center;
              }
  
              /* Logo */
              .logo {
                max-width: 200px;
                margin-bottom: 20px;
              }
  
              /* Header */
              h1 {
                font-size: 24px;
                font-weight: bold;
                color: #333333;
                margin: 20px 0;
              }
  
              /* Paragraphs */
              p {
                margin-bottom: 20px;
                color: #333333;
              }
  
              /* Signature */
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
              <p>Dear Customer,</p>
              <p>Your payment has been successfully confirmed.</p>
              <h3>Payment Details:</h3>
              <p>Number of items: ${itemCount}</p>
              <p>Total payment amount: $${paymentAmount}</p>
              <p>We appreciate your business and thank you for choosing Rent-ify.</p>
              <p>If you have any questions or need further assistance, please feel free to <a href="mailto:rent.ify.contact@gmail.com">contact us</a>. Our team is always ready to help.</p>
              <p>Best regards,</p>
              <p>The Rent-ify Team</p>
            </div>
          </body>
          </html>
        `,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }
      ]
    })

    console.log('Email sent successfully')
  } catch (error) {
    console.log('Error sending email:', error)
    throw new Error('Error sending email')
  }
}

const sendUserStatusChangeEmail = async (userEmail, newStatus) => {
  try {
    console.log('userEmail:', userEmail)

    await transporter.sendMail({
      subject: 'User Status Change - Rent-ify',
      from: 'Rent-ify <rent.ify.contact@gmail.com>',
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
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }
      ]
    })

    console.log('Email sent successfully')
  } catch (error) {
    console.log('Error sending email:', error)
    throw new Error('Error sending email')
  }
}

const sendOwnerEmail = async (nameUser, emailUser, ownerEmail, product) => {
  const productLink = `${baseUrl}/product/${product.idProd}`

  try {
    await transporter.sendMail({
      subject: 'Interest in Product - Rent-ify',
      from: 'Rent-ify <rent.ify.contact@gmail.com>',
      to: ownerEmail,
      html: `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Interest in Product - Rent-ify</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* General styles */
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
              color: #333333;
              background-color: #f0f0f0;
              margin: 0;
              padding: 0;
            }

            /* Main container */
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 5%;
              background-color: #ffffff;
              border: 1px solid #dddddd;
              border-radius: 4px;
              text-align: center;
            }

            /* Heading */
            h1 {
              font-size: 24px;
              font-weight: bold;
              color: #333333;
              margin: 20px 0;
            }

            /* Product card */
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

            /* Product image */
            .card img {
              max-width: 100%;
              height: auto;
            }

            /* Logo */
            .logo {
              text-align: center;
              margin-bottom: 20px;
            }

            /* Paragraphs */
            p {
              margin-bottom: 20px;
            }

            /* Signature */
            .signature {
              margin-top: 20px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="cid:logo" alt="Rent-ify Logo">
            </div>
            <h1>Interest in Product - Rent-ify</h1>
            <p>Name: ${nameUser}</p>
            <p>This user is interested in the product. <a href="mailto:${emailUser}?subject=Regarding Product Inquiry - Rent-ify">Contact them</a> for further details.</p>
            <a href="${productLink}">
              <div class="card">
                <img src="${product.image}" alt="Product Image">
                <h2>${product.name}</h2>
                <p>Description: ${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Location: ${product.location}, ${product.state}, ${product.country.name}</p>
              </div>
            </a>
           </div>
        </body>
        </html>
        `,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }
      ]
    })

    console.log('Email sent successfully')
  } catch (error) {
    console.log('Error sending email:', error)
    throw new Error('Error sending email')
  }
}

const sendContactEmail = async (nameUser, userEmail, message) => {
  try {
    await transporter.sendMail({
      subject: 'Contact Form - Support',
      from: 'Rent-ify <rent.ify.contact@gmail.com>',
      to: 'rent.ify.soporte@gmail.com',
      html: `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Contact Form - Support</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* General styles */
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
              color: #333333;
              background-color: #f0f0f0;
              margin: 0;
              padding: 0;
            }
  
            /* Main container */
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 5%;
              background-color: #ffffff;
              border: 1px solid #dddddd;
              border-radius: 4px;
              text-align: center;
            }
  
            /* Heading */
            h1 {
              font-size: 24px;
              font-weight: bold;
              color: #333333;
              margin: 20px 0;
            }
  
            /* Paragraphs */
            p {
              margin-bottom: 20px;
            }
  
            /* Signature */
            .signature {
              margin-top: 20px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="container">
          <div class="logo">
              <img src="cid:logo" alt="Rent-ify Logo">
            </div>
            <h1>Contact Form - Support</h1>
            <p>Name: ${nameUser}</p>
            <p>Email: ${userEmail}</p>
            <p>Message: ${message}</p>
            <p>Please contact the user by clicking <a href="mailto:${userEmail}?subject=Contact%20Support%20-%20Rent-ify">Contact them</a>.</p>
          </div>
        </body>
        </html>
        `,
      attachments: [
        {
          filename: 'logo.png',
          path: logoPath,
          cid: 'logo'
        }
      ]
    })
    console.log('Email sent successfully')
  } catch (error) {
    console.log('Error sending email:', error)
    throw new Error('Error sending email')
  }
}

module.exports = {
  sendWelcomeEmail,
  sendProductCreatedEmail,
  sendPaymentPendingEmail,
  sendPaymentConfirmationEmail,
  sendUserStatusChangeEmail,
  sendContactEmail,
  sendOwnerEmail
}
