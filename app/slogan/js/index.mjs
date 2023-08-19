// import * as Font from '../Woffs/FZXiJinLJW.woff.json' assert {type: 'json'};
import {
    insertFont
} from './utils.mjs';

const LS_KEY = 'linrslogan/msg';
const editor = document.getElementById('editor');

window.addEventListener('load', function () {
    // insertFont(Font.default.value);
}, false);


const fontFamilySelect = document.getElementById('fontFamilySelect');
fontFamilySelect.addEventListener('change', function() {
    const me = this;
    const val = this.value;
    if (val === '') return;
    const loaded = this.dataset[val];
    (async (ff, loaded) => {
      if (!loaded) {
        const font = await import(`../Woffs/${ff}.woff.json`, {
          assert: { type: 'json' }
        });
        insertFont(font.default.value);
        me.dataset[val] = 'loaded';
      }
    })(this.value, loaded);
});

const fontSizeRange = document.getElementById('fontSizeRange');

fontSizeRange.addEventListener('change', function(){
    document.body.style.setProperty('--font-size', `${this.value}px`);
});


const editorBgImg = document.getElementById('editorBgImg');

editorBgImg.addEventListener('change', function(e){
   const [file] = this.files;
  if (file) {
    editor.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
  }
});


editor.addEventListener('input', function(e) {
    localStorage.setItem(LS_KEY, this.innerHTML);
});

function init() {
    const msg = localStorage.getItem(LS_KEY);
    if (msg) {
        editor.innerHTML = msg;
    }
}

init();
