import * as Font from '../Woffs/FZXiJinLJW.woff.json' assert {type: 'json'};
import {
    insertFont
} from './utils.mjs';

window.addEventListener('load', function () {
alert(navigator.userAgent);
alert(Font.default.fontName);
    insertFont(Font.default.value);
}, false);


const fontSizeRange = document.getElementById('fontSizeRange');

fontSizeRange.addEventListener('change', function(){
    alert(this.value);
    document.body.style.setProperty('--font-size', `${this.value}px`);
});


const editorBgImg = document.getElementById('editorBgImg');

editorBgImg.addEventListener('change', function(e){
alert(this.value);
   const [file] = this.files;
   alert(file);
  if (file) {
    document.body.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
  }
});
