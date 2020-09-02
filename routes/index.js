var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

//ROOT route
router.get('/', (req,res)=>{
    res.redirect('/blogs');
});

//sign up signup form
router.get('/signup', (req, res)=>{
    res.render('signup');
});

router.post('/signup', (req, res)=>{
    var newUser = new User({username: req.body.username});
    var password = req.body.password;

    User.register(newUser, password, (err, user)=>{
        if(err){
            req.flash('error', 'something went wrong!');
            res.redirect('back');
        }else{
            passport.authenticate('local')(req, res, ()=>{
                req.flash('success', 'signed up successfully')
                res.redirect('/blogs');
            });
        }
    });
});

//login route
router.get('/login', (req, res)=>{
    res.render('login');
});

router.post('/login', passport.authenticate('local',{
    successRedirect: '/blogs',
    failureRedirect: '/login'
}));

//logout route
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success', 'logged out successfully');
    res.redirect('/blogs');
});

module.exports = router;