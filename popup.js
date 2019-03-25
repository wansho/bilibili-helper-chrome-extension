// popup 用来 和 Chrome Extension 的用户UI，也就是 popup.html 进行交互

let detectSex = document.getElementById("detec_sex");

/*
// 获取在安装插件时存储的color值，并设置popup.html的颜色
chrome.storage.sync.get(
	'color', 
	function(data) {
		changeColor.style.backgroundColor = data.color;
		changeColor.setAttribute('value', data.color);
	}
);
*/

// 为按钮添加点击事件
detectSex.onclick = function(element) {
	//let color = element.target.value;
	chrome.tabs.query(
		{active: true, currentWindow: true}, 
		function(tabs){
			/*
			// 注入执行脚本
			chrome.tabs.executeScript(
				tabs[0].id,
				{code: 'document.body.style.backgroundColor = "' + color + '";'}
			);
			*/
			/**
			 * Use the chrome.tabs API to interact with the browser's tab system. 
			 * You can use this API to create, modify, and rearrange tabs in the browser. 
			 * 
			 * The majority of the chrome.tabs API can be used without declaring any 
			 * permission. However, the "tabs" permission is required in order to 
			 * populate the url, title, and favIconUrl properties of Tab. 
			 * 
			 * https://developer.chrome.com/extensions/tabs
			 */
			chrome.tabs.query(
				{active: true, currentWindow: true}, 
				function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {command: "detect"});
				}
			);		
		}
	);
	
	/*
	// 点击按钮后另起一个tab(页面)，打开一个网页
	chrome.tabs.create(
		{active:true,url:'https://www.baidu.com/'}
	);
	*/
	
	console.log("hehe, nimei");
	
	//popup.js 中可以直接调用 background.js 中的方法, background.js 类似于一个基类
	var bg = chrome.extension.getBackgroundPage();
	bg.test()
	
};