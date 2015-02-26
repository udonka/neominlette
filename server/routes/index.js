var express = require('express');
var router = express.Router();

var model = require('../models/roulettes.js');
var Roulette = model.Roulette;

var userModel = require('../models/users.js');
var User = userModel.User;

//add login check function
var loginCheck = function(req, res, next){
    if(req.session.user){
        return next();
    }
    res.redirect('/login');
}



router.get('/', function(req, res){
  var fullUrl= req.protocol + '://' + req.get('host') + req.originalUrl;

  res.render('branding' , {
    user_name: req.user.name,
    user_id: req.user.id,
    roulette_id: "home",
    labels: [ //実はうわべだけ
      'Udonka',
      'Hayate',
      'Ukiy',
    ],
    QRURL: fullUrl });
});


module.exports = router;
