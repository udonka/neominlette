
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var branding_router = require('./routes/index');
var users_router = require('./routes/users');
var login_router = require('./routes/login');
var signup_router = require('./routes/signup');
var logout_router = require('./routes/logout');
var roulette_router = require('./routes/roulette');
var home_router = require('./routes/home');
var facebook_router = require('./routes/facebook');
var twitter_router = require('./routes/twitter');

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

app.use(session({ // ???? using session and passport.session?
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
app.use(flash()); //it enables flash
app.use(express.static(path.join(__dirname, 'public'))); //enable access to local dir
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/login', login_router);
app.use('/signup', signup_router);
app.get('/logout', logout_router);
app.use('/roulette', roulette_router);
app.use('/users', users_router);
app.use('/home', home_router);
app.use('/facebook', facebook_router);
app.use('/twitter', twitter_router);
app.use('/', branding_router);

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
