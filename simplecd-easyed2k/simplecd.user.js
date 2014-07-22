// ==UserScript==
// @name        ed2k loader
// @namespace   simplecd
// @description 提取simplecd的ed2k链接
// @author x007007007
// @updateURL   https://raw.githubusercontent.com/x007007007/greasmonkey-script/master/simplecd-easyed2k/simplecd.version
// @downloadURL https://raw.githubusercontent.com/x007007007/greasmonkey-script/master/simplecd-easyed2k/simplecd.user.js
// @include     http://simplecd.me/*
// @version     0.0.1
// @grant       GM_xmlhttpRequest
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @require     http://code.jquery.com/jquery-2.0.2.min.js
// ==/UserScript==
//提取一个分享中的所有链接信息
'strict';
var reg = /<input\s+type="checkbox"\s+value="(\w+)"\s+name="selectemule"\s+filesize="(\d+)"\s+\/>\s*<a\s+target="_blank"\s+href="(.*?)">(.*?)<\/a>/gi;
var reg_ed2k = />\s*(ed2k:\/\/.*?)\s*<\//gi
$(document) .ready(function () {
    if (window.location.pathname.match(/\/category\/.*/i)) {
        //处理列表
        var item_ul = $('<ul></ul>');
        var item_dock_toggle = $('<div style="position:relative;height:15px;width:100%;font-size:14px;background:gray;"></div>');
        var item_dock_toggle_min = $('<div style="float:right;background:yellow;">Toggle</div>');
        var item_dock_toggle_all = $('<div style="float:left;background:blue;">ALL</div>');
        var item_dock_toggle_getEd2k = $('<div style="float:left;background:red;">ED2K</div>');
        var item_dock_toggle_cls = $('<div style="float:right;background:red;">Cls</div>');
        var item_dock_toggle_registor = $('<div style="float:right;background:blue;">Registor</div>');
        var item_dock_container = $('<div style="position:relative;width:260px;height:300px;overflow-y:auto;">') .append(item_ul);
        var item_dock = $('<div style="position:fixed;bottom:0px;left:0;background:white" ></div>') .append(item_dock_toggle) .append(item_dock_container) .appendTo(document.body);
        var install_load_button = function () {
            $('td.entry-info>a[href^=\'/entry/\']') .each(function (index, element) {
                var id = element.href.match(/\/entry\/(\w+)/i) [1];
                var button = $('<div class="GM_load_list_button" style="background:red;width:30px;height:10px;">LOAD</div>');
                button.on('click', function () {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: '/entry/' + id + '/',
                        onload: function (response) {
                            var item;
                            while (item = reg.exec(response.responseText)) {
                                /* 提取列表中的所有资源  */
                                var itemstr = '<li><input id="GM_item_' + item[1] + '" type="checkbox" name="GM_item" value="' + item[1] + '" style="float: left;" /><label for="GM_item_' + item[1] + '"><div style="width:90%;word-break:break-all;">' + item[4] + '</div></label></li>';
                                //console.log(itemstr);
                                item_ul.append(itemstr);
                            }
                        }
                    });
                });
                button.insertAfter($(element));
            });
        };
        item_dock_toggle.append(item_dock_toggle_min) .append(item_dock_toggle_all) .append(item_dock_toggle_cls) .append(item_dock_toggle_registor) .append(item_dock_toggle_getEd2k);
        item_dock_toggle_registor.on('click', install_load_button);
        item_dock_toggle_min.on('click', function () {
            item_dock_container.toggle();
        });
        item_dock_toggle_cls.on('click',function(){
            item_ul.empty();
        })
        item_dock_toggle_getEd2k.on('click', function () {
            var id_list = [
            ];
            var ed2k_list = [
            ];
            var offset = 0;
            var state_stack = 0
            item_dock_container.find('input') .each(function (index, ele) {
                if (ele.checked) {
                    id_list.push(ele.value);
                }
            });
            while (id_list.length - offset > 0) {
                state_stack++;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'http://simplecd.me/download/?mode=copy&rid=' + id_list.slice(offset, offset + 30) .join('&rid='),
                    onload: function (response) {
                        var ed2kres;
                        while (ed2kres = reg_ed2k.exec(response.responseText)) {
                            ed2k_list.push(ed2kres[1]);
                        }
                        if (--state_stack == 0) {
                            GM_setClipboard(ed2k_list.join('\n'));
                            alert('以复制到剪切板！');
                        }
                    }
                });
                offset = offset + 30;
            }
        });
        item_dock_toggle_all.on('click', function () {
            item_ul.find('input') .each(function (i, e) {
                if (e.checked) {
                    e.checked = false;
                } else {
                    e.checked = true;
                }
            })
        });
        install_load_button();
    }
});
