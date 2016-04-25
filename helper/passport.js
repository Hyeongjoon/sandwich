var passport = require('passport');
var localStrategy = require('passport-local').Strategy;


passport.use( new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
      } , function(email, password, done) {
    	    console.log("여긴 되는겨???");
    	    console.log(email);
    	    console.log(password);
        if (email === 'wkdwns00@gmail.com' && password === '7557523m') {
        
        	console.log("이건 언제되는겨");
          var user = {id : 'user_1'};
          return done(null, user);
        } else {
          return done(null, false, { message: 'Fail to login.' });
        }
      }
));

passport.serializeUser( function(user, done) {
    console.log('serialize');
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('deserialize');
    done(null, user);
});

exports.passport = passport;