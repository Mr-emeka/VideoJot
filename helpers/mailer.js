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
var message = {
    // sender info
    from: 'No reply email <vidjot@gmail.com>',
    to: '',
    // subject of the message
    subject: 'Thanks for registering',
    html: ''
}

module.exports = function(user) {

    if (typeof user === 'undefined')
        return;

    // Recipt list
    message.to = user.email;
    // HTML body
    message.html = '<h1>Welcome On board !!!</h1>'

    console.log('sending email');
    transport.sendMail(message, function(err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('Message sent successfully!');
    });
}