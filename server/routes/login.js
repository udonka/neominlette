var express = require('express');
var router = express.Router();
var passport = require('passport');

var model = require('../models/users.js');
var User = model.User;
var rouletteModel = require('../models/roulettes.js');
var Roulette = rouletteModel.Roulette;

var isAuthenticated = function(req, res, next){
    if(req.isAuthenticated()){
      res.redirect('/home');
    }
    return next();
}


router.get('/', isAuthenticated, function(req, res){
  res.render('login', {message: req.flash('loginMessage')});
});

router.post('/', passport.authenticate('local-login',{
  successRedirect : '/home',
  failureRedirect : '/login',
  failureFlash : true
}));

module.exports = router;
