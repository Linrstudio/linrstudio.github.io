function LinrXCode(n, t) { 
  for (var r = 0, u, i = 0; i < n.length; i++){u = n.charCodeAt(i),r += u & 255,r += u >> 8 & 255;};
  return r % t
};
function LinrGetToken(n) {
  var r = localStorage['thumbnailKeys']; var i = JSON.parse(r.substr(2)); var u = LinrXCode(n, i.thumbnailKeys.length); return i.thumbnailKeys[u];
}; 
function LinrPadLeft(str) { 
  var pad = '00'; return pad.substring(0, pad.length - str.length) + str; 
};
function LinrRenderAll(id) {
  var srcs = [];
  var $eo = $('#' + id);
  var w = $eo.width(), 
      h = $eo.height();
  var el = document.createElement('div');
      el.id = 'LinrAppSoClBlinks';
  for (var i = 0; i < 25; ++i) {
    var index = LinrPadLeft(i + ''),
        token = LinrGetToken('http://www.so.cl/Fusion/Public/Blink/BlinkFile(\'' + id + '\',\'preview-' + index + '.jpg\')'),
        img = new Image;
        img.src = 'http://cdn3.so.cl/handlers/thumbnail?h=' + h + '&w='+ w + '&url=http%3A%2F%2Fwww.so.cl%2FFusion%2FPublic%2FBlink%2FBlinkFile(\'' + id + '\'%2C\'preview-' + index + '.jpg\')&key=' + token;
        el.appendChild(img);
        srcs.push(h + '|' + w + '|' + index + '|' + token);
  };
  document.body.appendChild(el);
  return srcs;
};
var title = document.querySelector('.stacks-tile.post-core.post-tile.posttype-moment'); 
if (title) {
  var id = title.dataset.id;
  if（id){
    var srcs = LinrRenderAll(id);
    console.log('srcs', srcs);
    if(srcs.length){
      location.href='linrappx://slideshow/' + srcs.join('`');
    }
  }
};
