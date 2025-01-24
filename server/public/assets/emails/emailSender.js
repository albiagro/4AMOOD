const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true, //ssl
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PSW
    }
});

export const sendEmailVerification = (emailTo, name, token) => {

    const mailConfigurations = {

        // It should be a string of sender/server email
        from: process.env.EMAIL_USER,
    
        to: emailTo,
    
        // Subject of Email
        subject: 'Welcome to 4AMood!',
        
        // This would be the text of email body
        text: `Hi ${name}, Welcome To 4AMood!

Please follow the given link to verify your email and activate your account:
https://fouramood.netlify.app/verify/${token} 

We hope you will enjoy your experience at 4AMood!
        
Kind Regards,
4AMood Support`
    };
    


    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) console.log(error)
    });
}

export const sendGenericEmail = (emailTo, subject, message) => {

    const mailConfigurations = {

        // It should be a string of sender/server email
        from: process.env.EMAIL_USER,
    
        to: emailTo,
    
        // Subject of Email
        subject: subject,
        
        // This would be the text of email body
        text: message
    };    


    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) console.log(error)
    });
}

