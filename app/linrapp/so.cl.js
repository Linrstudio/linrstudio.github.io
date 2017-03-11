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
var el = document.createElement('div');
for (var i = 0; i < 25; ++i) {
var $eo = $('#' + id);
var w = $eo.width(), h = $eo.height();
var img = new Image;
img.src = 'http://cdn3.so.cl/handlers/thumbnail?h=' + h + '&w='+ w + '&url=http%3A%2F%2Fwww.so.cl%2FFusion%2FPublic%2FBlink%2FBlinkFile(\'' + id + '\'%2C\'preview-' + LinrPadLeft(i + '') + '.jpg\')&key=' + LinrGetToken('http://www.so.cl/Fusion/Public/Blink/BlinkFile(\'' + id + '\',\'preview-' + LinrPadLeft(i + '') + '.jpg\')');
el.appendChild(img); 
document.body.appendChild(el);};
};
var title = document.querySelector('.stacks-tile.post-core.post-tile.posttype-moment'); 
if (title) {
  var id = title.dataset.id;
  LinrRenderAll(id);
};
