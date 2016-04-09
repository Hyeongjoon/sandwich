
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
	
	$("#tool-button")
			.click(				
					function() {
						var tmp = $("#sandCityName").val()+", " + $("#sandCountryName").val();
						if(tmp != $("#tool-bar").val()){
							alert("It is worng to select city, please retry to search city!!");
							return false;
						} else if ($("#sandCityId").val() == 0
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
							form.setAttribute("action", "/myPage/reviseSand");
							input.type = "hidden";
							input.name = "sandCityId";
							input.value = $("#sandCityId").val();
							form.appendChild(input);

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
							
							var input8 = document.createElement("input");
							input8.type = "hidden";
							input8.name = "sandID";
							input8.value = $("#sandID").val();
							form.appendChild(input8);

							document.body.appendChild(form);
							form.submit();
						}
					});
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
