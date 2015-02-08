var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var signup = require('./routes/signup');
var logout = require('./routes/logout');
var roulette = require('./routes/roulette');
var home = require('./routes/home');
var facebook = require('./routes/facebook');
var twitter = require('./routes/twitter');

var app = express();
//add
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

require('./config/passport')(passport);


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
    maxAge: 60 * 60 * 10000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/login', login);
app.use('/signup', signup);
app.get('/logout', logout);
app.use('/roulette', roulette);
app.use('/users', users);
app.use('/home', home);
app.use('/facebook', facebook);
app.use('/twitter', twitter);
app.use('/', routes);

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
