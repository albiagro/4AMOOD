const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PSW
    }
});

module.exports.sendEmailVerification = (emailTo, name, token) => {

    const mailConfigurations = {

        // It should be a string of sender/server email
        from: process.env.EMAIL_USER,
    
        to: emailTo,
    
        // Subject of Email
        subject: 'Welcome to 4AMood!',
        
        // This would be the text of email body
        text: `Hi ${name}, Welcome To 4AMood!

               Please follow the given link to verify your email
               https://fouramood.netlify.app/verify/${token} and activate your account.

               We hope you will enjoy your experience at 4AMood!
               
               Kind Regards,
               4AMood Support`
    };
    
    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) throw Error(error);
        console.log('Email Sent Successfully');
        console.log(info);
    });
}

