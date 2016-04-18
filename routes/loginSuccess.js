var express = require('express');
var router = express.Router();
var passport = require('../app.js').passport;


router.post('/',
	    passport.authenticate('local', { failureRedirect: '/login_fail', failureFlash: true }),
	    function(req, res) {
	        res.redirect('/login_success');
	    });

module.exports = router;


/*function(args1 , callback){
if(args1==''){
socket.emit('chkResult' , false);
return;
} else{
tmpUserInfo = args1[0];
chat_roomDAO.findMyAlramNick1(tmpUserInfo.nickname, callback);
}
}, function(args1 , callback){
tmpNick1Alram=args1[0]['sum(nick1_alram)'];
chat_roomDAO.findMyAlramNick2(tmpUserInfo.nickname, callback);
}], */