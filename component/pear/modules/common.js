layui.define(['jquery', 'element','table'], function(exports) {
	"use strict";

	var MOD_NAME = 'common',
		$ = layui.jquery,
		table = layui.table,
		element = layui.element;

	var common = new function() {
		
		// 获 取 表 格 选 中 数 据
		this.checkField = function(obj, field) {
			let data = table.checkStatus(obj.config.id).data;
			if (data.length === 0) {
				return "";
			}
			let ids = "";
			for (let i = 0; i < data.length; i++) {
				ids += data[i][field] + ",";
			}
			ids = ids.substr(0, ids.length - 1);
			return ids;
		}
	}
	exports(MOD_NAME, common);
});
