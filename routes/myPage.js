var express = require('express');
var router = express.Router();
var accountDAO = require('../model/AccountDAO.js');
var accountHelper = require('../helper/AccountHelper.js');
var sandDAO = require('../model/SandDAO.js');
var sandHelper = require('../helper/SandHelper.js');
var townDAO = require('../model/TownDAO.js');
var async = require('async');

router.get('/', function(req, res, next) {
	var tmp;
	async.waterfall([ function(callback) {
		sandDAO.findMySand(req.session.inform, callback);
	}, function(arg1, callback) {
		if (arg1.length == 0) {
			callback(null, []);
		} else {
			tmp = arg1;
			var cityCode = sandHelper.extractsCityId(arg1);
			townDAO.findCityById(cityCode, callback);
		}
	}, function(arg1, callback) {
		if (arg1.length == 0) {
			callback(null, []);
		} else {
			callback(null, sandHelper.addCityNameInSand(arg1, tmp));
		}
	} ], function(err, results) {
		if (err) {
			res.redirect('/error');
		} else {
			res.render('myPage', {
				inform : req.session.inform,
				city : req.session.searchCity,
				mySand : results,
				socketIP : req.session.socketIp
			});
		}
	});
});

router.post('/deleteInteresting', function(req, res, next) {
	var tmp = req.body.number;
	if (req.session.inform.interesting_city.length == 0
			|| req.session.inform.interesting_city_code == null
			|| req.session.inform.interesting_city_code == ''
			|| tmp == undefined
			|| tmp >= req.session.inform.interesting_city.length) {
		res.redirect('/error');
	} else {
		var changedCity = accountHelper.deleteCityId(
				req.session.inform.interesting_city_code,
				req.session.inform.interesting_city[tmp].city_id);
		req.session.inform.interesting_city.splice(tmp, 1);
		req.session.inform.interesting_city_code = changedCity;
		if (changedCity === false) {
			res.redirect('/error');
		} else {
			async.waterfall([ function(callback) {
				accountDAO.changeInterestingCity(req.session.inform,
						changedCity, callback);
			} ], function(err, results) {
				if (results == true) {
					res.redirect('/myPage');
				} else {
					res.redirect('/error');
				}
			});
		}
	}
});

router.post('/addInteresting', function(req, res, next) {
	var confirm = accountHelper.duplicationChkCityId(
			req.session.inform.interesting_city_code, req.body.CityId);
	if (confirm) {
		res.render('addInterestingErr', {});
	} else {
		var cityArr = accountHelper.addCityId(
				req.session.inform.interesting_city_code, req.body.CityId);
		req.session.inform.interesting_city_code = cityArr;
		var city = {
			city_id : req.body.CityId,
			country_code : req.body.CountryName,
			english_city_name : req.body.CityName,
			from : req.body.from
		};
		req.session.inform.interesting_city.push(city);
		req.session.searchCity.push(city);
		async.waterfall([ function(callback) {
			accountDAO.changeInterestingCity(req.session.inform,
					req.session.inform.interesting_city_code, callback);
		} ], function(err, results) {
			if (results != true) {
				res.redirect('/error');

			} else {
				res.redirect('/myPage');
			}
		});
	}
});

router.post('/addSand', function(req, res, next) {
	var newSand = {
		nick : req.session.inform.nick,
		contents : req.body.contents,
		language : req.body.language,
		city_code : req.body.sandCityId,
		start_date : req.body.sandFrom,
		end_date : req.body.sandTo
	};
	async.waterfall([ function(callback) {
		sandDAO.registerSand(newSand, callback);
	} ], function(err, results) {
		if (results != true) {
			res.redirect('/error');
		} else {
			res.redirect('/myPage');
		}
	});
});

router.post('/deleteSand', function(req, res, next) {
	var sandID = req.body.sandID;
	async.waterfall([ function(callback) {
		sandDAO.deleteSand(req.session.inform, sandID, callback);
	} ], function(err, results) {
		if (err || results != true) {
			res.redirect('/error');
		} else {
			res.redirect('/myPage');
		}
	});
});

router.post('/transActivation', function(req, res, next) {
	var sandID = req.body.sandID;
	var activation = req.body.activation;
	async.waterfall([ function(callback) {
		sandDAO.switchActivation(sandID, activation, callback);
	} ], function(err, results) {
		if (err || results != true) {
			res.redirect('/error');
		} else {
			res.redirect('/myPage');
		}
	});
});

router.post('/revise', function(req, res, next) {
	var reviseSand = {
		sandID : req.body.sandID,
		startDate : req.body.startDate,
		endDate : req.body.endDate,
		city_code : req.body.city_code,
		country_name : req.body.country_name,
		city_name : req.body.city_name,
		image : req.body.image,
		contents : req.body.contents,
		language : req.body.language
	};
	res.render('revise', {
		inform : req.session.inform,
		city : req.session.searchCity,
		reviseSand : reviseSand,
		socketIP : req.session.req.session.socketIp
	});

});

router.post('/reviseSand', function(req, res, next) {
	var reviseSand = {
		id : req.body.sandID,
		start_date : req.body.sandFrom,
		end_date : req.body.sandTo,
		city_code : req.body.sandCityId,
		contents : req.body.contents,
		language : req.body.language
	};
	async.waterfall([ function(callback) {
		sandDAO.reviseSand(reviseSand, callback);
	} ], function(err, results) {
		if(err || results != true){
			res.redirect('/error');
		} else{
			res.redirect('/myPage');
		}
	});
});

module.exports = router;
