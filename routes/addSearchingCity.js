var express = require('express');
var router = express.Router();


router.post('/' ,  function(req, res, next) {
	if(req.session.searchCity==null){
		req.session.searchCity = [];
	}
	var addCity = {'to' : req.body.to , 'from' : req.body.from , 'english_city_name' : req.body.cityName , 'country_code' : req.body.countryName , 'city_id' : req.body.cityId};
	if(addCity.to==0){
		addCity.to = undefined;
	}
	req.session.searchCity.push(addCity);
	res.redirect('/main');
});


module.exports = router;