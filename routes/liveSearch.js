var express = require('express');
var router = express.Router();
var async = require('async');
var requesting = require('request');
var TownDAO = require('../model/TownDAO.js');
var accountDAO = require('../model/AccountDAO.js');
var chat_roomDAO = require('../model/chat_roomDAO.js');
var chat_logDAO = require('../model/chat_logDAO.js');
var config = require('../helper/config.js');

var place_key = config.google_place_apikey;

var io = require('../app.js').tmp;

var room = [];
var roomNum = [];
var connectingUser = [];

io.on('connection', function(socket) {
	// 실시간 push 알람및 실시간 알람을 위한 연결
	//connectingUser[socket.handshake.session.inform.nick] = socket.handshake.session.inform.nick; 
	//socket.join(connectingUser[socket.handshake.session.inform.nick]);
	if(socket.handshake.session.inform == undefined){
	socket.on('loginChk' , function(data){
		if(data.email==''||data.pw == ''){
			socket.emit('chkResult' , false);
		} else{
			var tmpUserInfo;
			var tmpNick1Alram;
			async.waterfall([ function(callback) {
				accountDAO.findAccount(data.email, data.pw, callback);
			}, function(args1 , callback){
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
			}], function(err, results) {
				var alram = tmpNick1Alram + results[0]['sum(nick2_alram)'];
					//여기부터 다시하장>.<
					
			});
		}
	}); //처음에 로그인 쓸려니까 >.< 아래 설정 당연히 session 없을꺼니까 if문으로 걸러서 오류안생기게 >.<
	} else{
	socket.on('findCity', function(data) {
		var koResult = [];
		var enResult = [];
		async.waterfall([function(callback) {
			requesting('https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&language=en&key='+place_key+'&input='+data, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
					var tmp_placeID = [];
				    var tmp = JSON.parse(body);
				    var tmpLength;
				    if(tmp.predictions.length==0){
				    	callback(null , false); //결과가 없을때 보낼 메세지
				    }else{
				    if(tmp.predictions.length>=3){
				    	tmpLength = 3;
				    } else{
				    	tmpLength = tmp.predictions.length;
				    }
				    for(var i = 0 ; i < tmpLength ; i++){
				    tmp_placeID[i] = tmp.predictions[i].place_id;
				    }
				    callback(null, tmp_placeID);
				  }} else{
					  console.log('구글에 autocomplete 요청보냈는데 에러남');
					  console.log(error);
					  callback(null , false); //리퀘스트 에러나면 보낼 메세지
				  }
				});
		} , function(args1 , callback){
			if(args1 ===false){
				callback(null , false);
			} else{
			for(var i = 0; i < args1.length ; i++){
				requesting('https://maps.googleapis.com/maps/api/place/details/json?language=ko&key='+place_key+'&placeid='+args1[i], function (error, response, body) {
					if (!error && response.statusCode == 200) {
					var tmp = JSON.parse(body);
					console.log(tmp);
					console.log(tmp.result.formatted_address);
					console.log(tmp.result.place_id);
					koResult[i] = {address : tmp.result.formatted_address , placeId : tmp.result.place_id};
					} else {
						console.log('구글에 detail 요청보냈는데 에러남');
						return;
					}
				});
				}
				
			}
		} , function(args1 , callback){
			console.log(koResult);
		}], function(err, results) {
			
		});
		
		
		'https://maps.googleapis.com/maps/api/place/details/json?language=en&key='+place_key+'placeid=';
		
		
		
		/*
		data = data.replace(/^\s+/, "");
		if (data.length > 1) {
			async.parallel([ function(callback) {
				TownDAO.findCityByName(data, callback);
			} ], function(err, results) {
				socket.emit('toclient', results[0]);
			});
		} else {
			socket.emit('toclient', null);
		}*/
	});

	socket.on('chkPassword', function(data) {
		if (data.password == null || data.password.length < 2) {
			socket.emit('result', false);
		} else {
			async.parallel([ function(callback) {
				accountDAO.findAccount(data.email, data.password, callback);
			} ], function(err, results) {
				if (err | results[0].length != 1) {
					socket.emit('result', false);
				} else {
					socket.emit('result', true);
				}
			})
		}
	});
	
	socket.on('changeDLang', function(data){
		if(data==null){
			socket.emit('DLangResult', false);
			return false;
		} else{
			data = data.replace(/^\s+/, "");
			
			var tmp = socket.handshake.session.inform.addLang.split(' ');
			var result = ''
			for(var i = 0 ; i < tmp.length ; i++){
				if(tmp[i]!==data){
					result = result + ' ' + tmp[i]
				}
			}
			result = result.replace(/^\s+/, "");
			async.parallel([ function(callback) {
				if(data === socket.handshake.session.inform.dLang){
					callback(null , true);
				} else{
					// 원래있던거랑 다른거 왔을때만 DB랑 연결
				accountDAO.changeDefalutLang(socket.handshake.session.inform.email , data , callback);
				}
			} , function(callback){
				if(result===socket.handshake.session.inform.addLang){
					callback(null , true);
				}else{
					// 원래있던거랑 다른거 왔을때만 DB랑 연결
				accountDAO.changeAddLang(socket.handshake.session.inform.email , result , callback);
				}
			}] , function(err, results){
				if((results[0]!==true) || (results[1]!==true)||err){
					socket.emit('DLangResult', false);
				} else{
				socket.handshake.session.inform.dLang = data;
				socket.handshake.session.inform.addLang = result;
				socket.handshake.session.save();
				var finalResult = {dLang : data , addLang : result};
				socket.emit('DLangResult', finalResult);
				return false;
				}
			});
		}
	});
	
	socket.on('addAddLang', function(data){
		data = data.replace(/^\s+/, "");
		if(data==null){
			socket.emit('addAddLangResult', false);
			return false;
		} else if(data==socket.handshake.session.inform.dLang){
			socket.emit('addAddLangResult', false);
			return false;
		} else if(socket.handshake.session.inform.addLang.indexOf(data)!==-1){
			socket.emit('addAddLangResult', false);
			return false;
		} else{
			var tmp = socket.handshake.session.inform.addLang + ' ' + data;
			tmp = tmp.replace(/^\s+/, "");
			async.parallel([ function(callback) {
				accountDAO.changeAddLang(socket.handshake.session.inform.email , tmp , callback);
			}] , function(err, results){
				if(results[0]!==true|| err ){
					socket.emit('addAddLangResult', false);
					return false;
				} else{
					socket.handshake.session.inform.addLang = tmp;
					socket.handshake.session.save();
					socket.emit('addAddLangResult', data);
					return false;
				}
			});
		}
	});
	socket.on('deleteAddLang', function(data){
		if(data==null){
			socket.emit('deleteAddLangResult', false);
			return false;
		} else if (data==socket.handshake.session.inform.dLang){
			socket.emit('deleteAddLangResult', false);
			return false;
		} else if (socket.handshake.session.inform.addLang.indexOf(data)==-1){
			socket.emit('deleteAddLangResult', false);
			return false;
		} else{
			data = data.replace(/^\s+/, "");
			
			var tmp = socket.handshake.session.inform.addLang.split(' ');
			var result = ''
			for(var i = 0 ; i < tmp.length ; i++){
				if(tmp[i]!==data){
					result = result + ' ' + tmp[i]
				}
			}
			result = result.replace(/^\s+/, "");
			async.parallel([ function(callback) {
				accountDAO.changeAddLang(socket.handshake.session.inform.email , result , callback);
			}], function(err,results){
				if(results[0]!==true || err){
					socket.emit('deleteAddLangResult', false);
					return false;
				} else{
					socket.handshake.session.inform.addLang = result;
					socket.handshake.session.save();
					socket.emit('deleteAddLangResult', true);
					return false;
				}
			});
		}
	});
	
	socket.on('deleteProhibit' , function(data){
		if(data == null){
			socket.emit('deleteProhibitResult', false);
			return false;
		} else if(socket.handshake.session.inform.prohibit_account.indexOf(data.prohibitNick)!==-1){
			var tmp = socket.handshake.session.inform.prohibit_account.split(' ');
			var result = ''
			for(var i = 0 ; i < tmp.length ; i++){
					if(tmp[i]!==data.prohibitNick){
						result = result + ' ' + tmp[i]
					}
				}
			result = result.replace(/^\s+/, "");
			async.parallel([ function(callback) {
				accountDAO.changeProhibitAccount(socket.handshake.session.inform.email , result , callback);
			}] , function(err , results){
				if(results[0]!==true||err){
					socket.emit('deleteProhibitResult', false);
					return false;
				} else{
					socket.handshake.session.inform.prohibit_account = result;
					socket.handshake.session.save();
					socket.emit('deleteProhibitResult', data.num);
					return false;
				}
			});
		} else{
			socket.emit('deleteProhibitResult', false);
			return false;
		}
	});
	
	socket.on('chatRoom' , function (data){
		var tmpRoomInfo; // 중간에 방정보 기억할라고
		
		if(socket.handshake.session.inform.nick!== data.myNick){
			socket.emit('submitResult' , false);
			return false;
		} else {
		async.waterfall([ function(callback) {
			chat_roomDAO.findChatRoom(data.myNick, data.targetNick, callback);
		} , function(args1 , callback){
			 if(args1==''){
				chat_roomDAO.createRoom(data , callback);
			} else {
				callback(null , true);
			}
		} , function (args1 , callback){
			if(args1 == true){
				chat_roomDAO.findChatRoom(data.myNick, data.targetNick, callback);	
			} else{
				socket.emit('submitResult' , false);
				return false;
			}
			} , function(args1 , callback){
				if(room[args1[0].room_number]==undefined){
					room[args1[0].room_number] = args1[0].room_number;
					socket.join(room[args1[0].room_number]);
				}
				tmpRoomInfo = args1[0];
				chat_logDAO.insertChatlog(args1[0].room_number , data.myNick , data.targetNick , data.contents, callback);
				
			} , function(args1 , callback){
				if(args1 == true){
					chat_roomDAO.updateAlramTime(data , tmpRoomInfo , callback);
				}else {
					socket.emit('submitResult' , false);
					return false;
				}
			}], function(err, results) {
			if(err){
				socket.emit('submitResult' , false);
				return false;
			} else{
				
			socket.emit('submitResult' , data.contents );
			socket.to(room[tmpRoomInfo.room_number]).emit('broadcast_msg', data.contents);
			}
		});}
	});
	
	socket.on('new' , function(data){
		if(data==null){
			return false;
		} else{
			roomNum[socket.handshake.session.inform.nick] = data.roomNumber;
			room[data.roomNumber] = data.roomNumber;
			socket.join(room[data.roomNumber]);
		}
		async.waterfall([
		   function(callback){
			   chat_roomDAO.alramZero(data.nick1 , data.myNick , data.roomNumber , callback);
		       }] , function(err , results){
			if(err ||results[0]==false){
				socket.emit('submitResult' , false);
				return false;
			} else{
				socket.emit('searchBarAlram' , true);
			}
		});
	});
	
	socket.on('updateContent' , function(data){
		var tmpRoomNum = 0;
		async.waterfall([		       
		       function(callback){
		    	   chat_roomDAO.findChatRoomByID(data.myNick , data.targetNick , callback);
		       }  , function(args1 , callback){
		    	   tmpRoomNum = args1[0].room_number; 
		    	 if(args1[0].nick1_deleted==true || args1[0].nick2_deleted == true){
		    		 chat_roomDAO.updateDeleted(args1[0].room_number , callback);
		    	 } else{ 
		    		 callback(null , true);
		    	 }
		       }] , function(err ,results){
			if(!err || results == true){
				if(roomNum[data.targetNick]!==tmpRoomNum){
					socket.to(connectingUser[data.targetNick]).emit('searchBarAlram' , true);
					socket.to(connectingUser[data.targetNick]).emit('searchBarBeep' , true);
					socket.to(connectingUser[data.targetNick]).emit('contents' , data);
				} 
			}
		});
	});
	
	// 연결끊어졌을때 작동될 함수
	socket.on('disconnect' , function(data){
		if(roomNum[socket.handshake.session.inform.nick]!=undefined){
			 delete room[roomNum[socket.handshake.session.inform.nick]];
			 delete roomNum[socket.handshake.session.inform.nick];
		}
		
		if(connectingUser[socket.handshake.session.inform.nick]!=undefined){
			 delete connectingUser[socket.handshake.session.inform.nick];
		}
	});
	
	socket.on('receive_msg', function(data){
		async.waterfall([
		      		   function(callback){
		      			   chat_roomDAO.alramZero(data.nick1 , data.myNick , data.roomNumber , callback);
		      		       }] , function(err , results){
		      			if(err ||results[0]==false){
		      				socket.emit('submitResult' , false);
		      				return false;
		      			} else{
		      				socket.emit('searchBarAlram' , true);
		      			}
		});
	});
	
	socket.on('delete_chat_room' , function(data){
		if(socket.handshake.session.inform.nick!== data.myNick){
			socket.emit('deleteResult' , false);
			console.log("여기까지 왔니??");
			return false;
		} else {
			async.waterfall([
			    function(callback){
				chat_roomDAO.findChatRoomByID(data.myNick , data.targetNick , callback);
			} , function(args1 , callback){
				if(args1[0]==null){
					socket.emit('deleteResult' , false);
				} else{
					chat_roomDAO.deleteChatRoom(args1[0] , data.myNick , callback);
				}
			}] , function(err , results){
				if(err||results==false){
					socket.emit('deleteResult' , false);
				} else{
					socket.emit('deleteResult' , data);
					socket.emit('searchBarAlram' , true);
				}
			});
		}
	});
	
	
	socket.on('searchBarUpdate' , function(data){
		if(data == true){
			var alram = 0;
			async.waterfall([
		      function(callback){
		    	  chat_roomDAO.findMyAlramNick1(socket.handshake.session.inform.nick , callback);  
		      } ,  
		      function(args1 , callback){
		    	  alram = alram + args1[0]['sum(nick1_alram)'];
		    	  chat_roomDAO.findMyAlramNick2(socket.handshake.session.inform.nick , callback);  
		      }] , function(err , results){
				if(!err){
				alram = alram + results[0]['sum(nick2_alram)'];
				socket.handshake.session.inform.alram = alram;
				socket.handshake.session.save();
				socket.emit('updateAlram' , alram);
				}
		});
		} else {
			console.log("서치바 에러");
		}
	});
	
	}
});



module.exports = router;