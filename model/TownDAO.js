var base = require('./BaseDAO.js');
var mysql = require('mysql');

exports.findCityById = function(city_code, callback) {
	var tmp = city_code.split(' ');
	var sqlQuery = 'SELECT * from town WHERE city_id = ' + mysql.escape(tmp[0]);
	for (var i = 1; i < tmp.length; i++) {
		sqlQuery = sqlQuery + ' or city_id = ' + mysql.escape(tmp[i]);
	}
	base.select(sqlQuery, callback);
};

exports.findCityByName = function(city_name, callback){
	city_name = city_name + '%';
	var sqlQuery = 'SELECT * FROM town WHERE english_city_name LIKE ' +mysql.escape(city_name)+ ' LIMIT 20';
	base.select(sqlQuery , callback);
};
