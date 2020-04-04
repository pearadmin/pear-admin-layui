
window.rootPath = (function (src) {
    src = document.scripts[document.scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();

layui.config({
    base: rootPath + "lay-modules/",
    version: true
}).extend({
    pearone: "pearone/pearone", 
	notice:'notice/notice',
	iconPicker:'iconPicker/iconPicker',
	tinymce:'tinymce/tinymce',
	tableSelect:'tableSelect/tableSelect',
	treetable:'treetable/treetable',
	tag:'tag/tag',
	formSelects:'formSelects/formSelects-v4',
	dtree:'dtree/dtree'
});