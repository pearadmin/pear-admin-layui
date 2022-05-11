layui.define(['jquery', 'element', 'layer'], function (exports) {
	"use strict";

	/**
	 * Drawer component
	 * */
	var MOD_NAME = 'drawer',
		$ = layui.jquery,
		element = layui.element,
		layer = layui.layer;


	var drawer = new function () {

		/**
		 * open drawer
		 * */
		this.open = function (option) {
			// 默认使用 legacy 模式
			if (option.legacy === undefined) {
				option.legacy = true;
				console.log("PearModule[drawer]: Legacy API Mode");
			};
			if (option.legacy) {
				var obj = new mSlider({
					target: option.target,
					dom: option.dom,
					direction: option.direction,
					distance: option.distance,
					time: option.time ? option.time : 0,
					maskClose: option.maskClose,
					callback: option.success
				});
				obj.open();
				return obj;
			} else {
				return layerDrawer(option);
			}
		}
		this.title = layer.title;
		this.style = layer.style;
		this.close = layer.close;
		this.closeAll = layer.closeAll;
	}

	/**
	 * 
	 * 封装 layer.open
	 * type,anim,move 不可用,其它参数和 layer.open 一致
	 * @param {LayerOption} option 
	 * @returns 原生 layer 的 index
	 */
	function layerDrawer(option) {

		var opt = normalizeOption(option)
		var layerIndex = layer.open(opt);

		return layerIndex;
	}

	/**
		* 规格化 layer.open 选项
		* @param {*} option layer.open 的选项
		* @returns 规格化后的 layer.open 选项 
		*/
	function normalizeOption(option) {
		// 兼容旧版 API, target 选项无法兼容
		if (option.direction && !option.offset) {
			if (option.direction === "right") {
				option.offset = "r";
			} else if (option.direction === "left") {
				option.offset = "l";
			} else if (option.direction === "top") {
				option.offset = "t";
			} else if (option.direction === "bottom") {
				option.offset = "b";
			}
		}
		if (option.distance && !option.area) {
			option.area = option.distance;
		}
		if (option.dom && !option.content) {
			option.content = $("#test").html();
			console.log(option.dom, option.content);
		}
		if (option.maskClose && !option.shadeClose) {
			option.shadeClose = (option.maskClose + "").toString() !== "false" ? true : false; 
		}

		option.type = 1
		option.anim = -1; // 关闭原生入场动画
		option.move = false;
		option.fixed = true;
		if (option.offset === undefined) option.offset = "r";
		option.area = calcDrawerArea(option.offset, option.area);
		if (option.title === undefined) option.title = false;
		if (option.closeBtn === undefined) option.closeBtn = false;
		if (option.shadeClose === undefined) option.shadeClose = true;
		if (option.skin === undefined) option.skin = getDrawerAnimationClass(option.offset);
		if (option.resize === undefined) option.resize = false;

		return option;
	}

	/**
	 * 计算抽屉宽高
	 * @param {string} offset 抽屉方向 l = 左, r = 右, t = 上, b = 下 
	 * @param {string[] | string} drawerArea 抽屉大小,字符串数组格式：[width, height]，字符串格式：百分比或单位 px。
	 * @returns 抽屉宽高数组
	 */
	function calcDrawerArea(offset, drawerArea = "30%") {
		if (drawerArea instanceof Array) {
			return drawerArea;
		}
		if (drawerArea === "auto") {
			drawerArea = "30%";
		}
		if (offset === "l" || offset === "r") {
			return [drawerArea, "100%"];
		} else if (offset === "t" || offset === "b") {
			return ["100%", drawerArea];
		}
		return [drawerArea, "100%"];
	}

	/**
	 * 获取抽屉入场动画类
	 * @param {string} offset 抽屉方向
	 * @returns 抽屉入场动画类
	 */
	function getDrawerAnimationClass(offset) {
		const prefix = "pear-drawer-anim layui-anim layer-anim";
		let suffix = "rl";
		if (offset === "l") {
			suffix = "lr";
		} else if (offset === "r") {
			suffix = "rl";
		} else if (offset === "t") {
			suffix = "tb";
		} else if (offset === "b") {
			suffix = "bt";
		}
		return `${prefix}-${suffix}`;
	}
	exports(MOD_NAME, drawer);
});

/**
 * 源码
 * */
(function (b, c) {
	function a(d) {
		this.opts = {
			"target": d.target || "body",
			"direction": d.direction || "left",
			"distance": d.distance || "60%",
			"dom": this.Q(d.dom),
			"time": d.time || "",
			"maskClose": (d.maskClose + "").toString() !== "false" ? true : false,
			"callback": d.callback || ""
		};
		this.rnd = this.rnd();
		this.target = this.opts.target;
		this.dom = this.opts.dom[0];
		this.wrap = "";
		this.inner = "";
		this.mask = "";
		this.init()
	}
	a.prototype = {
		Q: function (d) {
			return document.querySelectorAll(d)
		},
		isMobile: function () {
			return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? true : false
		},
		addEvent: function (f, e, d) {
			if (f.attachEvent) {
				f.attachEvent("on" + e, d)
			} else {
				f.addEventListener(e, d, false)
			}
		},
		rnd: function () {
			return Math.random().toString(36).substr(2, 6)
		},
		init: function () {
			var g = this;
			if (!g.dom) {
				console.log("未正确绑定弹窗容器");
				return
			}
			var d = document.createElement("div");
			var e = document.createElement("div");
			var f = document.createElement("div");
			d.setAttribute("class", "mSlider-main ms-" + g.rnd);
			e.setAttribute("class", "mSlider-inner");
			f.setAttribute("class", "mSlider-mask");
			g.Q(g.target)[0].appendChild(d);
			g.Q(".ms-" + g.rnd)[0].appendChild(e);
			g.Q(".ms-" + g.rnd)[0].appendChild(f);
			g.wrap = g.Q(".ms-" + g.rnd)[0];
			g.inner = g.Q(".ms-" + g.rnd + " .mSlider-inner")[0];
			g.mask = g.Q(".ms-" + g.rnd + " .mSlider-mask")[0];
			g.inner.appendChild(g.dom);
			switch (g.opts.direction) {
				case "top":
					g.top = "0";
					g.left = "0";
					g.width = "100%";
					g.height = g.opts.distance;
					g.translate = "0,-100%,0";
					break;
				case "bottom":
					g.bottom = "0";
					g.left = "0";
					g.width = "100%";
					g.height = g.opts.distance;
					g.translate = "0,100%,0";
					break;
				case "right":
					g.top = "0";
					g.right = "0";
					g.width = g.opts.distance;
					g.height = document.documentElement.clientHeight + "px";
					g.translate = "100%,0,0";
					break;
				default:
					g.top = "0";
					g.left = "0";
					g.width = g.opts.distance;
					g.height = document.documentElement.clientHeight + "px";
					g.translate = "-100%,0,0"
			}
			g.wrap.style.display = "none";
			g.wrap.style.position = (g.target === "body" ? "fixed" : "absolute");
			g.wrap.style.top = "0";
			g.wrap.style.left = "0";
			g.wrap.style.width = "100%";
			g.wrap.style.height = "100%";
			g.wrap.style.zIndex = 9999999;
			g.inner.style.position = "absolute";
			g.inner.style.top = g.top;
			g.inner.style.bottom = g.bottom;
			g.inner.style.left = g.left;
			g.inner.style.right = g.right;
			g.inner.style.width = g.width;
			g.inner.style.height = (g.target === "body" ? g.height : "100%");
			g.inner.style.backgroundColor = "#fff";
			g.inner.style.transform = "translate3d(" + g.translate + ")";
			g.inner.style.webkitTransition = "all .2s ease-out";
			g.inner.style.transition = "all .2s ease-out";
			g.inner.style.zIndex = 10000000;
			g.mask.style.width = "100%";
			g.mask.style.height = "100%";
			g.mask.style.opacity = "0.1";
			g.mask.style.backgroundColor = "black";
			g.mask.style.zIndex = "9999998";
			g.mask.style.webkitBackfaceVisibility = "hidden";
			g.events()
		},
		open: function () {
			var d = this;
			d.wrap.style.display = "block";

			setTimeout(function () {
				d.inner.style.transform = "translate3d(0,0,0)";
				d.inner.style.webkitTransform = "translate3d(0,0,0)";
				d.mask.style.opacity = 0.1
			}, 30);
			if (d.opts.time) {
				d.timer = setTimeout(function () {
					d.close()
				}, d.opts.time)
			}
		},
		close: function () {
			var d = this;
			d.timer && clearTimeout(d.timer);
			d.inner.style.webkitTransform = "translate3d(" + d.translate + ")";
			d.inner.style.transform = "translate3d(" + d.translate + ")";
			d.mask.style.opacity = 0;
			setTimeout(function () {
				d.wrap.style.display = "none";
				d.timer = null;
				d.opts.callback && d.opts.callback()
			}, 300)
		},
		events: function () {
			var d = this;
			d.addEvent(d.mask, "touchmove", function (f) {
				f.preventDefault()
			});
			d.addEvent(d.mask, (d.isMobile() ? "touchend" : "click"), function (f) {
				if (d.opts.maskClose) {
					d.close()
				}
			})
		}
	};
	b.mSlider = a
})(window);