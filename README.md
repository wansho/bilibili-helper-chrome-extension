# Bilibili-Helper

[TOC]

## 待加入的功能

1. 鉴黄 —> 脚本自动化举报，改视频标题并飘红警告
2. 高能定位
3. 弹幕热度趋势（加入一条颜色 bar，用不同的颜色表示不同的热度）
4. 视频热度趋势
5. 热词/梗 发现 ——> 排行榜
6. 自动发评论 ——> 抢一楼
## 框架

![Bilibili-Safe-Guard](http://assets.processon.com/chart_image/5c8e3493e4b09a16b9a55f92.png?_=1553490987714)

## 弹幕解析

目前可以定位到弹幕文件和每一条弹幕的内容，但是无法解析每条弹幕的属性。下面是在前端界面的定位轨迹：

1. 找到弹幕容器

   ```html
   <div class="player-auxiliary-danmaku-wrap mCustomScrollbar _mCS_2 mCS-autoHide" style="height: 376px;">
   ```

2. 定位到每条弹幕属性在前端的容器

   ```html
   <li dmno="0" class="danmaku-info-row" style="padding-top: 0px;">
       <span class="danmaku-info-time">03:50</span>	<span class="danmaku-info-danmaku" title="哈哈哈">哈哈哈</span>
       <span class="danmaku-info-date">02-20 20:47</span>
       <div class="danmaku-info-float-layer">
           <div class="danmaku-info-report-btn player-tooltips-trigger" data-tooltip="1" data-change-mode="2" data-text="举报该弹幕的发送者" data-position="top-right">举报</div>
           <div class="danmaku-info-block-btn player-tooltips-trigger" name="list_prevent" data-tooltip="1" data-change-mode="2" data-text="屏蔽该弹幕的发送者" data-position="top-right">屏蔽用户</div>	</div>
   </li>
   ```

3. 重新分析弹幕源文件

   实际上可以直接分析弹幕源文件的规律，抓住不变量进行分析。

   ```xml
   <!-- 03:50 02-20 20:47 -->
   <d p="230.76000,1,25,16777215,1550666851,0,413cf6a8,12333705372631044">哈哈哈</d>
   
   <!-- 02:22 02-20 20:48 -->
   <d p="142.62800,1,25,16777215,1550666899,0,3554ca94,12333730536357892">我就是鞍山人啊~~</d>
   
   <!-- 07:15 02-20 20:48 -->
   <d p="435.61300,1,25,16777215,1550666902,0,a2c03861,12333732301635588">这个电影B站就有正版 你说B站几个人看过</d>
   
   <!-- 20:12 02-21 23:50 -->
   <d p="1212.55200,1,25,16777215,1550764218,0,7119c298,12384753885380612">非常期待！！！</d>
   ```

   解析规则总结

   ```
   "435.61300,1,25,16777215,1550666902,0,a2c03861,12333732301635588"
   435.61300: 弹幕在视频第几秒发送
   1：所有弹幕会包含的数字
   25：所有弹幕会包含的数字
   16777215：所有弹幕会包含的数字
   1550666902：弹幕发送时间的10位的 unix 时间戳
   ```

   目前已经可以解析 **弹幕在视频中的发送时间** 和 **弹幕的发送时间** 两个属性。

## 自动化评论测试

```
telnet api.bilibili.com 80
POST /x/v2/reply/add HTTP/1.1
Host: api.bilibili.com
Cookie: DedeUserID__ckMd5=ce6e1cb27593719c; _dfcaptcha=762f830805b438db0407f69a0431dbaf; sid=j900c54q; buvid3=85148A53-4C8D-48FD-AA7C-573E4A20171447157infoc; DedeUserID=72195837; stardustvideo=1; rpdid=qqoxxslowdossksxomxw; CURRENT_FNVAL=16; bili_jct=f8f349f6002e11b10116c636673997b1; SESSDATA=be37ed85%2C1556153240%2Cfc017e31; LIVE_BUVID=AUTO7915535612221477
Origin: https://www.bilibili.com
Connection: Keep-Alive
Referer: https://www.bilibili.com/video/av47483830?from=search&seid=8100762963916782638
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Content-Length: 95
Accept-Encoding: gzip, deflate, br
Accept: application/json, text/javascript, */*; q=0.01
Accept-Language: zh-Hans-CN, zh-Hans; q=0.5

oid=47483830&type=1&message=woshirobot&plat=1&jsonp=jsonp&csrf=f8f349f6002e11b10116c636673997b1

```

以上的命令已经测试通过，比较重要的几个属性：csrf, cookie

## Fixed-Problems

### Bilibili 默认返回 gzip 编码的网页源码

```
import gzip
gzip.decompress(response.read()).decode("utf-8")
```

建议改用 requests，其可以自动解压缩，功能比 urllib 更强大。

