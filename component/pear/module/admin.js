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
				this.menuRender(option);
				this.bodyRender(option);
				this.keepLoad(option);
				this.logoRender(option);
			}

			this.logoRender = function(option) {

				$(".layui-logo .logo").attr("src", option.logoImage);
				$(".layui-logo .title").html(option.logoTitle);
			}

			this.menuRender = function(option) {
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
						tabMax: 20,
						closeEvent: function(id) {
							sideMenu.selectItem(id);
						},
						data: [{
							id: '0',
							url: option.index,
							title: '首页',
							close: false
						}] //初始化数据
					});

					bodyTab.click(function(id) {
						bodyTab.positionTab();
						sideMenu.selectItem(id);
					})

					$("body").on("click", ".refresh", function() {

						bodyTab.refresh(600);
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

						bodyFrame.refresh(600);
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

			openRight("");

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

					form.render();

					var color = localStorage.getItem("theme-color");
					if (color != "null") {
						$(".select-color-item").removeClass("layui-icon")
							.removeClass("layui-icon-ok");

						$(".select-color-item").each(function() {
							if ($(this).css("background-color") === color) {
								$(this).addClass("layui-icon").addClass("layui-icon-ok");
							}
						});
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
		}

		exports('admin', pearAdmin);
	})
