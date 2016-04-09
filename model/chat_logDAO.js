var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.insertChatlog = function(roomNumber , myNick , targetNick , contents , callback){
	var data  = {
			room_number : roomNumber,
			from_user : myNick,
			to_user : targetNick,
			log_text : contents 
	};
	
	var sqlQuery = 'INSERT INTO chat_log SET ? ';
	base.insert(sqlQuery , data , callback);
};

exports.findChatLog = function(roomInfo, myNick , callback){
	var sqlQuery; 
	var whatNick;
	sqlQuery = 'SELECT * FROM chat_log WHERE room_number = ' + mysql.escape(roomInfo.room_number);

	if((roomInfo.nick1 == myNick) && (roomInfo.nick1_deleted_time !== null)){
		sqlQuery = sqlQuery + ' AND sended_time > ' + mysql.escape(roomInfo.nick1_deleted_time);
	} else if((roomInfo.nick2 == myNick) && (roomInfo.nick2_deleted_time !== null)){
		sqlQuery = sqlQuery + ' AND sended_time > ' + mysql.escape(roomInfo.nick2_deleted_time);
	}

	sqlQuery = sqlQuery+ ' ORDER BY sended_time DESC LIMIT 20';	
	 base.select(sqlQuery , callback);
}

exports.findOneLog = function(chatArr , callback){
	var sqlQuery = 'SELECT chat_log.room_number , chat_log.from_user , chat_log.to_user , chat_log.log_text , chat_log.sended_time FROM ' +
	'(SELECT room_number , MAX(sended_time) as sended_time FROM chat_log WHERE room_number IN ( '
	sqlQuery = sqlQuery + chatArr[0].room_number;
	for(var i = 1 ; i < chatArr.length ; i++){
		sqlQuery = sqlQuery + ' , ' + chatArr[i].room_number; 
	}
	sqlQuery = sqlQuery + ') GROUP BY room_number) tmp , chat_log WHERE chat_log.room_number = tmp.room_number AND chat_log.sended_time = tmp.sended_time';
	base.select(sqlQuery , callback);
	
}