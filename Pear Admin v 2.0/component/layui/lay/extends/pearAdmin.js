layui.define(['table', 'jquery', 'element', 'form', 'pearTab', 'pearMenu', 'pearFrame'], function(exports) {
	"use strict";

	var $ = layui.jquery,
		form = layui.form,
		element = layui.element,
		pearTab = layui.pearTab,
		pearMenu = layui.pearMenu,
		pearFrame = layui.pearFrame;

	var bodyFrame;
	var sideMenu;
	var bodyTab;

	var pearAdmin = new function() {

		this.render = function(option) {

			this.menuRender(option);

			this.bodyRender(option);

			this.keepLoad(option);

			this.themeRender(option);

		}

		this.menuRender = function(option) {

			/** 侧 边 菜 单 组 件 初 始 化 */
			sideMenu = pearMenu.render({
				elem: 'sideMenu', //依赖容器
				async: true, //数据形式
				theme: option.theme,
				height: '100%',
				control: option.control ? 'control' : false, // control 
				defaultMenu: 1,
				defaultOpen: 0, //默认打开菜单
				accordion: true,
				url: option.data, //数据地址
				parseData: false, //请求后是否进行数据解析 函数
				change: option.change
			})


		}

		this.bodyRender = function(option) {

			if (option.muiltTab) {

				bodyTab = pearTab.render({
					elem: 'content',
					roll: true,
					tool: true,
					width: '100%',
					height: '100%',
					index: 0,
					tabMax: 20,
					data: [{
						id: '11',
						url: option.index,
						title: '首页',
						close: false
					}] //初始化数据
				});

				// 选 项 卡 切 换 API 文 档
				bodyTab.click(function(id) {

					// 选 项 卡 定 位
					bodyTab.positionTab();

					sideMenu.selectItem(id);
				})


				$("body").on("click", ".refresh", function() {

					bodyTab.refresh(500);
				})

				sideMenu.click(function(dom, data) {

					bodyTab.addTabOnly({
						id: data.menuId,
						title: data.menuTitle,
						url: data.menuUrl,
						icon: data.menuIcon,
						close: true
					}, 300);

					compatible();
				})

			} else {

				// 选 项 卡 初 始 API 文 档
				bodyFrame = pearFrame.render({
					elem: 'content',
					title: '首 页',
					url: option.index,
					width: '100%',
					height: '100%'
				});

				$("body").on("click", ".refresh", function() {
					bodyFrame.refresh(500);
				})

				sideMenu.click(function(dom, data) {

					compatible();
					bodyFrame.changePage(data.menuUrl, data.menuTitle, true);

				})
			}

		}

		this.keepLoad = function(option) {
			// 关 闭 加 载 层
			compatible();

			setTimeout(function() {

				$(".preloader").fadeOut(option.done);

				// 设 置 关 闭 时 间
			}, option.keepLoad)
		}



		this.colorSet = function(color) {

			var style = '';

			// 自 定 义 菜 单 配 色
			style +=
				'.light-theme .pear-nav-tree .layui-this a:hover,.light-theme .pear-nav-tree .layui-this,.light-theme .pear-nav-tree .layui-this a,.pear-nav-tree .layui-this a,.pear-nav-tree .layui-this{background-color: ' +
				color + '!important;}';

			// 自定义 Logo 标题演示
			style +=
				'.pear-admin .layui-logo .title{color:' +
				color + '!important;}';

			// 自 定 义 标 签 配 色
			style += '.pear-frame-title .dot,.pear-tab .layui-this .pear-tab-active{background-color: ' + color +
				'!important;}';

			// 自 定 义 快 捷 菜 单
			style += '.bottom-nav li a:hover{background-color:' +
				color + '!important;}';

			// 自 定 义 顶 部 配 色
			style += '.pear-admin .layui-header .layui-nav .layui-nav-bar{background-color: ' + color + '!important;}'

			// 自 定 义 加 载 配 色
			style += '.ball-loader>span,.signal-loader>span {background-color: ' + color + '!important;}';

			// 自 定 义 顶 部 配 色
			style += '.layui-header .layui-nav-child .layui-this a{background-color:' + color +
				'!important;color:white!important;}';

			// 自 定 义 加 载 配 色
			style += '#preloader{background-color:' + color + '!important;}';

			// 自 定 义 滚 动 条 样 式

			localStorage.setItem("theme-color", color);

			if ($("iframe").contents().find("#customTheme").length > 0) {

				$("iframe").contents().find("#customTheme").remove();

			}


			var theme = "<style>";

			theme += '</style>';


			$("iframe").contents().find("head").append(theme);

			$("#pearone-bg-color").html(style);
		}


		this.themeRender = function(option) {

			var color = localStorage.getItem("theme-color");

			var menu = localStorage.getItem("theme-menu");

			this.colorSet(color);

			this.menuSkin(menu);
		}


		this.menuSkin = function(theme) {

			$(".pear-admin").removeClass("light-theme");
			$(".pear-admin").removeClass("dark-theme");
			$(".pear-admin").addClass(theme);

		}
	};


	$("body").on("click", ".collaspe,.pear-cover", function() {
		sideMenu.collaspe();
		if ($(".pear-admin").is(".pear-mini")) {
			$(".pear-admin").removeClass("pear-mini");
		} else {
			$(".pear-admin").addClass("pear-mini");
		}
	})


	/**
	 * 全屏/退出全屏
	 */
	$("body").on("click", ".fullScreen", function() {
		if ($(this).hasClass("layui-icon-screen-restore")) {

			screenFun(2).then(function() {
				$(".fullScreen").eq(0).removeClass("layui-icon-screen-restore");
			});

		} else {

			screenFun(1).then(function() {
				$(".fullScreen").eq(0).addClass("layui-icon-screen-restore");
			});

		}

	});


	function compatible() {
		if ($(window).width() <= 768) {
			sideMenu.collaspe();
			if ($(".pear-admin").is(".pear-mini")) {
				$(".pear-admin").removeClass("pear-mini");
			} else {
				$(".pear-admin").addClass("pear-mini");
			}
		}
	}

	/**
	 * 全屏和退出全屏的方法
	 * @param num 1代表全屏 2代表退出全屏
	 * @returns {Promise}
	 */
	function screenFun(num) {
		num = num || 1;
		num = num * 1;
		var docElm = document.documentElement;

		switch (num) {
			case 1:
				if (docElm.requestFullscreen) {
					docElm.requestFullscreen();
				} else if (docElm.mozRequestFullScreen) {
					docElm.mozRequestFullScreen();
				} else if (docElm.webkitRequestFullScreen) {
					docElm.webkitRequestFullScreen();
				} else if (docElm.msRequestFullscreen) {
					docElm.msRequestFullscreen();
				}
				break;
			case 2:
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
				break;
		}

		return new Promise(function(res, rej) {
			res("返回值");
		});
	}


	//监听背景色选择
	$('body').on('click', '[data-select-bgcolor]', function() {
		var theme = $(this).attr('data-select-bgcolor');

		$('[data-select-bgcolor]').removeClass("layui-this");

		$(this).addClass("layui-this");

		localStorage.setItem("theme-menu", theme);

		pearAdmin.menuSkin(theme);
	});

	$('body').on('click', '.select-color-item', function() {

		$(".select-color-item").removeClass("layui-icon")
			.removeClass("layui-icon-ok");

		$(this).addClass("layui-icon").addClass("layui-icon-ok");

		var color = $(".select-color-item.layui-icon-ok").css("background-color");


		pearAdmin.colorSet(color);
	});


	$("body").on("click", ".setting", function() {

		var bgColorHtml =
			'<li class="layui-this" data-select-bgcolor="dark-theme">' +
			'<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">' +
			'<div><span style="display:block; width: 20%; float: left; height: 12px; background: #28333E;"></span><span style="display:block; width: 80%; float: left; height: 12px; background: white;"></span></div>' +
			'<div><span style="display:block; width: 20%; float: left; height: 40px; background: #28333E;"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #f4f5f7;"></span></div>' +
			'</a>' +
			'</li>';


		bgColorHtml +=
			'<li  data-select-bgcolor="light-theme">' +
			'<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">' +
			'<div><span style="display:block; width: 20%; float: left; height: 12px; background: white;"></span><span style="display:block; width: 80%; float: left; height: 12px; background: white;"></span></div>' +
			'<div><span style="display:block; width: 20%; float: left; height: 40px; background: white;"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #f4f5f7;"></span></div>' +
			'</a>' +
			'</li>';

		var html =
			'<div class="pearone-color">\n' +
			'<div class="color-title">整体风格</div>\n' +
			'<div class="color-content">\n' +
			'<ul>\n' + bgColorHtml + '</ul>\n' +
			'</div>\n' +
			'</div>';


		html +=
			"<div class='select-color'><div class='select-color-title'>主题色</div><div class='select-color-content'><span class='select-color-item layui-icon layui-icon-ok' style='background-color:#FF5722;'></span><span class='select-color-item' style='background-color:#5FB878;'></span><span class='select-color-item'  style='background-color:#1E9FFF;'></span><span class='select-color-item' style='background-color:#FFB800;'></span><span class='select-color-item' style='background-color:darkgray;'></span></div></div>"

		html += '<div class="more-menu-list">' +
			'<a class="more-menu-item" href="http://www.pearadmin.cn/doc/" target="_blank">' +
			'<i class="layui-icon layui-icon-read" style="font-size: 19px;"></i> 开发文档' +
			'</a>' +
			'<a class="more-menu-item" href="https://gitee.com/Jmysy/Pear-Admin-Layui" target="_blank">' +
			'<i class="layui-icon layui-icon-tabs" style="font-size: 16px;"></i> 开源地址' +
			'</a>' +
			'<a class="more-menu-item" href="http://www.pearadmin.cn/" target="_blank">' +
			'<i class="layui-icon layui-icon-theme"></i> 官方网站' +
			'</a>' +
			'<a class="more-menu-item" href="http://qm.qq.com/cgi-bin/qm/qr?k=wguN0SYYFVTX9K-5Muf36E_J77bCzdDD&authKey=Ye5voDJGOphYUvypWJHOEyHoYBcgzk1l7djAS4fWcmls1jybLnYjwLrzwsS6Jdo3&group_code=682110771" target="_blank">' +
			'<i class="layui-icon layui-icon-survey"></i> 交流社区' +
			'</a>' +
			'</div>';


		openRight(html);

	})

	function openRight(html) {
		layer.open({
			type: 1,
			offset: 'r',
			area: ['340px', '100%'],
			title: false,
			shade: 0.1,
			closeBtn: 0,
			shadeClose: false,
			anim: -1,
			skin: 'layer-anim-right',
			move: false,
			content: html,
			success: function(layero, index) {
				$('#layui-layer-shade' + index).click(function() {
					var $layero = $('#layui-layer' + index);
					$layero.animate({
						left: $layero.offset().left + $layero.width()
					}, 200, function() {
						layer.close(index);
					});
				})
			}
		});
	}




	exports('pearAdmin', pearAdmin);
})
