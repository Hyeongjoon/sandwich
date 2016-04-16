var express = require('express');
var router = express.Router();
var passport = require('../app.js').passportTmp;

router.get('/', function(req, res, next) {
	res.render('tmp', {
		
	});
});



module.exports = router;