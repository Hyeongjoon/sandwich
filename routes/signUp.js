var express = require('express');
var router = express.Router();
var async = require('async');
var AccountDAO = require('../model/AccountDAO.js');


router.get('/register', function(req, res, next) {
	res.render('err', {});
});

router.get('/chkNick', function(req, res, next) {
	res.render('err', {});
});


router.post('/register', function(req, res, next) {
	var nick = req.body.usernickname;
	var email = req.body.useremail;
	var pwd = req.body.userPWD;
	var pwdConfirm = req.body.userPWDconfirm;
	var dLang = req.body.defalutLanguage;
	var aLang = req.body.finalAddtionL;
	if (pwd.length < 8) {
		res.render('unCertified', {
			errMsg : '올바르지 못한 접근입니다. 다시 회원가입 작성해주세요'
		});
	} else if (pwd != pwdConfirm) {
		res.render('unCertified', {
			errMsg : '올바르지 못한 접근입니다. 다시 회원가입 작성해주세요'
		});
	} else if (req.session.chkEmail == 'uncertified'
			|| req.session.chkNick == 'uncertified') {
		res.render('unCertified', {
			errMsg : 'email인증과 nickName 인증을 해야합니다.'
		});
	} else if (req.session.email != email || req.session.nick != nick) {
		res.render('unCertified', {
			errMsg : '인증오류 입니다. 다시 해주세요'
		});
	} else {
		var insert = {
			'nickname' : nick,
			'password' : pwd,
			'email' : email,
			'default_language' : dLang,
			'addtional_language' : aLang,
			'page_language' : dLang
		};
		async.parallel([function(callback) {
			AccountDAO.register(insert, callback);
		} ], function(err, results) {
			if((!err)&&(results[0]==true)){
				delete req.session.inform;
				delete req.session.chkEmail;
				delete req.session.chkNick;
				delete req.session.email;
				delete req.session.nick;
				res.render('success');
			}else{
				res.render('unCertified', {
					errMsg : '내부 서버 오류입니다. 다시 작성해주세요'
				});
			}
		}
		);
	}
});

router.get('/', function(req, res, next) {
	if (req.session.inform == undefined) {
		req.session.chkEmail = 'uncertified';
		req.session.chkNick = 'uncertified';
		req.session.email = null;
		req.session.nick = null;
		res.render('signUp', {
			email : '',
			emailResult : '',
			nickResult : '',
			Nick : ''
		});
	} else {
		if (req.session.inform.login == 'sucess') {
			res.render('err');
		} else {
			req.session.chkEmail = 'uncertified';
			req.session.chkNick = 'uncertified';
			req.session.email = null;
			req.session.nick = null;
			res.render('signUp', {
				email : '',
				emailResult : '',
				nickResult : '',
				Nick : ''
			});
		}
	}

});

router.post('/', function(req, res, next) {
					var tmpValue = req.body.useremail;
					if (!((tmpValue.indexOf('@') != -1
							&& tmpValue.indexOf('.') != -1 && tmpValue
							.indexOf(' ') == -1)
							&& (tmpValue.indexOf('.') - tmpValue.indexOf('@') > 1) && (tmpValue
							.indexOf('.') != (tmpValue.length - 1) && tmpValue
							.indexOf('@') != 0))) {
						res.render('signUp', {
							email : req.body.useremail,
							Nick : req.body.usernickname,
							emailResult : 'it is wrong email',
							nickResult : req.body.resultNick
						});
					} else {
						async.parallel([ function(callback) {
							AccountDAO.certifyEmail(tmpValue, callback);
						} ], function(err, results) {
							if(!err){
							var tmp = arguments[1][0];
							if (tmp[0] == undefined) {
								req.session.chkEmail = 'certified';
								req.session.email = req.body.useremail;
								res.render('signUp', {
									email : req.body.useremail,
									Nick : req.body.usernickname,
									emailResult : 'you can use this Email',
									nickResult : req.body.resultNick
								});
							} else {
								res.render('signUp', {
									email : req.body.useremail,
									Nick : req.body.usernickname,
									emailResult : 'it is already used',
									nickResult : req.body.resultNick
								});

							}} else{
								res.render('unCertified', {
									errMsg : '내부 서버 오류입니다. 다시 작성해주세요'
								});
								
							} 
						});
					}
				});

router.post('/chkNick', function(req, res, next) {
	var tmpValue = req.body.usernickname;
	if (tmpValue.length <= 0 || tmpValue > 19) {
		res.render('signUp', {
			email : req.body.useremail,
			Nick : req.body.usernickname,
			emailResult : req.body.resultEmail,
			nickResult : 'it is wrong nickname'
		});
	} else {
		async.parallel([ function(callback) {
			AccountDAO.certifyNick(tmpValue, callback);
		} ], function(err, results) {
			if(!err){
			var tmp = arguments[1][0];
			if (tmp[0] == undefined) {
				req.session.chkNick = 'certified';
				req.session.nick = req.body.usernickname;
				res.render('signUp', {
					email : req.body.useremail,
					Nick : req.body.usernickname,
					emailResult : req.body.resultEmail,
					nickResult : 'you can use this Nickname'
				});
			} else {
				res.render('signUp', {
					email : req.body.useremail,
					Nick : req.body.usernickname,
					emailResult : req.body.resultEmail,
					nickResult : 'it is already used'
				});
			}} else{
				res.render('unCertified', {
					errMsg : '내부 서버 오류입니다. 다시 작성해주세요'
				});
			}
		});

	}
});

module.exports = router;
