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
  console.log("post user id");
  var conditions = { _id: req.params.id}
  var update;

  //両方なかったら意味なしさよなら
  if(!req.body.email && !req.body.password)
  {
    res.redirect('back');
  }


  //メールがあったら更新
  if(req.body.email)
  {
    update = {$set : {
      "userinfo.local.email": req.body.email
    }};
  }
  //!!!!!!!!!!!!!!!!!!!!!!!!この瞬間にログアウトしてしまう
  //のでログインする処理ほしい
  

  //パスワードがあったら更新
  if(req.body.password)
  {
    update = {$set: {
      "userinfo.local.password": helper.generateHash(req.body.password)
    }};
  }

  //実際に更新処理
  User.update(conditions, update, function(err, num){
    if(err){
      console.log(err);
    }
    console.log(num);
    req.session.destroy();
    res.redirect('/login');
  });
});

module.exports = router;
