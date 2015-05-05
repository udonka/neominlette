var express = require('express');
var router = express.Router();
var model = require('../models/roulettes.js');
var Roulette = model.Roulette;
var User = require('../models/users.js').User;

var loginCheck = function(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }

  res.redirect('/');
}

/* GET home page. */
router.get('/', loginCheck,function(req, res) {
  //引数なしってなんだよ
  //基本的にはいみなし
  
  var send = {
    user_id: req.user.id,
    user_name: req.user.name,
  };

  //no id
  res.redirect('/home');

});


router.get('/:id', function(req, res){
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
        user: req.user,
        user_name: req.user && req.user.name,
        user_id: req.user && req.user.id,
        roulette_id: req.params.id,
				groupname: user[0].rouletteGroups[0].name,
				roulettename: roulette.name,
        labels: roulette.labels,
        QRURL: fullUrl
      });
    });
	});
});

router.post('/', loginCheck, function(req, res){
  var newRoulette = new Roulette(req.body);

  //新しいルーレットを作って保存
  newRoulette.save(function(e){
    //error処理
    if(e){
      console.log(e);
      res.redirect('/home');
      return;
    }

    var group = {
      name:newRoulette.name,
      roulettes:[newRoulette._id]
    }

    //Userモデルにも保存
    User.update({_id: req.user._id}, 
      {$push:{rouletteGroups: group}},
      function(err, number, raw){
        //なにもしない
      });
    res.redirect('/home');

  });
});


module.exports = router;
