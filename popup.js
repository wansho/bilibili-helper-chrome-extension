// popup 用来 和 Chrome Extension 的用户UI，也就是 popup.html 进行交互


let start_button = document.getElementById("activate");
// 为按钮添加点击事件
start_button.onclick = function(element) {

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			chrome.tabs.query({active: true, currentWindow: true},
				function(tabs) {
					// 请求 contentscript.js 获取 cookie 和 url，然后发送给 background.js
					// JQuery 代码
					console.log("---------------------------");
					$("#loader").css("visibility", "visible"); // 显示 loader
					chrome.tabs.sendMessage(tabs[0].id, {command: "start"});
				}
			);		
		}
	);	
};

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		command = request.command;
		if(command == "over"){ // 请求结束
			console.log("loader over");
			$("#loader").css("visibility", "hidden"); // 显示 loader
		}
	}
);

function switch_check(){
	// 判断插件开关是否开启
	if($("#custom-switch-01").checked){
		return true;
	}
	return false;
}