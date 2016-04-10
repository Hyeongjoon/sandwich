var express = require('express');
var router = express.Router();
var config = require('../helper/config.js');

router.get('/', function(req, res, next) {
	req.session.socketIp = config.socketIODomain;
	if (req.session.inform == undefined) {
		res.render('loginPage', {
			title : 'sandwich',
			socketIP : req.session.socketIp
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
