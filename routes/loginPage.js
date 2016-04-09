var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	if (req.session.inform == undefined) {
		res.render('loginPage', {
			title : 'sandwich'
		});
	} else {
		if (req.session.inform.login == 'sucess') {
			res.redirect('/main');
		} else {
			res.render('loginPage', {
				title : 'sandwitch'
			});
		}
	}
});

router.get('/logout', function(req, res, next) {
	req.session.destroy();  
	res.clearCookie('sid'); 
	res.redirect('/');
});

router.get('/google8c0de622edb1cbc9.html', function(req, res, next) {
	res.render('google8c0de622edb1cbc9', {});
});

module.exports = router;
