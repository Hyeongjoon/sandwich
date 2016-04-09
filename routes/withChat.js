var express = require('express');
var router = express.Router();
var async = require('async');
var chat_roomDAO = require('../model/chat_roomDAO.js');
var chat_logDAO = require('../model/chat_logDAO.js');

router.post('/', function(req, res, next) {           //여기로 넘어올려면 내 닉네임이랑 타겟닉네임 필요함
	console.log(req.body.myNick);
	console.log(req.body.targetNick);
	var roomInfo;
	var nick1;
	if (req.body.myNick == req.body.targetNick) {
		res.redirect('/error');
	} else if (req.session.inform.nick !== req.body.myNick) {
		res.redirect('/error');
	} else {
		var roomNumber;                       //view 에 보낼 변수
		async.waterfall([
				function(callback) {
					chat_roomDAO.findChatRoom(req.body.myNick, req.body.targetNick, callback);
				}, function(arg1, callback) {
					roomInfo = arg1;
					if (roomInfo == '') {
						callback(null, []);
						roomNumber = undefined;
					} else {
						roomNumber = roomInfo[0].room_number;
						nick1 = roomInfo[0].nick1;
						chat_logDAO.findChatLog( roomInfo[0] , req.body.myNick , callback );
					}
				} ], function(err, results) {	
			console.log(results);
			if (err) {
				res.redirect('/error');
			} else {
			res.render('chatRoom', {
				socketIP : req.session.socketIp,
				chatInfo : results,
				roomNumber : roomNumber,
				targetNick : req.body.targetNick,
				myNick : req.session.inform.nick,
				nick1 : nick1,
				inform : req.session.inform
			});
			}
		});
	}
});

module.exports = router;
