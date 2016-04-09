$(function() {
	$("#option-menu2, #option-menu3, #option-menu4").click(function() {
		if ($(this).next('.option-submenu:hidden').is(":hidden")) {
			$(this).next('.option-submenu:hidden').slideDown("middle");
			return false;
		} else {
			$(this).next('.option-submenu').slideUp();
			return false;
		}
	});
});

function chkPassword(email) {
	if (!$("#passwordCorrect").is(":hidden")) {
		return false
	} else {
		if ($("#option-password").val().length < 2) {
			alert("올바른 패스워드를 적어주세요");
			return false;
		} else {
			var tmpData = {
				email : email,
				password : $("#option-password").val()
			};
			socket.emit('chkPassword', tmpData);
			socket.on('result', function(data) {
				if (data === true) {
					if (!$("#passwordworng").is(":hidden")) {
						$("#passwordworng").slideUp();
					}
					$("#option-password").prop('disabled', true);
					$("#passwordCorrect").slideDown("middle");
				} else {
					$("#passwordworng").slideDown("middle");
				}
			});
			return false;
		}
	}
}

$(function() {
	$("#submenu2-passwordok").click(
			function() {
				if ($("#submenu2-password").val().length < 8
						|| $("#submenu1-password").val().length < 8) {
					alert("비밀번호 설정시 8자리 이상으로 해주세요");
					return false;
				} else if ($("#submenu2-password").val() !== $(
						"#submenu1-password").val()) {
					alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
					return false;
				} else if ($("#option-password").val() === $(
						"#submenu2-password").val()) {
					alert("원래 비밀번호와 다른 비밀번호로 해주세요");
					return false;
				} else {
					var form = document.createElement("form");

					form.setAttribute("method", "post");
					form.setAttribute("action", "/option/password");

					var input = document.createElement("input");
					input.type = "hidden";
					input.name = "password";
					input.value = $("#submenu1-password").val();
					form.appendChild(input);

					var input2 = document.createElement("input");
					input2.type = "hidden";
					input2.name = "passwordConfirm";
					input2.value = $("#submenu2-password").val()
					form.appendChild(input2);

					document.body.appendChild(form);
					form.submit();
				}
			});
});

$(function() {
	$("#submenu4-resign").click(function() {
		if (confirm("delete???") === false) {
			return false;
		} else {
			var form = document.createElement("form");

			form.setAttribute("method", "post");
			form.setAttribute("action", "/option/delete");
			document.body.appendChild(form);
			form.submit();
		}
	});
});

$(function() {
	$("#submenu1-change1").click(function() {
		if (confirm("페이지 언어를 수정하시겠 습니까?") === false) {
			return false;
		} else {
			var form = document.createElement("form");

			form.setAttribute("method", "post");
			form.setAttribute("action", "/option/changePageLang");

			var input = document.createElement("input");
			input.type = "hidden";
			input.name = "pageLang";
			input.value = $("#submenu1-select1").val();
			form.appendChild(input);
			document.body.appendChild(form);
			form.submit();

		}
	});
});

$(function() {
	$("#submenu1-change2").click(function() {
		if ($("#defaultL").text() == $("#submenu1-select2").val()) {
			alert("이미 설정되어 있는 언어입니다.");
			return false;
		} else if (confirm("수정하시겠습니까??") === false) {
			return false;
		} else {
			socket.emit('changeDLang', $("#submenu1-select2").val());
			return false;
		}
	});
});

function addDeletionEvent() {
	$(function() {
		$(".option-addition").off("click");
		$(".option-addition").click(function() {
			if (confirm("삭제하시겠습니까??") === false) {
				return false;
			} else {
				var tmp = $(this).text();
				$(this).text("");
				socket.emit('deleteAddLang', tmp);
				return false;
			}
		});
	});
}

function deleteNick(i, prohibitNick) {
	if (confirm("차단사용자를 헤제하겠습니까???") == false) {
		return false;
	} else {
		data = {
			num : i,
			prohibitNick : prohibitNick
		};
		socket.emit('deleteProhibit', data);
	}
}

$(function() {
	$("#submenu2-add").click(
			function() {
				if ($("#defaultL").text() == $("#submenu2-select3").val()) {
					alert("default에 설정되어 있는 값은 추가할수 없습니다.");
					return false;
				} else if ($("#additionL").text().indexOf(
						$("#submenu2-select3").val()) !== -1) {
					alert("이미 addtional에 추가되어 있는 언어입니다.");
					return false;
				} else if (confirm("추가하시겠습니까??") === false) {
					return false;
				} else {
					socket.emit('addAddLang', $("#submenu2-select3").val());
					return false;
				}
			});
});
// 받는부분
$(function() {
	socket.on('DLangResult', function(data) {
		if (data == false) {
			var form = document.createElement("form");
			form.setAttribute("method", "get");
			form.setAttribute("action", "/error");
			document.body.appendChild(form);
			form.submit();
		} else {
			$("#defaultL").text(data.dLang);
			$("#additionL").text("");
			var tmp = data.addLang.split(' ');
			for (var i = 0; i < tmp.length; i++) {
				if (i == 0) {
					$("#additionL").append(
							"<a class='option-addition' style='cursor: pointer' >"
									+ tmp[i] + "</a>");
				} else {
					$("#additionL").append(' ');
					$("#additionL").append(
							"<a class='option-addition' style='cursor: pointer'>"
									+ tmp[i] + "</a>");
				}
			}
			if ($("#additionL").text().replace(/^\s+/, "") == '') {
				$("#additionL").text("");
				$("#additionL").append('<a id ="noAddLang" >no Language</a>');
			}
			addDeletionEvent();
			return false;
		}
	});

	socket.on('addAddLangResult', function(data) {
		if (data == false) {
			var form = document.createElement("form");
			form.setAttribute("method", "get");
			form.setAttribute("action", "/error");
			document.body.appendChild(form);
			form.submit();
		} else {
			if ($("#noAddLang").length > 0) {
				$("#additionL").text("");
			}
			$("#additionL").append(' ');
			$("#additionL").append(
					"<a class='option-addition' style='cursor: pointer'>"
							+ data + "</a>");
			addDeletionEvent();
			return false;
		}
	});

	socket.on('deleteAddLangResult', function(data) {
		if (data == false) {
			var form = document.createElement("form");
			form.setAttribute("method", "get");
			form.setAttribute("action", "/error");
			document.body.appendChild(form);
			form.submit();
		} else {
			if ($("#additionL").text().replace(/^\s+/, "") == '') {
				$("#additionL").text("");
				$("#additionL").append('<a id ="noAddLang" >no Language</a>');
			}
			return false;
		}
	});
	socket
			.on(
					'deleteProhibitResult',
					function(data) {
						if (data === false) {
							var form = document.createElement("form");
							form.setAttribute("method", "get");
							form.setAttribute("action", "/error");
							document.body.appendChild(form);
							form.submit();
						} else {
							$("#prohibitNick" + data).text("");
							if ($("#prohibit").text().replace(/^\s+/, "") == '') {
								$("#prohibit").text("")
								$("#prohibit")
										.append(
												'<li id="prohibitNick"><div id="o-menu4-submenu1">차단 사용자가 없습니다.'
														+ '<div id="submenu1-nickname"><div id="prohibit-delete"></div></div></div></li>');
							}
						}
					});

});

addDeletionEvent();