// Content Script 用来和 前端页面 通过 DOM 进行交互，会在加载前端的时候自动执行，
// Content Script 已经在 manifest 中设置了 在页面加载完成后执行
// Content Script 中的 log 会打印在其操作的页面上，也就是 Web page 上，F12
// Content Script 只限于 DOM 操作，做 html，css，js 的相关操作，不能完成与服务器交互的操作，事实上，Google 对 Content Script 的限制非常严格，因为 Content-Script 可以轻而易举的获取到用户的隐私

progress_width = 0;

// 由于 DOM 加载完了，但是其中的参数并没有加载完，所以我们每秒都 check 一下 DOM 到底有没有真正加载完，
// 加载完后，取消 check，然后发送
var flag = 0; // 周期性运行函数的 flag
flag = setInterval(checkout_dom, 1000);
function checkout_dom(){
	let video_length_view = get_video_length_view(); // 判断 view 是否加载完成
	if(typeof(video_length_view) == "undefined"){
		return;
	}else{
		if(video_length_view.textContent == "00:00"){
			return;
		}
		// DOM 加载完成，取消定时调用函数的操作，并发送 message
		clearInterval(flag);
		danmu_trend_switch_check_and_message();
		// 获取 progress_width 并存储到本地
		progress_width = get_progress_width();
	}
}

// 对 video_length 进行实时的 check，如果发现长度发生变化，则对弹幕热度条进行适配
var flag_restart_danmu_trend = setInterval(checkout_width, 2000);
function checkout_width(){
	let video_length_view = get_video_length_view();
	if(typeof(video_length_view) == "undefined"){
		return;
	}else{
		// DOM 加载完成，判断 progress_width 是否有变化，先获取旧的 progress_width 与之比较
		let old_progress_width = progress_width;
		if(old_progress_width == 0){
			return;
		}else{
			let new_progress_width = get_progress_width();
			if(Math.abs(new_progress_width - old_progress_width) > 30){
				// 由于 progress_width 受到 echart 图表的影响，其宽度会变化，所以需要有一个缓冲区间
				// 读取数据并重新渲染
				progress_width = new_progress_width;
				console.log("restart danmu_trend");
				danmu_plugin_duplicates();
				get_data_and_render();
			}
		}
	}
}

function get_video_length_view(){
	// 获取 video 的时长，返回的是时长控件
	return document.getElementsByClassName("bilibili-player-video-time-total")[0];
}

function get_progress_width(){
	// 获取进度条在前端占用的长度， int 类型
	let progress = $(".bilibili-player-video-progress").width();
	return progress;
}

function send_message_for_ajax(){
	// 发送 messge 给 background.js，将 url 和 cookie 交给 background.js 处理
	let url = document.documentURI;
	let cookie = document.cookie;
	let video_length = get_video_length_view().textContent;
	let video_info = {"url": url, "cookie": cookie, "video_length": video_length};
	// 注意，JavaScript 的字典类型不能直接 toString 转成字符串
	chrome.storage.local.set({url_param: video_info}, function() {
		console.log("url param saved.");
		command = "start_Ajax";
		chrome.runtime.sendMessage({"command": command});
	});
}

// 接收 popup.js发送过来的消息
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
	// background.js 中的log时在扩展页面该扩展的背景页显示的
		command = request.command;
		if(command == "danmu_trend_switch_change"){
			danmu_trend_switch_check_and_message();
		}
		if(command == "start_rendering"){ // 开始将 timeline 数据渲染到前端
			get_data_and_render();
		}
	}
);

function danmu_trend_switch_check_and_message(){
	// 判断是否开启了 switch，如果开启了，则发送 message
	chrome.storage.sync.get("danmn_trend_switch", function(result) {
		let conf = result.danmn_trend_switch;
		danmu_plugin_duplicates();
		if(conf == "on"){
			send_message_for_ajax();
		}
	});
}

function get_data_and_render(){
	// 获取存储的数据并渲染到前端
	chrome.storage.local.get(["timeline", "climax_period_list"], function(data) {
		timeline = data.timeline;
		climax_period_list = data.climax_period_list;
		console.log("load timeline success");
		console.log("load climax_period_list success");
		render(timeline, climax_period_list);
	});
}

function danmu_plugin_duplicates(){
	// 判断弹幕热度插件是否存在，如果存在，则删除
	if($("#danmu-trend-plugin").length > 0){
		$("#danmu-trend-plugin").remove();
	}
}

function check_if_in_hot_period(second, climax_period_list){
	// 判断某一秒是否在热点区间里面
	for(var i=0; i<climax_period_list.length; i++){
		var start_seconds = climax_period_list[i]["start_time"];
		var end_seconds = climax_period_list[i]["end_time"];
		if(second>=start_seconds && second<end_seconds){
			return true;
		}
	}
	return false;
}

function generate_series(start_second, end_second, hot_flag, data_list){
	// 生成 series，将 data_list 转成字符串，并返回一个字符串化的 series
	var color = (hot_flag==1? "'rgb(255, 140, 102)'":"'rgb(226, 226, 226)'"); // 226, 226, 226
	// data_list = "[" + data_list.toString() + "]";
	data_list_str = "";
	for(var i=0; i<data_list.length; i++){
		data_list_str = data_list_str + "[" + data_list[i].toString() + "], ";
	}
	data_list_str = "[" + data_list_str.substring(0, data_list_str.length-2) + "]";
	series_item = "{\n" +
		"            name: '热度',\n" +
		"            type: 'line',\n" +
		"            smooth: true,\n" +
		"            data: " + data_list_str + ",\n" +
		"            symbol:'none',\n" +
		"            areaStyle: {\n" +
		"                normal: {\n" +
		"                    color: " + color + ",\n" +
		"                    opacity: 1\n" +
		"                }\n" +
		"            }\n" +
		"        }\n";
	return series_item;
}

function render(timeline, climax_period_list){
	// 在前端渲染数据
	// $(".tit").append("追加文本");
	// 在 class = "bilibili-player-video-bottom-area" 的 div 上面加上一个 bar，用来显示弹幕热度

	// 获取进度条的长度
	let progress = get_progress_width();
	let progress_length = progress.toString() + "px";
    // 构造 X 轴 和 values 的数据
    let video_length = get_video_length_view().textContent;
    let length = parseInt(video_length.split(":")[0]) * 60 + parseInt(video_length.split(":")[1]);
    let x_axis = Array.from({length:length}, (v,k) => k);
    // 将 X 轴坐标转成视频的进度
	for(var i=0; i < x_axis.length; i++){
		var seconds = x_axis[i];
		// 分钟部分
		var minute = Math.floor(seconds/60).toString()
		minute.length == 1 ? minute = "0" + minute : minute = minute;
		// 秒部分
		var second = Math.floor(seconds % 60).toString()
		second.length == 1 ? second = "0" + second : second = second;
		x_axis[i] = '"' + minute + ":" + second + '"'
	}
	// 填充 values
	let values = [];
	for(var i=0; i < x_axis.length; i++){
		let tmp = timeline[i];
		if(typeof(tmp) == "undefined"){
			values.push(0);
		}else{
			values.push(tmp);
		}
	}

	// 生成所有区间的属性，区分热点区间和非热点区间
	series_list = [];
	statistics_start_second = 0;
	statistics_end_second = 0;
	hot_flag = 0; // 标记当前区间的属性，是否是 hot period
	data_list = [];
	for(var second=0; second < length; second++){
		if(check_if_in_hot_period(second, climax_period_list)){ // 是热点区间
			if(hot_flag == 1){ // 前一秒也是热点区间
				statistics_end_second = second;
				data_list.push([second, values[second]])
			}else{ // 前一秒不是热点区间
				// 先生成前一个时间段的区间
				statistics_end_second = second - 1;
				data_list.push([second, values[second]])
				series_item = generate_series(statistics_start_second, statistics_end_second, hot_flag, data_list);
				series_list.push(series_item);
				data_list = []
				// 再初始化下一个区间
				hot_flag = 1;
				statistics_start_second = second;
				data_list.push([second, values[second]])
			}
		}else{ // 不是热点区间
			if(hot_flag == 0){ // 前一秒也不是热点区间
				statistics_end_second = second;
				data_list.push([second, values[second]])
			}else{ // 前一秒是热点区间
				// 先生成前一个时间段的区间
				statistics_end_second = second - 1;
				data_list.push([second, values[second]])
				series_item = generate_series(statistics_start_second, statistics_end_second, hot_flag, data_list);
				series_list.push(series_item);
				data_list = []
				// 再初始化下一个区间
				hot_flag = 0;
				statistics_start_second = second;
				data_list.push([second, values[second]])
			}
		}
	}
	series_list.push(generate_series(statistics_start_second, second, hot_flag, data_list));
	// 将 x_axis 和 values 转成字符串的形式
	x_axis = "[" + x_axis.toString() + "]";
	series_list = "[" + series_list.toString() + "]";

    var echart = "<div id=\"danmu-trend-plugin\" style=\"width: " + progress_length + "; height: 50px; margin: 0 auto;\"></div>\n" +
		"<script type=\"text/javascript\">\n" +
		"    var myChart = echarts.init(document.getElementById(\"danmu-trend-plugin\"));\n" +
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
		"            x: 0,\n" +
		"            y: 0,\n" +
		"            x2: 0,\n" +
		"            y2: 0,\n" +
		"            borderWidth: 1,\n" +
		"        }, \n" +
		"        yAxis: {\n" +
		"            type: 'value', \n" +
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
		"        series: " + series_list + "\n" +
		"    };\n" +
		"    myChart.setOption(option);\n" +
		"</script> "

	$(".bilibili-player-video-bottom-area").prepend(echart);

}
