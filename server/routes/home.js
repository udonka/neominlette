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
  console.log(req.user.name);
  res.render('user',{
    user: req.user.name,
    name: req.user.name,
    rouletteGroup: req.user.rouletteGroup
  });
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
  res.render('createRoulette', 
    {
      user: req.user.name
    });
})

module.exports = router;
