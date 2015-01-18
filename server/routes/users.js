var express = require('express');
var router = express.Router();
var User = require('../models/users.js').User;

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

router.post('/', function(req, res){
  var newUser = new User(req.body);
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
