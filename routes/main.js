var express = require('express');
var router = express.Router();
var async = require('async');
var sandDAO = require('../model/SandDAO.js');
var townDAO = require('../model/TownDAO.js');
var sandHelper = require('../helper/SandHelper.js');

router.get('/', function(req, res, next) {

	if (req.session.inform == undefined) {
		res.redirect('/error');
	} else {
		if (req.session.inform.login !== 'sucess') {
			res.redirect('/error');
		} else {
			var tmp;
			var tmpSand;
			async.waterfall([
					function(callback) {
						if (req.session.searchCity.length == 0) {
							callback(null, []);
						} else {
							var prohibit = req.session.inform.prohibit_account.split(' ');
							sandDAO.findSandByCity(req.session.searchCity, prohibit , callback);
						}
					},
					function(arg1, callback) {

						if (arg1.length==0) {
							callback(null, []);
						} else {
							callback(null, sandHelper.filterByLanguage(arg1,
									req.session.inform));
						}
					},
					function(arg1, callback) {
						tmp = arg1;
						if (arg1.length==0) {
							callback(null, []);
						} else {
							var city_code = sandHelper.extractsCityId(arg1);
							townDAO.findCityById(city_code, callback);
						}
					},
					function(arg1, callback) {
						if (arg1.length==0) {
							callback(null, []);
						} else {
							callback(null, sandHelper.addCityNameInSand(arg1, tmp));
						}
					}  ], function(err, results) {
				if (err) {
					res.redirect('/error');
				} else if (!err) {
					res.render('main', {
						inform : req.session.inform,
						city : req.session.searchCity,
						sand : results,
						socketIP : req.session.socketIp
					});
				}
			});
		}
	}
});

router.post('/', function(req, res, next) {
	var tmp = req.body.number;
	if (tmp != undefined) {
		req.session.searchCity.splice(tmp, 1);
	}
	res.redirect('/main');
});


module.exports = router;
