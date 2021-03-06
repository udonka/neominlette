var express = require('express');
var router = express.Router();
var passport = require('passport');

var model = require('../models/users.js');
var User = model.User;

router.get('/', function(req, res){
  res.render('signup');
});

router.post('/', passport.authenticate('local-signup',{
  successRedirect : '/home',
  failureRedirect : '/login',
  failureFlash : true
}));

module.exports = router;
