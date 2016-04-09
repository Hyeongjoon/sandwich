function withChat(myNickname, targetNick) {

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

//아래꺼 targetNick이랑 myNick 바뀜 
//그니까 서버에서 받으니까 바뀐거 페이지 기준으로 바뀐거임
//결론은 myNick은 보내는사람 Nickname임 
$(function() {
	socket.on('contents', function(data) {
		if ($('.' + data.myNick + 'Contents').length > 0) {
			var tmp = $('.' + data.myNick + 'Number').text();
			tmp = tmp*1 +1;
			$("."+data.myNick +"Body").remove();
			if($('#chat-room').length>0){
				$('#chat-room').before(
						'<div id="chat-room" class="' + data.myNick + 'Body"><div id="chat-nickname">'
								+ data.myNick
								+ '</div><div id="chat-writing" class="'
								+ data.myNick + 'Contents"  onclick="withChat(' + '\''  
								+ data.targetNick + '\'' + ' ,  ' + '\'' + data.myNick + '\''
								+ ')" style="cursor: pointer">' + data.contents
								+ '</div>' + '<div id="chat-number" class = "' +data.myNick+'Number" >'+ tmp
								+ '</div><div id="chat-cancel" onclick ="deleteChatRoom('+'\''+data.targetNick+'\'' + ' ,  ' + '\'' + data.myNick + '\''+ ' ,  ' + data.roomNumber+ ')" style="cursor: pointer">x</div></div>');	
			} else{
				$('#chat-body').append(
						'<div id="chat-room" class="' + data.myNick + 'Body"><div id="chat-nickname">'
								+ data.myNick
								+ '</div><div id="chat-writing" class="'
								+ data.myNick + 'Contents"  onclick="withChat(' + '\''  
								+ data.targetNick + '\'' + ' ,  ' + '\'' + data.myNick + '\''
								+ ')" style="cursor: pointer">' + data.contents
								+ '</div>' + '<div id="chat-number" class = "' +data.myNick+'Number" >'+ tmp
								+ '</div><div id="chat-cancel" onclick ="deleteChatRoom('+'\''+data.targetNick+'\'' + ' ,  ' + '\'' + data.myNick + '\''  + ' ,  ' + data.roomNumber+ ')" style="cursor: pointer">x</div></div>');
			}
		} else {
			if($("#chat-room-none").length>0){
				$("#chat-room-none").remove();
			}
			if($('#chat-room').length>0){
				$('#chat-room').before(
						'<div id="chat-room" class="' + data.myNick + 'Body"><div id="chat-nickname">'
								+ data.myNick
								+ '</div><div id="chat-writing" class="'
								+ data.myNick + 'Contents"  onclick="withChat(' + '\''  
								+ data.targetNick + '\'' + ' ,  ' + '\'' + data.myNick + '\''
								+ ')" style="cursor: pointer">' + data.contents
								+ '</div>' + '<div id="chat-number" class = "' +data.myNick+'Number" >'+ 1
								+ '</div><div id="chat-cancel" onclick ="deleteChatRoom('+'\''+data.targetNick+'\'' + ' ,  ' + '\'' + data.myNick + '\'' + ' ,  '+ data.roomNumber+   ')" style="cursor: pointer">x</div></div>');
			} else{
				$('#chat-body').append(
						'<div id="chat-room" class="' + data.myNick + 'Body"><div id="chat-nickname">'
								+ data.myNick
								+ '</div><div id="chat-writing" class="'
								+ data.myNick + 'Contents"  onclick="withChat(' + '\''  
								+ data.targetNick + '\'' + ' ,  ' + '\'' + data.myNick + '\''
								+ ')" style="cursor: pointer">' + data.contents
								+ '</div>' + '<div id="chat-number" class = "' +data.myNick+'Number" >'+ 1
								+ '</div><div id="chat-cancel" onclick ="deleteChatRoom('+'\''+data.targetNick+'\'' + ' ,  ' + '\'' + data.myNick + '\'' + ' ,  '+ data.roomNumber+   ')" style="cursor: pointer">x</div></div>');
			}
		}
	});
});

$(function() {
	socket.on('deleteResult', function(data) {
		if(data == false){
			var form = document.createElement("form");
			form.setAttribute("method", "get");
			form.setAttribute("action", "/error");
			document.body.appendChild(form);
			form.submit();
		} else {
			$("." + data.targetNick + "Body").remove();
			if($('#chat-main').length <= 0){
				$('#chat-body').append('<div id="chat-room-none">채팅방이 없습니다.</div>');
			} 
		}
	});
});

function deleteChatRoom(myNickname, targetNick , roomNumber) {
	if(confirm("delete???")==true){
	data = {
		myNick : myNickname,
		targetNick : targetNick,
		roomNumber : roomNumber
	};
	socket.emit('delete_chat_room' , data);
	}
};