var express = require('express');
var router = express.Router();

var model = require('../models/users.js');
var User = model.User;


router.get('/login', function(req, res){
	var name = req.query.name;
  var email = req.query.email;
  var password = req.query.password;
  var query = { "email": email, "password": password };
  User.find(query, function(err, data){
    if(err){
      console.log(err);
    }else if(data == ""){
      res.render('login');
    }else{
			var max = req.session.cookie.maxAge;
			/*
			if(max < 0 ){
				console.log("call regenerate");
				req.session.regenerate(function(err){
					if(err) console.log(err);
				});
			}
			*/
			if(max > 0) console.log("u");
			else console.log("d");
			console.log("data:" + data);
			console.log("maxAge"+ max);
			req.session.user = data[0].name;
      req.session.email = email;
			console.log('name '+req.session.user);
			res.redirect('/' + req.session.user);
    }
  });
});


/*
router.get('/login', function(req, res){
      res.render('login');
}
*/
router.post('/login', function(req, res){
  var email = req.query.email;
  var password = req.query.password;
  var query = { "email": email, "password": password };
  User.find(query, function(err, data){
    if(err){
      console.log(err);
    }else if(data == ""){
			//user is not registered
      res.render('login');
    }else{
      req.session.user = email;
      res.redirect('/');
    }
  });
});

module.exports = router;
