var express = require('express');
var router = express.Router();
var User = require('../models/users.js').User;
var helper = require('../helper/encrypt');

/* GET users listing. */
router.get('/', function(req, res) {
  User.find({}, function(e, users){
    if(e){
      console.log(e);
    }else{
      res.json(users);
    }
  });
});

router.post('/:id', function(req, res) {
  var conditions = { _id: req.params.id}
  var update;
  if(!req.body.email && !req.body.password)
    res.redirect('back');

  if(req.body.email)
    update = {$set : {"local.email": req.body.email}};

  if(req.body.password)
    update = {$set: {"local.password": helper.generateHash(req.body.password)}};

  User.update(conditions, update, function(err, num){
    if(err){
      console.log(err);
    }
    console.log(num);
    req.session.destroy();
    res.redirect('/login');
  });
});


router.post('/', function(req, res){
  var data = {
    name: req.body.name,
    local: {
      email: req.body.email,
      password: req.body.passwort
    }
  };
  var newUser = new User(data);
  console.log(req.body);
  newUser.save(function(err){
    if(err){
      console.log(err);
      res.redirect('back');
    }else{
      res.redirect('/login');
    }
  });
});



module.exports = router;
