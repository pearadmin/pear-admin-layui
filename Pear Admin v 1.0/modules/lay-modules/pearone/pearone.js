/**
 * Author: 就眠仪式
 * */
layui.define(["element", "jquery", "layer", "form"], function(exports) {
	var element = layui.element,
		$ = layui.$,
		layer = layui.layer,
		form = layui.form;

	// 判断是否在web容器中打开
	if (!/http(s*):\/\//.test(location.href)) {
		return layer.alert("请先将项目部署至web容器（Apache/Tomcat/Nginx/IIS/等），否则部分数据将无法显示");
	}
    pearone = new function() {
		/**
		 *  系统配置
		 * @param name 
		 * @returns {{BgColorDefault: number, urlSuffixDefault: boolean}|*}
		 */


		var config = {
			multileTab: true,
			homeInfo: 'views/system/console.html',
			menuInfo: 'api/menu.json',
			BgColorDefault: 2,
			menuType: true,
			showFooter: false
		};
		this.config = function(name) {
				if (name == undefined) {
					return config;
				} else {
					return config[name];
				}
			},
			this.setConfig = function(b) {

				config.multileTab = b;
			},
			this.setConfig = function(name, value) {
				config[name] = value;
			}
		this.init = function(option) {
				//在所有初始化之前,提前构建主题颜色
				pearone.initBgColor()
				pearone.setConfig("menuType", option.menuType);

				if (option.menuType) {
					pearone.initMenuPlus(option.menuInfo);
				} else {
					pearone.initMenu(option.menuInfo);
				}
				pearone.initHome(option.homeInfo);
				pearone.initTab(option.multileTab);

				pearone.initFooter(option.showFooter);

				if (option.tabType == 1) {

					className = "layui-tab-button";

				} else if (option.tabType == 2) {

					className = "layui-tab-topline";

				} else if (option.tabType == 3) {

					className = "layui-tab-circular";

				}
				$(".layui-tab").removeClass("layui-tab-button");
				$(".layui-tab").removeClass("layui-tab-topline");
				$(".layui-tab").removeClass("layui-tab-circular");
				$(".layui-tab").addClass(className);

			},
			this.initMenu = function(url) {
				$(".modules-pe").html("");
				$(".layui-side #menuEnd").html("");
				$(".layui-header #topMenu").html("");
				var leftHtml = '<ul class="layui-nav layui-nav-tree" id="menu" lay-filter="test">'
				$.ajaxSettings.async = false;
				$.get(url, function(result) {
					$.each(result, function(i, item) {
						var content = '<li class="layui-nav-item" >';
						if (item.type == 0) {
							content += '<a  href="javascript:;" href="javascript:;"><i class="' + item.icon + '"></i><span>' + item.title +
								'</span></a>';
						} else if (item.type == 1) {
							content += '<a class="site-demo-active" data-url="' + item.href + '" data-id="' + item.id +
								'" data-title="' + item.title + '" href="javascript:;" href="javascript:;"><i class="' + item.icon +
								'"></i><span>' + item.title + '</span></a>';
						}
						//这里是添加所有的子菜单
						content += pearone.loadchild(item);
						content += '</li>';
						leftHtml += content;

					});
					leftHtml += "</ul>";
					$("#menuEnd").append(leftHtml);
					element.init();
					pearone.initTab(pearone.config('multileTab'));
				});
				$.ajaxSettings.async = true;
			},
			this.initFooter = function(b) {
				if (!b) {
					$(".pearone-layout").addClass("pearone-hide-footer");
				} else {
					$(".pearone-layout").removeClass("pearone-hide-footer");
				}
			},
			this.initMenuPlus = function(url) {
				var headHtml = "";
				var leftHtml = "";
				$(".layui-side #menuEnd").html("");
				$(".layui-header #topMenu").html("");
				$(".layui-header-mini-menu").html("");
				$(".modules-pe").html("");
				$.ajaxSettings.async = false;
				$.get(url, function(result) {
					//每一个菜单
					var leftMenuEnd = '<ul class="layui-nav layui-nav-tree leftMenu" id="leftMenu" lay-filter="test">';

					var headerMobileMenuHtml =
						' <li class="layui-nav-item"> <a href="javascript:;"><i class="layui-icon">&#xe656;</i>&nbsp;&nbsp;选择模块</a><dl class="layui-nav-child layui-header-mini-menu">';
					//遍历第一层,既顶部菜单
					$.each(result, function(i, item) {
						//设置每一个菜单的唯一值
						leftMenuEnd = '<ul  class="layui-nav layui-nav-tree leftMenu" id="lay-' + item.id + '" lay-filter="test">';

						headerMobileMenuHtml += '<dd><a href="javascript:;" id="lay-' + item.id + '" data-menu="' + item.id +
							'"><i class="' + item.icon + '"></i> ' + item.title + '</a></dd>\n';

						var content = '<li class="layui-nav-item" id="lay-' + item.id + '">';
						if (item.type == 0) {
							content += '<a  href="javascript:;" href="javascript:;"><i class="' + item.icon +
								'"></i>&nbsp;&nbsp;<span>' + item.title + '</span></a>';
						} else if (item.type == 1) {
							content += '<a class="site-demo-active" data-url="' + item.href + '" data-id="' + item.id +
								'" data-title="' + item.title + '" href="javascript:;" href="javascript:;"><i class="' + item.icon +
								'"></i>&nbsp;&nbsp;<span>' + item.title + '</span></a>';
						}
						//这里是添加所有的子菜单
						/* content+=pearone.loadchild(item); */
						//遍历基本的左侧菜单
						$.each(item.children, function(j, item1) {
                            var leftMenu = '<li class="layui-nav-item">';
                            if (item1.type == 0) {
								leftMenu += '<a  href="javascript:;" href="javascript:;"><i class="' + item1.icon + '"></i><span>' +
									item1.title + '</span></a>';
							} else if (item1.type == 1) {

								leftMenu += '<a class="site-demo-active" data-url="' + item1.href + '" data-id="' + item1.id +
									'" data-title="' + item1.title + '" href="javascript:;" href="javascript:;"><i class="' + item1.icon +
									'"></i><span>' + item1.title + '</span></a>';

							}

							leftMenu += pearone.loadchild(item1);
							leftMenu += '</li>';
							leftMenuEnd += leftMenu;
						})


						leftMenuEnd += '</ul>';
						//将每一个菜单拼接到总的 
						leftHtml += leftMenuEnd;

						content += '</li>';
						$("#topMenu").append(content);
						$("#topMenu li").click(function() {
							var menuId = $(this).attr("id");
							$(".layui-side .leftMenu").addClass("layui-hide");
							$(".layui-side .leftMenu").removeClass("layui-show");
							$(".layui-side #" + menuId).addClass("layui-show");
							$(".layui-side #" + menuId).removeClass("layui-hide");
						})
					});
					headerMobileMenuHtml += '</dl></li>';

					$(".modules-pe").append(headerMobileMenuHtml);

					$(".layui-header-mini-menu dd a").click(function() {

						var menuId = $(this).attr("id");
						$(".layui-side .leftMenu").addClass("layui-hide");
						$(".layui-side .leftMenu").removeClass("layui-show");
						$(".layui-side #" + menuId).addClass("layui-show");
						$(".layui-side #" + menuId).removeClass("layui-hide");
						// 移动端切换模块展示左侧菜单
						if ($(window).width() <= 768) {
							$('.modules-pe').blur();
							pearone.showMenu(true);
						}
					})
					$("#menuEnd").append(leftHtml);
					element.init();
					pearone.initTab(pearone.config('multileTab'));
					$("#topMenu li:first-child").addClass("layui-this");
					$(".layui-side .leftMenu").addClass("layui-hide");
					$("#menuEnd ul:first-child").addClass("layui-show");
					$("#menuEnd ul:first-child").removeClass("layui-hide");

				})
				$.ajaxSettings.async = true;

			}
		this.loadchild = function(obj) {
				if (obj == null) {
					return;
				}

				var content = '';
				if (obj.children != null && obj.children.length > 0) {
					content += '<dl class="layui-nav-child">';
				} else {
					content += '<dl>';
				}

				if (obj.children != null && obj.children.length > 0) {
					$.each(obj.children, function(i, note) {
						content += '<dd>';

						if (note.type == 0) {

							content += '<a  href="javascript:;"><i class="' + note.icon + '"></i><span>' + note.title + '</span></a>';
						} else if (note.type == 1) {
							content += '<a class="site-demo-active" data-url="' + note.href + '" data-id="' + note.id +
								'" data-title="' + note.title + '" data-icon="' + note.icon + '" href="javascript:;"><i class="' + note.icon +
								'"></i><span>' + note.title + '</span></a>';
						}
						if (note.children == null) {
							return;
						}
						content += pearone.loadchild(note);
						content += '</dd>';
					});

					content += '</dl>';
				}

				return content;
			},
			/**
			 * 初始化背景色
			 */
			this.initBgColor = function() {
				var bgcolorId = sessionStorage.getItem('pearoneBgcolorId');
				if (bgcolorId == null || bgcolorId == undefined || bgcolorId == '') {
					bgcolorId = pearone.config('BgColorDefault');
				}
				var bgcolorData = pearone.bgColorConfig(bgcolorId);
				var styleHtml = '.layui-layout-admin .layui-header{background-color:' + bgcolorData.headerRight +
					'!important;}\n' +
					'.layui-header>#topMenu>.layui-nav-item.layui-this,.pearone-tool i:hover{background-color:' + bgcolorData.headerRightThis +
					'!important;}\n' +
					'.layui-layout-admin .layui-logo {background-color:' + bgcolorData.headerLogo + '!important;}\n' +
					'.layui-side.layui-bg-black,.layui-side .layui-nav,.layui-side.layui-bg-black>.layui-left-menu>ul{background-color:' +
					bgcolorData.menuLeft + '!important;}\n' +
					'.layui-left-menu .layui-nav .layui-nav-child a:hover:not(.layui-this) {background-color:' + bgcolorData.menuLeftHover +
					';}\n' +
					'.layui-layout-admin .layui-nav-tree .layui-this, .layui-layout-admin .layui-nav-tree .layui-this>a, .layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this,.layui-nav-tree .layui-nav-bar,.layui-layout-admin .layui-nav-tree .layui-nav-child dd.layui-this a {\n' +
					'background-color: ' + bgcolorData.menuLeftThis +
					' !important;}\n .layui-layout-admin .layui-header .layui-nav .layui-nav-item>a{color:' + bgcolorData.headerColor +
					'!important;}\n .layui-header .layui-nav-bar,#topMenu .layui-this:after {background-color:' + bgcolorData.headerHover +
					'!important;}\n .layui-tab-title .layui-this,.layui-tab-title li:hover{color:' + bgcolorData.tabThis +
					'!important;}\n' +
					'}';
				$('#pearone-bg-color').html(styleHtml);
			},
			this.initTab = function(b) {

				pearone.setConfig("multileTab", b);

				/**初始化Tab页*/
				if (b) {


					$("#oneTab").hide();

					$("#multileTab").show();

					//当点击有site-demo-active属性的标签时，即左侧菜单栏中内容 ，触发点击事件
					$('.site-demo-active').on('click', function() {
						var dataid = $(this);

						var title = dataid.attr("data-title");
						var url = dataid.attr("data-url");
						var id = dataid.attr("data-id");

						//这时会判断右侧.layui-tab-title属性下的有lay-id属性的li的数目，即已经打开的tab项数目
						if ($(".layui-tab-title li[lay-id]").length <= 0) {
							//如果比零小，则直接打开新的tab项
							pearone.tabAdd(url, id, title);
						} else {
							//否则判断该tab项是否以及存在
							var isData = false; //初始化一个标志，为false说明未打开该tab项 为true则说明已有
							$.each($(".layui-tab-title li[lay-id]"), function() {
								//如果点击左侧菜单栏所传入的id 在右侧tab项中的lay-id属性可以找到，则说明该tab项已经打开
								if ($(this).attr("lay-id") == dataid.attr("data-id")) {
									isData = true;
								}
							})
							if (isData == false) {
								//标志为false 新增一个tab项
								var title = '<i class="' + dataid.attr("data-icon") + '"></i>&nbsp;&nbsp;<span>' + dataid.attr(
									"data-title") + '</span>'

								pearone.tabAdd(dataid.attr("data-url"), dataid.attr("data-id"), title);
							}
						}
						//最后不管是否新增tab，最后都转到要打开的选项页面上
						pearone.tabChange(dataid.attr("data-id"));
					});
					//绑定下拉菜单事件
					$("#closeThisTabs").off("click").on("click", function() {
						var currentTabId = $(".pearone-layout .layui-body .layui-tab-title .layui-this").attr("lay-id");
						if (currentTabId != 1) {
							pearone.tabDelete(currentTabId);
						}
					});

					$("#closeOtherTabs").on("click", function() {

						var currentTabId = $(".pearone-layout .layui-body .layui-tab-title .layui-this").attr("lay-id");

						var tabtitle = $(".layui-tab-title li");
						$.each(tabtitle, function(i) {
							if ($(this).attr("lay-id") != currentTabId && $(this).attr("lay-id") != 1) {
								pearone.tabDelete($(this).attr("lay-id"))
							}
						})
					});

					$("#closeAllTabs").on("click", function() {
						var tabtitle = $(".layui-tab-title li");
						$.each(tabtitle, function(i) {
							if ($(this).attr("lay-id") != 1) {
								pearone.tabDelete($(this).attr("lay-id"))
							}
						})
					});

					$("#leftPage").on("click", function() {
						pearone.leftPage();
					})

					$("#rightPage").on("click", function() {
						pearone.rightPage();
					})
					pearone.initHome(pearone.config('homeInfo'));

				} else {

					//标签页菜单单击监听
					$('.site-demo-active').on('click', function() {

						var loading = layer.load();

						var url = $(this).attr("data-url");

						$("#oneTab-title").html("<i class='layui-icon layui-icon-console'></i>&nbsp;&nbsp;<span>" + $(this).attr(
							"data-title") + "</span>");

						$("#mainFrame").attr("src", url);
						layer.close(loading);
					})
					$("#oneTab").show();
					$("#multileTab").hide();
					pearone.initHome(pearone.config('homeInfo'));
				}

			},
			this.initHome = function(url) {

				//初始化首页信息
				if (pearone.config('multileTab')) {

					//清空tab信息来初始化首页
					$(".pearone-layout .layui-body .layui-tab-title").html("");
					$(".pearone-layout .layui-body .layui-tab-content").html("");
					pearone.tabAdd(url, 1, "<i class='layui-icon layui-icon-home'></i>");
					pearone.tabChange(1);

				} else {

					$("#mainFrame").attr("src", url);
				}

			},
			this.tabAdd = function(url, id, name) {
				//查询该编号是否存在,如果存在进行相应替换

				if (id != 1) {
					var loading = layer.load();
				}
				element.tabAdd('mainFrame', {
					title: name,
					content: '<iframe data-frameid="' + id +
						'" frameborder="no" border="0" marginwidth="0" marginheight="0" style="width: 100%;height: 100%;" src="' +
						url +
						'" ></iframe>',
					id: id
				})
				element.render('tab');
				layer.close(loading);
			},
			this.tabChange = function(id) {
				//切换到指定Tab项
				element.tabChange('mainFrame', id); //根据传入的id传入到指定的tab项
			},

			this.tabDelete = function(id) {

				element.tabDelete("mainFrame", id); //删除
			},
			this.tabDeleteAll = function(ids) { //删除所有
				$.each(ids, function(i, item) {
					element.tabDelete("mainFrame", item); //ids是一个数组，里面存放了多个id，调用tabDelete方法分别删除
				})
			},
			this.rollPage = function(d) {
				var $tabTitle = $('.layui-body .layui-tab .layui-tab-title');
				var left = $tabTitle.scrollLeft();
				if ('left' === d) {

					$tabTitle.animate({
						scrollLeft: left - 450
					}, 400);
				} else if ('auto' === d) {
					var autoLeft = 0;
					$tabTitle.children("li").each(function() {
						if ($(this).hasClass('layui-this')) {
							return false;
						} else {
							autoLeft += $(this).outerWidth();
						}
					});
					$tabTitle.animate({
						scrollLeft: left - 47
					}, 400);
				} else {
					$tabTitle.animate({
						scrollLeft: left + 450
					}, 400);
				}
			},
			// 左滑动tab
			this.leftPage = function() {
				pearone.rollPage("left");
			},
			// 右滑动tab
			this.rightPage = function() {
				pearone.rollPage();
			},
			/**
			 * 配色方案配置项(默认选中第一个方案)
			 * @param bgcolorId
			 */
			this.bgColorConfig = function(bgcolorId) {
				var bgColorConfig = [{
						headerRight: '#1aa094', //头部背景色
						headerRightThis: '#197971', //头部选中色
						headerLogo: '#20222A', //图标背景色
						menuLeft: '#20222A', //左侧菜单背景
						menuLeftThis: '#1aa094', //左侧菜单选中色
						menuLeftHover: '#3b3f4b', //左侧菜单焦点色
						headerColor: 'white', //头部背景色
						headerHover: 'white', //头部焦点色
						tabThis: '#1aa094', //选项卡选中色
					},
					{
						headerRight: '#AA3130',
						headerRightThis: '',
						headerLogo: '#28333E',
						menuLeft: '#28333E',
						menuLeftThis: '#AA3130',
						menuLeftHover: '#3b3f4b',
						headerColor: 'white',
						headerHover: 'white',
						tabThis: 'black',
					},
					{
						headerRight: 'white',
						headerRightThis: '',
						headerLogo: '#344058',
						menuLeft: '#344058',
						menuLeftThis: '#409EFF',
						menuLeftHover: '#1f1f1f',
						headerColor: 'black',
						headerHover: 'black',
						tabThis: '#409EFF',
					},
					{
						headerRight: '#409EFF',
						headerRightThis: '',
						headerLogo: '#344058',
						menuLeft: '#344058',
						menuLeftThis: '#409EFF',
						menuLeftHover: '#3b3f4b',
						headerColor: 'white',
						headerHover: 'white',
						tabThis: '#409EFF',
					},
					{
						headerRight: '#F78400',
						headerRightThis: '',
						headerLogo: '#F78400',
						menuLeft: '#28333E',
						menuLeftThis: '#F78400',
						menuLeftHover: '#F78400',
						headerColor: 'white',
						headerHover: '#F78400',
						tabThis: '#F78400',
					},
					{
						headerRight: 'white',
						headerRightThis: '',
						headerLogo: '#28333E',
						menuLeft: '#28333E',
						menuLeftThis: '#1aa094',
						menuLeftHover: '#1aa094',
						headerColor: 'black',
						headerHover: '#1aa094',
						tabThis: '#1aa094',
					}
				];

				if (bgcolorId == undefined) {
					return bgColorConfig;
				} else {
					return bgColorConfig[bgcolorId];
				}
			},

			/**
			 * 构建背景颜色选择
			 * @returns {string}
			 */
			this.buildBgColorHtml = function() {
				var html = '';
				var bgcolorId = sessionStorage.getItem('pearoneBgcolorId');
				if (bgcolorId == null || bgcolorId == undefined || bgcolorId == '') {
					bgcolorId = 0;
				}
				var bgColorConfig = pearone.bgColorConfig();
				$.each(bgColorConfig, function(key, val) {
					if (key == bgcolorId) {
						html += '<li class="layui-this" data-select-bgcolor="' + key + '">\n';
					} else {
						html += '<li  data-select-bgcolor="' + key + '">\n';
					}
					html += '<a href="javascript:;" data-skin="skin-blue" style="" class="clearfix full-opacity-hover">\n' +
						'<div><span style="display:block; width: 20%; float: left; height: 12px; background: ' + val.headerLogo +
						';"></span><span style="display:block; width: 80%; float: left; height: 12px; background: ' + val.headerRight +
						';"></span></div>\n' +
						'<div><span style="display:block; width: 20%; float: left; height: 40px; background: ' + val.menuLeft +
						';"></span><span style="display:block; width: 80%; float: left; height: 40px; background: #f4f5f7;"></span></div>\n' +
						'</a>\n' +
						'</li>';
				});
				return html;
			},
			this.isPc = function() {
				if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
					return false;
				} else {
					return true;
				}
			}
		//显示隐藏左侧菜单
		this.showMenu = function(flag) {
			$("body").toggleClass("show-menu");
			if (flag == true) {
				$('.pearone-layout .layui-side .layui-nav-item').off('mouseenter').unbind('mouseleave');
				$('.pearone-layout .layui-side dd').off('mouseenter').unbind('mouseleave');
				$('body').removeClass('pearone-mini');
				$('.zoom-tool').attr("show-data", 1);
				//切换图标
				$('.zoom-tool').removeClass('layui-icon-spread-left');
				$('.zoom-tool').addClass('layui-icon-shrink-right');
			} else {
				$(".layui-side .layui-nav-item").hover(function() {
					$(this).children(".layui-nav-child").addClass("pearone-menu-hover");
					var top = $(this).offset().top;
					var css = {
						top: top + 'px'
					}
					$(this).children(".layui-nav-child").css(css);

				}, function() {
					$(this).children(".layui-nav-child").removeClass("pearone-menu-hover");
					var css = {
						top: '0px'
					}
					$(this).children(".layui-nav-child").css(css);
				})

				$(".layui-side dd").hover(function() {
					$(this).children(".layui-nav-child").addClass("pearone-menu-hover");
					var top = $(this).offset().top;
					var left = $(this).offset().left + 121;
					var bodyHeight = document.documentElement.clientHeight
					var endHeight = top + $(this).children(".layui-nav-child").height() + 60;

					if (endHeight > bodyHeight) {
						top = bodyHeight - $(this).children(".layui-nav-child").height() - 60;
					}
					var css = {
						top: top + 'px'
					}
					var css1 = {
						left: left + 'px'
					}
					$(this).children(".layui-nav-child").css(css);
					$(this).children(".layui-nav-child").css(css1);

				}, function() {

					$(this).children(".layui-nav-child").removeClass("pearone-menu-hover");
					var css = {
						top: '0px'
					}
					var css1 = {
						left: '0px'
					}
					$(this).children(".layui-nav-child").css(css);
					$(this).children(".layui-nav-child").css(css1);
				})
				$(".pearone-layout .layui-side .layui-nav-itemed").removeClass("layui-nav-itemed");
				$("body").addClass("pearone-mini");
				$("body").removeClass("show-menu");
				//切换图标
				$('.zoom-tool').removeClass('layui-icon-shrink-right');
				$('.zoom-tool').addClass('layui-icon-spread-left');
				$('.zoom-tool').attr("show-data", 0);
			}
		}
	}

	$('body').on('click', '[data-select-bgcolor]', function() {
		var bgcolorId = $(this).attr('data-select-bgcolor');
		$('.pearone-color .color-content ul .layui-this').attr('class', '');
		$(this).attr('class', 'layui-this');
		sessionStorage.setItem('pearoneBgcolorId', bgcolorId);
		parent.pearone.initBgColor();
	});


	$("body").on("click", ".pearone-refresh", function() {

		if (!($(this).hasClass("refreshThis"))) {
			$(this).addClass("refreshThis");
			var loading = layer.load();
			//兼容单标签页
			if (pearone.config("multileTab")) {

				console.log("多标签刷新");
				$(".pearone-layout .layui-tab-content .layui-show").find("iframe")[0].contentWindow.location.reload(true);
				layer.close(loading);
			} else {
				console.log("单页面刷新");
				$("#oneTab").find("iframe")[0].contentWindow.location.reload(true);
				layer.close(loading);
			}

			setTimeout(function() {
				$(".pearone-refresh").removeClass("refreshThis");
			}, 2000)
		} else {
			layer.msg("客官！我会反应不过来的");
		}
	});


	/**
	 * 菜单栏隐藏
	 * */
	$(".zoom-tool").click(function() {
		if ($(this).attr("show-data") == 0) {
			pearone.showMenu(true);
		} else {
			pearone.showMenu(false);
		}
	})

	$(".setTheme").click(function() {
		layer.open({
			type: 2,
			title: false,
			closeBtn: false, //不显示关闭按钮
			shade: [0],
			shadeClose: true,
			area: ['350px', 'calc(100% - 90px)'],
			offset: 'rb', //右下角弹出
			time: 0, //2秒后自动关闭
			anim: -1,
			skin: 'layer-anim-07',
			content: 'views/system/theme.html',
			cancel: function(index) {
				var $layero = $('#layui-layer' + index);
				$layero.animate({
					left: $layero.offset().left + $layero.width()
				}, 300, function() {
					layer.close(index);
				});
				return false;
			}
		});
    })
	element.on('tab(mainFrame)', function(data) {
		if (data.elem.context.attributes != undefined) {
			var id = data.elem.context.attributes[0].nodeValue;
			layui.each($(".layui-side"), function() {
				$(this).find(".layui-this").removeClass("layui-this");
			});
			$("[data-id='" + id + "']").attr("class", "layui-this");
		}
	});


	$(".layui-side").on("click", ".layui-nav-item>a", function() {

		if ($(".zoom-tool").attr("show-data") == 1) {

			if (!$(this).attr("lay-id")) {
				//当前
				var superEle = $(this).parent();
				var ele = $(this).next('.layui-nav-child');
				var height = ele.height();
				/* ele.css({"display": "block"}); */
				// 是否是展开状态
				if (superEle.is(".layui-nav-itemed")) {
					$(".pearone-layout .layui-side .layui-nav-item").removeClass("layui-nav-itemed");
					$(".pearone-layout .layui-side .layui-nav-item dd").removeClass("layui-nav-itemed");
					superEle.addClass("layui-nav-itemed");
					ele.height(0);
					ele.animate({
						height: height + "px"
					}, function() {
						ele.css({
							height: "auto"
						});
					});
				} else {
					ele.animate({
						height: 0
					}, function() {
						ele.removeAttr("style");
					});
				}
			}
		}
	});

	$(".layui-side").on("click", ".layui-nav-item dd>.site-demo-active", function() {

		if ($(".zoom-tool").attr("show-data") == 1) {

			if (!$(this).attr("lay-id")) {
				//当前
				var superEle = $(this).parent();
				var ele = $(this).next('.layui-nav-child');
				var height = ele.height();
				/* ele.css({"display": "block"}); */
				// 是否是展开状态
				if (superEle.is(".layui-nav-itemed")) {
					superEle.siblings().removeClass("layui-nav-itemed");
					superEle.addClass("layui-nav-itemed");
					ele.height(0);
					ele.animate({
						height: height + "px"
					}, function() {
						ele.css({
							height: "auto"
						});
					});
				} else {
					ele.animate({
						height: 0
					}, function() {
						ele.removeAttr("style");
					});
				}
			}

			//移动端点击后隐藏左侧菜单
			if ($(window).width() <= 768) {
				pearone.showMenu(false);
			}
		}
	});

	// 移动设备适配
	var mobileWidth = 768;
	if (!pearone.isPc() || ($(window).width() <= mobileWidth)) {
		pearone.showMenu(false);
	}
	$(window).on('resize', function(e) {
		if ($(window).width() <= mobileWidth) {
			pearone.showMenu(false);
		}
	});
	//移动端跳转链接先把导航关闭
	$(window).on('hashchange', function (e) {
		if ($(window).width() < mobileWidth) {
			pearone.showMenu(false);
		}
	});

	// 移动设备遮罩层
	var siteShadeDom = '.pearone-layout .site-mobile-shade';
	if ($(siteShadeDom).length <= 0) {
		$('.pearone-layout').append('<div class="site-mobile-shade"></div>');
	}
	$(siteShadeDom).click(function() {
		if ($(".zoom-tool").attr("show-data") == 1) {
			pearone.showMenu(false);
		}
	});

	exports("pearone", pearone);
});
