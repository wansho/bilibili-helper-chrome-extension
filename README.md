# Bilibili 风纪委员

## 待加入的功能

1. 鉴黄 —> 自动举报
2. 高能定位
3. 弹幕热度趋势（加入一条颜色 bar，用不同的颜色表示不同的热度）
4. 视频热度趋势
5. 抢一楼可还行？
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