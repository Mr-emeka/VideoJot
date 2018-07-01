const nodemailer = require('nodemailer');

const mail = require('../config/mailer');

const xoauth2 = require('xoauth2');

// Create a SMTP transport object
var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: mail.GMAIL_USER,
            clientId: mail.CLIENT_ID,
            clientSecret: mail.CLIENT_SECRET,
            refreshToken: mail.REFRESH_TOKEN


        })
    }
    // debug: true
});

// Message object
const mailOption = {
    // sender info
    from: 'No reply email <vidjot@gmail.com>',
    to: '',
    // subject of the message
    subject: 'Thanks for registering',
    html: ``,
}

module.exports = function(newUser) {

    if (typeof newUser === 'undefined')
        return;
    // console.log(newUser);

    // Recipt list
    mailOption.to = newUser.email;
    // HTML body
    mailOption.html = `<h1>Welcome On board !!!</h1>`

    console.log('sending email');
    transport.sendMail(mailOption, function(err) {
        console.log(mailOption);

        if (err) {
            console.log(err.mailOption);
            return;
        }
        console.log('Message sent successfully!');
    });
}