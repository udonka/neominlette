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
  if(req.user.auth_type == 'local'){
    send.user = req.user.userinfo.local.name;
    send.name = req.user.userinfo.local.name;
  }
  if(req.user.auth_type == 'facebook'){
    send.user = req.user.userinfo.facebook.name;
    send.name = req.user.userinfo.facebook.name;
  }
  if(req.user.auth_type == 'twitter'){
    send.user = req.user.userinfo.twitter.name;
    send.name = req.user.userinfo.twitter.name;
  }
  send.rouletteGroup = req.user.rouletteGroup;
  res.render('user', send);
});

router.get('/userinfo', loginCheck, function(req, res){
  console.log('auth_type', req.user.auth_type);
  if(req.user.auth_type == 'local'){
    console.log('local', req.user.userinfo.local);
    res.render('userinfo', {name: req.user.userinfo.local.name, id: req.user._id});
    return;
  }
  if(req.user.auth_type == 'facebook'){
    console.log('facebook', req.user.userinfo.facebook);
    res.render('userinfo_facebook', {user: req.user, name: req.user.userinfo.facebook.name});
    return;
  }
  if(req.user.auth_type == 'twitter'){
    console.log('twitter', req.user.userinfo.twitter);
    res.render('userinfo_twitter', {user: req.user, name: req.user.userinfo.twitter.name});
    return;
  }
  res.render('userinfo');
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
