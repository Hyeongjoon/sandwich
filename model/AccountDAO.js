var base = require('./BaseDAO.js');
var mysql = require('mysql');



exports.findAccount = function(userEmail, userPWD, callback) {
	var sqlQuery = 'SELECT * from account WHERE email = ' + mysql.escape(userEmail)
			+ 'AND password = ' + mysql.escape(userPWD);
	base.select(sqlQuery, callback);
};

exports.certifyEmail = function(userEmail, callback) {
	var sqlQuery = 'SELECT * from account WHERE email = ' + mysql.escape(userEmail);
	base.select(sqlQuery, callback);
};

exports.certifyNick = function(nickname, callback) {
	var sqlQuery = 'SELECT * from account WHERE nickname = '
			+ mysql.escape(nickname);
	base.select(sqlQuery, callback);
};

exports.register = function(inform, callback) {
	var sqlQuery = 'INSERT INTO account set ?'
	base.insert(sqlQuery, inform, callback);
};

exports.changeInterestingCity = function(inform, cityString, callback) {
	var sqlQuery = 'UPDATE account SET interesting_city_code = '
			+ mysql.escape(cityString) + ' WHERE nickname = '
			+ mysql.escape(inform.nick) + ' AND email = '
			+ mysql.escape(inform.email);
	base.update(sqlQuery, callback);
}

exports.changePassword = function(password, email , callback){
	var sqlQuery = 'UPDATE account SET password = '+mysql.escape(password) + ' WHERE email = ' + mysql.escape(email);
	base.update(sqlQuery, callback);
}

exports.deleteAccount = function(email , nickName , callback){
	var sqlQuery = 'DELETE FROM account WHERE email = ' + mysql.escape(email) + ' AND nickname = ' + mysql.escape(nickName);
	base.deletion(sqlQuery , callback);
}

exports.changePageLang = function(email , pageLang , callback){
	var sqlQuery = 'UPDATE account SET page_language = ' + mysql.escape(pageLang) + ' WHERE email = ' + mysql.escape(email);
	base.update(sqlQuery, callback);
}

exports.changeDefalutLang = function(email , DLang , callback){
	var sqlQuery = 'UPDATE account SET default_language = ' + mysql.escape(DLang) + ' WHERE email = ' +mysql.escape(email);
	base.update(sqlQuery, callback);
}

exports.changeAddLang = function(email , AddLang , callback){
	var sqlQuery = 'UPDATE account SET addtional_language = ' + mysql.escape(AddLang) + ' WHERE email = ' +mysql.escape(email);
	base.update(sqlQuery, callback);
}

exports.changeProhibitAccount = function (email , prohibitNick , callback){
	var sqlQuery = 'UPDATE account SET prohibit_account = ' + mysql.escape(prohibitNick) + ' WHERE email = ' + mysql.escape(email);
	base.update(sqlQuery, callback);
	
}