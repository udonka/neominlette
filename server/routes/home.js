var express = require('express');
var router = express.Router();

var rouletteModel = require('../models/roulettes.js');
var Roulette = rouletteModel.Roulette;

var userModel = require('../models/users.js');
var User = userModel.User;

//add login check function
var loginCheck = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

/* GET home page. */
router.get('/', loginCheck,function(req, res){
  //!!!!!!!!これいちいち書くのめんどくさいなあ
  var send = {
    user_id: req.user.id,
    user_name: req.user.name,
    rouletteGroups: req.user.rouletteGroups,
  };

  res.render('user', send);

});


router.get('/userinfo', loginCheck, function(req, res){
  var viewtemp = "";

  //認証方法によって描画テンプレートを場合分け
  if(req.user.auth_type == 'local'){
    viewtemp = 'userinfo';
  }
  else if(req.user.auth_type == 'facebook'){
    viewtemp = 'userinfo_facebook';
  }
  else if(req.user.auth_type == 'twitter'){
    viewtemp = 'userinfo_twitter';
  }
  else{
    //!!!!!nullだったらやだなあ
    res.render('userinfo', {
      user: "userがありません",
      user_name: "userがありません",
      user_id: "userがありません", 
    });
    return ;
  }

  res.render(viewtemp, {
    user: req.user,
    user_name: req.user.name,
    user_id: req.user.id, // いみないかなあ
  });
  return ;

});

router.get('/create', loginCheck, function(req, res){
  res.render('createRoulette',
    {
      user: req.user,
      user_name: req.user.name,
    });
})

module.exports = router;
