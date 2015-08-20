var iFlag;
function search() {
 if (document.getElementById('textcase').checked)
  {iFlag=4;}
 else
  {iFlag=0;}
 if (document.getElementById('searchtext').value==null || document.getElementById('searchtext').value=='')
  {
   alert("请指定一个将被查找的词!!!");
   return;
  }
 if(rng.findText(document.getElementById('searchtext').value,10000,iFlag)==true){
   rng.select();
   rng.scrollIntoView();
   rng.moveStart("character");
  }
 else 
  {alert("已搜索到文档末尾!!");}
}

function replace() {
 if (document.getElementById('textcase').checked)
  {iFlag=4;}
 else
  {iFlag=0;}
 if (document.getElementById('searchtext').value==null || document.getElementById('searchtext').value=='')
  {
   alert("请指定一个将被查找的词!!!");
   return;
  }
 if (rng.findText(document.getElementById('searchtext').value,-10000,iFlag)==true)
  {
   rng.text = document.getElementById('replacetext').value;
  }
 else 
  {alert("已搜索到文档末尾!!");}
}

function replaceall() {
 var rng = document.body.createTextRange();
 if (document.getElementById('textcase').checked)
  {iFlag=4;}
 else
  {iFlag=0;}
 if (document.getElementById('searchtext').value==null || document.getElementById('searchtext').value=='')
  {
   alert("请指定一个将被替换的词!!!");
   return;
  }
  for (i=0; rng.findText(document.getElementById('searchtext').value,10000,iFlag)!=false; i++)
  {
   rng.scrollIntoView();
   rng.text = document.getElementById('replacetext').value;
  }
  setTimeout('alert(i + " 项已替换完毕!")',200);
}
function gofind() {

	var id = 'linr_find_replace', el = document.getElementById(id), d = [];
	if(!el){
		el = document.createElement('div');
		el.id = id;
		d.push('<style>.linr-find-replace{}.linr-find-replace td{padding:5px;}.linr-find-replace input, .linr-find-replace button{padding:2px 6px;vertical-align:middle;line-height:19px;border:1px solid #CCC;}</style><table class="linr-find-replace" width="350" border="0" cellspacing="0" cellpadding="3">\n');
		d.push('<tr>\n');
		d.push('<td>查找内容:</td>\n');
		d.push('<td><input type="text" id="searchtext" onchange="window.rng=window.document.body.createTextRange()"></td>\n');
		d.push('<td><button accesskey="S" id="searchbutton" onclick="window.search()">查找<u>S</u></button></td>\n');
		d.push('</tr>\n');
		d.push('<tr>\n');
		d.push('<td>替换为:</td>\n');
		d.push('<td><input type="text" id="replacetext"></td>\n');
		d.push('<td><button accesskey="R" id="replacebutton" onclick="window.replace()">替换<u>R</u></button></td>\n');
		d.push('</tr>\n');
		d.push('<tr>\n');
		d.push('<td colspan="2"><input type="checkbox" id="textcase" value="textcase">区分大小写</td>\n');
		d.push('<td><button accesskey="A" id="replaceallbutton" onclick="window.replaceall()">全部替换<u>A</u></button></td>\n');
		d.push('</tr>\n');
		d.push('<tr>\n');
		d.push('<td colspan="2">&nbsp;</td>\n');
		d.push('<td></td>\n');
		d.push('</tr>\n');
		d.push('</table>\n');
	
		el.innerHTML = d.join('\n');
		el.style.cssText = 'position:fixed;_position:absolute;left:0;top:0;z-index:999999999;width:350px;padding:5px;border:1px solid #CCC;box-shadow:1px 1px 5px #CCC;background:#FFF;background:raga(255,255,255,.9);';
		document.body.appendChild(el);
	}else{
		el.style.display = 'block';
	}
};
gofind();
//http://help.dottoro.com/ljstxqnd.php
//javascript:(function(){var s = document.createElement("script");s.charset="utf-8";s.type = "text/javascript"; s.src = "http://xiaogezi.cn/app/bookmarklet/ctrl-h.js"; document.body.insertBefore(s, document.body.firstChild);})()