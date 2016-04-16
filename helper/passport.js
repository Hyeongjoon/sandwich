var passport = require('passport');
var localStrategy = require('passport-local').Strategy;




passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
      // 인증 정보 체크 로직
        if (email === 'wkdwns00@gmail.com' && password === '7557523m') {
        // 로그인 성공시 유저 아이디를 넘겨준다.
        	console.log("이건 언제되는겨");
          var user = {id: 'user_1'};
          return done(null, user);
        } else {
          return done(null, false, { message: 'Fail to login.' });
        }
      }
));

passport.serializeUser(function(user, done) {
    console.log('serialize');
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('deserialize');
    done(null, user);
});

exports.passport = passport;