const nodemailer = require('nodemailer');

const mail = require('../config/mailer');

// Create a SMTP transport object
var transport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: mail.GMAIL_USER,
        pass: mail.GMAIL_PASSWORD
    },
    // debug: true
});

// Message object
var message = {
    // sender info
    from: 'Sender Name <sender@example.com>',
    to: '',
    // subject of the message
    subject: 'Thanks for registering',
    headers: {
        'X-Laziness-level': 1000
    },
    html: ''
}

module.exports = function(user) {

    if (typeof user === 'undefined')
        return;

    // Recipt list
    message.to = user.email;
    // HTML body
    message.html = `<h1>Welcome On board !!!</h1>`

    console.log('sending email');
    transport.sendMail(message, function(err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('Message sent successfully!');
    });
}