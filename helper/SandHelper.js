exports.extractsCityId = function(sand) {
	var results = '';
	for (var i = 0; i < sand.length; i++) {

		results = results + ' ' + sand[i].city_code;
	}
	results = results.replace(/(^\s*)|(\s*$)/gi, "");
	return results;
}

exports.filterByLanguage = function(args, inform) {
	var result = [];
		for (var i = 0; i < args.length; i++) {
			if (args[i].language == inform.dLang || inform.addLang.indexOf(args[i].language)!==-1) {
				result.push(args[i]);
			}
		}
	return result;
};

exports.addCityNameInSand = function(town, sand) {
	for (var i = 0; i < town.length; i++) {
		for (var j = 0; j < sand.length; j++) {
			if (sand.city_name == undefined) {
				if (sand[j].city_code === town[i].city_id) {
					sand[j].city_name = town[i].english_city_name;
					sand[j].country_name = town[i].country_code;
				}
			}
		}
	}
	return sand;
}