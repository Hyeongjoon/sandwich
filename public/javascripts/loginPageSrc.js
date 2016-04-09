function chkLogin() {
		if(document.login.useremail.value == "" || document.login.userPWD.value == ""){
			alert('ID나 비밀번호를 입력해주세요.')
			return false;
		} else{
		document.login.action = "/findMember";
		document.login.method = "post";
		document.login.submit();}
	}


