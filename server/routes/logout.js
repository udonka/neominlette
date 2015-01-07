var express = require('express');
var router = express.Router();

router.get('/logout', function(req, res){
	console.log(req.session);
  req.session.destroy();
  console.log('deleted session');
  res.redirect('/');
});

module.exports = router;
