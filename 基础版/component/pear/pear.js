/**
 * author: 就眠仪式
 * description: Pear 配置文件
 * version:3.0.0
 */

window.rootPath = (function (src) {
    src = document.scripts[document.scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();

layui.config({
    base: rootPath + "modules/",
    version: true
}).extend({
    menu: "menu", 
	tab: "tab", 
	echarts: "echarts",
	echartsTheme:"echartsTheme",
	frame: "frame",
	message: "message"
});