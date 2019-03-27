// Content Script 用来和 前端页面 通过 DOM 进行交互，会在加载前端的时候自动执行，
// Content Script 已经在 manifest 中设置了 在页面加载完成后执行
// Content Script 中不支持 console.log() 方法
// Content Script 只限于 DOM 操作，做 html，css，js 的相关操作，不能完成与服务器交互的操作，事实上，Google 对 Content Script 的限制非常严格，因为 Content-Script 可以轻而易举的获取到用户的隐私

// 周期性运行函数的 flag
var flag = 0;

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
	// 注意，JavaScript 的字典类型不能直接 toString 转成字符串
	chrome.storage.local.set({url_param: video_info}, function() {
		console.log("url param saved.");
		command = "start_Ajax"
		// 发送 messge 给 background.js，将 url 和 cookie 交给 background.js 处理
		chrome.runtime.sendMessage({"command": command});
	});
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
		if(command == "start_rendering"){ // 开始将 timeline 数据渲染到前端
			chrome.storage.local.get('timeline', function(data) {
				timeline = data.timeline;
				console.log("load timeline success");
				render(timeline);
		  	});
		}
	}
);

function render(timeline){
	// 在前端渲染数据
	// $(".tit").append("追加文本");
	// 在 class = "bilibili-player-video-bottom-area" 的 div 上面加上一个 bar，用来显示弹幕热度

	// 获取进度条的长度
	let progress = document.getElementsByClassName("bilibili-player-video-progress")[0];
	let progress_length = progress.style.width.toString() + "px";

    // 构造 X 轴 和 values 的数据
    let video_length = document.getElementsByClassName("bilibili-player-video-time-total")[0].textContent;
    let length = parseInt(video_length.split(":")[0]) * 60 + parseInt(video_length.split(":")[1]);
    let x_axis = Array.from({length:length}, (v,k) => k);
	let values = [];
	for(var i=0; i < x_axis.length; i++){
		let tmp = timeline[i]
		if(typeof(tmp) == "undefined"){
			values.push(0);
		}else{
			values.push(tmp);
		}
	}
	// 将 x_axis 和 values 转成字符串的形式
	x_axis = "[" + x_axis.toString() + "]"
	values = "[" + values.toString() + "]"


    var echart = "<div id=\"bilibili-helper\" style=\"width: " + progress_length + "; height: 50px; margin: 0 auto;\"></div>\n" +
		"<script type=\"text/javascript\">\n" +
		"    var myChart = echarts.init(document.getElementById(\"bilibili-helper\"));\n" +
		"    var option = {\n" +
		"        tooltip: {\n" +
		"            trigger: 'axis'\n" +
		"        },\n" +
		"        xAxis: {\n" +
		"            type: 'category',\n" +
		"            data: " + x_axis + ", \n" +
		"            axisLine: {\n" +
		"                show: false\n" +
		"            },\n" +
		"            axisTick: {\n" +
		"                show: false\n" +
		"            },\n" +
		"            axisLabel: {\n" +
		"                show: false\n" +
		"            },\n" +
		"        },\n" +
		"        grid: {\n" + // 调整图标长宽 https://blog.csdn.net/lm1022/article/details/78203167
		"            x: 12,\n" +
		"            y: 0,\n" +
		"            x2: 12,\n" +
		"            y2: 0,\n" +
		"            borderWidth: 1,\n" +
		"        }, \n" +
		"        yAxis: {\n" +
		"            type: 'value', \n" +
		"            data: " + x_axis + ", \n" +
		"            axisLine: {\n" +
		"                show: false\n" +
		"            },\n" +
		"            axisTick: {\n" +
		"                show: false\n" +
		"            },\n" +
		"            axisLabel: {\n" +
		"                show: false\n" +
		"            },\n" +
		"        },\n" +
		"        series: [{\n" +
		"            name: '热度',\n" +
		"            type: 'line',\n" +
		"            smooth: true,\n" +
		"            symbol:'none',\n" +
		"            areaStyle: {\n" +
		"                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{\n" +
		"                    offset: 0,\n" +
		"                    color: 'rgb(255, 70, 131)'\n" +
		"                }, {\n" +
		"                    offset: 1,\n" +
		"                    color: 'rgb(255, 158, 68)'\n" +
		"                }])\n" +
		"            },\n" +
		"            data: " + values + ", \n" +
		"            }\n" +
		"        ]\n" +
		"    };\n" +
		"    myChart.setOption(option);\n" +
		"</script> "

	$(".bilibili-player-video-bottom-area").prepend(echart);

}