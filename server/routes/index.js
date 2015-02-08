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


router.get('/roulette/:id', function(req, res){
  var fullUrl= req.protocol + '://' + req.get('host') + req.originalUrl;
  Roulette.findById(req.params.id, function(err, roulette){
    if(err){
      console.log(err);
      //404
      res.status(404).send('NotFound');
      return ;
    }
    console.log('roulette:'+roulette);
		User.find({rouletteGroups:{$elemMatch:{roulettes:[req.params.id]}}},{rouletteGroups:{$elemMatch:{roulettes:[req.params.id]}}},function(err,user){
			if(err){
				console.log(err);
				//404
				res.status(404).send('NotFound');
				return;
			}
			console.log('roulettegroupname:'+user[0].rouletteGroups[0].name);
	    res.render('roulette', {
//      user: req.user.name,
        roulette_id: req.params.id,
				groupname: user[0].rouletteGroups[0].name,
				roulettename: roulette.name,
        labels: roulette.labels,
        QRURL: fullUrl
      });
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
