// ==UserScript==
// @name        ata 餐费明细
// @namespace   ata
// @description 计算总和
// @updateURL   https://raw.githubusercontent.com/x007007007/greasmonkey-script/master/ata/easysp.version
// @downloadURL https://raw.githubusercontent.com/x007007007/greasmonkey-script/master/ata/easysp.user.js
// @include     http://sp.ata.net.cn/Admin/files/gdfy/AddMealsDetail.aspx*
// @include     http://sp.ata.net.cn/Admin/files/nav/IndexNew2.aspx*
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
// ==/UserScript==
var clickevent = function () {
  var evn = document.createEvent('MouseEvents');
  evn.initEvent('click', true, true);
  return evn;
}
var getAll = function () {
  var tab = document.querySelectorAll('#frame1,#frame2, #frame3, #frame4, #frame5, #frmae6'),
  t = {
  };
  for (var i = 0; i < tab.length; i++) {
    var fdoc = tab[i].contentDocument;
    var frow = fdoc.querySelectorAll('#form1>div>div.md_blue,#form1>div>div.md_blue_byProcesse');
    for (var j = 0; j < frow.length; j++) {
      var itemstitle = frow[j].querySelector('div.md_head>span.f1 ,div.md_head_byProcesse>span.f1').innerHTML.trim();
      var items = frow[j].querySelectorAll('div.md_content>ul.list>li');
      t[itemstitle] = {
      }
      for (var k = 0; k < items.length; k++) {
        t[itemstitle][items[k].title.trim()] = items[k].querySelector('div.itemCenter');
      }
    }
  }
  return t;
};
var getCostSum = function () {
  var table = document.querySelectorAll('#form1 .bluetableSolid ') [1],
  i = 0,
  j = 0,
  titledoms = table.querySelectorAll('thead>tr>th'),
  rowdoms = table.querySelectorAll('tbody>tr'),
  sum_cost = 0;
  for (i = 0; i < titledoms.length; i++) {
    if (titledoms[i].innerHTML == '餐费金额') {
      break
    }
  }
  for (j = 0; j < rowdoms.length; j++) {
    sum_cost += parseInt(rowdoms[j].querySelectorAll('td') [i].innerHTML)
  }
  return sum_cost;
};
var init = function () {
  if (window.location.pathname == '/Admin/files/gdfy/AddMealsDetail.aspx') {
    console.log('进入餐费详细');
    var table = document.querySelectorAll('#form1 .bluetableSolid') [1],
    foot = document.createElement('tfoot');
    foot.innerHTML = '<tr><td colspan=8></td><td>总额:' + getCostSum() + '</td></tr>';
    table.appendChild(foot);
  } else if (window.location.pathname == '/Admin/files/nav/IndexNew2.aspx') {
    console.log('进入导航');
    var checkerandrun = function (cb) {
      console.log(setTimeout(cb, 2000));
    };
    checkerandrun(function () {
      var map = getAll();
      console.log(map);
      setTimeout(function () {
        map['人事考勤汇总报表']['刷卡记录'].dispatchEvent(clickevent());
      }, 5000);
      setTimeout(function () {
        map['个人费用报销']['交通费'].dispatchEvent(clickevent());
      }, 7000);
      setTimeout(function () {
        map['费用报销']['其他费用'].dispatchEvent(clickevent());
      }, 10000);
    });
    setInterval(function () {
      var subpages = document.querySelector('#curent').contentDocument.querySelectorAll('#mainDiv>div.content>div>iframe'),
      s = '',
      i = 0,
      doc = null;
      debug
      for (i = 0; i < subpages.length; i++) {
        s = subpages[i].src || '';
        doc = subpages[i].contentDocument;
        if (s.indexOf('/Admin/URLReNav.aspx') >= 0 && doc) {
          /* 餐费 */
          var flogdom = doc.querySelector('#divTop table tr td.title-td-right');
          if (flogdom.innerHTML != '开启协助') {
            flogdom.innerHTML = '开启协助';
            doc.querySelector('#txtPayObject').value = '快餐店';
            doc.querySelector('#ddlSubject').value = '102';
            doc.querySelector('#ddlProject').value = '1117-61';
            doc.querySelector('#txtuseAdress').value = '公司';
            doc.querySelector('#txtPurpose').value = '项目推进';
          }
        } else if (s.indexOf('/Admin/files/grfy/Traffic3.aspx') >= 0  && doc) {
          /* 交通 */
//           var flogdom = doc.querySelector('#divTop table tbody tr').append();
//           if (flogdom.innerHTML != '开启协助') {
//             flogdom.innerHTML = '开启协助';
//             doc.querySelector('#DropDownListXM').value = '1117-61';
//             doc.querySelector('#DropDownListGJ').value = '出租车';
//             doc.querySelector('#txtCome').value = '公司';
//             doc.querySelector('#txtTo').value = '家';
//             doc.querySelector('#TextBoxDW').value = '自己';
//             doc.querySelector('#TextBoxMD').value = "项目推进";
            
//           }
          //console.log(doc);
        } else if (s.indexOf('/Ribao/RibaoLeaveManager.aspx') >= 0 && doc) {
          /* 考勤 */
          //console.log(doc);
        } else if (s.indexOf('/Ribao/ICCardRecord.aspx') >= 0 && doc) {
          /* */
        } else {
          console.log(subpages[i])
        }
      }
      //}catch(e){}

    }, 2000);
  } else {
    console.warning(window.location);
  }
}
addEventListener('DOMContentLoaded', init, false);
