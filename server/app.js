var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var add = require('./routes/add');
var logout = require('./routes/logout');
var roulette = require('./routes/roulette');

var app = express();
//add
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//edit
app.use(session({
  secret: 'secret',
  store: new MongoStore({
    db: 'session',
    host: 'localhost',
    clear_interval: 60
  }),
  cookie: {
    httpOnly: false,
    maxAge: 60 * 1000
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', login);
app.use('/add', add);
app.get('/logout', logout);
app.use('/roulette', roulette);
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
var x  = {};




module.exports = app;
