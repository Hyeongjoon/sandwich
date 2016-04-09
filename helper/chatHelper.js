

exports.addInform = function(chatArr , myNick, chatLog , callback){
	for(var i = 0 ; i < chatArr.length ; i++){
		if(chatArr[i].nick1 == myNick){
				chatArr[i].myNick = chatArr[i].nick1;
				chatArr[i].targetNick = chatArr[i].nick2;
		} else{
				chatArr[i].myNick = chatArr[i].nick2;
				chatArr[i].targetNick = chatArr[i].nick1;
		}
	}
	
	for(var i = 0 ; i < chatArr.length ; i++){               // 어차피 10개가 최대니까 걍 2중포문쓰자....이게편하잖냐...
		for(var j = 0 ; j < chatLog.length ; j++){
			if(chatArr[i].room_number==chatLog[j].room_number){
				chatArr[i].log_text = chatLog[j].log_text;
			}
		}
	}
	callback(null , chatArr);
}