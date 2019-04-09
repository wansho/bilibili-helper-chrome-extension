// popup 用来 和 Chrome Extension 的用户UI，也就是 popup.html 进行交互

// bootstrap 生效
$(document).ready(function() { $('body').bootstrapMaterialDesign(); });
// 国际化
international_init();
// 初始化 danmu_trend_switch
danmu_trend_switch_init();

function send_message(msg){
	// 和 content-script 进行通信
	chrome.tabs.query({active: true, currentWindow: true},
		function(tabs) {
			// 请求 contentscript.js 获取 cookie 和 url，然后发送给 background.js
			// JQuery 代码
			chrome.tabs.sendMessage(tabs[0].id, {command: msg});
		}
	);
}

function danmu_trend_switch_init(){
	// 读取 danmu_trend_switch 的原始配置
	chrome.storage.sync.get("danmn_trend_switch", function(result) {
		let conf = result.danmn_trend_switch;
		if(conf == "on"){
			$('#danmu_trend_switch').attr("checked", true);
		}
		if(conf == "off"){
			$('#danmu_trend_switch').attr("checked", false);
		}
	});
	// 添加点击事件
	$('#danmu_trend_switch').on('change', function(){
		// danmu_trend_switch 添加点击事件
		let is_checked = $('#danmu_trend_switch').is(":checked")
		if(is_checked){
			console.log("danmu_trend_switch_on");
			chrome.storage.sync.set({danmn_trend_switch: 'on'}, function() {
			});
		}else{
			console.log("danmu_trend_switch_off");
			chrome.storage.sync.set({danmn_trend_switch: 'off'}, function() {
			});
		}
		send_message("danmu_trend_switch_change");
	});
}

// 给超链接添加点击事件，跳转到 GitHub
$("#github").click(function(){
	window.open("https://github.com/wansho/bilibili-helper-chrome-extension");
});

function international_init(){
	// 国际化初始化
	document.getElementById("provided_functions").innerText =
		chrome.i18n.getMessage("provided_functions");

	document.getElementById("switchs").innerText =
		chrome.i18n.getMessage("switchs");

	document.getElementById("danmu_trend").innerText =
		chrome.i18n.getMessage("danmu_trend");
}