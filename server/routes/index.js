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


router.get('/:name/:group/:id', function(req, res){
  var fullUrl= req.protocol + '://' + req.get('host') + req.originalUrl;
  Roulette.findById(req.params.id, function(err, roulette){
    if(err){
      console.log(err);
      //404
      res.status(404).send('NotFound');
      return ;
    }
    console.log('roulette');
    console.log(roulette);
    res.render('roulette', {
//      user: req.user.name,
      roulette_id: req.params.id,
      labels: roulette.labels,
      QRURL: fullUrl
    });
  });
});

router.get('/', function(req, res){
  var fullUrl= req.protocol + '://' + req.get('host') + req.originalUrl;

  res.render('branding' , {
    roulette_id: "home",
    labels: [
      'Udonka',
      'Hayate',
      'Ukiy',
    ],
    QRURL: fullUrl });
});


module.exports = router;
