const express = require('express');

const bcrypt = require('bcryptjs');

const passport = require('passport');

const mongoose = require('mongoose');

const mailer = require('../helpers/mailer')


const router = express.Router();

//load idea model
require('../models/users');
const user = mongoose.model('users');



//User login Route
router.get('/login', (req, res) => {
    res.render('users/login');

});

//User register Route
router.get('/register', (req, res) => {
    res.render('users/register');

});

//Register form Post
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({
            text: 'Passwords do not match'
        })
    }
    if (req.body.password.length < 4) {
        errors.push({
            text: 'Password must be at least 4 characters'
        });
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        user.findOne({
                email: req.body.email
            })
            .then(User => {
                if (User) {
                    req.flash('error_msg', 'Email has already been taken');
                    res.redirect('/users/login');
                } else {
                    const newUser = new user({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;

                            newUser.save()
                                .then(user => {

                                    req.flash('success_msg', `You are now registered and can login,Email has been sent to`);

                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });

                        });
                    });
                }
            });

    }


});

// Login form Post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout User
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/users/login');

})












module.exports = router;