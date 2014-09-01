// ==UserScript==
// @name        google search result direct link
// @namespace   x007007007
// @description 修改google搜索结果，在显示网站地址分类处（搜索结果下面第一行）添加直接打开页面的链接。
// @author      x007007007
// @updateURL   https://raw.githubusercontent.com/x007007007/greasmonkey-script/master/google/search_res_direct_link.version
// @downloadURL https://raw.githubusercontent.com/x007007007/greasmonkey-script/master/google/search_res_direct_link.user.js
// @include     https://www.google.com*
// @version     0.0.1
// @grant       none
// ==/UserScript==
function replaceShowHref() {
  function addlink(href, cite) {
    if(href && cite){
      let link = document.createElement('a'),
          root = cite.parentElement || document.body;
      link.href = href;
      link.target = '_blank';
      root.insertBefore(link, cite);
      link.appendChild(cite);
    }
  }
  var firstShowItem = document.querySelectorAll('#rso>li.g') .item(0) || null,
      searchitems = document.querySelectorAll('#rso>div.srg>li.g') || null,
      e;
  if (firstShowItem != null) {
    let item=firstShowItem.querySelector('h3.r>a'),
        itemhref=item && item.href || null,
        itemcite=firstShowItem.querySelector('div.s cite') || null;
    addlink(itemhref,itemcite);
  }
  for (e = 0; searchitems && e < searchitems.length; e++) {
    let item = searchitems.item(e) .querySelector('h3.r>a'),
        itemhref = item && item.href || null ,
        itemcite = searchitems.item(e) .querySelector('div.s cite') || null;
    addlink(itemhref, itemcite);
  }
}
addEventListener('DOMContentLoaded', replaceShowHref, false);
