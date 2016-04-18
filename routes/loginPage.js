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


module.exports = router;
