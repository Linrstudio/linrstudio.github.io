import * as Font from '../Woffs/FZXiJinLJW.woff.json' assert {type: 'json'};
import {
    insertFont
} from './utils.mjs';

window.addEventListener('load', function () {
    insertFont(Font.default.value);
}, false);


const fontSizeRange = document.getElementById('fontSizeRange');

fontSizeRange.addEventListener('change', function(){
    document.body.style.setProperty('--font-size', `${this.value}px`);
});


const editorBgImg = document.getElementById('editorBgImg');

editorBgImg.addEventListener('change', function(e){
   const [file] = this.files;
  if (file) {
    document.body.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
  }
});
