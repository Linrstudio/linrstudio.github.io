(function() {
    // Utility
    function findKeyframeRules(styles, func) {
        var rules = styles.cssRules || styles.rules || [];
        for(var i=0; i<rules.length; i++) {
            var rule = rules[i];
            if(rule.type == CSSRule.IMPORT_RULE) {
                findKeyframeRules(rule.styleSheet, func);
            }else if(rule.type === CSSRule.KEYFRAMES_RULE ||
                    rule.type === CSSRule.MOZ_KEYFRAMES_RULE ||
                    rule.type === CSSRule.WEBKIT_KEYFRAMES_RULE) {
                func(rule, styles, i);
            }
        }
    }
    // Classes
    function KeyframeRule(r) {
        this.original = r;
        this.keyText = r.keyText;
        this.css = {};

        // Extract the CSS as an object
        var rules = r.style.cssText.split(';');

        for(var i=0; i<rules.length; i++) {
            var parts = rules[i].split(':');

            if(parts.length == 2) {
                var key = parts[0].replace(/^\s+|\s+$/g, '');
                var value = parts[1].replace(/^\s+|\s+$/g, '');

                this.css[key] = value;
            }
        }
    };

    function KeyframeAnimation(kf) {
        this.original = kf;
        this.name = kf.name;
        this.keyframes = [];
        this.keytexts = [];
        this.keyframeHash = {};

        this.initKeyframes();
    };

    KeyframeAnimation.prototype.initKeyframes = function() {
        this.keyframes = [];
        this.keytexts = [];
        this.keyframeHash = {};

        var rules = this.original;

        for(var i=0; i<rules.cssRules.length; i++) {
            var rule = new KeyframeRule(rules.cssRules[i]);
            this.keyframes.push(rule);
            this.keytexts.push(rule.keyText);
            this.keyframeHash[rule.keyText] = rule;
        }
    };

    KeyframeAnimation.prototype.getKeyframeTexts = function() {
        return this.keytexts;
    };

    KeyframeAnimation.prototype.getKeyframe = function(text) {
        return this.keyframeHash[text];
    };

    KeyframeAnimation.prototype.setKeyframe = function(text, css) {
        var cssRule = text+" {";
		if(typeof(css) != 'string'){	// modified by xiaogezi
			for(var k in css) {
				cssRule += k + ':' + css[k] + ';';
			}
		}else{
			cssRule += css;
		}
		cssRule += "}";
        // The latest spec says that it should be appendRule, not insertRule.
        // Browsers also vary in the semantics of this, whether or not the new
        // rules are merged in with previous ones at the same keyframe or if they
        // are simply replaced. Need to look into that more.
        // 
        // https://github.com/jlongster/css-animations.js/issues/4
        if('appendRule' in this.original) {
            this.original.appendRule(cssRule);
        }
        else {
            this.original.insertRule(cssRule);
        }

        this.initKeyframes();
        
        // allow for chaining for ease of creation.
        return this;
    };

    KeyframeAnimation.prototype.setKeyframes = function(obj) {
        for(var k in obj) {
            this.setKeyframe(k, obj[k]);
        }
    };

    KeyframeAnimation.prototype.clear = function() {
        for(var i=0; i<this.keyframes.length; i++) {
            this.original.deleteRule(this.keyframes[i].keyText);
        }
    };

    function Animations() {
		//debugger
        this.animations = {};

        var styles = document.styleSheets;
        var anims = this.animations;

        for(var i=0; i<styles.length; i++) {
            try {
                findKeyframeRules(styles[i], function(rule) {
                    anims[rule.name] = new KeyframeAnimation(rule);
                });
            }
            catch(e) {
				//console.log(e);
                // Trying to interrogate a stylesheet from another
                // domain will throw a security error
            }
        }
    }

    Animations.prototype.get = function(name) {
        return this.animations[name];
    };

    Animations.prototype.getDynamicSheet = function() {
        if(!this.dynamicSheet) {
            var style = document.createElement('style');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);
            this.dynamicSheet = style.sheet;
        }

        return this.dynamicSheet;
    };

    Animations.prototype.create = function(name, frames) {
        var styles = this.getDynamicSheet();

        // frames can also be passed as the first parameter
        if(typeof name === 'object') {
            frames = name;
            name = null;
        }

        if(!name) {
            name = 'anim' + Math.floor(Math.random() * 100000);
        }

        // Append a empty animation to the end of the stylesheet
        try {
            var idx = styles.insertRule('@keyframes ' + name + '{}',
                                        styles.cssRules.length);
        }
        catch(e) {
            if(e.name == 'SYNTAX_ERR' || e.name == 'SyntaxError') {
                idx = styles.insertRule('@-webkit-keyframes ' + name + '{}',
                                        styles.cssRules.length);
            }
            else {
                throw e;
            }
        }

        var anim = new KeyframeAnimation(styles.cssRules[idx]);
        this.animations[name] = anim;

        if(frames) {
            anim.setKeyframes(frames);
        }

        return anim;
    };

    Animations.prototype.remove = function(name) {
        var styles = this.getDynamicSheet();
        name = name instanceof KeyframeAnimation ? name.name : name;

        this.animations[name] = null;

        try {
            findKeyframeRules(styles, function(rule, styles, i) {
                if(rule.name == name) {
                    styles.deleteRule(i);
                }
            });
        }
        catch(e) {
            // Trying to interrogate a stylesheet from another
            // domain will throw a security error
        }
    };

    if(typeof define == 'function' && define.amd) {
        define(function() { return new Animations(); });
    }
    else {
        window.CSSAnimations = new Animations();
    }
})();

function FreeTranform(){this.initialize.apply(this, arguments)}
FreeTranform.prototype = {
	initialize: function(drag, opts){
		this.drag = this.$(drag);
		this._x = this._y = 0;
		this._moveDrag = this.bind(this, this.moveDrag);
		this._stopDrag = this.bind(this, this.stopDrag);
		this.setOptions(opts);
		this.handle = this.$(this.opts.handle);
		this.maxContainer = this.$(this.opts.maxContainer);
		this.maxTop = Math.max(this.maxContainer.clientHeight, this.maxContainer.scrollHeight) - this.drag.offsetHeight;
		this.maxLeft = Math.max(this.maxContainer.clientWidth, this.maxContainer.scrollWidth) - this.drag.offsetWidth;
		this.limit = this.opts.limit;
		this.lockX = this.opts.lockX;
		this.lockY = this.opts.lockY;
		this.lock = this.opts.lock;
		this.onStart = this.opts.onStart;
		this.onMove = this.opts.onMove;
		this.onStop = this.opts.onStop;
		//this.handle.style.cursor = 'move';
		this.changeLayout();
		this.addHandler(this.handle, 'mousedown', this.bind(this, this.startDrag))
	},
	camelize: function(str){
		return str.replace(/\-(\w)/ig, 
		function(B, A) { 
			return A.toUpperCase(); 
		}); 
	},
	css: function(node, att) {
		var style = null;
		if(window.getComputedStyle) {
			style = window.getComputedStyle(node, null);
		}else{
			style = node.currentStyle;
		}
		return !att ? style : style[this.camelize(att)];
	},
	changeLayout: function(){
		var xy = this.getXY();
		this.drag.style.transform = 'translate3d(' + xy.x + 'px, ' + xy.y + 'px,0)';
	},
	getXY: function(){
		var matrix3d = this.css(this.drag, 'transform'), mx = 0, my = 0;
		if(matrix3d && matrix3d != 'none'){
			var matrix3ds = matrix3d.replace(/\(|\)| /g, '').split(',');

			if(matrix3ds.length > 6){
				mx = matrix3ds[12],
				my = matrix3ds[13];
			}else{
				mx = matrix3ds[4],
				my = matrix3ds[5];
			}
		}
		return {x: mx, y: my}
	},
	startDrag: function(e){
		var matrix3d = this.css(this.drag, 'transform'), mx = 0, my = 0;
		if(matrix3d){
			var matrix3ds = matrix3d.replace(/\(|\)| /g, '').split(',');

			if(matrix3ds.length > 6){
				mx = matrix3ds[12],
				my = matrix3ds[13];
			}else{
				mx = matrix3ds[4],
				my = matrix3ds[5];
			}
		}
		var xy = this.getXY();
		this._x = e.clientX - xy.x;
		this._y = e.clientY - xy.y;
		this.addHandler(document, 'mousemove', this._moveDrag);
		this.addHandler(document, 'mouseup', this._stopDrag);
		this.handle.setCapture && this.handle.setCapture();
		this.onStart();
		e.preventDefault();
	},
	moveDrag: function(e){
		var iTop = e.clientY - this._y;
		var iLeft = e.clientX - this._x;
		if (this.lock) return;
		this.limit && (iTop < 0 && (iTop = 0), iLeft < 0 && (iLeft = 0), iTop > this.maxTop && (iTop = this.maxTop), iLeft > this.maxLeft && (iLeft = this.maxLeft));
		this.drag.style.transform = 'translate3d(' + (this.lockX ? 0 : iLeft) + 'px, ' + (this.lockY ? 0 : iTop) + 'px,0)';
		this.onMove();
		e.preventDefault();
	},
	stopDrag: function(){
		this.removeHandler(document, 'mousemove', this._moveDrag);
		this.removeHandler(document, 'mouseup', this._stopDrag);
		this.handle.releaseCapture && this.handle.releaseCapture();
		this.onStop();
	},
	setOptions : function(opts){
		this.opts = {
			handle: this.drag, //事件对象
			limit: true, //锁定范围
			lock: false, //锁定位置
			lockX: false, //锁定水平位置
			lockY: false, //锁定垂直位置
			maxContainer: document.documentElement || document.body, //指定限制容器
			onStart: function() {}, //开始时回调函数
			onMove: function() {}, //拖拽时回调函数
			onStop: function() {}  //停止时回调函数
		};
		for (var p in opts) this.opts[p] = opts[p]
	},
	$: function (id){
		return typeof id === 'string' ? document.getElementById(id) : id
	},
	addHandler : function(oElement, sEventType, fnHandler){
		return oElement.addEventListener(sEventType, fnHandler, false);
	},
	removeHandler : function (oElement, sEventType, fnHandler){
		return oElement.removeEventListener(sEventType, fnHandler, false);
	},
	bind : function (object, fnHandler){
		return function(){
			return fnHandler.apply(object, arguments) 
		}
	}
};

(function(doc, win){
	
	var cssPrefix = (function(){
		if(navigator.webkitGetUserMedia){
			return '-webkit-';
		}
		return '';
	})(), aniAttrs = ['duration', 'timing-function', 'fill-mode', 'direction', 'iteration-count'],
	timingFunctions = {
	linear: '0, 0, 1, 1',
	ease: '0.25, 0.1, 0.25, 1',
	'ease-in': '0.42, 0, 1, 1',
	'ease-out': '0, 0, 0.58, 1',
	'ease-in-out': '0.42, 0, 0.58, 1',
	easeInBack: '0.6, -0.28, 0.735, 0.045',
	easeInCirc: '0.6, 0.04, 0.98, 0.335',
	easeInCubic: '0.55, 0.055, 0.675, 0.19',
	easeInExpo: '0.95, 0.05, 0.795, 0.035',
	easeInOutBack: '0.68, -0.55, 0.265, 1.55',
	easeInOutCirc: '0.785, 0.135, 0.15, 0.86',
	easeInOutCubic: '0.645, 0.045, 0.355, 1',
	easeInOutExpo: '1, 0, 0, 1',
	easeInOutQuad: '0.455, 0.03, 0.515, 0.955',
	easeInOutQuart: '0.77, 0, 0.175, 1',
	easeInOutQuint: '0.86, 0, 0.07, 1',
	easeInOutSine: '0.445, 0.05, 0.55, 0.95',
	easeInQuad: '0.55, 0.085, 0.68, 0.53',
	easeInQuart: '0.895, 0.03, 0.685, 0.22',
	easeInQuint: '0.755, 0.05, 0.855, 0.06',
	easeInSine: '0.47, 0, 0.745, 0.715',
	easeOutBack: '0.175, 0.885, 0.32, 1.275',
	easeOutCirc: '0.075, 0.82, 0.165, 1',
	easeOutCubic: '0.215, 0.61, 0.355, 1',
	easeOutExpo: '0.19, 1, 0.22, 1',
	easeOutQuad: '0.25, 0.46, 0.45, 0.94',
	easeOutQuart: '0.165, 0.84, 0.44, 1',
	easeOutQuint: '0.23, 1, 0.32, 1',
	easeOutSine: '0.39, 0.575, 0.565, 1'
};
	function tag(e,l){
		var k = document.createElement(e);
		if(l === null){return k;}
		for(var p in l){
			if(p == "class"){k.className = l[p];}else{if(p == 'style'){for(var s in l[p]){k.style[s] = l[p][s];}}else{if(p==='html'){k.innerHTML = l[p];}else{if(p === 'appendTo'){l[p].appendChild(k);}else{p === 'append' ? k.appendChild(l[p]) : k.setAttribute([p],l[p]);}}}}
		}
		return k;
	}
	function q(s, p){return (p || document).querySelector(s);}
	function qa(s, p){return (p || document).querySelectorAll(s);}
	function addEvent(o, t, fn){o.addEventListener(t, fn, false);}
	function hasClass(o, c){return o.classList.contains(c)}
	function toggleClass(o, c){o.classList.toggle(c)}
	function removeClass(o, c){o.classList.remove(c)}
	function addClass(o, c){o.classList.add(c)}
	function attr(el, n, v){if(v){el.setAttribute(n, v);}else{return el.getAttribute(n);}}
	
	function getCurrentStyle(node, att) {
		var style = null;
		if(window.getComputedStyle) {
			style = window.getComputedStyle(node, null);
		}else{
			style = node.currentStyle;
		}
		return !att ? style : style[camelize(att)];
	}
	
	function playState(el, state){
		if(!state){
			return getCurrentStyle(el, cssPrefix + 'animation-play-state');
		}else{
			el.style.animationPlayState = state;
		}
	}
	
	function findAnimationRules(el, func, emuFn){
		var animName = getCurrentStyle(el, cssPrefix + 'animation-name');
		if(animName != 'none' && animName != ''){
			func(animName, el);
		}else{
			el.children.length && emuFn && emuFn(el);
		}
	}
	function fireClick(el) {
		var event = document.createEvent("HTMLEvents");
		event.initEvent("click",true,false);
		el.dispatchEvent(event);
	}
	
	var storage = {
		getVal : function (n){
			return localStorage[n];
		},
		setVal : function (n,v){
			localStorage[n] = v;
		},
		clear : function () {
			localStorage.clear();
		}
	};
	
	function getToolbarCSS(){
var cssText = '<style>.tgl{display: none;}.tgl, .tgl:after, .tgl:before, .tgl *, .tgl *:after, .tgl *:before, .tgl + .tgl-btn{-webkit-box-sizing: border-box;  -moz-box-sizing: border-box;  box-sizing: border-box;}\
.tgl::-moz-selection, .tgl:after::-moz-selection, .tgl:before::-moz-selection, .tgl *::-moz-selection, .tgl *:after::-moz-selection, .tgl *:before::-moz-selection, .tgl + .tgl-btn::-moz-selection{background: none;}.tgl::selection, .tgl:after::selection, .tgl:before::selection, .tgl *::selection, .tgl *:after::selection, .tgl *:before::selection, .tgl + .tgl-btn::selection{background: none;}\
.tgl + .tgl-btn{outline: 0;  display: block;  width: 5em;  height: 2em;  position: relative;  cursor: pointer;}.tgl + .tgl-btn:after, .tgl + .tgl-btn:before{position: relative;  display: block;  content: "";  width: 50%;  height: 100%;}.tgl + .tgl-btn:after{left: 0;}.tgl + .tgl-btn:before{display: none;}.tgl:checked + .tgl-btn:after{left: 50%;}\
.tgl-skewed + .tgl-btn{overflow:hidden;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transition:all .2s ease;transition:all .2s ease;font-family:sans-serif;background:#888;}\
.tgl-skewed + .tgl-btn:after, .tgl-skewed + .tgl-btn:before{display:inline-block;-webkit-transition:all .2s ease;transition:all .2s ease;width:100%;text-align:center;position:absolute;line-height:2em;font-weight:bold;color:#fff;text-shadow:0 1px 0 rgba(0, 0, 0, 0.4);}\
.tgl-skewed + .tgl-btn:after{left:100%;content:attr(data-tg-on);}\
.tgl-skewed + .tgl-btn:before{left:0;content:attr(data-tg-off);}\
.tgl-skewed + .tgl-btn:active{background:#888}\
.tgl-skewed + .tgl-btn:active:before{left:-10%}\
.tgl-skewed:checked + .tgl-btn{background:#86d993}\
.tgl-skewed:checked + .tgl-btn:before{left:-100%}\
.tgl-skewed:checked + .tgl-btn:after{left:0}\
.tgl-skewed:checked + .tgl-btn:active:after{left:10%}\
.linr-ae-chks{display:inline-block;vertical-align:middle;}\
.linr-ae-chks li{display:inline-block;vertical-align:middle;}\
[data-animation-name]{outline:1px dotted rgba(252,86,86,.8);}\
.linr-ae-toolbar,.linr-ae-setting{position:absolute;z-index:999999999;background:rgba(255,255,255,.9);border:1px solid #D1D1D1;padding:10px;padding-right:35px;white-space:nowrap;}\
.linr-ae-toolbar a{cursor:pointer;}\
.linr-ae-setting{position:fixed;top:0;left:0;}\
.linr-ae-percents{display:inline-block;width:300px;height:45px;margin-left:30px;margin-right:25px;vertical-align:middle;position:relative;cursor:pointer;}\
.linr-ae-percents:after{position:absolute;content:\'\20\';height:2px;border:1px solid #CCC;width:100%;left:0;top:50%;margin-top:-2px;background:purple;}\
.linr-ae-replay,.linr-ae-play-pause,.linr-ae-onion,.linr-ae-dot,.linr-ae-export{display:inline-block;width:45px;vertical-align:middle;text-align:center;line-height:45px;border-radius:45px;background:purple;color:#FFF;overflow:hidden;}\
.linr-ae-hide{display:none;}\
.linr-ae-option:hover{opacity:.7;}\
.linr-ae-option,.linr-ae-option:before,.linr-ae-option:after{content:"";position:absolute;right:10px;bottom:20px;display:block;height:2px;background:#999;line-height:2px;width:20px;}\
.linr-ae-option:before,.linr-ae-option:after{right:0;background:none;height:40px;}\
.linr-ae-option:before{top:-6px;bottom:auto;border-top:2px solid #999;}\
.linr-ae-option:after{bottom:-6px;border-bottom:2px solid #999;}\
.linr-ae-dot{position:absolute;z-index:10;margin-left:-23px;height:100%;}\
.linr-ae-dot[data-active]{background-color:orange;}\
.linr-ae-ani-attr{margin-top:5px;}\
.linr-ae-pop{display:inline-block;border-radius:45px;width:45px;height:45px;overflow:hidden;background-color:orange;}\
.linr-ae-pop input{border:none;background:none;line-height:45px;height:45px;width:100%;text-align:center;color:#FFF;}\
.linr-ae-pop .tgl-btn{height:100%;font-size:12px;}\
.linr-ae-pop .tgl + .tgl-btn{width:45px;}\
.linr-ae-pop .tgl-skewed + .tgl-btn:after,.linr-ae-pop .tgl-skewed + .tgl-btn:before{line-height:45px;font-weight:400;}\
.linr-ae-select{}\
.linr-ae-animation-fill-mode,.linr-ae-animation-timing-function,.linr-ae-animation-direction{overflow:visible;vertical-align:top;}\
.linr-ae-animation-timing-function li{position:relative;}\
.linr-ae-animation-timing-function li i{display:block;content:"";position:absolute;top:0;left:0;width:0;height:100%;background:rgba(255,0,0,.3);transition:all ease .8s;}\
.linr-ae-animation-timing-function li:hover i{width:100%;}\
.linr-ae-animation-direction :checked.tgl-skewed + .tgl-btn{width:50px;margin-left:-2px;}\
.linr-ae-select .linr-ae-input{pointer-events:none;}\
.linr-ae-menu{display:none;position:absolute;border:1px solid #D1D1D1;background:rgba(255,255,255,.9);padding:0 10px;}\
.linr-ae-menu li{cursor:pointer;text-shadow:0 1px 0 rgba(255, 255, 255, 0.4);}\
.linr-ae-select:hover .linr-ae-menu{display:block;}\
.linr-ae-pos-right{position:absolute;right:0;}\
[data-onion]{position:absolute;z-index:99999;}\
.linr-ae-close{display:block;position:absolute;right:2px;top:-8px;width:24px;height:24px;text-align:center;color:#333;font:400 22px/45px Arial;}\
.linr-ae-replay{margin-right:6px;}\
.linr-ae-play-pause{position:static;height:45px;margin:0;background:green;}\
.linr-ae-helper-disabled [data-animation-name]{outline:none;}\
.linr-ae-animation-disabled *{-webkit-animation-name:none !important;animation-name:none !important;}\
.linr-ae-animation-paused *{-webkit-animation-play-state: paused !important;animation-play-state: paused !important;}\
.linr-ae-ele-item{display:block;padding:5px 3px;cursor:pointer;}\
.linr-ae-ele-item:hover{background:#EEE;}\
.linr-ae-ele-item.selected{background:#86d993;}\
.linr-ae-outline{border:2px solid #FF00FF;position:absolute;z-index:999999;pointer-events:none;}\
.linr-ae-frames-from-to,.linr-ae-frames-lt-2{border:1px solid #CCC;background:#EEE;font-size:10px;padding:0 5px;pointer-events:none;}\
</style>';
	return cssText;
	}

	function camelize(str){
		return str.replace(/\-(\w)/ig, 
			function(B, A) { 
			return A.toUpperCase(); 
		}); 
	}
	
	AnimationElements.prototype.setAniAttr = function(el, aniName){
		//debugger
		if(!attr(el, 'data-animation-name')){
			attr(el, 'data-animation-name', aniName);

			var anim = CSSAnimations.get(aniName), 
				cssText = el.style.cssText,
				frameHash = anim.keyframeHash,
				frameHashKeys = Object.keys(anim.keyframeHash).join('|');

				el.setAttribute('data-frames', frameHashKeys);
				if(cssText)attr(el, 'data-style', cssText);
				if(this.animationElements[aniName] instanceof Array){
					this.animationElements[aniName].push(el);
				}else{
					this.animationElements[aniName] = [el];
				}
				var index = this.animationElements[aniName].length - 1;
				aniMouseOver(el, this);
				// 添加到动画窗格
				this.addAnimationList(el.tagName.toLowerCase(), aniName, index, frameHashKeys);
			
		}
	};
	
	AnimationElements.prototype.addAnimationList = function(tagName, aniName, index, keys){
		var awin = document.getElementById('linr_ae_ani_win');
		var aele = document.createElement('a');
			aele.id = 'line_ae_ani_ele_' + aniName + '_' + index;
			aele.className = 'linr-ae-ele-item';
			aele.setAttribute('data-aniname', aniName);
			aele.setAttribute('data-index', index);
			aele.innerHTML = '元素 &lt;' + tagName + ':' + aniName + '&gt; <span class="' + ((keys == '0%|100%') ? 'linr-ae-frames-from-to' : 'linr-ae-frames-lt-2') + '">' + keys + '</span>';
			awin.appendChild(aele);
		
	}
	
	AnimationElements.prototype.eachAni = function(parentNode){
		var self = this, all = (parentNode || document).querySelectorAll((!parentNode ? 'html,body,body ' : '' ) + '*:not(script):not([data-animation-name])');
        var anims = self.animationElements;
        for(var i=0, j=all.length; i<j; ++i) {
			findAnimationRules(all[i], function(animName, el) {
				self.setAniAttr(el, animName);
			});
        }
	}
	
	function AnimationElements(){
		this.animationElements = {};
		this.animationTarget = null;
		this.animationKeyframs = null;
		this.mouseLock = false;
		this.toolbar();
		this.eachAni();
	}
	
	function cssToText(obj){
		if(!obj)return '';
		var css = obj['css'], cssTexts = [];
		if(css){
			for(var p in css){
				cssTexts.push(p + ': ' + css[p]);
			}
			return cssTexts.join(';');
		}
		return '';
	}
	
	function onionTool(target){
		var parentNode = target.parentNode;
		if(!attr(target, 'data-onioned')){
			var frames = attr(target, 'data-frames'),
				arr = frames.split('|'),
				len = arr.length,
				animName = attr(target, 'data-animation-name'),
				anim = CSSAnimations.get(animName),
				rect = target.getBoundingClientRect();
				
				var leftDft = getCurrentStyle(target, 'left'),
					topDft = getCurrentStyle(target, 'top');
				leftPx = leftDft != 'auto' ? leftDft : rect.left + 'px',
				topPx = topDft != 'auto' ? topDft : rect.top + 'px';
				
				arr.forEach(function(el, i){
					var hashes = anim.keyframeHash[el];
					var a = target.cloneNode(true);
					//a.id = '';
					a.setAttribute('data-onion', i);
					a.style.cssText = 'top:' + topPx + ';left:' + leftPx + ';-webkit-animation-name:none;animation-name:none;pointer-events:none;' + cssToText(hashes);
					a.style.opacity = el;
					a.style.opacity += .05;
					parentNode.appendChild(a);
				})
				attr(target, 'data-onioned', 1);
		}else{
			var onions = parentNode.querySelectorAll('[data-onion]');
			for(var i = 0, j = onions.length, cur; i < j; ++ i){
				cur = onions[i];
				cur.parentNode.removeChild(cur);
			}
			target.removeAttribute('data-onioned');
		}
	}
	
	function getAniSelection(fn){
		var aewin = doc.getElementById('linr_ae_ani_win'),
			sele = aewin.querySelector('.selected');
			fn && sele && fn(sele);
		return sele;
	}
	
	function GRT(b) { var a = b.offsetTop; while (b = b.offsetParent) { a += b.offsetTop } return (a) }
	function scrollAniIntoView(node, outline, fn){
		var offset = {top: GRT(node), height: node.offsetHeight},
			scrollTop = doc.documentElement.scrollTop,
			winHeight = win.innerHeight;
		doc.documentElement.scrollTop = offset.top - ((winHeight - offset.height) / 2);
		var offset = node.getBoundingClientRect();
		outline && fn && fn(outline, offset);
	}
	
	function fillAnimationParam(node){
		var framesPanel = document.getElementById('linr_ae_frames'),
			frameHash = attr(node, 'data-frame-hash'),
			keyframeName = attr(node, 'data-animation-name');
			
		if(self.animationTarget != node){
			self.animationTarget = node;
			win.AnimationElements.animationKeyframs = keyframeName;
			aniAttrs.forEach(function(cur, prefix, eo, ev){
				prefix = 'animation-';
				eo = document.querySelector('#linr_ae-' + prefix + cur);
				if(eo){
					ev = getCurrentStyle(self.animationTarget, cssPrefix + prefix + cur);//self.animationTarget.getAttribute('data-' + prefix + cur);
					if(cur != 'timing-function'){
						if(cur != 'iteration-count'){
							eo.value = ev;
						}else{
							eo.checked = ev == 1;
						}
						
					}else{
						var inFns = false;
						for(var p in timingFunctions){
							if(ev == 'cubic-bezier(' + timingFunctions[p] + ')'){
								eo.value = p;
								inFns = true;
								break;
							}
						}
						if(!inFns){
							eo.value = ev;
						}
					}
					q('#linr_ae_editable').checked = self.animationTarget.parentNode.contentEditable == 'true';
				}
			})
			document.getElementById('linr_ae_play_pause').innerHTML = (playState(node) != 'paused') ? '暂停' : '播放';

		var frameskeys = attr(node, 'data-frames').split('|'), frameDots = [];
			frameskeys.forEach(function(el, i){
				frameDots.push('<a class="linr-ae-dot" title="' + el + '" rel="' + i + '" style="left:' + el.split(',')[0] + ';"' + (frameHash == i ? ' data-active="1"' : '') + '>' + el.replace(/%/g, '') + '</a>');
			})
			framesPanel.innerHTML = frameDots.join('\n');
		}
	}
	
	function aniMouseOver(node, self){
		var toolbar = self.tool;
		node.addEventListener('mouseover', function(e){
			if(!getAniSelection()){
				
				var toolbarRect = toolbar.getBoundingClientRect(),
					toolbarHeight = toolbarRect.height;
				var rect = this.getBoundingClientRect(),
					winWidth = window.innerWidth,
					scrollTop = document.documentElement.scrollTop,
					toolbarUpTop = scrollTop + rect.top - toolbarHeight,
					toolbarBottomTop = scrollTop + rect.top + rect.height;
				
				fillAnimationParam(this);
				toolbar.style.cssText += 'display:block;position:absolute;top:' + (toolbarUpTop > 0 ? toolbarUpTop : toolbarBottomTop) + 'px;left:' + (rect.left > 0 ? (rect.left < winWidth ? rect.left : winWidth - toolbarRect.width) : 0) + 'px';
				e.preventDefault();
			}
		}, !1);
	}
	
	AnimationElements.prototype.replay = function(){
		this.close();
		var target = this.animationTarget;
		if(target){
			var oldAnimationName = getCurrentStyle(target, cssPrefix + 'animation-name'),
				cssText = attr(target, 'style');
			target.style.animationName = 'none';
			setTimeout(function(){target.style.animationName = oldAnimationName;!cssText ? target.removeAttribute('style') : (target.style.cssText = cssText);}, 0);
		}
	}
	AnimationElements.prototype.close = function(){
		if(!getAniSelection())
			this.tool.style.display = 'none';
	}
	AnimationElements.prototype.select = function(el){
		window.console && console.select && console.select(el);
	}
	AnimationElements.prototype.css = function(css){
		var s = [];
		for(var p in css){
			s.push( p + ': ' + css[p]);
		}
		return s.join(';');
	}
	AnimationElements.prototype.exportFrames = function(el){
		var self = this, frames = attr(el, 'data-frames'), css = [], text = [], aniName = attr(el, 'data-animation-name');
		if(frames){
			text.push('@keyframes ' + aniName + '{');
			var arr = frames.split('|');
			
			var anim = CSSAnimations.get(aniName);
			arr.forEach(function(cur, att){
				att = attr(el, 'data-frame-' + cur.replace('%', ''));
				css.push(cur + '{' + (att ? att : self.css(anim.keyframeHash[cur].css)) + '}');
			})
			text.push('\t' + css.join('\n\t'));
			text.push('}');
			
			return text.join('\n');
		}
		return '';
	}
	AnimationElements.prototype.toolbar = function(name) {
		var self = this;
        var toolbar = document.getElementById('linr_ae_toolbar');
		if(!toolbar){
			try{NodeList.prototype.forEach = Array.prototype.forEach;}catch(e){}
			toolbar = document.createElement('div');
			toolbar.id = 'linr_ae_toolbar';
			toolbar.className = 'linr-ae-toolbar';
			toolbar.style.cssText = 'display:none';
			
			var lbls = [];
			aniAttrs.forEach(function(C, P, A){
				P = 'animation-';
				A = P + C;
				var input = '';
				switch(C){
					case 'timing-function':
						var fns = [], curFn;
						for(var p in timingFunctions){
							curFn = timingFunctions[p];
							fns.push('<li data-fn="' + curFn + '"><i style="transition-timing-function:' + 'cubic-bezier(' + curFn + ')"></i>' + p + '</li>');
						}
						input = '<div class="linr-ae-select" id="linr_ae_pop-' + A + '"><input type="text" class="linr-ae-input" value="" id="linr_ae-' + A + '"><ul class="linr-ae-menu" data-att="' + A + '">' + fns.join('\n') + '</ul></div>';
					break;
					case 'fill-mode':
						input = '<div class="linr-ae-select" id="linr_ae_pop-' + A + '"><input type="text" class="linr-ae-input" value="" id="linr_ae-' + A + '"><ul class="linr-ae-menu" title="' + A + '" data-att="' + A + '"><li>none</li><li title="结束后保持动画结束时的状态，但当animation-direction为0，则动画不执行，持续保持动画开始时的状态">forwards</li><li title="结束后返回动画开始时的状态">backwards</li><li title="结束后可遵循forwards和backwards两个规则">both</li></ul></div>';
					break;
					case 'direction':
						input = '<div class="linr-ae-select" id="linr_ae_pop-' + A + '"><input type="text" class="linr-ae-input" value="" id="linr_ae-' + A + '"><ul class="linr-ae-menu" title="' + A + '" data-att="' + A + '"><li>normal</li><li title="动画反向运行">reverse</li><li title="循环正反方向交替 奇数为正常，偶数为反向">alternate</li><li title="动画从反向开始，交替">alternate-reverse</li></ul></div>';
					break;
					case 'iteration-count':
						input = '<input type="checkbox" class="linr-ae-input tgl tgl-skewed" value="" id="linr_ae-' + A + '"><label class="tgl-btn" for="linr_ae-' + A + '" data-tg-on="1" data-tg-off="infinite" title="' + A + '"></label>';
					break;
					default:
						input = '<input type="text" class="linr-ae-input" value="" id="linr_ae-' + A + '" title="' + A + '">';
					break;
				}
				
				lbls.push('<li class="linr-ae-pop linr-ae-' + A + '">' + input + '</li>');
			})
			lbls.push('<li class="linr-ae-pop linr-ae-editable"><input type="checkbox" class="linr-ae-input tgl tgl-skewed" value="" id="linr_ae_editable"><label class="tgl-btn" for="linr_ae_editable" data-tg-on="预览" data-tg-off="编辑"></label></li>');
			
			//lbls.push('<li class="linr-ae-pop linr-ae-transform"><input type="checkbox" class="linr-ae-input tgl tgl-skewed" value="" id="linr_ae_transform"><label class="tgl-btn" for="linr_ae_transform" data-tg-on="预览" data-tg-off="定位"></label></li>');
			
			toolbar.innerHTML = getToolbarCSS() + '<a class="linr-ae-replay" rel="replay" id="linr_ae_replay">重播</a><a class="linr-ae-play-pause" rel="pause" id="linr_ae_play_pause">暂停</a><span class="linr-ae-percents" id="linr_ae_frames"></span><a class="linr-ae-onion" rel="onion" id="linr_ae_onion">洋葱皮</a>\
			<a class="linr-ae-export linr-ae-hide" rel="export" id="linr_ae_export">导出</a><a class="linr-ae-close" rel="close">&times;</a>\
			<a class="linr-ae-option" id="linr_ae_more" title="更多设置"></a><div class="linr-ae-ani-attr linr-ae-hide" id="linr_ae_ani_attr"><ul>' + lbls.join('\n') + '</ul></div>';
			
			document.body.appendChild(toolbar);
			
			var replay = toolbar.querySelector('#linr_ae_replay'),
				pause = toolbar.querySelector('#linr_ae_play_pause');
			
			var setting = document.createElement('div');
				setting.id = 'linr_ae_setting';
				setting.className = 'linr-ae-setting';
				setting.innerHTML = '<ul class="linr-ae-chks" id="linr_ae_chks"><li><input class="tgl tgl-skewed" id="helper_chk" type="checkbox" checked value="linr-ae-helper-disabled"><label class="tgl-btn" for="helper_chk" data-tg-on="样式辅助" data-tg-off="样式辅助"></label></li>\
				<li><input class="tgl tgl-skewed" id="disani_chk" type="checkbox" value="linr-ae-animation-disabled" checked><label class="tgl-btn" for="disani_chk" data-tg-on="禁用动画" data-tg-off="开启动画"></label></li>\
				<li><input class="tgl tgl-skewed" id="pauseani_chk" type="checkbox" value="linr-ae-animation-paused"><label class="tgl-btn" for="pauseani_chk" data-tg-on="继续动画" data-tg-off="暂停动画"></label></li>\
				</ul><div id="linr_ae_ani_win"></div><div class="linr-ae-outline" id="linr_ae_ani_outline" style="display:none;"></div>';
				document.body.appendChild(setting);
				
			toolbar.addEventListener('click', function(e){
				var cur = e.target, rel = cur.rel, target = self.animationTarget, cssText = attr(target, 'style'), oldCssText = attr(target, 'data-style'), curFrameHash = attr(target,'data-frame-hash'), oldAnimationName = getCurrentStyle(target, cssPrefix + 'animation-name');
				if(rel){
					if(rel == 'pause'){
						playState(target) != 'paused' ? (playState(target, 'paused'), cur.innerHTML = '播放') : (playState(target, 'running'), cur.innerHTML = '暂停');
					}else if(rel == 'replay'){
						self.replay();
					}else if(rel == 'close'){
						self.close();
					}else if(rel == 'onion'){
						onionTool(target);
						self.close();
					}else if(rel == 'export'){
						var css = self.exportFrames(target);
						window.clipboardData && clipboardData.setData('text', css);
					}else{
						var anim = CSSAnimations.get(attr(target, 'data-animation-name'));
						var keyframes = anim.keyframes;
						var keyframe = keyframes[rel], cssTexts = [];
							if(keyframe){
								var css = keyframe.css;
								target.removeAttribute('style');
								oldCssText && attr(target, 'style', oldCssText);
								var dots = document.querySelectorAll('.linr-ae-dot[data-active="1"]');
								for(var i = 0, j = dots.length; i < j; ++ i){
									dots[i].removeAttribute('data-active');
								}
								if(!curFrameHash || (typeof(curFrameHash) == 'string' && curFrameHash != rel)){
									target.style.cssText += '-webkit-animation-name:none;animation-name:none;' + self.css(css);
									attr(target, 'data-frame-hash', rel);
									attr(cur, 'data-active', 1);
									removeClass(q('#linr_ae_export'), 'linr-ae-hide');
									self.select(target);
								}else{
									target.removeAttribute('data-frame-hash');
									addClass(q('#linr_ae_export'), 'linr-ae-hide');
								}
							}
						var oDrag = new FreeTranform(self.animationTarget, {handle:self.animationTarget, limit:false});
					}
				}
				
			}, !1);
			
			document.addEventListener('DOMAttrModified', function(e) {
				//debugger;
				var el = e.target,
					ex = 'data-animation-name,data-frames,data-active,data-frame-hash,style,data-animation-duration,data-animation-timing-function,data-animation-fill-mode,data-animation-direction,data-animation-iteration-count'.split(','),
					cssText;
				if (
						(e.attrName == 'style' && (cssText = el.style.cssText) &&
							(cssText.indexOf('animation-name: none') == -1 && cssText.indexOf('animation: none') == -1) && 
							(cssText.indexOf('animation-name:') > -1 || cssText.indexOf('animation:') > -1)
						) || (ex.indexOf(e.attrName) == -1 && el.className.indexOf('linr-ae') == -1 && e.attrName.indexOf('data-frame') == -1)
				){
					//console.log(el);
					findAnimationRules(e.target, function(a, b){
						if(!attr(b, 'data-animation-name')){
							self.setAniAttr(b, a);
						}
					},
					function(){
						self.eachAni(el);
					});
				}else{
					// todo
					var curFrame = q('.linr-ae-percents [data-active]');
					if(curFrame && e.attrName == 'style' && self.animationTarget == el){
						cssText = cssText.replace(/(-webkit-)?animation-name: none;/gi, '');
						attr(self.animationTarget, 'data-frame-' + curFrame.title.replace('%', ''), cssText);
						var anim = CSSAnimations.get(win.AnimationElements.animationKeyframs);
						//var rule = anim.getKeyframe('100%');
						//http://blogs.msdn.com/b/msdn_answers/archive/2013/11/04/part-i-using-javascript-to-set-keyframes-in-css-animations-windows-store-apps-ie.aspx
							anim.setKeyframe(curFrame.title, cssText);
					}
				}
			}, !1);
			
			var aecfgs = document.getElementById('linr_ae_chks');
			aecfgs.addEventListener('click', function(e){
				
				var el = e.target, val;
					if(val = el.value){
						switch(val){
							case 'linr-ae-helper-disabled':
							case 'linr-ae-animation-disabled':
							case 'linr-ae-animation-paused':
								document.documentElement.classList.toggle(val);
							break;
						};
						var chks = setting.querySelectorAll('#helper_chk'), arr = [];
						chks.forEach(function(eo){
							arr.push('#' + eo.id + ':' + eo.checked);
						})
						storage.setVal('linr-ae-setting', arr.join(','));
					}
			}, false);
			var aewin = document.getElementById('linr_ae_ani_win');
			aewin.addEventListener('click', function(e){
				var eo = e.target, ainame = eo.getAttribute('data-aniname'), index = eo.getAttribute('data-index');
				if(ainame){
					var tar = win.AnimationElements.animationElements[ainame][index], offset = setting.getBoundingClientRect();
					tar && (tar != win.AnimationElements.animationTarget ? (
						getAniSelection(function(o){removeClass(o, 'selected')}),
						addClass(eo, 'selected'),
						win.AnimationElements.animationTarget = tar,
						fillAnimationParam(tar),
						toolbar.style.cssText = 'position:fixed;left:' + (offset.left + offset.width)  + 'px;top:' + (offset.top ) + 'px; display: block;',
						removeClass(q('#linr_ae_ani_attr', toolbar), 'linr-ae-hide')
					) : (eo.classList.remove('selected'), win.AnimationElements.animationTarget = null)
					)
				}
			}, false)
			aewin.addEventListener('mouseover', function(e){
				var eo = e.target, ainame = eo.getAttribute('data-aniname'), index = eo.getAttribute('data-index');
				if(ainame){
					var outline = document.getElementById('linr_ae_ani_outline');
					var tar = win.AnimationElements.animationElements[ainame][index];
					tar && (
						scrollAniIntoView(tar, outline, function(oele, offset){
							outline.style.cssText = 'left:' + (offset.left - 2) + 'px;top:' + (offset.top - 2) + 'px;width:' + offset.width + 'px;height:' + offset.height + 'px;'
						})
					)
				}
			}, false)
			
			aewin.addEventListener('mouseout', function(e){
				var outline = document.getElementById('linr_ae_ani_outline');
				if(outline){
					outline.style.cssText = 'display:none';
				}
			}, false)
			
			var aniAttrOpt = qa('#linr_ae-animation-duration, #linr_ae-animation-iteration-count', toolbar);
				aniAttrOpt.forEach(function(cur){
					cur.addEventListener('change', function(e){
						var el = e.target, id = el.id, att = id.replace('linr_ae-', '');
							self.animationTarget.style[camelize(att)] = (att == 'animation-duration' ? el.value : (el.checked ? 1 : 'infinite'));
					},!1);
				})
			function bindMenu(){
				var menus = qa('.linr-ae-menu', toolbar);
					for(var i = 0, j = menus.length, cur; i < j; ++ i){
						cur = menus[i];
						
						cur.addEventListener('click', function(e){
							var el = e.target, val = el.tagName.toLowerCase() != 'i' ? el.textContent : el.parentNode.textContent, fn, att = attr(this, 'data-att'), input = toolbar.querySelector('#linr_ae-' + att);
							if(att == 'animation-timing-function'){
								if(fn = attr(el, 'data-fn')){
									self.animationTarget.style[att] = 'cubic-bezier(' + fn + ')';
								}
							}else{
								self.animationTarget.style[att] = val;
							}
							if(input){
								input.value = val;
							}
							setTimeout(function(){
								fireClick(replay);
							}, 50);
							
						},!1);
					}	
			}
			bindMenu();
			q('#linr_ae_editable', toolbar).addEventListener('change', function(e){
				self.animationTarget.parentNode.contentEditable = this.checked;
			}, !1);
			
			/* q('#linr_ae_transform', toolbar).addEventListener('change', function(e){
				var oDrag = new FreeTranform(self.animationTarget, {handle:self.animationTarget, limit:false});
				oDrag.lock = !this.checked;
			}, !1); */
			
			addEvent(q('#linr_ae_more', toolbar), 'click', function(e){
				toggleClass(q('#linr_ae_ani_attr', toolbar), 'linr-ae-hide');
				e.preventDefault();
			});
			function initSetting(){
				var opt = storage.getVal('linr-ae-setting');
				if(opt){
					opt.split(',').forEach(function(eo, str, bl, tmp){
						tmp = eo.split(':');
						str = tmp[0];
						bl = tmp[1];
						bl2 = bl == 'true';
						q(str).checked = bl == 'true';
						bl2 && document.documentElement.classList.toggle(q(str).value);
					})
				}
			}
			initSetting();
			this.tool = toolbar;
			document.execCommand("2D-Position", false, true);
		}
    };
	
	if(typeof define == 'function' && define.amd) {
        define(function() { return new AnimationElements(); });
    }
    else {
        window.AnimationElements = new AnimationElements();
    }

})(document, window)

//javascript:(function(){var s = document.createElement("script");s.charset="utf-8";s.type = "text/javascript"; s.src = "http://xiaogezi.cn/app/bookmarklet/ani.js"; document.body.insertBefore(s, document.body.firstChild);})()