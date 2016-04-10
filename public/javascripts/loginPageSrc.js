$(document).ready(function() {
	$('.slick').slick({
		infinite : false,
		speed : 500,
		fade : true,
		draggable : false
	});

	$('#a-SignUp').click(function() {
		$('#a-SignUp').css('cursor', 'default');
		$('#a-LogInButton').css('cursor', 'default');
		$('.slick').slick('slickGoTo', 1);
		$('#a-LogInButton').unbind('click');
		$(document).on('focus', '#a-Id2', function() {
			$(this).attr('autocomplete', 'off');
		});
		$('#a-Id2').unbind('click');
		$('#a-Id2').css('cursor', 'default');
		$('#a-Pw2').unbind('click');
		$('#a-Pw2').css('cursor', 'default');

	});

	$('#slickPage2').click(function() {
		$('#a-SignUp').css('cursor', 'pointer');
		$('#a-LogInButton').css('cursor', 'pointer');
		$('.slick').slick('slickGoTo', 0);
	});
});

$(function() {
	$('#a-LogInButton').css('cursor', 'pointer');
	$('#a-Id2 , #a-Pw2').keypress(function(e) {
		if (e.which == 13) {
			chkEmail();
		} else if(e.which == 32){
			$.msgBox({
				title:"쮸뿌쮸뿌",
				content:"space는 사용할수 없쪙"
				});
		}
	});
	$('#a-LogInButton').click(function() {
		chkEmail();
	});
});

function chkEmail() {
	var email = $('#a-Id2').val();
	var pw = $('#a-Pw2').val();
	if(email==''||pw==''||email.indexOf('@')==-1||email.indexOf('.')==-1||pw.length<=7||email.indexOf(' ')!=-1||pw.indexOf(' ')!=-1){
		$.msgBox({
			title:"쮸뿌쮸뿌",
			content:"올바른 email과 password를 적어주세요"
			});
		return;
	} else{
		$('#a-LogInButton').attr('src',"images/wait.gif");
		var userData = {email : email , pw : pw};
		socket.emit('loginChk' , userData);
	}
};
$(function() {
	socket.on('chkResult' , function(data) {
		if(data===false){
			$.msgBox({
				title:"쮸뿌쮸뿌",
				content:"아이디 혹은 비밀번호가 일치하지 않습니다."
				});
			$('#a-LogInButton').attr('src',"images/LoginPage/log_in.png");
			return;
		} else{
			
		}
	});
});

