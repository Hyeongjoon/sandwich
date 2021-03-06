var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Session = require('express-session');

var config = require('./helper/config.js');

var CookiePaser = cookieParser(config.secretKey);

var passport = require('./helper/passport.js').passport;


var RedisStore = require('connect-redis')(Session);
var redis = require('redis').createClient();

var sessionStore = new RedisStore({
	secret: config.secretKey,
	port : config.redisConfig.port,
	host : config.redisConfig.host
});

var session = new Session({
	store: sessionStore,
	cookie:{
		maxAge: 1000 * 60 * 60
	},
	key : config.sessionKey,
	resave : false,
    saveUninitialized : false,
    secret: config.secretKey
});

var app = express();

var sharedsession = require("express-socket.io-session");
var io = require('socket.io').listen(3001);


app.use(CookiePaser);
app.use(session);

app.use(passport.initialize());
app.use(passport.session());

exports.passport = passport;

exports.tmp = io.use(sharedsession(session));



//EJS
var engine = require('ejs-locals');


var login = require('./routes/loginPage');
var signUp = require('./routes/signUp');
var main = require('./routes/main');
var addSearching = require('./routes/addSearchingCity');
var myPage = require('./routes/myPage');
var option = require('./routes/option');
var chatMain = require('./routes/chatMain');
var withChat = require('./routes/withChat');
var liveSearch = require('./routes/liveSearch');
var tmp = require('./routes/tmp');
var success =require('./routes/loginSuccess');

// view engine setup
app.set('views', path.join(__dirname, 'views'));


//EJS
app.set('view engine', 'ejs');
 
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/logo3.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




//EJS
app.engine('ejs', engine);



app.use(express.static(path.join(__dirname, 'public')));


app.use('/tmp' , tmp);
app.use(':3001/' , liveSearch);
app.use('/' , login);
app.use('/signUp' , signUp);
app.use('/main' , main);
app.use('/addSearching', addSearching);
app.use('/myPage' , myPage);
app.use('/option' , option);
app.use('/chatMain' , chatMain);
app.use('/withChat' , withChat);
app.use('/loginSuccess' , success);


app.get('/error', function(req, res, next){
	res.render('err');
	req.session.destroy();
	res.clearCookie('sid');
});

//liveSearch


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
 
 
module.exports = app;