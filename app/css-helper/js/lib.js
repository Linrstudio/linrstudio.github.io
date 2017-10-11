/* Zepto v1.1.4-x Modified by xiaogezi (e.el.trigger bugfix && $.browser) - zepto event ajax form ie detect fx fx_methods touch gesture - zeptojs.com/license */
var Zepto=function(){function _(t){return null==t?String(t):E[S.call(t)]||"object"}function A(t){return"function"==_(t)}function L(t){return null!=t&&t==t.window}function k(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function Z(t){return"object"==_(t)}function D(t){return Z(t)&&!L(t)&&Object.getPrototypeOf(t)==Object.prototype}function $(t){return"number"==typeof t.length}function R(t){return a.call(t,function(t){return null!=t})}function F(t){return t.length>0?n.fn.concat.apply([],t):t}function z(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function I(t){return t in f?f[t]:f[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function q(t,e){return"number"!=typeof e||c[z(t)]?e:e+"px"}function B(t){var e,n;return u[t]||(e=s.createElement(t),s.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),u[t]=n),u[t]}function H(t){return"children"in t?o.call(t.children):n.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function U(n,i,r){for(e in i)r&&(D(i[e])||M(i[e]))?(D(i[e])&&!D(n[e])&&(n[e]={}),M(i[e])&&!M(n[e])&&(n[e]=[]),U(n[e],i[e],r)):i[e]!==t&&(n[e]=i[e])}function V(t,e){return null==e?n(t):n(t).filter(e)}function X(t,e,n,i){return A(e)?e.call(t,n,i):e}function Y(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function W(e,n){var i=e.className,r=i&&i.baseVal!==t;return n===t?r?i.baseVal:i:void(r?i.baseVal=n:e.className=n)}function J(t){var e;try{return t?"true"==t||("false"==t?!1:"null"==t?null:/^0/.test(t)||isNaN(e=Number(t))?/^[\[\{]/.test(t)?n.parseJSON(t):t:e):t}catch(i){return t}}function G(t,e){e(t);for(var n=0,i=t.childNodes.length;i>n;n++)G(t.childNodes[n],e)}var t,e,n,i,P,C,r=[],o=r.slice,a=r.filter,s=window.document,u={},f={},c={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},l=/^\s*<(\w+|!)[^>]*>/,h=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,p=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,d=/^(?:body|html)$/i,m=/([A-Z])/g,g=["val","css","html","text","data","width","height","offset"],v=["after","prepend","before","append"],y=s.createElement("table"),b=s.createElement("tr"),w={tr:s.createElement("tbody"),tbody:y,thead:y,tfoot:y,td:b,th:b,"*":s.createElement("div")},x=/complete|loaded|interactive/,T=/^[\w-]*$/,E={},S=E.toString,j={},O=s.createElement("div"),N={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},M=Array.isArray||function(t){return t instanceof Array};return j.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,o=!r;return o&&(r=O).appendChild(t),i=~j.qsa(r,e).indexOf(t),o&&O.removeChild(t),i},P=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},C=function(t){return a.call(t,function(e,n){return t.indexOf(e)==n})},j.fragment=function(e,i,r){var a,u,f;return h.test(e)&&(a=n(s.createElement(RegExp.$1))),a||(e.replace&&(e=e.replace(p,"<$1></$2>")),i===t&&(i=l.test(e)&&RegExp.$1),i in w||(i="*"),f=w[i],f.innerHTML=""+e,a=n.each(o.call(f.childNodes),function(){f.removeChild(this)})),D(r)&&(u=n(a),n.each(r,function(t,e){g.indexOf(t)>-1?u[t](e):u.attr(t,e)})),a},j.Z=function(t,e){return t=t||[],t.__proto__=n.fn,t.selector=e||"",t},j.isZ=function(t){return t instanceof j.Z},j.init=function(e,i){var r;if(!e)return j.Z();if("string"==typeof e)if(e=e.trim(),"<"==e[0]&&l.test(e))r=j.fragment(e,RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=j.qsa(s,e)}else{if(A(e))return n(s).ready(e);if(j.isZ(e))return e;if(M(e))r=R(e);else if(Z(e))r=[e],e=null;else if(l.test(e))r=j.fragment(e.trim(),RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=j.qsa(s,e)}}return j.Z(r,e)},n=function(t,e){return j.init(t,e)},n.extend=function(t){var e,n=o.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){U(t,n,e)}),t},j.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],a=i||r?e.slice(1):e,s=T.test(a);return k(t)&&s&&i?(n=t.getElementById(a))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:o.call(s&&!i?r?t.getElementsByClassName(a):t.getElementsByTagName(e):t.querySelectorAll(e))},n.contains=s.documentElement.contains?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e&&(e=e.parentNode);)if(e===t)return!0;return!1},n.type=_,n.isFunction=A,n.isWindow=L,n.isArray=M,n.isPlainObject=D,n.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},n.inArray=function(t,e,n){return r.indexOf.call(e,t,n)},n.camelCase=P,n.trim=function(t){return null==t?"":String.prototype.trim.call(t)},n.uuid=0,n.support={},n.expr={},n.map=function(t,e){var n,r,o,i=[];if($(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&i.push(n);else for(o in t)n=e(t[o],o),null!=n&&i.push(n);return F(i)},n.each=function(t,e){var n,i;if($(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(i in t)if(e.call(t[i],i,t[i])===!1)return t;return t},n.grep=function(t,e){return a.call(t,e)},window.JSON&&(n.parseJSON=JSON.parse),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){E["[object "+e+"]"]=e.toLowerCase()}),n.fn={forEach:r.forEach,reduce:r.reduce,push:r.push,sort:r.sort,indexOf:r.indexOf,concat:r.concat,map:function(t){return n(n.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return n(o.apply(this,arguments))},ready:function(t){return x.test(s.readyState)&&s.body?t(n):s.addEventListener("DOMContentLoaded",function(){t(n)},!1),this},get:function(e){return e===t?o.call(this):this[e>=0?e:e+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return r.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return A(t)?this.not(this.not(t)):n(a.call(this,function(e){return j.matches(e,t)}))},add:function(t,e){return n(C(this.concat(n(t,e))))},is:function(t){return this.length>0&&j.matches(this[0],t)},not:function(e){var i=[];if(A(e)&&e.call!==t)this.each(function(t){e.call(this,t)||i.push(this)});else{var r="string"==typeof e?this.filter(e):$(e)&&A(e.item)?o.call(e):n(e);this.forEach(function(t){r.indexOf(t)<0&&i.push(t)})}return n(i)},has:function(t){return this.filter(function(){return Z(t)?n.contains(this,t):n(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!Z(t)?t:n(t)},last:function(){var t=this[this.length-1];return t&&!Z(t)?t:n(t)},find:function(t){var e,i=this;return e=t?"object"==typeof t?n(t).filter(function(){var t=this;return r.some.call(i,function(e){return n.contains(e,t)})}):1==this.length?n(j.qsa(this[0],t)):this.map(function(){return j.qsa(this,t)}):[]},closest:function(t,e){var i=this[0],r=!1;for("object"==typeof t&&(r=n(t));i&&!(r?r.indexOf(i)>=0:j.matches(i,t));)i=i!==e&&!k(i)&&i.parentNode;return n(i)},parents:function(t){for(var e=[],i=this;i.length>0;)i=n.map(i,function(t){return(t=t.parentNode)&&!k(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return V(e,t)},parent:function(t){return V(C(this.pluck("parentNode")),t)},children:function(t){return V(this.map(function(){return H(this)}),t)},contents:function(){return this.map(function(){return o.call(this.childNodes)})},siblings:function(t){return V(this.map(function(t,e){return a.call(H(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return n.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=B(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=A(t);if(this[0]&&!e)var i=n(t).get(0),r=i.parentNode||this.length>1;return this.each(function(o){n(this).wrapAll(e?t.call(this,o):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){n(this[0]).before(t=n(t));for(var e;(e=t.children()).length;)t=e.first();n(t).append(this)}return this},wrapInner:function(t){var e=A(t);return this.each(function(i){var r=n(this),o=r.contents(),a=e?t.call(this,i):t;o.length?o.wrapAll(a):r.append(a)})},unwrap:function(){return this.parent().each(function(){n(this).replaceWith(n(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var i=n(this);(e===t?"none"==i.css("display"):e)?i.show():i.hide()})},prev:function(t){return n(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return n(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0 in arguments?this.each(function(e){var i=this.innerHTML;n(this).empty().append(X(this,t,e,i))}):0 in this?this[0].innerHTML:null},text:function(t){return 0 in arguments?this.each(function(e){var n=X(this,t,e,this.textContent);this.textContent=null==n?"":""+n}):0 in this?this[0].textContent:null},attr:function(n,i){var r;return"string"!=typeof n||1 in arguments?this.each(function(t){if(1===this.nodeType)if(Z(n))for(e in n)Y(this,e,n[e]);else Y(this,n,X(this,i,t,this.getAttribute(n)))}):this.length&&1===this[0].nodeType?!(r=this[0].getAttribute(n))&&n in this[0]?this[0][n]:r:t},removeAttr:function(t){return this.each(function(){1===this.nodeType&&Y(this,t)})},prop:function(t,e){return t=N[t]||t,1 in arguments?this.each(function(n){this[t]=X(this,e,n,this[t])}):this[0]&&this[0][t]},data:function(e,n){var i="data-"+e.replace(m,"-$1").toLowerCase(),r=1 in arguments?this.attr(i,n):this.attr(i);return null!==r?J(r):t},val:function(t){return 0 in arguments?this.each(function(e){this.value=X(this,t,e,this.value)}):this[0]&&(this[0].multiple?n(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value)},offset:function(t){if(t)return this.each(function(e){var i=n(this),r=X(this,t,e,i.offset()),o=i.offsetParent().offset(),a={top:r.top-o.top,left:r.left-o.left};"static"==i.css("position")&&(a.position="relative"),i.css(a)});if(!this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(t,i){if(arguments.length<2){var r=this[0],o=getComputedStyle(r,"");if(!r)return;if("string"==typeof t)return r.style[P(t)]||o.getPropertyValue(t);if(M(t)){var a={};return n.each(M(t)?t:[t],function(t,e){a[e]=r.style[P(e)]||o.getPropertyValue(e)}),a}}var s="";if("string"==_(t))i||0===i?s=z(t)+":"+q(t,i):this.each(function(){this.style.removeProperty(z(t))});else for(e in t)t[e]||0===t[e]?s+=z(e)+":"+q(e,t[e])+";":this.each(function(){this.style.removeProperty(z(e))});return this.each(function(){this.style.cssText+=";"+s})},index:function(t){return t?this.indexOf(n(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?r.some.call(this,function(t){return this.test(W(t))},I(t)):!1},addClass:function(t){return t?this.each(function(e){i=[];var r=W(this),o=X(this,t,e,r);o.split(/\s+/g).forEach(function(t){n(this).hasClass(t)||i.push(t)},this),i.length&&W(this,r+(r?" ":"")+i.join(" "))}):this},removeClass:function(e){return this.each(function(n){return e===t?W(this,""):(i=W(this),X(this,e,n,i).split(/\s+/g).forEach(function(t){i=i.replace(I(t)," ")}),void W(this,i.trim()))})},toggleClass:function(e,i){return e?this.each(function(r){var o=n(this),a=X(this,e,r,W(this));a.split(/\s+/g).forEach(function(e){(i===t?!o.hasClass(e):i)?o.addClass(e):o.removeClass(e)})}):this},scrollTop:function(e){if(this.length){var n="scrollTop"in this[0];return e===t?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var n="scrollLeft"in this[0];return e===t?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),i=this.offset(),r=d.test(e[0].nodeName)?{top:0,left:0}:e.offset();return i.top-=parseFloat(n(t).css("margin-top"))||0,i.left-=parseFloat(n(t).css("margin-left"))||0,r.top+=parseFloat(n(e[0]).css("border-top-width"))||0,r.left+=parseFloat(n(e[0]).css("border-left-width"))||0,{top:i.top-r.top,left:i.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||s.body;t&&!d.test(t.nodeName)&&"static"==n(t).css("position");)t=t.offsetParent;return t})}},n.fn.detach=n.fn.remove,["width","height"].forEach(function(e){var i=e.replace(/./,function(t){return t[0].toUpperCase()});n.fn[e]=function(r){var o,a=this[0];return r===t?L(a)?a["inner"+i]:k(a)?a.documentElement["scroll"+i]:(o=this.offset())&&o[e]:this.each(function(t){a=n(this),a.css(e,X(this,r,t,a[e]()))})}}),v.forEach(function(t,e){var i=e%2;n.fn[t]=function(){var t,o,r=n.map(arguments,function(e){return t=_(e),"object"==t||"array"==t||null==e?e:j.fragment(e)}),a=this.length>1;return r.length<1?this:this.each(function(t,u){o=i?u:u.parentNode,u=0==e?u.nextSibling:1==e?u.firstChild:2==e?u:null;var f=n.contains(s.documentElement,o);r.forEach(function(t){if(a)t=t.cloneNode(!0);else if(!o)return n(t).remove();o.insertBefore(t,u),f&&G(t,function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},n.fn[i?t+"To":"insert"+(e?"Before":"After")]=function(e){return n(e)[t](this),this}}),j.Z.prototype=n.fn,j.uniq=C,j.deserializeValue=J,n.zepto=j,n}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto),function(t){function l(t){return t._zid||(t._zid=e++)}function h(t,e,n,i){if(e=p(e),e.ns)var r=d(e.ns);return(a[l(t)]||[]).filter(function(t){return!(!t||e.e&&t.e!=e.e||e.ns&&!r.test(t.ns)||n&&l(t.fn)!==l(n)||i&&t.sel!=i)})}function p(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function d(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function m(t,e){return t.del&&!u&&t.e in f||!!e}function g(t){return c[t]||u&&f[t]||t}function v(e,i,r,o,s,u,f){var h=l(e),d=a[h]||(a[h]=[]);i.split(/\s/).forEach(function(i){if("ready"==i)return t(document).ready(r);var a=p(i);a.fn=r,a.sel=s,a.e in c&&(r=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?a.fn.apply(this,arguments):void 0}),a.del=u;var l=u||r;a.proxy=function(t){if(t=E(t),!t.isImmediatePropagationStopped()){t.data=o;var i=l.apply(e,t._args==n?[t]:[t].concat(t._args));return i===!1&&(t.preventDefault(),t.stopPropagation()),i}},a.i=d.length,d.push(a),"addEventListener"in e&&e.addEventListener(g(a.e),a.proxy,m(a,f))})}function y(t,e,n,i,r){var o=l(t);(e||"").split(/\s/).forEach(function(e){h(t,e,n,i).forEach(function(e){delete a[o][e.i],"removeEventListener"in t&&t.removeEventListener(g(e.e),e.proxy,m(e,r))})})}function E(e,i){return(i||!e.isDefaultPrevented)&&(i||(i=e),t.each(T,function(t,n){var r=i[t];e[t]=function(){return this[n]=b,r&&r.apply(i,arguments)},e[n]=w}),(i.defaultPrevented!==n?i.defaultPrevented:"returnValue"in i?i.returnValue===!1:i.getPreventDefault&&i.getPreventDefault())&&(e.isDefaultPrevented=b)),e}function S(t){var e,i={originalEvent:t};for(e in t)x.test(e)||t[e]===n||(i[e]=t[e]);return E(i,t)}var n,e=1,i=Array.prototype.slice,r=t.isFunction,o=function(t){return"string"==typeof t},a={},s={},u="onfocusin"in window,f={focus:"focusin",blur:"focusout"},c={mouseenter:"mouseover",mouseleave:"mouseout"};s.click=s.mousedown=s.mouseup=s.mousemove="MouseEvents",t.event={add:v,remove:y},t.proxy=function(e,n){var a=2 in arguments&&i.call(arguments,2);if(r(e)){var s=function(){return e.apply(n,a?a.concat(i.call(arguments)):arguments)};return s._zid=l(e),s}if(o(n))return a?(a.unshift(e[n],e),t.proxy.apply(null,a)):t.proxy(e[n],e);throw new TypeError("expected function")},t.fn.bind=function(t,e,n){return this.on(t,e,n)},t.fn.unbind=function(t,e){return this.off(t,e)},t.fn.one=function(t,e,n,i){return this.on(t,e,n,i,1)};var b=function(){return!0},w=function(){return!1},x=/^([A-Z]|returnValue$|layer[XY]$)/,T={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.fn.delegate=function(t,e,n){return this.on(e,t,n)},t.fn.undelegate=function(t,e,n){return this.off(e,t,n)},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,a,s,u,f){var c,l,h=this;return e&&!o(e)?(t.each(e,function(t,e){h.on(t,a,s,e,f)}),h):(o(a)||r(u)||u===!1||(u=s,s=a,a=n),(r(s)||s===!1)&&(u=s,s=n),u===!1&&(u=w),h.each(function(n,r){f&&(c=function(t){return y(r,t.type,u),u.apply(this,arguments)}),a&&(l=function(e){var n,o=t(e.target).closest(a,r).get(0);return o&&o!==r?(n=t.extend(S(e),{currentTarget:o,liveFired:r}),(c||u).apply(o,[n].concat(i.call(arguments,1)))):void 0}),v(r,e,u,s,a,l||c)}))},t.fn.off=function(e,i,a){var s=this;return e&&!o(e)?(t.each(e,function(t,e){s.off(t,i,e)}),s):(o(i)||r(a)||a===!1||(a=i,i=n),a===!1&&(a=w),s.each(function(){y(this,e,a,i)}))},t.fn.trigger=function(e,n){return e=o(e)||t.isPlainObject(e)?t.Event(e):E(e),e._args=n,this.each(function(){"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,n){var i,r;return this.each(function(a,s){i=S(o(e)?t.Event(e):e),i._args=n,i.target=s,t.each(h(s,e.type||e),function(t,e){return r=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),r},"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.trigger(e)}}),["focus","blur"].forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.each(function(){try{this[e]()}catch(t){}}),this}}),t.Event=function(t,e){o(t)||(e=t,t=e.type);var n=document.createEvent(s[t]||"Events"),i=!0;if(e)for(var r in e)"bubbles"==r?i=!!e[r]:n[r]=e[r];return n.initEvent(t,i,!0),E(n)}}(Zepto),function(t){function l(e,n,i){var r=t.Event(n);return t(e).trigger(r,i),!r.isDefaultPrevented()}function h(t,e,i,r){return t.global?l(e||n,i,r):void 0}function p(e){e.global&&0===t.active++&&h(e,null,"ajaxStart")}function d(e){e.global&&!--t.active&&h(e,null,"ajaxStop")}function m(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||h(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void h(e,n,"ajaxSend",[t,e])}function g(t,e,n,i){var r=n.context,o="success";n.success.call(r,t,o,e),i&&i.resolveWith(r,[t,o,e]),h(n,r,"ajaxSuccess",[e,n,t]),y(o,e,n)}function v(t,e,n,i,r){var o=i.context;i.error.call(o,n,e,t),r&&r.rejectWith(o,[n,e,t]),h(i,o,"ajaxError",[n,i,t||e]),y(e,n,i)}function y(t,e,n){var i=n.context;n.complete.call(i,e,t),h(n,i,"ajaxComplete",[e,n]),d(n)}function b(){}function w(t){return t&&(t=t.split(";",2)[0]),t&&(t==f?"html":t==u?"json":a.test(t)?"script":s.test(t)&&"xml")||"text"}function x(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function T(e){e.processData&&e.data&&"string"!=t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!=e.type.toUpperCase()||(e.url=x(e.url,e.data),e.data=void 0)}function E(e,n,i,r){return t.isFunction(n)&&(r=i,i=n,n=void 0),t.isFunction(i)||(r=i,i=void 0),{url:e,data:n,success:i,dataType:r}}function j(e,n,i,r){var o,a=t.isArray(n),s=t.isPlainObject(n);t.each(n,function(n,u){o=t.type(u),r&&(n=i?r:r+"["+(s||"object"==o||"array"==o?n:"")+"]"),!r&&a?e.add(u.name,u.value):"array"==o||!i&&"object"==o?j(e,u,i,n):e.add(n,u)})}var i,r,e=0,n=window.document,o=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,a=/^(?:text|application)\/javascript/i,s=/^(?:text|application)\/xml/i,u="application/json",f="text/html",c=/^\s*$/;t.active=0,t.ajaxJSONP=function(i,r){if(!("type"in i))return t.ajax(i);var f,h,o=i.jsonpCallback,a=(t.isFunction(o)?o():o)||"jsonp"+ ++e,s=n.createElement("script"),u=window[a],c=function(e){t(s).triggerHandler("error",e||"abort")},l={abort:c};return r&&r.promise(l),t(s).on("load error",function(e,n){clearTimeout(h),t(s).off().remove(),"error"!=e.type&&f?g(f[0],l,i,r):v(null,n||"error",l,i,r),window[a]=u,f&&t.isFunction(u)&&u(f[0]),u=f=void 0}),m(l,i)===!1?(c("abort"),l):(window[a]=function(){f=arguments},s.src=i.url.replace(/\?(.+)=\?/,"?$1="+a),n.head.appendChild(s),i.timeout>0&&(h=setTimeout(function(){c("timeout")},i.timeout)),l)},t.ajaxSettings={type:"GET",beforeSend:b,success:b,error:b,complete:b,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:u,xml:"application/xml, text/xml",html:f,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var n=t.extend({},e||{}),o=t.Deferred&&t.Deferred();for(i in t.ajaxSettings)void 0===n[i]&&(n[i]=t.ajaxSettings[i]);p(n),n.crossDomain||(n.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(n.url)&&RegExp.$2!=window.location.host),n.url||(n.url=window.location.toString()),T(n);var a=n.dataType,s=/\?.+=\?/.test(n.url);if(s&&(a="jsonp"),n.cache!==!1&&(e&&e.cache===!0||"script"!=a&&"jsonp"!=a)||(n.url=x(n.url,"_="+Date.now())),"jsonp"==a)return s||(n.url=x(n.url,n.jsonp?n.jsonp+"=?":n.jsonp===!1?"":"callback=?")),t.ajaxJSONP(n,o);var E,u=n.accepts[a],f={},l=function(t,e){f[t.toLowerCase()]=[t,e]},h=/^([\w-]+:)\/\//.test(n.url)?RegExp.$1:window.location.protocol,d=n.xhr(),y=d.setRequestHeader;if(o&&o.promise(d),n.crossDomain||l("X-Requested-With","XMLHttpRequest"),l("Accept",u||"*/*"),(u=n.mimeType||u)&&(u.indexOf(",")>-1&&(u=u.split(",",2)[0]),d.overrideMimeType&&d.overrideMimeType(u)),(n.contentType||n.contentType!==!1&&n.data&&"GET"!=n.type.toUpperCase())&&l("Content-Type",n.contentType||"application/x-www-form-urlencoded"),n.headers)for(r in n.headers)l(r,n.headers[r]);if(d.setRequestHeader=l,d.onreadystatechange=function(){if(4==d.readyState){d.onreadystatechange=b,clearTimeout(E);var e,i=!1;if(d.status>=200&&d.status<300||304==d.status||0==d.status&&"file:"==h){a=a||w(n.mimeType||d.getResponseHeader("content-type")),e=d.responseText;try{"script"==a?(1,eval)(e):"xml"==a?e=d.responseXML:"json"==a&&(e=c.test(e)?null:t.parseJSON(e))}catch(r){i=r}i?v(i,"parsererror",d,n,o):g(e,d,n,o)}else v(d.statusText||null,d.status?"error":"abort",d,n,o)}},m(d,n)===!1)return d.abort(),v(null,"abort",d,n,o),d;if(n.xhrFields)for(r in n.xhrFields)d[r]=n.xhrFields[r];var S="async"in n?n.async:!0;d.open(n.type,n.url,S,n.username,n.password);for(r in f)y.apply(d,f[r]);return n.timeout>0&&(E=setTimeout(function(){d.onreadystatechange=b,d.abort(),v(null,"timeout",d,n,o)},n.timeout)),d.send(n.data?n.data:null),d},t.get=function(){return t.ajax(E.apply(null,arguments))},t.post=function(){var e=E.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=E.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,i){if(!this.length)return this;var s,r=this,a=e.split(/\s/),u=E(e,n,i),f=u.success;return a.length>1&&(u.url=a[0],s=a[1]),u.success=function(e){r.html(s?t("<div>").html(e.replace(o,"")).find(s):e),f&&f.apply(r,arguments)},t.ajax(u),this};var S=encodeURIComponent;t.param=function(t,e){var n=[];return n.add=function(t,e){this.push(S(t)+"="+S(e))},j(n,t,e),n.join("&").replace(/%20/g,"+")}}(Zepto),function(t){t.fn.serializeArray=function(){var n,e=[];return t([].slice.call(this.get(0).elements)).each(function(){n=t(this);var i=n.attr("type");"fieldset"!=this.nodeName.toLowerCase()&&!this.disabled&&"submit"!=i&&"reset"!=i&&"button"!=i&&("radio"!=i&&"checkbox"!=i||this.checked)&&e.push({name:n.attr("name"),value:n.val()})}),e},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(e)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(Zepto),function(t){"__proto__"in{}||t.extend(t.zepto,{Z:function(e,n){return e=e||[],t.extend(e,t.fn),e.selector=n||"",e.__Z=!0,e},isZ:function(e){return"array"===t.type(e)&&"__Z"in e}});try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;window.getComputedStyle=function(t){try{return n(t)}catch(e){return null}}}}(Zepto),
/* detect.js */
(function(f){function d(a,f){var b=this.os={},c=this.browser={},d=a.match(/Web[kK]it[\/]{0,1}([\d.]+)/),g=a.match(/(Android);?[\s\/]+([\d.]+)?/),u=!!a.match(/\(Macintosh\; Intel /),h=a.match(/(iPad).*OS\s([\d_]+)/),k=a.match(/(iPod)(.*OS\s([\d_]+))?/),n=!h&&a.match(/(iPhone\sOS)\s([\d_]+)/),v=/Win\d{2}|Windows/.test(f),p=a.match(/Windows Phone ([\d.]+)/),q=a.match(/Kindle\/([\d.]+)/),e=a.match(/Chrome\/([\d.]+)/)||a.match(/CriOS\/([\d.]+)/),l=a.match(/Firefox\/([\d.]+)/),m=a.match(/MSIE\s([\d.]+)/)||
a.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),r=!e&&a.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),t=r||a.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),w=a.match(/MicroMessenger/);if(c.webkit=!!d)c.version=d[1];g&&(b.android=!0,b.version=g[2]);n&&!k&&(b.ios=b.iphone=!0,b.version=n[2].replace(/_/g,"."));h&&(b.ios=b.ipad=!0,b.version=h[2].replace(/_/g,"."));k&&(b.ios=b.ipod=!0,b.version=k[3]?k[3].replace(/_/g,"."):null);p&&(b.wp=!0,b.version=p[1]);q&&(b.kindle=!0,b.version=
q[1]);e&&(c.chrome=!0,c.version=e[1]);l&&(c.firefox=!0,c.version=l[1]);m&&(c.ie=!0,c.version=m[1]);t&&(u||b.ios||v)&&(c.safari=!0,b.ios||(c.version=t[1]));r&&(c.webview=!0);c.wechat=!!w;b.tablet=!!(h||g&&!a.match(/Mobile/)||l&&a.match(/Tablet/)||m&&!a.match(/Phone/)&&a.match(/Touch/));b.phone=!(b.tablet||b.ipod||!(g||n||e&&a.match(/Android/)||e&&a.match(/CriOS\/([\d.]+)/)||l&&a.match(/Mobile/)||m&&a.match(/Touch/)))}d.call(f,navigator.userAgent,navigator.platform);f.__detect=d})(Zepto),

function(t,e){function w(t){return t.replace(/([a-z])([A-Z])/,"$1-$2").toLowerCase()}function x(t){return i?i+t:t.toLowerCase()}var i,c,l,h,p,d,m,g,v,y,n="",a={Webkit:"webkit",Moz:"",O:"o"},s=window.document,u=s.createElement("div"),f=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,b={};t.each(a,function(t,r){return u.style[t+"TransitionProperty"]!==e?(n="-"+t.toLowerCase()+"-",i=r,!1):void 0}),c=n+"transform",b[l=n+"transition-property"]=b[h=n+"transition-duration"]=b[d=n+"transition-delay"]=b[p=n+"transition-timing-function"]=b[m=n+"animation-name"]=b[g=n+"animation-duration"]=b[y=n+"animation-delay"]=b[v=n+"animation-timing-function"]="",t.fx={off:i===e&&u.style.transitionProperty===e,speeds:{_default:400,fast:200,slow:600},cssPrefix:n,transitionEnd:x("TransitionEnd"),animationEnd:x("AnimationEnd")},t.fn.animate=function(n,i,r,o,a){return t.isFunction(i)&&(o=i,r=e,i=e),t.isFunction(r)&&(o=r,r=e),t.isPlainObject(i)&&(r=i.easing,o=i.complete,a=i.delay,i=i.duration),i&&(i=("number"==typeof i?i:t.fx.speeds[i]||t.fx.speeds._default)/1e3),a&&(a=parseFloat(a)/1e3),this.anim(n,i,r,o,a)},t.fn.anim=function(n,i,r,o,a){var s,x,S,u={},T="",E=this,j=t.fx.transitionEnd,P=!1;if(i===e&&(i=t.fx.speeds._default/1e3),a===e&&(a=0),t.fx.off&&(i=0),"string"==typeof n)u[m]=n,u[g]=i+"s",u[y]=a+"s",u[v]=r||"linear",j=t.fx.animationEnd;else{x=[];for(s in n)f.test(s)?T+=s+"("+n[s]+") ":(u[s]=n[s],x.push(w(s)));T&&(u[c]=T,x.push(c)),i>0&&"object"==typeof n&&(u[l]=x.join(", "),u[h]=i+"s",u[d]=a+"s",u[p]=r||"linear")}return S=function(e){if("undefined"!=typeof e){if(e.target!==e.currentTarget)return;t(e.target).unbind(j,S)}else t(this).unbind(j,S);P=!0,t(this).css(b),o&&o.call(this)},i>0&&(this.bind(j,S),setTimeout(function(){P||S.call(E)},1e3*(i+a)+25)),this.size()&&this.get(0).clientLeft,this.css(u),0>=i&&setTimeout(function(){E.each(function(){S.call(this)})},0),this},u=null}(Zepto),function(t,e){function s(n,i,r,o,a){"function"!=typeof i||a||(a=i,i=e);var s={opacity:r};return o&&(s.scale=o,n.css(t.fx.cssPrefix+"transform-origin","0 0")),n.animate(s,i,null,a)}function u(e,n,i,r){return s(e,n,0,i,function(){o.call(t(this)),r&&r.call(this)})}var n=window.document,r=(n.documentElement,t.fn.show),o=t.fn.hide,a=t.fn.toggle;t.fn.show=function(t,n){return r.call(this),t===e?t=0:this.css("opacity",0),s(this,t,1,"1,1",n)},t.fn.hide=function(t,n){return t===e?o.call(this):u(this,t,"0,0",n)},t.fn.toggle=function(n,i){return n===e||"boolean"==typeof n?a.call(this,n):this.each(function(){var e=t(this);e["none"==e.css("display")?"show":"hide"](n,i)})},t.fn.fadeTo=function(t,e,n){return s(this,t,e,null,n)},t.fn.fadeIn=function(t,e){var n=this.css("opacity");return n>0?this.css("opacity",0):n=1,r.call(this).fadeTo(t,n,e)},t.fn.fadeOut=function(t,e){return u(this,t,null,e)},t.fn.fadeToggle=function(e,n){return this.each(function(){var i=t(this);i[0==i.css("opacity")||"none"==i.css("display")?"fadeIn":"fadeOut"](e,n)})}}(Zepto),
/* touch.js */
(function(e){function v(a,c,d,e){return Math.abs(a-c)>=Math.abs(d-e)?0<a-c?"Left":"Right":0<d-e?"Up":"Down"}function w(){c=null;a.last&&(a.el.trigger("longTap"),a={})}function r(){d&&clearTimeout(d);k&&clearTimeout(k);l&&clearTimeout(l);c&&clearTimeout(c);d=k=l=c=null;a={}}function t(a){return("touch"==a.pointerType||a.pointerType==a.MSPOINTER_TYPE_TOUCH)&&a.isPrimary}function u(a,c){return a.type=="pointer"+c||a.type.toLowerCase()=="mspointer"+c}var a={},d,k,l,c,m;e(document).ready(function(){var h,
n,p=0,q=0,f,g;"MSGesture"in window&&(m=new MSGesture,m.target=document.body);e(document).bind("MSGestureEnd",function(b){if(b=1<b.velocityX?"Right":-1>b.velocityX?"Left":1<b.velocityY?"Down":-1>b.velocityY?"Up":null)a.el.trigger("swipe"),a.el.trigger("swipe"+b)}).on("touchstart MSPointerDown pointerdown",function(b){if(!(g=u(b,"down"))||t(b))f=g?b:b.touches[0],b.touches&&1===b.touches.length&&a.x2&&(a.x2=void 0,a.y2=void 0),h=Date.now(),n=h-(a.last||h),a.el=e("tagName"in f.target?f.target:f.target.parentNode),
d&&clearTimeout(d),a.x1=f.pageX,a.y1=f.pageY,0<n&&250>=n&&(a.isDoubleTap=!0),a.last=h,c=setTimeout(w,750),m&&g&&m.addPointer(b.pointerId)}).on("touchmove MSPointerMove pointermove",function(b){if(!(g=u(b,"move"))||t(b))f=g?b:b.touches[0],c&&clearTimeout(c),c=null,a.x2=f.pageX,a.y2=f.pageY,p+=Math.abs(a.x1-a.x2),q+=Math.abs(a.y1-a.y2)}).on("touchend MSPointerUp pointerup",function(b){if(!(g=u(b,"up"))||t(b))c&&clearTimeout(c),c=null,a.x2&&30<Math.abs(a.x1-a.x2)||a.y2&&30<Math.abs(a.y1-a.y2)?l=setTimeout(function(){a.el&&
(a.el.trigger("swipe"),a.el.trigger("swipe"+v(a.x1,a.x2,a.y1,a.y2)));a={}},0):"last"in a&&(30>p&&30>q?k=setTimeout(function(){var b=e.Event("tap");b.cancelTouch=r;a.el&&a.el.trigger(b);a.isDoubleTap?(a.el&&a.el.trigger("doubleTap"),a={}):d=setTimeout(function(){d=null;a.el&&a.el.trigger("singleTap");a={}},250)},0):a={}),p=q=0}).on("touchcancel MSPointerCancel pointercancel",r);e(window).on("scroll",r)});"swipe swipeLeft swipeRight swipeUp swipeDown doubleTap tap singleTap longTap".split(" ").forEach(function(a){e.fn[a]=
function(c){return this.on(a,c)}})})(Zepto),
/* gesture.js */
function(t){function i(t){return"tagName"in t?t:t.parentNode}if(t.os.ios){var n,e={};t(document).bind("gesturestart",function(t){{var r=Date.now();
r-(e.last||r)}e.target=i(t.target),n&&clearTimeout(n),e.e1=t.scale,e.last=r}).bind("gesturechange",function(t){e.e2=t.scale}).bind("gestureend",function(){e.e2>0?(0!=Math.abs(e.e1-e.e2)&&t(e.target).trigger("pinch")&&t(e.target).trigger("pinch"+(e.e1-e.e2>0?"In":"Out")),e.e1=e.e2=e.last=0):"last"in e&&(e={})}),["pinch","pinchIn","pinchOut"].forEach(function(e){t.fn[e]=function(t){return this.bind(e,t)}})}}(Zepto);
/* Callbacks.js */
(function(f){f.Callbacks=function(g){g=f.extend({},g);var e,n,l,p,h,k,a=[],c=!g.once&&[],q=function(b){e=g.memory&&b;n=!0;k=p||0;p=0;h=a.length;for(l=!0;a&&k<h;++k)if(!1===a[k].apply(b[0],b[1])&&g.stopOnFalse){e=!1;break}l=!1;a&&(c?c.length&&q(c.shift()):e?a.length=0:m.disable())},m={add:function(){if(a){var b=a.length,d=function(b){f.each(b,function(b,c){"function"===typeof c?g.unique&&m.has(c)||a.push(c):c&&c.length&&"string"!==typeof c&&d(c)})};d(arguments);l?h=a.length:e&&(p=b,q(e))}return this},
remove:function(){a&&f.each(arguments,function(c,d){for(var b;-1<(b=f.inArray(d,a,b));)a.splice(b,1),l&&(b<=h&&--h,b<=k&&--k)});return this},has:function(b){return!!(a&&(b?-1<f.inArray(b,a):a.length))},empty:function(){h=a.length=0;return this},disable:function(){a=c=e=void 0;return this},disabled:function(){return!a},lock:function(){c=void 0;e||m.disable();return this},locked:function(){return!c},fireWith:function(b,d){!a||n&&!c||(d=d||[],d=[b,d.slice?d.slice():d],l?c.push(d):q(d));return this},
fire:function(){return m.fireWith(this,arguments)},fired:function(){return!!n}};return m}})(Zepto);
/* deferred.js */
(function(c){function k(e){var d=[["resolve","done",c.Callbacks({once:1,memory:1}),"resolved"],["reject","fail",c.Callbacks({once:1,memory:1}),"rejected"],["notify","progress",c.Callbacks({memory:1})]],g="pending",f={state:function(){return g},always:function(){a.done(arguments).fail(arguments);return this},then:function(){var h=arguments;return k(function(b){c.each(d,function(d,g){var e=c.isFunction(h[d])&&h[d];a[g[1]](function(){var a=e&&e.apply(this,arguments);if(a&&c.isFunction(a.promise))a.promise().done(b.resolve).fail(b.reject).progress(b.notify);
else{var d=this===f?b.promise():this;b[g[0]+"With"](d,e?[a]:arguments)}})});h=null}).promise()},promise:function(a){return null!=a?c.extend(a,f):f}},a={};c.each(d,function(c,b){var e=b[2],h=b[3];f[b[1]]=e.add;h&&e.add(function(){g=h},d[c^1][2].disable,d[2][2].lock);a[b[0]]=function(){a[b[0]+"With"](this===a?f:this,arguments);return this};a[b[0]+"With"]=e.fireWith});f.promise(a);e&&e.call(a,a);return a}var n=Array.prototype.slice;c.when=function(e){var d=n.call(arguments),g=d.length,f=0,a=1!==g||e&&
c.isFunction(e.promise)?g:0,h=1===a?e:k(),b,l=function(d,b,c){return function(e){b[d]=this;c[d]=1<arguments.length?n.call(arguments):e;c===m?h.notifyWith(b,c):--a||h.resolveWith(b,c)}};if(1<g){var m=Array(g);var p=Array(g);for(b=Array(g);f<g;++f)d[f]&&c.isFunction(d[f].promise)?d[f].promise().done(l(f,b,d)).fail(h.reject).progress(l(f,p,m)):--a}a||h.resolveWith(b,d);return h.promise()};c.Deferred=k})(Zepto);


/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.8.6
 * Modified by xiaogezi v1.5.0
 *
 */

(function ($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function (options) {
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,       // è®¾ç½®ä¸€ä¸ªå€¼ï¼Œè¡¨ç¤ºå…ƒç´ è·ç¦»åº•éƒ¨çš„è·ç¦»æ—¶ï¼Œè§¦å‘lazyload
            failure_limit: 0,
            event: "scroll",    // é»˜è®¤ç»‘å®š scroll äº‹ä»¶
            effect: "show",     // é»˜è®¤ä½¿ç”¨ show æ•ˆæžœ
            container: window,  // ç”¨äºŽlazyloadçš„çˆ¶å®¹å™¨
            data_attribute: "src",
            skip_invisible: true,
            skip_above: true,   // æ˜¯å¦è·³è¿‡æ»šåŠ¨æ¡ä¸Šæ–¹çš„å…ƒç´ ï¼Œæ¯”å¦‚åœ¨é¡µé¢ä¸­éƒ¨æˆ–åº•éƒ¨åˆ·æ–°æ—¶ï¼Œé¡µé¢ä¸Šæ–¹çš„å†…å®¹æ˜¯å¦åŠ è½½ã€‚è®¾ç½®ä¸º false åˆ™ä¸ºåŠ è½½
            remove_attribute: false,
            appear: null,
            load: null,         // lazyload è§¦å‘åŽçš„å›žè°ƒ
            update: false,      // æ˜¯å¦ç«‹å³æ¸²æŸ“å¯è§åŒºåŸŸçš„ lazyload
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;

            elements.each(function () {
                var $this = $(this);
                if (settings.skip_invisible && $this.css("display") === "none") {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                    /* Nothing. */
                    !settings.skip_above && $this.trigger("appear");
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if (options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
            settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.on(settings.event, function (event) {
                return update();
            });
        }

        this.each(function () {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function () {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }

                    if (!$self.is('[data-class]')) { //xiaogezi
                        var original = $self.data(settings.data_attribute);

                        $("<img />")
                            .on("load", function () {
                                settings.effect !== false && $self.hide()

                                if ($self.is("img")) {
                                    $self.attr("src", original);
                                } else {
                                    $self.css('background-image', 'url(' + original + ')');
                                }
                                var fn = $self[settings.effect];
                                fn && fn(settings.effect_speed);
                                self.loaded = true;

                                $self.trigger('appeared');
                                settings.remove_attribute && $self.removeAttr('data-src');

                                /* Remove image from array so it is not looped next time. */
                                var temp = $.grep(elements, function (element) {
                                    return !element.loaded;
                                });
                                elements = $(temp);

                                if (settings.load) {
                                    var elements_left = elements.length;
                                    settings.load.call(self, elements_left, settings);
                                }
                            })
                            .attr("src", original);
                    } else { //xiaogezi
                        var cssclass = $self.data('class');
                        settings.effect == 'hide' && $self.hide();
                        $self.addClass(cssclass);
                        settings.remove_attribute && $self.removeAttr('data-class');
                        self.loaded = true;
                        $self.trigger('appeared');

                        /* Remove image from array so it is not looped next time. */
                        var temp = $.grep(elements, function (element) {
                            return !element.loaded;
                        });
                        elements = $(temp);

                        if (settings.load) {
                            var elements_left = elements.length;
                            settings.load.call(self, elements_left, settings);
                        }
                    }
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.on(settings.event, function (event) {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.on("resize", function (event) {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
            $window.on("pageshow", function (event) {
                // if (event.originalEvent.persisted) {
                event = event.originalEvent || event;
                if (event.persisted) {
                    elements.each(function () {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(window).on("load", function () {
            update();
        });

        settings.update && update(); // å¼‚æ­¥åŠ è½½åŽï¼Œç«‹å³æ›´æ–°

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window[0].scrollY;
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window[0].scrollX;
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window[0].scrollY;
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };

    $.leftofbegin = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window[0].scrollX;
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function (element, settings) {
        
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
            !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.fn, {
        "below-the-fold": function (a) { return $.belowthefold(a, { threshold: 0 }); },
        "above-the-top": function (a) { return !$.belowthefold(a, { threshold: 0 }); },
        "right-of-screen": function (a) { return $.rightoffold(a, { threshold: 0 }); },
        "left-of-screen": function (a) { return !$.rightoffold(a, { threshold: 0 }); },
        "in-viewport": function (a) { return $.inviewport(a, { threshold: 0 }); },
        /* Maintain BC for couple of versions. */
        "above-the-fold": function (a) { return !$.belowthefold(a, { threshold: 0 }); },
        "right-of-fold": function (a) { return $.rightoffold(a, { threshold: 0 }); },
        "left-of-fold": function (a) { return !$.rightoffold(a, { threshold: 0 }); }
    });

})(window.Zepto || window.jQuery, window, document);