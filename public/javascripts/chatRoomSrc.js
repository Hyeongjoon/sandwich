$(function(){
	$("#goToChatingMain").click(function(){
		location.replace("/chatMain");
	});
});


function reply(roomNumber , targetNick , myNick ){
	var contents = $("#chating-write").val();
	var tmp = $("#chating-write").val();
	contents = contents.replace(/(^\s*)|(\s*$)/gi, "");
	if(contents==''){
		return false;
	} else {
		tmp = tmp.replace(/\n/g, '<br/>');
		tmp = tmp.replace(/\s/g, '&nbsp;');
		
		
		
		data = {
				contents : tmp,
				roomNumber : 1*roomNumber,
				targetNick : targetNick,
				myNick : myNick
		}
		socket.emit('chatRoom' , data);
		socket.emit('updateContent' , data);
		$("#chating-write").val('');
	}
}

$(function(){
	$("#chating-body").scrollTop($("#chating-body")[0].scrollHeight);
});




$(function(){
	socket.on('broadcast_msg', function (data){
		socket.emit('receive_msg' , inform);
		$("#chating-body").append("<li id='chating-others'>" + data + "</li>");
		$("#chating-body").scrollTop($("#chating-body")[0].scrollHeight);
	});
});


$(function(){
	socket.on('submitResult', function (data){
		if(data === false){
			var form = document.createElement("form");
			form.setAttribute("method", "get");
			form.setAttribute("action", "/error");
			document.body.appendChild(form);
			form.submit();
		} else{
			$("#chating-body").append("<li id='chating-mine'>" + data + "</li>");
			$("#chating-body").scrollTop($("#chating-body")[0].scrollHeight);
		}
	});
});