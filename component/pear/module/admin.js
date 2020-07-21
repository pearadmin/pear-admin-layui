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

			openRight();

		})
		
		function openRight() {
		    var themeHtml =	buildThemeHtml();
			
			var linkHtml = buildLinkHtml();
			
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
				content: themeHtml + linkHtml,
				success: function(layero, index) {

					form.render();

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

		/** 同 步 请 求 获 取 数 据 */
		function getData() {

			$.ajaxSettings.async = false;
			var data = null;

			$.get("setting.json", function(result) {
				data = result;
			});

			$.ajaxSettings.async = true;
			return data;
		}
		
		$('body').on('click', '[data-select-bgcolor]', function() {
			var theme = $(this).attr('data-select-bgcolor');
			$('[data-select-bgcolor]').removeClass("layui-this");
			$(this).addClass("layui-this");
			setColor(getThemeById(theme));
		});
		
		function getThemeById(id){
			var theme;
			$.each(getData().theme, function(i, value) {
				if(value.id == id){
					theme = value;
				}
			})
			return theme;
		}

        function setColor(theme){
			  
			   console.log("传过来的主题"+JSON.stringify(theme));
		
				var theme = "<style>";
			
				theme += '</style>';
			
				$("#pearadmin-bg-color").html(style);
				
		}

		function buildThemeHtml() {

			var bgColorHtml = "";

			$.each(getData().theme, function(i, value) {

				bgColorHtml += '<li  data-select-bgcolor="'+value.id+'">' +
					'<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">' +
					'<div><span style="display:block; width: 20%; float: left; height: 12px; background: '+value.logoBgColor+';"></span><span style="display:block; width: 80%; float: left; height: 12px; background: '+value.headerBgColor+';"></span></div>' +
					'<div><span style="display:block; width: 20%; float: left; height: 40px; background: '+value.menuBgColor+';"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #f4f5f7;"></span></div>' +
					'</a>' +
					'</li>';
			})

			var html =
				'<div class="pearone-color">\n' +
				'<div class="color-title">整体风格</div>\n' +
				'<div class="color-content">\n' +
				'<ul>\n' + bgColorHtml + '</ul>\n' +
				'</div>\n' +
				'</div>';

			return html;
		}
		
		function buildLinkHtml(){
			
			var links = "";
			
			$.each(getData().links, function(i, value) {
				
				links += '<a class="more-menu-item" href="'+value.href+'" target="_blank">' +
				'<i class="'+value.icon+'" style="font-size: 19px;"></i> '+value.title +
				'</a>'
			})
			
			return '<div class="more-menu-list">' + links + '</div>';
		}

		exports('admin', pearAdmin);
	})
