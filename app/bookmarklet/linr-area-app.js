window.linrArea || (function(win){
	var la = win.linrArea = {};
	
	la.arr = null;

	function g(str){
		return document.getElementById(str);
	}
	function getPos(b){
		var a=b.offsetTop,c=b.offsetLeft;
		while(b=b.offsetParent){
			a+=b.offsetTop;
			c+=b.offsetLeft;
		}
		return [c, a];
	}
	function dlg(id,innerHTML){
		var xw = document.createElement('div');
			xw.id = id;
			xw.style.cssText = 'border:1px #eee solid;border-radius:3px;background:#FFF;padding:5px;position:absolute;z-index:999999;filter:alpha(opacity=90);opacity:.9;';
			xw.innerHTML = innerHTML ? innerHTML : '';
			document.body.appendChild(xw);
			return xw;
	}
	function areaDlg(bl,pos){
		var xw = g('linr_area_dlg'), css;
		if(!xw){
			xw = dlg('linr_area_dlg','<input style="padding:3px;writing-mode:rl-tb;" size="40" id="linr_area_txt" class="shop-text" onpaste="linrArea.setHref(this.value);" oncontextmenu="this.select();" />\
			<br/><input type="button" value="Õ³Ìù" onclick="linrArea.setViaClip();" />');
		}
		css = xw.style;
		if(bl){
			css.visibility = 'visible';
			css.left = pos[0] + 'px';
			css.top = pos[1] + 'px';
		}else{
			css.visibility = 'hidden';
		}
	}

	function getParentImg(nm){
		var img = document.getElementsByTagName('img'),
			curImg = null;
			for(var i = 0; i < img.length; i++){
				var um = img[i].getAttribute('usemap');
				if(um){
					if(um == '#'+ nm){
						curImg = img[i];
						break;
					}
				}
			}
		return curImg;
	}
	
	function getElementsByAttr(l,t,e,r){
		var r=r||document;
		var m=r.getElementsByTagName(e||"*");
		var n = [];
		for(var o=0;o<m.length;o++){
			switch(l){
				case 'class':
					var q = new RegExp("(?:^|\\s+)" + t + "(?:\\s+|$)");
					if(q.test(m[o].className)){
						n.push(m[o])
					}
				break;
				default:
					if(m[o].getAttribute(l)==t){
						n.push(m[o])
					}
				break;
			}
		}
		return n;
	}

	la.arr = null;
	la.cur = null;
	
	la.setHref = function(url){
		g('linr_area_txt').value = url;
		la.cur.setAttribute('href', url);
	}
	
	la.setViaClip = function(){
		var url = window.clipboardData.getData('text');
		if(url){
			g('linr_area_txt').value = url;
			la.cur.setAttribute('href', url);
		}
	}
	la.setImgSrc = function(obj){
		var img = document.getElementsByTagName('img');
		var url = window.clipboardData.getData('text');
		var index = obj.getAttribute('data-area-img-index');
		if(url){
			img[index].src = url;
		}
	}
	
	la.copyCustome = function(obj){
		var arr = getElementsByAttr('class','custom-area','div',g('bd'));
		var index = obj.getAttribute('data-custome-area-index');
		obj.style.color = 'green';
		window.clipboardData.setData('text', arr[index].innerHTML);
	}
	la.saveCustome = function(obj){
		//g('J_CustomTextarea_editor').
		//g('J_CustomTextarea').
		var ifm = document.frames[0];
		var arr = getElementsByAttr('class','custom-area','div',g('bd'));
		var index = obj.getAttribute('data-custome-area-index');
		if(ifm){
			var source_txt = ifm.document.getElementById('J_CustomTextarea');
				if(source_txt){
					source_txt.value = arr[index].innerHTML;
				}
		}
		return false;
	}
	
	la.removeMask = function(){
		var arr = document.getElementsByTagName('barbd');
			for(var i=0;i<arr.length;i++){
				arr[i].style.display = 'none';
			}
		var arr1 = document.getElementsByTagName('bar');
			for(var i=0;i<arr1.length;i++){
				arr1[i].style.height = '50px';
			}	
	}
	
	la.mng = function(){
		 var img = document.getElementsByTagName('img'),
			curImg = null;
			for(var i = 0; i < img.length; i++){
				var eo = img[i];
				var um = eo.getAttribute('usemap');
				if(um){
					var xw = dlg('linr_area_img_dlg_' + i, '<a href="#" data-area-img-index="' + i + '" onclick="linrArea.setImgSrc(this);return false;">Õ³Ìù</a>');
						xw.style.left = getPos(eo)[0] + eo.offsetWidth - xw.offsetWidth + 'px';
						xw.style.top = getPos(eo)[1] - 25 + 'px';
				}
			}
	}
	la.custom = function(){
		var arr = getElementsByAttr('class','custom-area','div',g('bd'));
			for(var i = 0; i< arr.length;i++){
				var eo = arr[i];
					eo.onmouseover = function(){
						this.style.background = '#4cf8f6';
						this.contentEditable = true;
					}
					eo.onmouseout = function(){
						this.style.background = '#FFF';
						this.contentEditable = false;
					}
				var xw = dlg('linr_custom_area_dlg_' + i, '<a href="#" data-custome-area-index="' + i + '" onclick="linrArea.saveCustome(this);return false;">±£´æ</a> <a href="#" data-custome-area-index="' + i + '" onclick="linrArea.copyCustome(this);return false;">¸´ÖÆ</a>');
					xw.style.left = getPos(eo)[0] + eo.offsetWidth - xw.offsetWidth + 'px';
					xw.style.top = getPos(eo)[1] + 'px';
			}
	}
	
	la.process = function(){
		for(var i=0;i<la.arr.length;i++){
			la.arr[i].onmouseover = function(){
				la.cur = this;
				var href = this.href;
				var pos = this.coords.split(',');
				var parent = this.parentNode;
				var img = getParentImg(parent.name);
				var imgPos = getPos(img);
				areaDlg(true,[imgPos[0] + Number(pos[0]), imgPos[1] + Number(pos[1])]);
				g('linr_area_txt').setAttribute('data-area-index', this.sourceIndex);
				g('linr_area_txt').value = href;
			}
		}
	}
	
	la.contextmenu = function(){
		var doc = document;
		var bool = function(){return true}
		doc.oncontextmenu=bool;
		doc.onselectstart=bool;
		doc.ondragstart=bool;
		doc.oncopy=bool;
		doc.onpaste=bool;
		doc.onmouseup=bool;
		doc.onmousedown=bool;
		doc.ondrag=bool;
		doc.ondrop=bool;
		doc.body.oncontextmenu=bool;
		doc.body.onselectstart=bool;
		doc.body.ondragstart=bool;
		doc.body.oncopy=bool;
		doc.body.onpaste=bool;
		doc.body.onmouseup=bool;
		doc.body.onmousedown=bool;
		doc.body.ondrag=bool;
		doc.body.ondrop=bool;
		
		var pl = g('mod-detail');
			if(pl){
				var htm = pl.outerHTML;
				pl.outerHTML = htm;
			}
		
	}
	
	la.init = function(){
		la.arr = document.getElementsByTagName('area');
		la.process();
		la.mng();
		la.custom();
		la.min2max();
		la.removeMask();
		la.nothumb();
		la.contextmenu();
	}
	la.nothumb = function(){
		var ht = location.host;
		var arr;
			if(ht == "fenxiao.taobao.com"){
				arr = document.getElementsByTagName('img');
					for(var i = 0;i<arr.length;i++){
						var img = arr[i];
						var src = img.src;
							if(src.indexOf('logo') == -1){
								img.style.width = '300px';
								img.style.height = '300px';
							}
							img.src = src.replace('jpg_sum.jpg','jpg_310x310.jpg');;
					}
			
			}
			
			
	}
	la.min2max = function(){
		var tbl = document.getElementById('J_DataTable') || document.getElementById('J_BoughtTable') ;
		var arr = tbl ? tbl.getElementsByTagName('img') : [];
			for(var i = 0; i < arr.length; i++){
				var src = arr[i].src;
				arr[i].parentNode.className = 'pic';
				arr[i].removeAttribute('width');
				arr[i].style.border='1px solid #fff';
				arr[i].src = src.replace('jpg_sum.jpg','jpg_310x310.jpg');
				arr[i].parentNode.onclick = function(){
					window.clipboardData.setData('text', 'http://item.taobao.com/item.htm?id=' + this.href.split('=')[1]);
					this.getElementsByTagName('img')[0].style.border='1px solid green';
					return false;
				}
			}
		var desc = getElementsByAttr('class', 'desc', 'td', tbl);
			for(var i = 0; i < desc.length; i++){
				desc[i].setAttribute('valign','bottom');
				var link = desc[i].getElementsByTagName('a')[0];
					link.onclick = function(){
						window.clipboardData.setData('text', this.title);
						this.style.color = 'green';
						return false;
					}
			}
	}

	la.init();
})(window);
