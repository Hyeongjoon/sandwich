exports.duplicationChkCityId = function (cityArray, cityID) {
	var tmp = cityArray.split(' ');
	for (var i = 0; i < tmp.length; i++) {
		if (tmp[i] == cityID) {
			return true;
		} 
	}
	return false;
}

exports.deleteCityId = function(cityArray , cityID){
		var tmp = cityArray.split(' ');
		for (var i = 0; i < tmp.length; i++) {
			if (tmp[i] == cityID) {
				tmp.splice(i,1);
				var result = '';
				for(var j= 0 ; j < tmp.length ; j++){
					result = result + tmp[j] + ' ';
				}
				result = result.replace(/(^\s*)|(\s*$)/gi, "");
				return result;
			} 
		}
		return false;
}

exports.addCityId = function(cityArr , cityID){
	var result = cityArr + ' ' + cityID;
	result = result.replace(/(^\s*)|(\s*$)/gi, "");
	return result;
}
