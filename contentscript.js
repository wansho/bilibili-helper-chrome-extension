// Content Script 用来和 前端页面 通过 DOM 进行交互，会在加载前端的时候自动执行，
// Content Script 已经在 manifest 中设置了 在页面加载完成后执行
// Content Script 中不支持 console.log() 方法
// Content Script 只限于 DOM 操作，做 html，css，js 的相关操作，不能完成与服务器交互的操作，事实上，Google 对 Content Script 的限制非常严格，因为 Content-Script 可以轻而易举的获取到用户的隐私

// 周期性运行函数的 flag
var flag = 0;

$(".bilibili-player-video-time-total").on("send_message", send_message);

function checkout_dom(){
	
	let video_length = document.getElementsByClassName("bilibili-player-video-time-total")[0];
	if(typeof(video_length) == "undefined"){
		return;
	}else{
		// DOM 加载完成，取消定时调用函数的操作，并发送 message
		clearInterval(flag);
		send_message();
	}
}

// while(true){
// 	let video_length = document.getElementsByClassName("bilibili-player-video-time-total")[0];
// 	if(typeof(video_length) == "undefined"){
// 		continue;
// 	}else{
// 		break;
// 	}
// }

function send_message(){
	let url = document.documentURI;
	let cookie = document.cookie;
	let video_length = document.getElementsByClassName("bilibili-player-video-time-total")[0].textContent;
	let video_info = {"url": url, "cookie": cookie, "video_length": video_length};
	// 发送 messge 给 background.js，将 url 和 cookie 交给 background.js 处理
	chrome.runtime.sendMessage({command: video_info});
}

// 由于 DOM 加载完了，但是其中的参数并没有加载完，所以我们每秒都 check 一下 DOM 到底有没有真正加载完，
// 加载完后，取消 check，然后发送
flag = setInterval(checkout_dom, 1000); 


// 接收 popup.js发送过来的消息
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
	// background.js 中的log时在扩展页面该扩展的背景页显示的
		command = request.command;
		if(command == "start"){ //收到 popup.js 发来的点击事件detect后，向background.js发送检测请求
			send_message();
		}
	}
);