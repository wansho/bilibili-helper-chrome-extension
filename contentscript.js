// Content Script 用来和 前端页面 通过 DOM 进行交互，会在加载前端的时候自动执行，
// Content Script 已经在 manifest 中设置了 在页面加载完成后执行
// Content Script 中不支持 console.log() 方法
// Content Script 只限于 DOM 操作，做 html，css，js 的相关操作，不能完成与服务器交互的操作，事实上，Google 对 Content Script 的限制非常严格，因为 Content-Script 可以轻而易举的获取到用户的隐私

let url = document.documentURI;
let cookie = document.cookie;

// 发送 messge 给 background.js，将 url 和 cookie 交给 background.js 处理
chrome.runtime.sendMessage({command: {"url": url, "cookie": cookie}});
