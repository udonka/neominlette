var express = require('express');
var router = express.Router();

var model = require('../models/users.js');
var User = model.User;

router.get('/', function(req, res){
  res.render('signup');
});

router.post('/', function(req, res){
  var newUser = new User(req.body);
  console.log(req.body);
  newUser.save(function(err){
    if(err){
      console.log(err);
      res.redirect('back');
    }else{
      res.redirect('/login');
    }
  });
});

module.exports = router;
