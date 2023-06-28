const express = require('express');
const nodemailer = require('nodemailer')
const {google}=require('googleapis')
const router = express.Router();

router.post('/send-email', (req,res)=>{
const {name,emailUs,phone,message} =req.body


const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN= process.env.REFRESH_TOKEN

const oAuth2Client=new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

const pass = process.env.EMAIL_PASS;
const email = process.env.EMAIL_RENTIFY;

async function sendMail(){
    try{
        const accessToken=await oAuth2Client.getAccessToken()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                type: "OAuth2",
                user: email,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken:REFRESH_TOKEN,
                accessToken: accessToken
            },
        });
        
        const mailOptions={
          from:"Pagina web Nodemailer <rent.ify.contact@gmail.com>",
          to: "rent.ify.contact@gmail.com",
          subject : "Nodemailer prueba",
          text: `Nombre: ${name}\nEmail: ${emailUs}\nCelular: ${phone}\nMensaje: ${message}`,     
        };

       const result = await transporter.sendMail(mailOptions)
       return result;

    }
    catch(err){
        console.log(err)
    }
}
 sendMail()
 .then(result=>res.status(200).send("enviado"))
 .catch((error)=>console.log(error.message));

});

module.exports= router