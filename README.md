# Bilibili-Helper-Chrome-Extension

Bilibili-Helper 是一款 致力于为 B 站用户提供人性化逛站工具的 Chrome 插件，其提供的主要功能有：

* 软色情视频识别

* 视频弹幕热度可视化
* 高能定位

## Introduction & Inspiration

做这款插件的初衷有两个：

* 快速定位视频的高能，节省我看视频的时间
* 鉴别软色情视频

第一个初衷来源于我经常在B站看 LPL 比赛回放的习惯，本人喜欢在 B 站上看英雄联盟比赛的录播，苦于录播时间长，往往需要手动拉进度条，找开团的时间点，于是我干脆自己做了一个插件，通过弹幕热度，帮助自己找到视频热点，准确定位视频高能。

第二个初衷来源于 [B站克里斯事件](https://www.zhihu.com/question/268705696/answer/342174669) 和 [B站ASMR被禁事件](<https://tech.sina.com.cn/i/2018-06-09/doc-ihcscwxc2366854.shtml>)，B站现在低龄化越来越严重，与此同时，B站的软色情也越来越严重，类似克里斯事件这么恶劣的事件，实际上每天都有可能发生，而 B 站表面上是加强了内容审核，实际上一直都在纵容这些软色情视频。尤其是事情发生一年后的今天，B站仍然不知悔改，各种软色情视频满天飞，舞蹈区已经成了软色情的重灾区。所以，插件的第二个主要功能，就是鉴别这些软色情视频，提醒青少年们远离这些精神鸦片。

伊甸园中的红苹果 [![](https://wansho-blog-pic.oss-cn-beijing.aliyuncs.com/bilibili-helper/icon.jpg)]()代表了诱惑和智慧，我选择用红苹果作为插件的标志，警醒大家，用自己的智慧，抵制 B 站的软色情。

### 弹幕热度可视化/高能定位

该插件能够在视频加载完成后，在视频下方生成一个弹幕热度图，通过弹幕热度，我们可以比较准确的定位视频的热点，上图的比赛中，开局后的每一个弹幕峰值，往往都是一次团战或者击杀。

<p align="center">
  <a href="https://media.giphy.com/media/f9XpASOHKdr1aaM2zx/giphy.gif">
    <img src="https://media.giphy.com/media/f9XpASOHKdr1aaM2zx/giphy.gif">
  </a>
</p>

另外，该插件会在后台计算出视频中高能的时间段，并且在热度图中对视频高能的区间进行标记。

<p align="center">
    <img src="https://wansho-blog-pic.oss-cn-beijing.aliyuncs.com/bilibili-helper/%E4%B8%8D%E5%90%8C%E7%9A%84%E9%A2%9C%E8%89%B2%E6%A0%87%E8%AE%B0%E6%97%B6%E9%97%B4%E6%AE%B5.jpg">
</p>



### 软色情识别

B 站的软色情视频已经屡次被点名，但是屡教不改：

* 2018-03  [B 站克里斯事件](<https://www.zhihu.com/question/268705696/answer/342174669>)

* 2018-06  [扫黄打非办约谈网易云B站等 要求清理涉低俗ASMR内容](<https://tech.sina.com.cn/i/2018-06-08/doc-ihcscwxa3110979.shtml>)

* 2019-04  [13岁让女老师怀孕，15岁的同居生活…知名网站被曝低俗内容泛滥](https://www.ithome.com/0/419/302.htm)

B站不但在软色情方面不作为，甚至会推送推荐这些不健康的视频。而且只要看了一个软色情相关的视频，就会推荐类似的视频。有的人会说，算法是中立的，技术没有对错之分，但这只是借口而已，难道算法不是人写的吗？难道算法不能对软色情视频进行过滤吗？

## Download & Installation

* [Github Release](https://github.com/wansho/bilibili-helper-chrome-extension/releases)
* [Chrome Extension](https://chrome.google.com/webstore/detail/bilibili-helper/hdppmpnmokdiaabkhgnooeimhmbahdkm?hl=zh-CN&gl=CN)
* [百度网盘](https://pan.baidu.com/s/14uFFnoBGUITDbLWjDOqc-A)  提取码: 3sgg

关于如何离线安装 Chrome 插件，请手动百度关键词：*Chrome 插件离线安装*

## Tutorial

<p align="center">
  <a href="https://wansho-blog-pic.oss-cn-beijing.aliyuncs.com/bilibili-helper/tutorial.jpg">
    <img src="https://wansho-blog-pic.oss-cn-beijing.aliyuncs.com/bilibili-helper/tutorial.jpg">
  </a>
</p>

打开 弹幕热度开关 即可放心食用弹幕热度插件。

## Dev

### Data Flow

![data-flow](http://assets.processon.com/chart_image/5cad413ae4b0b39803e4165b.png?_=1554860808775)

### Chrome Extension Develop Summary

[**chrome-extension-summary**](<https://github.com/wansho/chrome-extension-summary>)

## Todo

目前该插件主要功能已实现，但仍有很多 Bug，后期有时间的话，我会把以下问题都解决：

* 实现番剧的弹幕分析兼容
* 鉴黄 / 软色情识别
* 实现全屏时的兼容 —> 完成
* 高能定位 —> 完成
* 完善用户UI —> 完成（使用了 material design 的 UI）

如果你在使用中发现重大的Bug，欢迎来 Github 提交 issue 进行反馈。

