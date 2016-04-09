var express = require('express');
var router = express.Router();
var async = require('async');
var chat_roomDAO = require('../model/chat_roomDAO.js');
var chat_logDAO = require('../model/chat_logDAO.js');
var chatHelper = require('../helper/chatHelper.js');

router.get('/', function(req, res, next) {
	async.waterfall([ 
	    function(callback) {
		chat_roomDAO.findMyChatRoom(req.session.inform.nick, callback);
	} , function(args1 , callback){
		if(args1 == ''){
			callback(null, '');
		} else{
			RoomInfo = args1;
			chat_logDAO.findOneLog(RoomInfo , callback);
		}	
	} , function(args1 , callback){
		if(args1 ==''){
			callback(null, '');
		} else{
		chatHelper.addInform(RoomInfo , req.session.inform.nick, args1 , callback);
		}
	} ] , function(err, results) {
		if(err){
			res.redirect('/error');
		} else {
			res.render('chatMain', {
				myNick : req.session.inform.nick,
				socketIP : req.session.socketIp,
				chatRoom : results,
				inform : req.session.inform
			});
		}
	});
});

module.exports = router;
