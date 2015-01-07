var express = require('express');
var router = express.Router();
var model = require('../models/roulettes.js');
var Roulette = model.Roulette;
var User = require('../models/users.js').User;

var loginCheck = function(req, res, next){
    if(req.session.user){
        next();
    }else{
        res.redirect('/login');
    }
}

/* GET home page. */
router.get('/', loginCheck,function(req, res) {
  res.render('roulette');
  console.log(req.session.user);
});

router.post('/', loginCheck, function(req, res){
  var newRoulette = new Roulette(req.body);
  newRoulette.group = "one";
  console.log(req.body);
  User.findOne({name: req.session.user, email: req.session.email},
               function(e, user){
                 if(e) {
                   console.log(e);
                 }
                 newRoulette.author = user.name;
                 newRoulette.save(function(e){
                   if(e){
                   console.log(e);
                   res.redirect('back');
                 }else{
                   req.session.roulette = newRoulette;
                   res.redirect('/'+req.session.user+'/one/'+ newRoulette.name);
                 }
              });

  });
  console.log(newRoulette);
});

module.exports = router;
