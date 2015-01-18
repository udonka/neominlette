var express = require('express');
var router = express.Router();

var rouletteModel = require('../models/roulettes.js');
var Roulette = rouletteModel.Roulette;

var userModel = require('../models/users.js');
var User = userModel.User;

//add login check function
var loginCheck = function(req, res, next){
    if(req.session.user){
        next();
    }else{
        console.log("user: "+req.session.user);
        res.redirect('/login');
    }
}

/* GET home page. */
router.get('/', loginCheck, function(req, res){
  console.log('/:name');
  User.findOne({name: req.session.userName}, function(err, data){
    if(err) {
      console.log(err);
    }else if(data == null){
      console.log(data);
    }else{
      console.log(data);
      res.render('user',
        {name: data.name,
         rouletteGroup: data.rouletteGroup});
    }
  });

});

router.get('/userinfo', loginCheck, function(req, res){
  res.render('userinfo', 
    {userName: req.session.userName,
     userEmail: req.session.userEmail,
     id: req.session.user._id
    });
});

module.exports = router;
