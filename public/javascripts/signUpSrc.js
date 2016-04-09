var target = document.getElementById('target').firstChild;
var additionalL = document.getElementById('additionalL');
var defaultL = document.getElementById('defalutL');

function addLanguage() {
	var tmpTarget = document.getElementById('target').innerHTML;
	if (tmpTarget.indexOf(additionalL.value) != -1) {
		alert("이미 있는 언어는 추가할수 없습니다");
		return;
	} else {
		target.appendData(" " + additionalL.value);
		return;
	}
}

function deleteLanguage() {
	var tmpTarget = document.getElementById('target').innerHTML;
	var tmpValue = tmpTarget.substring(tmpTarget.indexOf('addtional'));
	if (tmpValue.indexOf(additionalL.value) == -1) {
		alert("삭제할 값이 없습니다.");
		return;
	} else {
		target.deleteData(tmpTarget.indexOf(additionalL.value),
				additionalL.value.length);

		return;
	}
}

function setDefault() {
	var tmpTarget = document.getElementById('target').innerHTML;

	if (defaultL.value == '-') {
		return;
	} else {
		if (tmpTarget.indexOf('addtional') == 10) {
			if (tmpTarget.indexOf(defaultL.value) == -1) {
				target.insertData(10, defaultL.value + ' ');
			} else {
				target.deleteData(tmpTarget.indexOf(defaultL.value),
						defaultL.value.length);
				target.insertData(10, defaultL.value + ' ');
			}
		} else {
			target.deleteData(10, tmpTarget.indexOf('addtional') - 10);
			tmpTarget = document.getElementById('target').innerHTML;
			if (tmpTarget.indexOf(defaultL.value) != -1) {
				target.deleteData(tmpTarget.indexOf(defaultL.value),
						defaultL.value.length);
				target.insertData(10, defaultL.value + ' ');
			} else {
				target.insertData(10, defaultL.value + ' ');
			}
		}
	}
}

function certify() {
	var tmpValue = document.signForm.useremail.value;
	if (tmpValue.indexOf('@') != -1 && tmpValue.indexOf('.') != -1
			&& tmpValue.indexOf(' ') == -1) {
		if (tmpValue.indexOf('.') - tmpValue.indexOf('@') > 1) {
			if (tmpValue.indexOf('.') != (tmpValue.length - 1)
					&& tmpValue.indexOf('@') != 0) {
				document.signForm.action = "/signUp";
				document.signForm.method = "post";
				document.signForm.submit();
			} else {
				alert("Email is wrong");
				return;
			}

		} else {
			alert("Email is wrong");
			return;
		}
	} else {

		alert("Email is wrong");
		return;
	}
}

function checkPW() {
	var tmpPW = document.signForm.userPWD.value;
	var tmpPWC = document.signForm.userPWDconfirm.value;
	if (tmpPW.length < 8) {
		alert("8자리 이상으로 해주세요")
		return;
	} else {
		if (tmpPW === tmpPWC) {
			alert("비밀번호와 비밀번호 확인이 일치합니다.");
		} else {
			alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
			return;
		}
	}
}

function chkNick() {
	var tmpValue = document.signForm.usernickname.value;
	if (tmpValue.length <= 0 || tmpValue > 19) {
		alert("Nickname`s length must be apper 0 and lower 19");
		return;
	} else {
		document.signForm.action = "/signUp/chkNick";
		document.signForm.method = "post";
		document.signForm.submit();
	}
}

function signUp() {
	var fdefaultL = document.getElementById('defalutL');
	var tmpPW = document.signForm.userPWD.value;
	var tmpPWC = document.signForm.userPWDconfirm.value;
	if (document.signForm.agree.checked == false) {
		alert("약관에 동의 하셔야 합니다.");
		return false;
	} else if (fdefaultL.value == '-') {
		alert("default 언어를 선택해야 합니다.");
		return false;
	} else if(tmpPW !== tmpPWC){
		alert("비밀번호와 비멀번호 확인이 다릅니다. 확인해 주세요");
		return false;
	} else if(tmpPW.length < 8){
		alert("비밀번호는 8자리 이상으로 해주세요")
		return false;
	} else {
		var tmpTarget = document.getElementById('target').innerHTML;
		var finalAddL = tmpTarget.substring(tmpTarget.indexOf('addtional') + 12);
		document.signForm.finalAddtionL.value = finalAddL;
		
		document.signForm.action = "/signUp/register";
		document.signForm.method = "post";
		document.signForm.submit();
		
	}

}
