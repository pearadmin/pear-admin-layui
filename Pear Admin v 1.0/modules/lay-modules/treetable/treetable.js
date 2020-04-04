;
layui.define("jquery", function(e) {
    "use strict";
    var o = layui.jquery,
        a = layui.hint(),
        f = layui.form,
        r = "layui-tree-enter",
        i = function(e) {
            this.options = e
        },
		t = {
			arrow: ["&#xe623;", "&#xe625;"],
			checkbox: ["&#xe626;", "&#xe627;"],
			radio: ["&#xe62b;", "&#xe62a;"],
			branch: ["folder-close", "folder"],
			leaf: "leaf"
		},
        tt = {},
        TreeTable = function() {
            this.mapping = {};
        },
        TreeNode = function(item) {
            this.item = item;
            this.nodes = [];
        };
        i.prototype.expand = function(treeNode, isOpened, e) {
            var o = this;
            var subTreeNodes = treeNode.nodes;
            if (subTreeNodes && subTreeNodes.length > 0) {
                for (var ind = 0; ind < subTreeNodes.length; ind++) {
                    var subTreeNode = subTreeNodes[ind];
                    var subTrNode = document.getElementById(subTreeNode.id);
                    if (subTrNode) {
                        !isOpened ? (e.data("spread", null), subTrNode.setAttribute('class', 'layui-hide layui-anim layui-anim-fadein')) : (e.data("spread", !0), subTrNode.setAttribute('class', 'layui-anim layui-anim-fadein'))
                    }
                    if (isOpened && !subTreeNode.isOpened) {
                        continue;
                    }
                    o.expand(subTreeNode, isOpened, e);
                }
            }
        },
        i.prototype.traverseModel = function(treeTable, parentNode, item, childrenAttrs) {
            var o = this;
            if (item) {
                var treeNode = new TreeNode(item);
                if (parentNode) {
                    treeNode.parentId = parentNode.id;
                    treeNode.id = item.id;
                    treeNode.level = parentNode.level + 1;
                    parentNode.nodes[parentNode.nodes.length] = treeNode;
                    treeNode.parent = parentNode;
                } else {
                    treeNode.id = item.id;
                    treeNode.level = 0;
                }
                treeNode.isOpened = false;
                treeTable.mapping[treeNode.id] = treeNode;
                var children = item[childrenAttrs];
                if (children && children.constructor == Array) {
                    for (var i = 0; i < children.length; i++) {
                        o.traverseModel(treeTable, treeNode, children[i], childrenAttrs);
                    }
                }
            }
        }, i.prototype.initGird = function(e) {
            var ob = this, i = ob.options;
            i = o.extend({}, i, {checkbox: i.checkbox?i.checkbox:false , spreadable :i.spreadable?i.spreadable:false});
            var tableHeaderStr = '<thead><tr>';
            tableHeaderStr += (i.checkbox == false ? '' : '<th style="width:10px"><input type="checkbox" name="treeGirdCheckbox" lay-skin="primary" lay-filter="allChoose"></th>');
            for (var ind = 0; ind < i.layout.length; ind++) {
                var headerClass = i.layout[ind].headerClass ? ' class="' + i.layout[ind].headerClass + '"' : '';
                tableHeaderStr += '<th' + headerClass + '>' + i.layout[ind].name + '</th>';
            }
            tableHeaderStr += '</tr></thead>';
            tableHeaderStr = o(tableHeaderStr);

            var treeTable = new TreeTable();
            var root = {
                id: 'root',
                children: i.nodes
            }
            ob.traverseModel(treeTable, null, root, ['children']);
            tt[e.selector] = treeTable;
            e.addClass("layui-tree layui-treetable"),
                i.skin && e.addClass("layui-tree-skin-" + i.skin),
                ob.treeGird(e), ob.checkboxEvent(e, i),
                e.wrapInner('<tbody></tbody'),
                e.prepend(tableHeaderStr),
                e.wrapInner('<table class="layui-table"></table>'),
                e.wrapInner('<div class="layui-form"></div>'),
                ob.on(e);
            return e;
        }, i.prototype.treeGird = function(e, a) {
            var r = this,
                i = r.options,
                n = a || i.nodes,
                nt = tt[e.selector];
            layui.each(n, function(a, n) {
                if (n.children) {
                    layui.each(n.children, function(index, item) {
                        item.pid = n.id;
                    });
                }
                var treeNode = nt.mapping[n.id];
                var indent = "";
                if (treeNode.level > 1) {
                    for (var ind = 1; ind < treeNode.level; ind++) {
                        indent += '<span style="display: inline-block;width: 20px;"></span>';
                    }
                }
                var p;
                if (i.spreadable) {
                    n.spread = true, p = false, treeNode.isOpened = true;
                } else {
                    p = treeNode.parentId == 'root' ? null : treeNode.parentId;
                }
                var l = n.children && n.children.length > 0,
                    str = o(['<tr class="' + (p ? "layui-hide layui-anim layui-anim-fadein" : "layui-anim layui-anim-fadein") + '" id="' + n.id + '">', 
                        function() {
                            if (i.checkbox){
                                return '<td><input type="checkbox" name="treeGirdCheckbox" lay-skin="primary" lay-filter="*" value="' + n.id + '" ' + ((n.checked && n.checked == true) ? 'checked="checked"' : "") +'></td>';
                            }
                        }(), 
                        function() {
                            var ret = ""
                            for (var ind = 0; ind < i.layout.length; ind++) {
                                if (i.layout[ind].treeNodes) {
                                    ret += '<td class="' + i.layout[ind].colClass + '" style="' + i.layout[ind].style + '"><li ' + (n.spread ? 'data-spread="' + n.spread + '"' : "") + '>' + (indent + (l ? '<i class="layui-icon layui-tree-spread">' + (n.spread ? t.arrow[1] : t.arrow[0]) + "</i>" : "")) + '<a href="' + (n.href || "javascript:;") + '" ' + (i.target && n.href ? 'target="' + i.target + '"' : "") + ">" + ('<i class="layui-icon layui-tree-' + (l ? "branch" : "leaf") + ' '+(l ? n.spread ? t.branch[1] : t.branch[0] : t.leaf)+'">' + "</i>") + ("<cite>" + (n.name || "未命名") + "</cite></a></li></td>");
                                } else if (i.layout[ind].render) {
                                    ret += '<td class="' + i.layout[ind].colClass + '" style="' + i.layout[ind].style + '">' + i.layout[ind].render(JSON.stringify(n)) + '</td>'
                                } else {
                                    ret += '<td class="' + i.layout[ind].colClass + '" style="' + i.layout[ind].style + '">' + n[i.layout[ind].field] + '</td>';
                                }
                            }
                            return ret;
                        }(), "</tr>"].join(""));
                e.append(str), l && (r.treeGird(e, n.children)), r.spreadGird(str, n, e.selector), i.drag && r.drag(str, n);
                r.changed(str, n)
            })
        },i.prototype.checkboxEvent = function (e, options){
            var nt = tt[e.selector];
            
            f.on('checkbox(allChoose)', function(data){
                var child = o(data.elem).parents('table').find('tbody input[type="checkbox"]');  
                child.each(function(index, item){  
                    item.checked = data.elem.checked;  
                });  
                f.render('checkbox');  
            });
            f.on('checkbox(*)',function(data){
                var node = nt.mapping[data.value].item;
                if (options.callback && options.callback.beforeCheck) {
                    if (options.callback.beforeCheck(node)){
                        // 允许勾选或取消勾选
                        data.elem.checked ? data.othis.addClass('layui-form-checked') : data.othis.removeClass('layui-form-checked');
                    }else{
                        // 不允许勾选或取消勾选
                        data.elem.checked = !data.elem.checked;
                        !data.elem.checked ?  data.othis.removeClass('layui-form-checked') :data.othis.addClass('layui-form-checked');
                        return true;
                    }
                }
                node.checked = data.elem.checked;

                var sib = o(data.elem).parents('table').find('tbody input[type="checkbox"]:checked').length;
                var total = o(data.elem).parents('table').find('tbody input[type="checkbox"]').length;
                if(sib == total){
                    o(data.elem).parents('table').find('thead input[type="checkbox"]').prop("checked",true);
                    f.render();
                }else{
                    o(data.elem).parents('table').find('thead input[type="checkbox"]').prop("checked",false);
                    f.render();
                }
                if (options.callback && options.callback.onCheck) {
                    return options.callback.onCheck(node);
                }
            }); 
        },i.prototype.changed = function(e, o) {
            var r = this;
            if (o.pid == undefined || o.pid == null) {
                e.children("input").on("change", function() {
                    var childUl = e.children("ul"),
                        checked = this.checked;
                    childUl.find("input").prop("checked", checked);
                })
            } else {
                e.children("input").on("change", function() {
                    var that = this;
                    if (!this.checked) {
                        if (o.children && o.children.length > 0) {
                            var childUl = e.children("ul"),
                                checked = this.checked;
                            childUl.find("input").prop("checked", checked);
                        }
                        r.cancelParentsCheckboxCheck(that);
                    } else {
                        r.parentsChecked(this, this.checked);
                        if (o.children && o.children.length > 0) {
                            var childUl = e.children("ul"),
                                checked = this.checked;
                            childUl.find("input").prop("checked", checked);
                        }
                    }
                });
            }
        }, i.prototype.cancelParentsCheckboxCheck = function(ele) {
            if (!ele) {
                return;
            }
            var r = this,
                siblingInputs = r.siblingInputs(ele),
                parentId = ele.getAttribute("data-parent-id"),
                parentInput = null,
                bool = true,
                childrendInputs = null,
                hasOneChildrenInputCheck = false;
            if (parentId != 'undefined') {
                parentInput = document.getElementById(parentId);
                childrendInputs = r.currentChildrenInputs(parentInput);
            }
            for (var i = 0, len = siblingInputs.length; i < len; i++) {
                if (siblingInputs[i].checked) {
                    bool = false;
                    break;
                }
            }
            if (!childrendInputs || childrendInputs.length == 0) {
                hasOneChildrenInputCheck = false;
            } else {
                for (var j = 0, len2 = childrendInputs.length; j < len2; j++) {
                    if (childrendInputs[j].getAttribute("data-parent-id") != "undefined") {
                        if (childrendInputs[j].checked) {
                            hasOneChildrenInputCheck = true;
                            break;
                        }
                    }
                }
            }
            if (bool && !hasOneChildrenInputCheck) {
                r.inputChecked(parentInput, false);
            }
            this.cancelParentsCheckboxCheck(parentInput);
        }, i.prototype.siblingInputs = function(ele) {
            var that = this;
            if (ele) {
                var parent = ele.parentElement,
                    parents = parent.parentElement,
                    childrens = parents.children,
                    siblingInputs = [];
            } else {
                return null;
            }
            for (var i = 0, len = childrens.length; i < len; i++) {
                if (childrens[i] != parent) {
                    if (childrens[i].children[0].nodeName == "INPUT") {
                        siblingInputs.push(childrens[i].children[0]);
                    }
                    if (childrens[i].children[1].nodeName == "INPUT") {
                        siblingInputs.push(childrens[i].children[1]);
                    }
                }
            }
            parent = null;
            parents = null;
            childrens = null;
            return siblingInputs;
        }, i.prototype.currentChildrenInputs = function(ele) {
            var parent = ele.parentElement,
                childrenInputs = [];
            if (parent.getElementsByTagName("ul").length > 0) {
                var uls = parent.getElementsByTagName("ul");
                for (var i = 0, len = uls.length; i < len; i++) {
                    var inputs = uls[i].getElementsByTagName("input");
                    for (var j = 0, len2 = inputs.length; j < len2; j++) {
                        childrenInputs.push(inputs[j]);
                    }
                }
            }
            return childrenInputs;
        }, i.prototype.inputChecked = function(ele, checked) {
            ele.checked = checked;
        }, i.prototype.parentsChecked = function(e, checked) {
            var r = this,
                i = r.options,
                selector = i.elem,
                currentInput = e;
            if (currentInput && (currentInput.nodeName == "INPUT")) {
                var parentId = currentInput.getAttribute("data-parent-id"),
                    parentInput = null;
                setTimeout(function() {
                    r.check(currentInput, checked);
                    if (parentId) {
                        r.parentsChecked(document.getElementById(parentId), checked);
                    }
                }, 50);
            }
        }, i.prototype.findParents = function(ele, selector) {
            var parent = ele.parentElement,
                that = this;
            if (selector.substr(0, 1) == "#") {
                if (parent) {
                    if (parent.id != selector.substr(1)) {
                        that.findParents(parent, selector);
                    } else {
                        return parent;
                    }
                }
            } else if (selector.substr(0, 1) == ".") {
                if (parent) {
                    var classnameArr = parent.className.split(" "),
                        len = classnameArr.length,
                        selectt = selector.substr(1),
                        hasSelector = false;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            if (classnameArr[i] == selectt) {
                                hasSelector = true;
                                break;
                            }
                        }
                    }
                    if (!hasSelector) {
                        that.findParents(parent, selector);
                    } else if (hasSelector) {
                        return parent;
                    }
                }
            }
        }, i.prototype.num = 1, i.prototype.uuid = function() {
            var that = this,
                randomStr = ['l', 'a', 'y', 'e', 'r', 'n', 'i'],
                randomNum = Math.floor(Math.random() * 6);
            return function() {
                var str = "";
                for (var i = 0; i <= randomNum; i++) {
                    str += randomStr[Math.floor(Math.random() * 6)];
                }
                return "layer_" + new Date().getTime() + "_" + (that.num++) + "_" + (++that.num) + "_" + str;
            }();
        }, i.prototype.check = function(input, bool) {
            if (bool) {
                input.checked = true;
            } else {
                input.checked = false;
            }
        }, i.prototype.click = function(e, o) {
            var a = this,
                r = a.options;
            e.children("a").on("click", function(e) {
                layui.stope(e), r.click(o)
            })
        }, i.prototype.spreadGird = function(e, o, el) {
            var a = this,
                r = (a.options, e.find(".layui-tree-spread")),
                nodeId = e[0].id,
                ri = e.find(".layui-tree-branch"),
                nt = tt[el],
                l = function() {
                    var treeNode = nt.mapping[nodeId];
                    var isOpened = treeNode.isOpened;
                    if (isOpened){
                        if (a.options.callback && a.options.callback.beforeCollapse && !a.options.callback.beforeCollapse(treeNode)) return true;
                    }else{
                        if (a.options.callback && a.options.callback.beforeExpand && !a.options.callback.beforeExpand(treeNode)) return true;
                    }
                    a.expand(treeNode, !isOpened, e);
                    isOpened ? (e.data("spread", null), r.html(t.arrow[0]), ri.removeClass(t.branch[1]), ri.addClass(t.branch[0])) : (e.data("spread", !0), r.html(t.arrow[1]), ri.removeClass(t.branch[0]), ri.addClass(t.branch[1]))
                    treeNode.isOpened = !isOpened;
                    if (isOpened){
                        if (a.options.callback && a.options.callback.onCollapse && !a.options.callback.onCollapse(treeNode)) return true;
                    }else{
                        if (a.options.callback && a.options.callback.onExpand && !a.options.callback.onExpand(treeNode)) return true;
                    }
                };
            (r.on("click", l), ri.parent().on("dblclick", l))
        }, i.prototype.on = function(e) {
            var a = this,
                i = a.options,
                t = "layui-tree-drag";
            e.find("i").on("selectstart", function(e) {
                return !1
            }), i.drag && o(document).on("mousemove", function(e) {
                var r = a.move;
                if (r.from) {
                    var i = (r.to, o('<div class="layui-box ' + t + '"></div>'));
                    e.preventDefault(), o("." + t)[0] || o("body").append(i);
                    var n = o("." + t)[0] ? o("." + t) : i;
                    n.addClass("layui-show").html(r.from.elem.children("a").html()), n.css({
                        left: e.pageX + 10,
                        top: e.pageY + 10
                    })
                }
            }).on("mouseup", function() {
                var e = a.move;
                e.from && (e.from.elem.children("a").removeClass(r), e.to && e.to.elem.children("a").removeClass(r), a.move = {}, o("." + t).remove())
            })
        }, i.prototype.move = {}, i.prototype.drag = function(e, a) {
            var i = this,
                t = (i.options, e.children("a")),
                n = function() {
                    var t = o(this),
                        n = i.move;
                    n.from && (n.to = {
                        item: a,
                        elem: e
                    }, t.addClass(r))
                };
            t.on("mousedown", function() {
                var o = i.move;
                o.from = {
                    item: a,
                    elem: e
                }
            }), t.on("mouseenter", n).on("mousemove", n).on("mouseleave", function() {
                var e = o(this),
                    a = i.move;
                a.from && (delete a.to, e.removeClass(r))
            })
        },  i.prototype.getLastChildNode = function(node){
            var a = this, lastChildNode
            if (node.children){
                lastChildNode = this.getLastChildNode(node.children[node.children.length-1]);
            }else{
                lastChildNode = node;
            }
            return lastChildNode;
        },  i.prototype.addNodes = function(v, parentNode, newNodes, isLastChild){
            var a = this,
                i = a.options,
                nt = tt[i.elem];
                layui.each(newNodes, function(an, n) {
                    if (n.children) {
                        layui.each(n.children, function (index, item) {
                            item.pid = n.id;
                        });
                    }
                    var treeNode = nt.mapping[n.id];
                    var indent = "";
                    if (treeNode.level > 1) {
                        for (var ind = 1; ind < treeNode.level; ind++) {
                            indent += '<span style="display: inline-block;width: 20px;"></span>';
                        }
                    }
                    var p;
                    if (i.spreadable) {
                        n.spread = true, p = false, treeNode.isOpened = true;
                    } else {
                        p = treeNode.parentId == 'root' ? null : treeNode.parentId;
                    }
                    if (isLastChild) {
                        if (parentNode) p = nt.mapping[parentNode.id].isOpened ? false : true;
                        else p = false;
                    }
                    
                    var l = n.children && n.children.length > 0,
                        str = o(['<tr class="' + (p ? "layui-hide layui-anim layui-anim-fadein" : "layui-anim layui-anim-fadein") + '" id="' + n.id + '">', 
                        function () {
                            if (i.checkbox) {
                                return '<td><input type="checkbox" name="treeGirdCheckbox" lay-skin="primary" lay-filter="*" value="' + n.id + '" ' + ((n.checked && n.checked == true) ? 'checked="checked"' : "") + '></td>';
                            }
                        }(),
                        function () {
                            var ret = ""
                            for (var ind = 0; ind < i.layout.length; ind++) {
                                if (i.layout[ind].treeNodes) {
                                    ret += '<td class="' + i.layout[ind].colClass + '" style="' + i.layout[ind].style + '">'
                                        + '<li ' + (n.spread ? 'data-spread="' + n.spread + '"' : "") + '>'
                                        + (indent + (l ? '<i class="layui-icon layui-tree-spread">' + (n.spread ? t.arrow[1] : t.arrow[0]) + "</i>" : ""))
                                        + '<a href="' + (n.href || "javascript:;") + '" ' + (i.target && n.href ? 'target="' + i.target + '"' : "") + ">"
                                        + ('<i class="layui-icon layui-tree-' + (l ? "branch" : "leaf") + ' '+(l ? n.spread ? t.branch[1] : t.branch[0] : t.leaf)+' ">'
                                        + "</i>") + ("<cite>" + (n.name || "未命名") + "</cite></a></li></td>");
                                } else if (i.layout[ind].render) {
                                    ret += '<td class="' + i.layout[ind].colClass + '" style="' + i.layout[ind].style + '">' + i.layout[ind].render(JSON.stringify(n)) + '</td>'
                                } else {
                                    ret += '<td class="' + i.layout[ind].colClass + '" style="' + i.layout[ind].style + '">' + n[i.layout[ind].field] + '</td>';
                                }
                            }
                            return ret;
                        }(), "</tr>"].join(""));
                    if (parentNode) {
                        var lastChildNode;
                        if (isLastChild) {
                            lastChildNode = a.getLastChildNode(parentNode);
                        }else {
                            lastChildNode = parentNode;
                        }
                        v.find("tbody tr[id="+lastChildNode.id+"]").after(str);
                    }else{
                        v.find("tbody").append(str);
                    }
                    l && (a.addNodes(v, n, n.children, false)), a.spreadGird(str, n, v.selector), i.drag && a.drag(str, n);
                    a.changed(str, n)
                })
        }, i.prototype.removeNodes = function(v, treeNode){
            var a = this, i = a.options, nt = tt[i.elem];
            delete nt.mapping[treeNode.id];

            var trNode = v.find("tbody tr[id="+treeNode.id+"]");
            trNode.remove();

            for (var i = 0; i <  treeNode.nodes.length; i++){
                a.removeNodes(v, nt.mapping[treeNode.nodes[i].id])
            }
        }, i.prototype.expandNode = function (nt, node, v, a, isOpened, sonSign){
            var treeNode = nt.mapping[node.id];
            var e = v.find("tbody tr[id=" + treeNode.id + "]");
            var r = (a.options, e.find(".layui-tree-spread"));

            if (isOpened){
                if (!treeNode.isOpened) o(r).trigger("click");
            }else{
                if (treeNode.isOpened) o(r).trigger("click");
            }

            if (sonSign) {
                for (var key in nt.mapping) {
                    var childNode = nt.mapping[key];
                    if (childNode.parentId == node.id) {
                        if (isOpened){
                            if (!childNode.isOpened) o(v.find("tbody tr[id=" + childNode.id + "]").find(".layui-tree-spread")).trigger("click");
                        }else{
                            if (treeNode.isOpened) o(v.find("tbody tr[id=" + childNode.id + "]").find(".layui-tree-spread")).trigger("click");
                        }
                        
                    }
                }
            }
        }, e("treetable", function(e) {
            var r = new i(e = e || {}),
                telem = o(e.elem);
            var v = r.initGird(telem);
            layui.addcss("modules/treetable/treetable.css");

            var funs = {
                getNode : function(idValue){
                    if (!idValue) return;
                    var a = this,
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                    for (var key in nt.mapping) {
                        var treeNode = nt.mapping[key];
                        if (treeNode.id == idValue) {
                            return treeNode.item;
                        }
                    }
                }, getNodeByParam : function(key, value, parentNode){
                    if (key == null || value == null) return;
                    var a = this,
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                    var arr = new Array();
                    for (var k in nt.mapping) {
                        var treeNode = nt.mapping[k];
                        if (treeNode.item[key] == value) {
                            var node = parentNode == null ? arr.push(treeNode.item):(parentNode.id == treeNode.parent.id ? arr.push(treeNode.item) : null);
                            return node;
                        }
                    }
                    return arr;
                }, getNodesByParam : function(key, value, parentNode){
                    if (key == null || value == null) return;
                    var a = this,
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                    var arr = new Array();
                    for (var k in nt.mapping) {
                        var treeNode = nt.mapping[k];
                        if (treeNode.item[key] == value) {
                            parentNode == null ? arr.push(treeNode.item):(parentNode.id == treeNode.parent.id ? arr.push(treeNode.item) : null);
                        }
                    }
                    return arr;
                }, getNodes : function(){
                    var a = this,
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                   
                    for (var key in nt.mapping) {
                        var treeNode = nt.mapping[key];
                        if (treeNode && treeNode.item && treeNode.id != 'root'){
                            arr.push(treeNode.item);
                        }
                    }
                    return arr;
                },addNode : function(parentNode, newNodes){
                    var i = r.options,
                        n = a || i.nodes,
                        nt = tt[v.selector];
                        
                    var arr = [];
                    if (!Array.isArray(newNodes)){
                        arr.push(newNodes)
                    }else{
                        arr = newNodes;
                    }
                    var treeTable = new TreeTable();
                    
                    r.traverseModel(treeTable, parentNode? nt.mapping[parentNode.id]:nt.mapping['root'], newNodes, ['children']);
                    for (var tttt in treeTable.mapping){
                        if ('root' == tttt) continue;
                        nt.mapping[tttt] = treeTable.mapping[tttt];
                    }
                    r.addNodes(v, parentNode, arr, true);
                    f.render();
                },editNodeName : function(node){
                    var i = r.options, n = a || i.nodes, nt = tt[v.selector];
                    var treeNode = nt.mapping[node.id];
                    treeNode.item = node;

                    var trNode = v.find("tbody tr[id="+node.id+"] td li a cite");
                    trNode.text(node.name);
                    f.render();
                },removeNode : function(node){
                    var i = r.options, n = a || i.nodes, nt = tt[v.selector];
                    var treeNode = nt.mapping[node.id];
                    r.removeNodes(v, treeNode);
                    f.render();
                },getSelected : function() {
                    var arr = new Array();
                    var nt = tt[v.selector]
                    o(e.elem).find("input[type=checkbox]:checked").each(function(index, v) {
                        var treeNode = nt.mapping[v.value];
                        if (treeNode && treeNode.item && treeNode.id != 'root'){
                            arr.push(treeNode.item);
                        }
                    });
                    return arr;
                },getUnSelected : function() {
                    var arr = new Array();
                    var nt = tt[v.selector]
                    o(e.elem).find("input[type=checkbox]:not(:checked)").each(function(index, v) {
                        var treeNode = nt.mapping[v.value];
                        if (treeNode && treeNode.item && treeNode.id != 'root'){
                            arr.push(treeNode.item);
                        }
                    });
                    return arr;
                },expand : function() {
                    var a = this,
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                    for (var key in nt.mapping) {
                        var treeNode = nt.mapping[key];
                        if (treeNode.id == 'root') continue;
                        var isOpened = treeNode.isOpened;
                        if (isOpened) continue;
                        var e = o('#' + treeNode.id),
                            r = (a.options, e.find(".layui-tree-spread")),
                            ri = e.find(".layui-tree-branch");
                        oi.expand(treeNode, !isOpened, e);
                        isOpened ? (e.data("spread", null), r.html(t.arrow[0]), ri.removeClass(t.branch[1]), ri.addClass(t.branch[0])) : (e.data("spread", !0), r.html(t.arrow[1]), ri.removeClass(t.branch[0]), ri.addClass(t.branch[1]))
                        treeNode.isOpened = !isOpened;
                    }
                },collapse : function() {
                    var a = this,
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                    for (var key in nt.mapping) {
                        var treeNode = nt.mapping[key];
                        if (treeNode.id == 'root') continue;
                        var isOpened = treeNode.isOpened;
                        if (!isOpened)  continue;
                        var e = o('#' + treeNode.id),
                            r = (a.options, e.find(".layui-tree-spread")),
                            ri = e.find(".layui-tree-branch");
                        oi.expand(treeNode, !isOpened, e);
                        isOpened ? (e.data("spread", null), r.html(t.arrow[0]), ri.removeClass(t.branch[1]), ri.addClass(t.branch[0])) : (e.data("spread", !0), r.html(t.arrow[1]), ri.removeClass(t.branch[0]), ri.addClass(t.branch[1]))
                        treeNode.isOpened = !isOpened;
                    }
                }, destory : function (){
                    var a = this, 
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                    var treeO = o(v.selector);
                    if (treeO) treeO.empty(), delete tt[v.selector];
                }, expandNode : function(node, sonSign){
                    var a = this, 
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                    r.expandNode(nt, node, v, a, true, sonSign);
                }, collapseNode : function(node, sonSign){
                    var a = this, 
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                    r.expandNode(nt, node, v, a, false, sonSign);
                }, checkNode : function (node, check){
                    var a = this, 
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                    var ck = v.find("tbody tr[id=" + node.id + "] ");
                    ck.find('input[type=checkbox]').attr("checked", check);
                    ck.find('input[type=checkbox]')[0].checked = check;
                    check ? ck.find('.layui-form-checkbox').addClass('layui-form-checked') : ck.find('.layui-form-checkbox').removeClass('layui-form-checked')
                }, setChkDisabled : function(node, disabled){
                    var a = this,
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];
                    var ck = v.find("tbody tr[id=" + node.id + "] ");
                    ck.find('input[type=checkbox]').attr("disabled",disabled);
                    disabled ? ck.find('.layui-form-checkbox').addClass('layui-checkbox-disbaled layui-disabled') : ck.find('.layui-form-checkbox').removeClass('layui-checkbox-disbaled layui-disabled');
                }, checkAllNodes : function(check){
                    var a = this,
                        oi = new i(v = v || {}),
                        nt = tt[v.selector];

                    for (var key in nt.mapping) {
                        var treeNode = nt.mapping[key];
                        if (treeNode && treeNode.item && treeNode.id != 'root'){
                            var ck = v.find("tbody tr[id=" + treeNode.id + "] ");
                            ck.find('input[type=checkbox]').attr("checked", check);
                            ck.find('input[type=checkbox]')[0].checked = check;
                            check ? ck.find('.layui-form-checkbox').addClass('layui-form-checked') : ck.find('.layui-form-checkbox').removeClass('layui-form-checked')
                        }
                    }
                    var all = v.find('thead input[type="checkbox"]');
                    all.attr("checked", check);
                    all[0].checked = check;
                    check ? all.parents('tr').find('.layui-form-checkbox').addClass('layui-form-checked') : all.parents('tr').find('.layui-form-checkbox').removeClass('layui-form-checked')
                }
            }
            for (var key in funs){
                v[key] = funs[key];
            }
            
            if (e.callback) {
                v.onCheck = e.callback.onCheck;
            }

            return telem[0] ? v : a.error("layui.tree 没有找到" + e.elem + "元素");
        })
});