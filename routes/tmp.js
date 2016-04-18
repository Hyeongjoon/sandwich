var express = require('express');
var router = express.Router();
var passport = require('../app.js').passport;

router.get('/', function(req, res, next) {
	res.render('tmp', {
		
	});
});
router.post('/',
	    passport.authenticate('local', { failureRedirect: '/login_fail', failureFlash: true }),
	    function(req, res) {
			console.log(req.session);
	        res.redirect('/login_success');
});

module.exports = router;