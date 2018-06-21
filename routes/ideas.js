const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();

const {
    ensureAuthenticated
} = require('../helpers/auth');

//load idea model
require('../models/idea');
const Idea = mongoose.model('ideas');



//Add idea form route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add')

});

//Add idea form route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.find({
            where: {
                id: req.params.id
            }
        })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas')
            } else {
                res.render('ideas/edit', {
                    idea: idea

                });
            }

        });


});

router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({
            user: req.user.id
        })
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas


            });
        })

});

//process route
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: "please add a title"
        });

    }
    if (!req.body.details) {
        errors.push({
            text: "please add some details"
        });

    }
    if (errors.length > 0) {
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details

        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(function (Idea) {
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas');
            });
    }

});

//Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea
        .find({
            _id: req.params.iD
        })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details
            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea updated');
                    res.redirect('/ideas')
                })
        });
});

//Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({
            id: req.params.id
        })
        .then((idea) => {
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        })

});












module.exports = router;