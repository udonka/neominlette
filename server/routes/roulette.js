var express = require('express');
var router = express.Router();
var model = require('../models/roulettes.js');
var Roulette = model.Roulette;
var User = require('../models/users.js').User;

var loginCheck = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
}

/* GET home page. */
router.get('/', loginCheck,function(req, res) {
  res.render('roulette');
});

router.post('/', loginCheck, function(req, res){
  var newRoulette = new Roulette(req.body);
  newRoulette.save(function(e){
    if(e){
      console.log(e);
      res.redirect('/home');
    }else{
      console.log(newRoulette);
			var group = {
				name:newRoulette.name,
				roulettes:[newRoulette._id]
			}
      User.update({_id: req.user._id}, 
        {$push:{rouletteGroups: group}},
        function(err, number, raw){
        });
      res.redirect('/home');
    }
  });
});


module.exports = router;
