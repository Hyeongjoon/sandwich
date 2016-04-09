$(function() {
	$("#myPage-searchadd").autocomplete(
			{
				source : function(request, response) {
					var tmp = request.term;
					tmp = tmp.replace(/(^\s*)|(\s*$)/gi, "");
					if (tmp.length > 1) {
						connection(tmp, response);
					}
				},
				select : function(event, ui) {
					var tmp = ui.item.english_city_name + ", "
							+ ui.item.country_code;
					$("#myPage-searchadd").val(tmp);
					$("#interestingCityName").val(ui.item.english_city_name);
					$("#interestingCountryName").val(
							ui.item.country_code);
					$("#interestingCityId").val(ui.item.city_id);
					return false;
				},
				delay : 300,
				focus : function(event, ui) {
					return false;
				},
				minLength : 2
			}).autocomplete("instance")._renderItem = function(ul, item) {
		if (item.english_city_name == undefined) {
			return $("<li>").append("<a>" + "no result" + "</a>").appendTo(ul);
		} else {
			return $("<li>").append(
					"<a>" + item.english_city_name + ", "
							+ item.country_code + "</a>").appendTo(ul);
		}

	}
});

$(function() {
	$("#tool-bar").autocomplete(
			{
				source : function(request, response) {
					var tmp = request.term;
					tmp = tmp.replace(/(^\s*)|(\s*$)/gi, "");
					if (tmp.length > 1) {
						connection(tmp, response);
					}
				},
				select : function(event, ui) {
					var tmp = ui.item.english_city_name + ", "
							+ ui.item.country_code;
					$("#tool-bar").val(tmp);
					$("#sandCityName").val(ui.item.english_city_name);
					$("#sandCountryName").val(ui.item.country_code);
					$("#sandCityId").val(ui.item.city_id);
					return false;
				},
				delay : 300,
				focus : function(event, ui) {
					return false;
				},
				minLength : 2
			}).autocomplete("instance")._renderItem = function(ul, item) {
		if (item.english_city_name == undefined) {
			return $("<li>").append("<a>" + "no result" + "</a>").appendTo(ul);
		} else {
			return $("<li>").append(
					"<a>" + item.english_city_name + ", "
							+ item.country_code + "</a>").appendTo(ul);
		}

	}
});

$(function() {
	$("#tool-from, #tool-to").datepicker({
		dateFormat : 'yy-mm-dd',
		minDate : '0d',
		maxDate : '1y',
		showMonthAfterYear : true,
		showAnim : "fold"
	});
	$('#tool-from').datepicker("option", "onClose", function(selectedDate) {
		if (selectedDate != 0) {
			$("#tool-to").datepicker("option", "minDate", selectedDate);
		} else {
			$("#tool-to").datepicker("option", "minDate", '0d');
		}
	});
});

function deleteInteresting(i) {
	var form = document.createElement("form");
	var input = document.createElement("input");

	form.setAttribute("method", "post");
	form.setAttribute("action", "/myPage/deleteInteresting");
	input.type = "hidden";
	input.name = "number";
	input.value = i;
	form.appendChild(input);
	document.body.appendChild(form);
	form.submit();
};

$(function() {
	$("#myPage-save").click(
			function() {
				if ($("#interestingCityId").val() == 0
						|| $("#interestingCountryName").val() == 0
						|| $("#interestingCityName").val() == 0) {
					alert("검색어를 선택해 주세요");
					return false;
				} else {

					var form = document.createElement("form");
					var input = document.createElement("input");
					form.setAttribute("method", "post");
					form.setAttribute("action", "/myPage/addInteresting");
					input.type = "hidden";
					input.name = "CityId";
					input.value = $("#interestingCityId").val();
					form.appendChild(input);
					var input2 = document.createElement("input");
					input2.type = "hidden";
					input2.name = "CountryName";
					input2.value = $("#interestingCountryName").val();
					form.appendChild(input2);
					var input3 = document.createElement("input");
					input3.type = "hidden";
					input3.name = "CityName";
					input3.value = $("#interestingCityName").val();
					form.appendChild(input3);
					var input4 = document.createElement("input");
					input4.type = "hidden";
					input4.name = "from";
					var today = new Date();
					var month = today.getMonth() + 1;
					if (month < 10) {
						month = '0' + month;
					}
					var year = today.getFullYear();
					var day = today.getDate();
					if (day < 10) {
						day = '0' + day;
					}
					var result = year + '-' + month + '-' + day;
					input4.value = result;
					form.appendChild(input4);
					document.body.appendChild(form);
					form.submit();
				}
			});
});

$(function() {
	$("#tool-button")
			.click(
					function() {
						if ($("#sandCityId").val() == 0
								|| $("#sandCountryName").val() == 0
								|| $("#sandCityName").val() == 0
								|| $("#tool-to").val() == 0
								|| $("#tool-from").val() == 0
								|| $("#mypage-textarea").val() == 0) {
							alert("Date, city, contents are required to register a sand!!");
							return false;
						} else {
							var form = document.createElement("form");
							var input = document.createElement("input");
							form.setAttribute("method", "post");
							form.setAttribute("action", "/myPage/addSand");
							input.type = "hidden";
							input.name = "sandCityId";
							input.value = $("#sandCityId").val();
							form.appendChild(input);

							var input2 = document.createElement("input");
							input2.type = "hidden";
							input2.name = "sandCountryName";
							input2.value = $("#sandCountryName").val();
							form.appendChild(input2);

							var input3 = document.createElement("input");
							input3.type = "hidden";
							input3.name = "sandCityName";
							input3.value = $("#sandCityName").val();
							form.appendChild(input3);

							var input4 = document.createElement("input");
							input4.type = "hidden";
							input4.name = "sandTo";
							input4.value = $("#tool-to").val();
							form.appendChild(input4);

							var input5 = document.createElement("input");
							input5.type = "hidden";
							input5.name = "sandFrom";
							input5.value = $("#tool-from").val();
							form.appendChild(input5);

							var input6 = document.createElement("input");
							input6.type = "hidden";
							input6.name = "contents";
							input6.value = $("#mypage-textarea").val();
							form.appendChild(input6);

							var input7 = document.createElement("input");
							input7.type = "hidden";
							input7.name = "language";
							input7.value = $("#selectLanguage").val();
							form.appendChild(input7);

							document.body.appendChild(form);
							form.submit();
						}
					});
});

function deleteSand(sandID){
	if (confirm("delete???") === false){
		return;
	} else{
		var form = document.createElement("form");
		var input = document.createElement("input");
		
		form.setAttribute("method", "post");
		form.setAttribute("action", "/myPage/deleteSand");
		input.type = "hidden";
		input.name = "sandID";
		input.value = sandID;
		form.appendChild(input);
		document.body.appendChild(form);
		form.submit();
	}
}

function transActivation(sandID , activation){
	var form = document.createElement("form");
	var input = document.createElement("input");
	
	form.setAttribute("method", "post");
	form.setAttribute("action", "/myPage/transActivation");
	input.type = "hidden";
	input.name = "sandID";
	input.value = sandID;
	form.appendChild(input);
	
	var input2 = document.createElement("input");
	input2.type = "hidden";
	input2.name = "activation";
	input2.value = activation;
	form.appendChild(input2);
	
	document.body.appendChild(form);
	form.submit();
}

function revise(mySandId, startDate , endDate, city_code , country_name , city_name , image , contents, language){
	
	var form = document.createElement("form");
	
	form.setAttribute("method", "post");
	form.setAttribute("action", "/myPage/revise");
	
	var input = document.createElement("input");
	input.type = "hidden";
	input.name = "sandID";
	input.value = mySandId;
	form.appendChild(input);
	
	var input2 = document.createElement("input");
	input2.type = "hidden";
	input2.name = "startDate";
	input2.value = startDate;
	form.appendChild(input2);
	
	var input3 = document.createElement("input");
	input3.type = "hidden";
	input3.name = "endDate";
	input3.value = endDate;
	form.appendChild(input3);
	
	var input4 = document.createElement("input");
	input4.type = "hidden";
	input4.name = "city_code";
	input4.value = city_code;
	form.appendChild(input4);
	
	var input5 = document.createElement("input");
	input5.type = "hidden";
	input5.name = "country_name";
	input5.value = country_name;
	form.appendChild(input5);
	
	var input6 = document.createElement("input");
	input6.type = "hidden";
	input6.name = "city_name";
	input6.value = city_name;
	form.appendChild(input6);
	
	var input7 = document.createElement("input");
	input7.type = "hidden";
	input7.name = "image";
	input7.value = image;
	form.appendChild(input7);
	
	var input8 = document.createElement("input");
	input8.type = "hidden";
	input8.name = "contents";
	input8.value = contents;
	form.appendChild(input8);
	
	var input9 = document.createElement("input");
	input9.type = "hidden";
	input9.name = "language";
	input9.value = language;
	form.appendChild(input9);
	
	
	document.body.appendChild(form);
	form.submit();
	
}
