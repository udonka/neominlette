var express = require('express');
var router = express.Router();
var passport = require('passport');

var model = require('../models/users.js');
var User = model.User;

var isAuthenticated = function(req, res, next){
    if(req.isAuthenticated()){
  res.redirect('/home');
    }
    return next();
}

router.get('/', passport.authenticate('twitter', {scope: 'email'}));

router.get('/callback',
                  passport.authenticate('twitter', {
                    successRedirect : '/home',
                    failureRedirect : '/login'
                  }));
module.exports = router;