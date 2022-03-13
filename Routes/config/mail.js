const nodemailer = require('nodemailer');
const keys = require('../config/keys.js');
const path = require('path');
//Pug view for html
const pug = require('pug');
const emailhtml = pug.compileFile(path.join(__dirname+'/emailbody.pug'));


var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers:'SSLv3'
    },
     auth: {
       user: keys.email.user,
       pass: keys.email.password
     }
});

const showMail = (body) =>{
  return emailhtml({
    body: `${body}`
  }) 
}
const sendMail =async ({to, subject, body}) =>{

var mailOptions = {
     from: keys.email.user,
     to: `${to}, contact@startvest.io`,
     subject: subject,
     html: emailhtml({
      body: `${body}`
    })
}


await transporter.sendMail(mailOptions, function(error, info){
     if (error) {
       console.log(error);
       return res.status(500).json({sent: false});
     } else {
       console.log('Email sent by nodemailer: ' + info.response);
       return res.status(200).json({sent: true});
     }
   });
   
}

module.exports = {
     send: sendMail,
     show: showMail
}