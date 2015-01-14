var express = require('express'),
		path = require('path'),
		logger = require('morgan'),
		bodyParser = require('body-parser'),
		app = express();

var routes = require('./routes/index');

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use('/', routes);
app.use(express.static(path.join(__dirname,'public')));


/*
app.get('/', function(req,res){
	res.sendfile('public/test.html');
});
*/

//app.listen(3003); これで指定してもうまくいかない模様
console.log('server start!');

module.exports = app;
