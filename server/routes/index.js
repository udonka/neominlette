var express = require('express');
var router = express.Router();

var model = require('../models/roulettes.js');
var Roulette = model.Roulette;

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
router.get('/:name/one/roulette', loginCheck, function(req, res){
  console.log("call get /name/one/roulette");
  res.render('createRoulette');
});
router.get('/:name/one/:rname', function(req, res){
  console.log("call get /name/one/rname");
  console.log(req.session.roulette);
  console.log(req.params.rname);
  var query = {name: req.params.rname};
  var tags;
  Roulette.findOne(query, function(err, data){
    console.log("room: "+data);
    if(err){
      res.redirect('/login');
    }else if(data==''){
      res.redirect('/login');
    }else{
      tags = data.tags;
      res.render('index', {user: req.params.name, 
                       tags: tags,
                       room: req.params.rname});

    }
  });
});

router.get('/:name/:group/:id', function(req, res){
  Roulette.findById(req.params.id, function(err, roulette){
    if(err){
      console.log(err);
      return ;
    }
    console.log('roulette');
    console.log(roulette);
    res.render('roulette');
  });
});

router.get('/:name', loginCheck,function(req, res) {
  console.log('/:name');
  console.log({name: req.params.name});
  User.findOne({name: req.params.name}, function(err, data){
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

router.get('/', loginCheck, function(req, res){
  res.redirect('/login');
});
router.use('/', function(req, res){
  console.log('/ use');
  res.send('use');
});


module.exports = router;
