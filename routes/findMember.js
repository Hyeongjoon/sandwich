var express = require('express');
var router = express.Router();
var async = require('async');
var config = require('../helper/config.js');
var AccountDAO = require('../model/AccountDAO.js');
var TownDAO = require('../model/TownDAO.js');
var chatRoomDAO = require('../model/chat_roomDAO.js');

router.post('/', function(req, res, next) {
	var userInfo;
	var alram = 0;
	if(req.body.email==null || req.body.password==null){
		res.render('err');
	} else{
	async.series([ function(callback) {
		AccountDAO.findAccount(req.body.email, req.body.password, callback);
	}, function(callback){
		  chatRoomDAO.findMyAlramNick1(req.body.email, callback);
	}, function(callback){
		chatRoomDAO.findMyAlramNick2(req.body.email , callback);
	}], function(err, results) {
		console.log(results[0]);
		if(results[0]==''){
			console.log("영구없당");
		}
		/*
		if (err) {
			res.redirect('/error');
		}
		if (tmp[0] == undefined) {
			res.render('loginErr', {});
		} else if (tmp.length >= 2) {
			res.render('loginErr', {});
		} else {
			if(tmp[0].interesting_city_code==null){
				tmp[0].interesting_city_code ='';
			}
			alram = alram + results[0]['sum(nick2_alram)'];
			alram = alram + args1[0]['sum(nick1_alram)'];
			req.session.inform = {
				login : 'sucess',
				nick : tmp[0].nickname,
				email : tmp[0].email,
				interesting_city_code : tmp[0].interesting_city_code,
				interesting_city: [],
				dLang : tmp[0].default_language,
				addLang : tmp[0].addtional_language,
				pageLang : tmp[0].page_language,
				prohibit_account : tmp[0].prohibit_account,
				alram : alram
			};
			req.session.socketIp = config.socketIODomain;
			if (tmp2 != undefined) {
				var today = new Date();
				var month = today.getMonth() + 1;
				var day = today.getDate();
				if(month<10){
					month = '0' + month; 
				}
				if(day < 10){
					day = '0'+day;
				}
				var time = today.getFullYear() + '-' + month
						+ '-' + day;
				for (var i = 0; i < tmp2.length; i++) {
					req.session.inform.interesting_city.push(tmp2[i]);
					tmp2[i].from = time;
					tmp2[i].to = undefined;
				}
			}
			if(tmp2 ==undefined){
				tmp2 = [];
			}
			req.session.searchCity = tmp2;
			res.redirect('/main');
		}*/
	});}
});

router.get('/', function(req, res, next) {
	res.render('err');
});

module.exports = router;
