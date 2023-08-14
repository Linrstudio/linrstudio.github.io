import * as Font from '../Woffs/FZXiJinLJW.woff.json' assert {type: 'json'};
import {
    insertFont
} from './utils.mjs';

const LS_KEY = 'linrslogan/msg';

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

const editor = document.getElementById('editor');
editor.addEventListener('input', function(e) {
    localStorage.setItem(LS_KEY, this.textContent);
});

function init() {
    const msg = localStorage.getItem(LS_KEY);
    if (msg) {
        editor.textContent = msg;
    }
}

init();
