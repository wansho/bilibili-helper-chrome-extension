// 只有在 background.js 中，才能实现外域访问

// 在安装了这个扩展的时候，加入一个监听器
chrome.runtime.onInstalled.addListener(function() {
	/* 
	https://developer.chrome.com/extensions/declarativeContent
	Use the chrome.declarativeContent API to take actions depending on the content 
	of a page, without requiring permission to read the page's content. 
	*/
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			// 条件：hostEquals == 'www.bilibili.com'
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {hostEquals: 'www.bilibili.com'},
				})
			],
			// 干什么：showPageAction
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});

// 接收 contentscript.js和 popup.js 发送过来的 html 文件进行分析
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
		// background.js 中的 log 是在扩展页面该扩展的背景页显示的
		command = request.command; // command可能是detect命令，也可能直接是html页面
		if(command == "start"){
			return;
		}
		$.ajax({
			url: "http://127.0.0.1:8000/bilibili_helper/",
			type: "GET",
			dataType: "json", // 是请求后，返回的数据将以json格式显示
			data: command,
			success: function (data) {
				console.log(data["url"]);
				return;
			}
		});
    }
);

