layui.define(['jquery', 'element'], function(exports) {
	"use strict";

	var MOD_NAME = 'document',
		$ = layui.jquery,
		element = layui.element;

	var document = function(opt) {
		this.option = opt;
	};


	$("body").on("click", "*[loading]", function() {
	
	})

	exports(MOD_NAME, new document());
})
