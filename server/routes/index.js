var express = require('express');
var router = express.Router();

var model = require('../models/roulettes.js');
var Roulette = model.Roulette;

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
router.get('/:name', loginCheck,function(req, res) {
  console.log("index call"+req.params.name);
  Roulette.find({author: req.params.name}, function(err, roulettes){
    if(err){
      console.log(err);
      res.redirect('/login');
    }
    console.log(roulettes);
    res.render('users', { title: 'Express' , user: req.session.user, roulettes: roulettes});
  });
  console.log(req.session.user);
});

router.get('/', loginCheck, function(req, res){
  res.redirect('/login');
});
/*
router.use('/', function(req, res){
  console.log('/ use');
  res.send('use');
});
*/


module.exports = router;
