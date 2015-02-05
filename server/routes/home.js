var express = require('express');
var router = express.Router();

var rouletteModel = require('../models/roulettes.js');
var Roulette = rouletteModel.Roulette;

var userModel = require('../models/users.js');
var User = userModel.User;

//add login check function
var loginCheck = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

/* GET home page. */
router.get('/', loginCheck,function(req, res){
  var send = {};
  if(req.user.name){
    send.user = req.user.name;
    send.name = req.user.name;
  }
  if(req.user.facebook.name){
    console.log('facebook');
    console.log(Object.keys(req.user.facebook).length);
    send.user = req.user.facebook.name;
    send.name = req.user.facebook.name;
  }
  send.rouletteGroup = req.user.rouletteGroup;
  console.log(send);
  res.render('user', send);
});

router.get('/userinfo', loginCheck, function(req, res){
  res.render('userinfo',
             {
               user : req.user.name,
               userName: req.user.name,
               userEmail: req.user.email,
               id: req.user._id
             });
});

router.get('/create', loginCheck, function(req, res){
  var send = {};
  if(req.user.name){
    send.user = req.user.name;
  }
  if(req.user.facebook.name){
    send.user = req.user.facebook.name;
  }
  res.render('createRoulette',
    {
      user: req.user.name
    });
})

module.exports = router;
