$(document).ready(function() {
	$('.slick').slick({
		infinite : false,
		speed : 500,
		fade : true,
		draggable : false
	});

	$('#a-SignUp').click(function() {
		$('.slick').slick('slickGoTo', 1);
	});

	$('#a-BT').click(function() {
		$('.slick').slick('slickGoTo', 0);
	});
});
// slick page 1꺼
$(function() {
	$('#a-LogInButton').css('cursor', 'pointer');
	$('#a-Id2 , #a-Pw2').keypress(function(e) {
		keypress(e);
	});
	$('#a-LogInButton').click(function() {
		chkEmail();
	});
});

function keypress(e){
	if (e.which == 13) {
		chkEmail();
	} else if(e.which == 32){
		$.msgBox({
			title:"쮸뿌쮸뿌",
			content:"space는 사용할수 없쪙"
			});
	}
}

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
		$('#a-LogInButton').unbind();
		$('#a-Id2 , #a-Pw2').unbind();
		$('#a-LogInButton').css('cursor', 'default');
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
			$('#a-LogInButton').bind('click' , function(){
				chkEmail();
			});
	    	$('#a-Id2 , #a-Pw2').bind('keypress' , function(e){
				keypress(e);
			});
	    	$('#a-LogInButton').css('cursor', 'pointer');
			return;
		} else{
			console.log("여기까지 왔쪙"); //로그인 성공했을때 해야할일 적기
		}
	});
});


//slick page 2꺼

$(function(){
	$('#a-WE').click(function(){
			var popUrl = "/chkEmail";	//팝업창에 출력될 페이지 URL
			var popOption = "width=370, height=360, status=no, menubar=no , top=250px , left=750px";    //팝업창 옵션(optoin)
				window.open(popUrl,"",popOption);
	});
});