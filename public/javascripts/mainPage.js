function deleteSearching(i) {
	var form = document.createElement("form");
	var input = document.createElement("input");

	form.setAttribute("method", "post");
	form.setAttribute("action", "/main");
	input.type = "hidden";
	input.name = "number";
	input.value = i;
	form.appendChild(input);
	document.body.appendChild(form);
	form.submit();
}

function withChat(myNickname , targetNick){
	if(myNickname==targetNick){
		alert("자기 자신과는 대화할수 없습니다.");
		return false;
	} else{
	var form = document.createElement("form");
	
	var input = document.createElement("input");
	form.setAttribute("method", "post");
	form.setAttribute("action", "/withChat");
	input.type = "hidden";
	input.name = "myNick";
	input.value = myNickname;
	form.appendChild(input);
	
	var input2 = document.createElement("input");
	input2.type = "hidden";
	input2.name = "targetNick";
	input2.value = targetNick;
	form.appendChild(input2);
	
	document.body.appendChild(form);
	form.submit();
	
	}
}