var express = require('express');
var router = express.Router();
var async = require('async');
var accountDAO = require('../model/AccountDAO.js');

router.get('/', function(req, res, next) {
	res.render('option', {
		socketIP : req.session.socketIp,
		inform : req.session.inform
	});
});

router.post('/password', function(req, res, next) {
	if (req.body.password !== req.body.passwordConfirm) {
		res.redirect('/error');
	} else {
		async.parallel([ function(callback) {
			accountDAO.changePassword(req.body.password,
					req.session.inform.email, callback);
		} ], function(err, results) {
			if (results[0] !== true) {
				res.redirect('/error');
			} else {
				res.redirect('/option');
			}
		});
	}
});

router.post('/delete', function(req, res, next) {
	async.parallel([ function(callback) {
		accountDAO.deleteAccount(req.session.inform.email,
				req.session.inform.nick, callback);
	} ], function(err, results) {
		if (results[0] !== true) {
			res.redirect('/error');
		} else {
			res.redirect('/logout');
		}
	});
});

router.post('/changePageLang', function(req, res, next) {
	async.parallel([ function(callback) {
		accountDAO.changePageLang(req.session.inform.email, req.body.pageLang,
				callback);
	} ], function(err, results) {
		if (results[0] !== true) {
			res.redirect('/error');
		} else {
			req.session.inform.pageLang = req.body.pageLang;
			res.redirect('/option');
		}
	});
});

module.exports = router;