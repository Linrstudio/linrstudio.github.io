const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
          ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  };
  function getMatrix(el, key){
      return new WebKitCSSMatrix(window.getComputedStyle(el)['transform']);
  }
  function getStyle(el, key){
      return window.getComputedStyle(el)[key];
  }
  function getXPathForElement(element) {
      const idx = (sib, name) => sib 
          ? idx(sib.previousElementSibling, name||sib.localName) + (sib.localName == name)
          : 1;
      const segs = elm => !elm || elm.nodeType !== 1 
          ? ['']
          : elm.id && document.querySelector(`#${elm.id}`) === elm
              ? [`id("${elm.id}")`]
              : [...segs(elm.parentNode), `${elm.localName.toLowerCase()}[${idx(elm)}]`];
      return segs(element).join('/');
  }
  
  function getElementByXPath(path) { 
      return (new XPathEvaluator()) 
          .evaluate(path, document.documentElement, null, 
                          XPathResult.FIRST_ORDERED_NODE_TYPE, null) 
          .singleNodeValue; 
  } 
  let mengs = {
      selector: '.draggable',
      activeElement: null,
      dragMoveListener (e) {
          let eo = e.target,
              {x, y} = eo.dataset;
  
              x = parseInt(x, 10) || 0, 
              y = parseInt(y, 10) || 0;
  
              x += e.dx;
              y += e.dy;
  
          eo.style.cssText += 'left:' + x + 'px;top: ' + y + 'px;';
  
          eo.dataset.x = x;
          eo.dataset.y = y;
  
          this.store();
      },
      store () {
          let nodes = document.querySelectorAll(this.selector);
          [].map.call(nodes, (node, i) => {
              let key = getXPathForElement(node),
                  val = Object.assign({
                      style: node.style.cssText,
                  }, node.dataset);
              if(val) {
                  localStorage.setItem(key, JSON.stringify(val));
              }
          });
      },
      restore () {
          let nodes = document.querySelectorAll(this.selector);
          [].map.call(nodes, (node, i) => {
              let key = getXPathForElement(node),
                  val = localStorage.getItem(key);
              if(val) {
                  let obj = JSON.parse(val);
  
                  node.style.cssText = obj.style;
                  delete obj.style;
  
                  for(var p in obj) {
                      node.dataset[p] = obj[p];
                  }
              }
          });
      },
      lib () {
          let css = document.createElement('style');
              css.innerHTML = `.mengs-opacity {opacity:0!important;}.mengs-active { outline: 1px solid rgba(158, 9, 234, 5);} [data-invert="true"]{filter:invert(100);}`;
              document.head.appendChild(css);
          let js = document.createElement('script');
              document.body.appendChild(js);
              js.onload = this.initLib.bind(this);
              js.src = 'http://code.interactjs.io/v1.3.3/interact.min.js';
      },
      initLib () {
          if(window.interact) {
              window.interactInstance = interact(this.selector).draggable({
                  inertia: true,
                  autoScroll: true,
                  onmove: this.dragMoveListener.bind(this),
                  onend: function (e) {
                      let eo = e.target;
                      if(!elementIsVisibleInViewport(eo, true)) {
                          eo.style.cssText += 'left:0;top:0;'
                          eo.dataset.x = 0;
                          eo.dataset.y = 0;
                      }
                  }
              });
          }
          this.initEvent();
          this.restore();
      },
      tune (option) {
          // console.log('option', option);
  
          let {altKey, shiftKey, node, wheelDeltaY, cw, rotateStep, scaleStep, event} = option;
          let {wheel, ratateVal, scaleVal} = node.dataset;
  
          ratateVal = ratateVal ? parseInt(ratateVal, 10) : 1;
          scaleVal = scaleVal ? parseFloat(scaleVal) : 1;
  
          rotateStep = rotateStep || 45;
          scaleStep = scaleStep || .1;
  
          if(wheel) {
              if(event) {
                event.preventDefault();
              }
              let dir = cw ? 1 : -1;
              let src = node.style.transform + ' ';
              if(!altKey) {
  
                  node.style.transform = src.replace(/rotate\([0-9\-]+deg\)/g, ' ') + `${wheel}(${ratateVal}deg)`;
  
                  let delta = shiftKey ? rotateStep : 1;
                  ratateVal += delta * dir;
                  node.dataset.ratateVal = ratateVal;
  
              } else {
  
                  if(scaleVal < 0) {
                      scaleVal = 1;
                  }
                  node.style.transform = src.replace(/scale\([0-9\-\.]+\)/g, ' ') + `scale(${scaleVal})`;
                  scaleVal += dir * scaleStep;
                  node.dataset.scaleVal = scaleVal;
              }
          }
      },
      getStyleVal (node, key) {
          return parseInt(getStyle(node, key), 10);
      },
      initEvent() {
          let me = this;
          document.addEventListener('mousewheel', e => {
              me.tune({
                  node: e.target,
                  altKey: e.altKey,
                  shiftKey: e.shiftKey,
                  ctrlKey: e.ctrlKey,
                  wheelDeltaY: e.wheelDeltaY,
                  cw: e.wheelDeltaY < 0,
                  event: e
              })
          })
          document.addEventListener('click', e => {
              let cssClass = 'mengs-active';
              let currentElement = document.querySelector('.' + cssClass);
              currentElement && currentElement.classList.remove(cssClass)
  
              let eo = e.target;
                  eo.classList.add(cssClass);
                  me.activeElement = eo;
              let ctrlKey = e.ctrlKey;
              let {wheel, ratateVal, scaleVal} = eo.dataset;
              if(ctrlKey && wheel) {
                  eo.classList.add('lock');
              }
          })
          document.addEventListener('keydown', e => {
              e.preventDefault();
              console.log(e.keyCode, e.shiftKey);
              let keyCode = e.keyCode;
              let {ctrlKey, altKey} = e;
              let delta = ctrlKey ? 1 : 10;
              let val = 0;
              let currentElement = me.activeElement;
              switch(keyCode) {
                  case 73:    // I
                      currentElement.dataset.invert = currentElement.dataset.invert !== 'true';
                  break;
  
                  case 219: // [
                  case 221: //]
                      me.tune({
                          node: currentElement,
                          altKey: false,
                          shiftKey: false,
                          ctrlKey: false,
                          cw: keyCode != 219
                      });
  
                  case 188: // <
                  case 190: //>
                      let key = altKey ? 'height' : 'width';
                      val = me.getStyleVal(currentElement, key) + delta * (keyCode == 188 ? -1 : 1);
                      currentElement.style[key] = val + 'px';
                      currentElement.dataset[key] = val;
                  break;
  
                  case 37: // <--
                  case 39: //-->
                      val = me.getStyleVal(currentElement, 'left') + delta * (keyCode == 37 ? -1 : 1);
                      currentElement.style.left = val + 'px';
                      currentElement.dataset.x = val;
                  break;
  
                  case 38: // ^--
                  case 40: //--v
                      val = me.getStyleVal(currentElement, 'top') + delta * (keyCode == 38 ? -1 : 1);
                      currentElement.style.top = val + 'px';
                      currentElement.dataset.y = val;
                  break;
  
                  case 189: // -
                  case 187: // +
  
                      me.tune({
                          node: currentElement,
                          altKey: true,
                          shiftKey: false,
                          ctrlKey: false,
                          cw: keyCode != 189,
                          scaleStep: .01
                      })
                      
                  break;
  
                  case 82: // R
                      currentElement.style.cssText = 'left:x;top:x;width:x;';
                      currentElement.dataset.x = 0;
                      currentElement.dataset.y = 0;
                  break;
                  
                  case 72: // H
                    let apacityClass = 'mengs-opacity';
                    let cls = currentElement.classList;
                    cls.contains(apacityClass) ? cls.remove(apacityClass) : cls.add(apacityClass);
                  break;
              }
              me.store();
          })
      },
      init(selector) {
          this.selector = selector;
          this.lib(selector);
      }
  };
  //mengs.init('.she-lights2 i');
  //mengs.init('.stars-xs i');
  //mengs.init('.gift i');