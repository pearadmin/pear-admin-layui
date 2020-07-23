layui.define(['table', 'jquery', 'element', 'form', 'tab', 'menu', 'frame'],
	function(exports) {
		"use strict";

		var $ = layui.jquery,
			form = layui.form,
			element = layui.element,
			pearTab = layui.tab,
			pearMenu = layui.menu,
			pearFrame = layui.frame;

		var bodyFrame;
		var sideMenu;
		var bodyTab;

		var pearAdmin = new function() {

			this.render = function(option) {

				var option = getData();

				this.menuRender(option);
				this.bodyRender(option);
				this.keepLoad(option);
				this.logoRender(option);
				this.themeRender(option);
			}

			this.logoRender = function(option) {

				$(".layui-logo .logo").attr("src", option.logoImage);
				$(".layui-logo .title").html(option.logoTitle);
			}

			this.menuRender = function(option) {
				sideMenu = pearMenu.render({
					elem: 'sideMenu', //依赖容器
					async: true, //数据形式
					theme: "dark-theme",
					height: '100%',
					control: option.control ? 'control' : false, // control 
					defaultMenu: 1,
					defaultOpen: 0, //默认打开菜单
					accordion: option.accordion,
					url: option.data, //数据地址
					parseData: false, //请求后是否进行数据解析 函数
					change: option.change
				})
				sideMenu.selectItem(option.select);
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
						tabMax: option.tabMax,
						closeEvent: function(id) {
							sideMenu.selectItem(id);
						},
						data: [{
							id: '0',
							url: option.index,
							title: option.indexTitle,
							close: false
						}] //初始化数据
					});

					bodyTab.click(function(id) {
						bodyTab.positionTab();
						sideMenu.selectItem(id);
					})

					$("body").on("click", ".refresh", function() {
						$(".refresh a").removeClass("layui-icon-refresh-1");
						$(".refresh a").addClass("layui-anim");
						$(".refresh a").addClass("layui-anim-rotate");
						$(".refresh a").addClass("layui-anim-loop");
						$(".refresh a").addClass("layui-icon-loading");
						bodyTab.refresh(400);
						setTimeout(function() {
							$(".refresh a").addClass("layui-icon-refresh-1");
							$(".refresh a").removeClass("layui-anim");
							$(".refresh a").removeClass("layui-anim-rotate");
							$(".refresh a").removeClass("layui-anim-loop");
							$(".refresh a").removeClass("layui-icon-loading");
						}, 600)
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

					bodyFrame = pearFrame.render({
						elem: 'content',
						title: '工作空间 / 首页',
						url: option.index,
						width: '100%',
						height: '100%'
					});

					$("body").on("click", ".refresh", function() {
						$(".refresh a").removeClass("layui-icon-refresh-1");
						$(".refresh a").addClass("layui-anim");
						$(".refresh a").addClass("layui-anim-rotate");
						$(".refresh a").addClass("layui-anim-loop");
						$(".refresh a").addClass("layui-icon-loading");
						bodyFrame.refresh(400);
						setTimeout(function() {
							$(".refresh a").addClass("layui-icon-refresh-1");
							$(".refresh a").removeClass("layui-anim");
							$(".refresh a").removeClass("layui-anim-rotate");
							$(".refresh a").removeClass("layui-anim-loop");
							$(".refresh a").removeClass("layui-icon-loading");
						}, 600)
					})

					sideMenu.click(function(dom, data) {
						bodyFrame.changePage(data.menuUrl, data.menuPath, true);
						compatible()
					})
				}
			}

			this.keepLoad = function(option) {

				compatible()
				setTimeout(function() {

					$(".loader-main").fadeOut(option.done);
				}, option.keepLoad)
			}

			this.themeRender = function(option) {
			
			    if(option.allowCustom == false){
					$(".setting").remove();
				}
				var colorId = localStorage.getItem("theme-color");
				var menu = localStorage.getItem("theme-menu");
                var color = getColorById(colorId);
              
			    if(menu=="null"){
					menu = option.defaultMenu;
				}else{
					
					if(option.allowCustom == false){
						menu = option.defaultMenu;
					}
				}
			   
			    localStorage.setItem("theme-color",color.id);
				localStorage.setItem("theme-menu",menu);

				this.colorSet(color.color);
				this.menuSkin(menu);
			}

			this.menuSkin = function(theme) {
				$(".pear-admin").removeClass("light-theme");
				$(".pear-admin").removeClass("dark-theme");
				$(".pear-admin").removeClass("night-theme");
				$(".pear-admin").addClass(theme);
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


				// 自 定 义 样 式 选 择 边 框 配 色
				style +=
					'.pearone-color .color-content li.layui-this:after, .pearone-color .color-content li:hover:after {border: ' +
					color + ' 2px solid!important;}';

				style += '.layui-nav .layui-nav-child dd.layui-this a, .layui-nav-child dd.layui-this{background-color:' + color +
					'!important}';

				style += '.pear-social-entrance {background-color:' + color + '!important}';

				style += '.pear-admin .pe-collaspe {background-color:' + color + '!important}';

				if ($("iframe").contents().find("#customTheme").length > 0) {

					$("iframe").contents().find("#customTheme").remove();
				}

				var theme = "<style>";
				theme += '</style>';

				$("iframe").contents().find("head").append(theme);
				$("#pearadmin-bg-color").html(style);
			}
		};

		$("body").on("click", ".collaspe,.pear-cover", function() {
			sideMenu.collaspe();
			if ($(".pear-admin").is(".pear-mini")) {
				$(".layui-icon-spread-left").addClass("layui-icon-shrink-right")
				$(".layui-icon-spread-left").removeClass("layui-icon-spread-left")
				$(".pear-admin").removeClass("pear-mini");
			} else {
				$(".layui-icon-shrink-right").addClass("layui-icon-spread-left")
				$(".layui-icon-shrink-right").removeClass("layui-icon-shrink-right")
				$(".pear-admin").addClass("pear-mini");
			}
		})

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
					$(".layui-icon-spread-left").addClass("layui-icon-shrink-right")
					$(".layui-icon-spread-left").removeClass("layui-icon-spread-left")
					$(".pear-admin").removeClass("pear-mini");
				} else {
					$(".layui-icon-shrink-right").addClass("layui-icon-spread-left")
					$(".layui-icon-shrink-right").removeClass("layui-icon-shrink-right")
					$(".pear-admin").addClass("pear-mini");
				}
			}
		}

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


		$("body").on("click", ".setting", function() {

			var bgColorHtml =
				'<li class="layui-this" data-select-bgcolor="dark-theme" >' +
				'<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">' +
				'<div><span style="display:block; width: 20%; float: left; height: 12px; background: #28333E;"></span><span style="display:block; width: 80%; float: left; height: 12px; background: white;"></span></div>' +
				'<div><span style="display:block; width: 20%; float: left; height: 40px; background: #28333E;"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #f4f5f7;"></span></div>' +
				'</a>' +
				'</li>';

			bgColorHtml +=
				'<li  data-select-bgcolor="light-theme" >' +
				'<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">' +
				'<div><span style="display:block; width: 20%; float: left; height: 12px; background: white;"></span><span style="display:block; width: 80%; float: left; height: 12px; background: white;"></span></div>' +
				'<div><span style="display:block; width: 20%; float: left; height: 40px; background: white;"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #f4f5f7;"></span></div>' +
				'</a>' +
				'</li>';

			bgColorHtml +=
				'<li  data-select-bgcolor="night-theme" >' +
				'<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">' +
				'<div><span style="display:block; width: 20%; float: left; height: 12px; background: #28333E;"></span><span style="display:block; width: 80%; float: left; height: 12px; background: #28333E;"></span></div>' +
				'<div><span style="display:block; width: 20%; float: left; height: 40px; background: #28333E;"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #28333E;"></span></div>' +
				'</a>' +
				'</li>';

			var html =
				'<div class="pearone-color">\n' +
				'<div class="color-title">整体风格</div>\n' +
				'<div class="color-content">\n' +
				'<ul>\n' + bgColorHtml + '</ul>\n' +
				'</div>\n' +
				'</div>';

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
				content: html + buildColorHtml() + buildLinkHtml(),
				success: function(layero, index) {

					form.render();

					var color = localStorage.getItem("theme-color");
					var menu = localStorage.getItem("theme-menu");

					if (color != "null") {
						$(".select-color-item").removeClass("layui-icon")
							.removeClass("layui-icon-ok");

						$("*[color-id='" + color + "']").addClass("layui-icon")
							.addClass("layui-icon-ok");
					}

					if (menu != "null") {
						$("*[data-select-bgcolor]").removeClass("layui-this");

						$("[data-select-bgcolor='" + menu + "']").addClass("layui-this");
					}

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
		})


		function getData() {

			$.ajaxSettings.async = false;
			var data = null;

			$.getJSON("setting.json", function(result) {
				data = result;
			});

			$.ajaxSettings.async = true;
			return data;
		}

		$('body').on('click', '[data-select-bgcolor]', function() {

			var theme = $(this).attr('data-select-bgcolor');
			$('[data-select-bgcolor]').removeClass("layui-this");
			$(this).addClass("layui-this");
			localStorage.setItem("theme-menu", theme);
			pearAdmin.menuSkin(theme);

		});

		$('body').on('click', '.select-color-item', function() {
			$(".select-color-item").removeClass("layui-icon").removeClass("layui-icon-ok");
			$(this).addClass("layui-icon").addClass("layui-icon-ok");
			var colorId = $(".select-color-item.layui-icon-ok").attr("color-id");
			localStorage.setItem("theme-color", colorId);
			var color = getColorById(colorId);
			pearAdmin.colorSet(color.color);
		});

		function getColorById(id) {
			var color;
			
			var flag = false;
			
			var data = getData();
			
			$.each(data.colors, function(i, value) {

				if (value.id == id) {
					color = value;
					flag = true;
				}
			})
			
			if(flag==false || data.allowCustom == false){
				
				$.each(data.colors, function(i, value) {
				
					if (value.id == data.defaultColor) {
						color = value; 
					}
				})
			}
			return color;
		}

		function buildLinkHtml() {

			var links = "";

			$.each(getData().links, function(i, value) {

				links += '<a class="more-menu-item" href="' + value.href + '" target="_blank">' +
					'<i class="' + value.icon + '" style="font-size: 19px;"></i> ' + value.title +
					'</a>'
			})

			return '<div class="more-menu-list">' + links + '</div>';
		}

		function buildColorHtml() {

			var colors = "";

			$.each(getData().colors, function(i, value) {
				colors += "<span class='select-color-item' color-id='" + value.id + "' style='background-color:" + value.color + ";'></span>";
			})
			return "<div class='select-color'><div class='select-color-title'>主题色</div><div class='select-color-content'>" + colors + "</div></div>"

		}

		exports('admin', pearAdmin);
	})
