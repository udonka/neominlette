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
  console.log('user', req.user);
  if(req.user.userinfo.local.name){
    send.user = req.user.userinfo.local.name;
    send.name = req.user.userinfo.local.name;
  }
  if(req.user.userinfo.facebook.name){
    console.log('facebook');
    send.user = req.user.userinfo.facebook.name;
    send.name = req.user.userinfo.facebook.name;
  }
  send.rouletteGroup = req.user.rouletteGroup;
  console.log(send);
  res.render('user', send);
});

router.get('/userinfo', loginCheck, function(req, res){
  res.render('userinfo',
             {
               user : req.user.userinfo.local.name,
               userName: req.user.userinfo.local.name,
               userEmail: req.user.userinfo.local.email,
               id: req.user._id
             });
});

router.get('/create', loginCheck, function(req, res){
  var send = {};
  if(req.user.userinfo.local.name){
    send.user = req.user.userinfo.local.name;
  }
  if(req.user.userinfo.facebook.name){
    send.user = req.user.userinfo.facebook.name;
  }
  res.render('createRoulette',
    {
      user: req.user.userinfo.local.name
    });
})

module.exports = router;
