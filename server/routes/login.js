var express = require('express');
var router = express.Router();

var model = require('../models/users.js');
var User = model.User;
var rouletteModel = require('../models/roulettes.js');
var Roulette = rouletteModel.Roulette;


router.get('/', function(req, res){
  res.render('login');
});

router.post('/', function(req, res){
  var query = req.body;
  User.findOne(query, function(err, data){
    if(err){
      console.log(err);
    }else if(data == ""){
      res.render('login');
    }else if(data == null){
      console.log('null');
      console.log(data);
      res.render('login');
    }else{
      console.log(data);
      req.session.user = data;
      req.session.userName = data.name;
      req.session.userEmail = data.email;
      res.redirect('/home');
    }
  });
});

module.exports = router;
