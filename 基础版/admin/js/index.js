layui.use(['element', 'menu', 'tab', 'jquery', 'frame', 'message'], function() {
	var element = layui.element;
	var menu = layui.menu;
	var tab = layui.tab;
	var $ = layui.jquery;
	var frame = layui.frame;
	var message = layui.message;

	/** 公 用 组 件 对 象 */
	var sideMenu,content;
	
	render();
	
	
	function render() {

		menuRender();   /** 初 始 化 菜 单 */
		
		tabRender();    /** 初 始 化 选 项 卡 */
		
		logoRender();   /** 图 标 初 始 化 */
		
		noticeRender(); /** 消 息 栏 初 始 化 */
	}

	/** 初 始 化 侧 边 菜 单 */
	function menuRender() {

		sideMenu = menu.render({
			elem: 'sideMenu',
			async: true,
			theme: "dark",
			height: '100%',
			control: false,
			accordion: true,
			url: "admin/data/menu.json",
			parseData: false,
			done: function() {
				console.log(" 菜 单 渲 染 完 成 ");
			}

		})
        
		// 初 始 化 选 中
		sideMenu.selectItem("0");
	}

	/** 选 项 卡 初 始 化 */
	function tabRender() {

		content = tab.render({
			elem: 'content',
			roll: true,
			tool: true,
			width: '100%',
			height: '100%',
			index: 0,
			tabMax: 20,
			data: [{
				id: '0',
				url: "view/console/console.html",
				title: '首页',
				close: false,
			}]
		});
		
		content.click(function(){
			
			// 选 项 卡 定 位
			content.positionTab();
			
			// 菜 单 选 中
			sideMenu.selectItem(id);
		})
		
		sideMenu.click(function(dom, data){
			content.addTabOnly({
				id: data.menuId,
				title: data.menuTitle,
				url: data.menuUrl,
				icon: data.menuIcon,
				close: true
			}, 300);
			
			content.positionTab();
		})
	}

	/** Iframe 初 始 化 */
	function frameRender() {

		content = frame.render({
			elem: 'content',
			title: '工作空间 / 首页',
			url: "https://www.baidu.com",
			width: '100%',
			height: '100%'
		});
		
		sideMenu.click(function(dom, data){
			content.changePage(data.menuUrl, data.menuPath, true);
		})
	}
	
	
	function noticeRender(){
		
		message.render({
			elem: 'message',
			url: "admin/data/message.json",
			height: '250px',
			click: function(id, title, context, form) {
				
				layer.msg("message:"+id);
			}
		});
	}
	
	
	/** Logo 初 始 化 */
	function logoRender(){
		
		$(".pear-logo span").html("Pear Admin");
		
		
		$(".pear-logo img").attr("src","Pear Admin");
	
	}	
	
	$(".refresh").click(function(){
	   
		content.refresh(500); 
	 	
	})
	
	// 菜 单 的 隐 藏 触 发
	$(".collaspe").click(function() {
		sideMenu.collaspe();
		
		if ($(".pear-admin").is(".pear-mini")) {

			$(".pear-admin").removeClass("pear-mini");
		} else {

			$(".pear-admin").addClass("pear-mini");
		}
	})

	setTimeout(function() {

		$(".loader-main").fadeOut();

	}, 2000)

});
