import {initialBoard,movesFor,legalMoves,applyMove,inCheck,gameStatus,pieceLabel} from './engine.js';
const $=id=>document.getElementById(id), KEY='chuhe-save-v1';
const AI_PAUSE=1000, MOVE_DURATION=650, PATH_HOLD=2000, PATH_FADE=400;
let board=initialBoard(),turn='red',mode='ai',history=[],selected=null,choices=[],thinking=false,result=null,worker=null,epoch=0,sound=false,audio=null,pendingMode=null,aiTimer=null,motionTimer=null,motion=null,trail=null,trailTimer=null,trailExpires=0;
const other=s=>s==='red'?'black':'red',sideName=s=>s==='red'?'红方':'黑方';
function boardKey(b,s){return JSON.stringify(b)+s;}
function svgBoard(){let lines='';for(let r=0;r<10;r++) lines+=`<path d="M 50 ${50+r*100} H 850"/>`;for(let c=0;c<9;c++){const x=50+c*100;lines+=c===0||c===8?`<path d="M ${x} 50 V 950"/>`:`<path d="M ${x} 50 V 450 M ${x} 550 V 950"/>`;}return `<svg viewBox="0 0 900 1000" aria-hidden="true"><g fill="none" stroke="#856d48" stroke-width="2">${lines}<path d="M350 50 L550 250 M550 50 L350 250 M350 750 L550 950 M550 750 L350 950"/></g><g fill="#967b50" font-family="serif" font-size="40" text-anchor="middle"><text x="250" y="515">楚 河</text><text x="650" y="515">汉 界</text></g></svg>`;}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({version:1,mode,history:history.map(h=>h.move)}));$('save-state').textContent='已自动保存';}catch{$('save-state').textContent='存储不可用';}}
function restore(){try{const s=JSON.parse(localStorage.getItem(KEY));if(!s||s.version!==1||!['ai','local'].includes(s.mode)||!Array.isArray(s.history)||s.history.length>1000)return;let b=initialBoard(),t='red',hs=[];for(const m of s.history){if(!m||!legalMoves(b,t).some(l=>JSON.stringify(l)===JSON.stringify(m)))throw Error('Invalid save');hs.push({board:b,turn:t,move:m});b=applyMove(b,m);t=other(t);}board=b;turn=t;history=hs;mode=s.mode;}catch{board=initialBoard();turn='red';history=[];}}
function updateResult(){result=gameStatus(board,turn);if(result.over)return;const k=boardKey(board,turn);let count=1;for(const h of history)if(boardKey(h.board,h.turn)===k)count++;let quiet=0;for(let i=history.length-1;i>=0;i--){const h=history[i];if(h.board[h.move.to[0]][h.move.to[1]])break;quiet++;}if(count>=3||quiet>=120)result={over:true,winner:null,reason:count>=3?'三次重复局面，和棋':'连续 120 手不吃子，和棋'};}
// 马沿“日”字折线路径，其余棋子沿起终点连线；仅用于展示，不改变规则。
function movePath(h){const {from,to}=h.move,p=h.board[from[0]][from[1]],points=[from];if(p.type==='h')points.push(Math.abs(to[0]-from[0])===2?[to[0],from[1]]:[from[0],to[1]]);points.push(to);return points;}
function pathOverlay(h){const points=movePath(h).map(([r,c])=>`${50+c*100},${50+r*100}`).join(' ');return `<svg class="move-path" style="animation-delay:${trailExpires-performance.now()-PATH_FADE}ms" viewBox="0 0 900 1000" aria-hidden="true"><defs><marker id="move-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#176b8a"/></marker></defs><polyline points="${points}" fill="none" stroke="#176b8a" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" marker-end="url(#move-arrow)"/></svg>`;}
function describeMove(h){const {from,to}=h.move,p=h.board[from[0]][from[1]],capture=h.board[to[0]][to[1]];return `电脑走${pieceLabel(p)}：第${from[0]+1}行第${from[1]+1}列 → 第${to[0]+1}行第${to[1]+1}列${capture?`，吃掉${pieceLabel(capture)}`:''}。`;}
function render(){
 updateResult();const lastEntry=history.at(-1),last=lastEntry?.move,showPath=!!trail&&trail===lastEntry;let html=svgBoard();
 if(showPath)html+=pathOverlay(lastEntry);
 for(let r=0;r<10;r++)for(let c=0;c<9;c++){
  const p=board[r][c],isSelected=selected?.[0]===r&&selected?.[1]===c,isLegal=choices.some(m=>m.to[0]===r&&m.to[1]===c),isOrigin=last&&last.from[0]===r&&last.from[1]===c,from=showPath&&last.from[0]===r&&last.from[1]===c,to=showPath&&last.to[0]===r&&last.to[1]===c;
  const name=`${p?sideName(p.side)+pieceLabel(p):'空位'}，第${r+1}行第${c+1}列${from?'，电脑上一步起点':to?'，电脑上一步落点':''}`;
  html+=`<button class="cell${isSelected?' selected':''}${isLegal?' legal':''}${isOrigin?' last-origin':''}${from?' move-from':''}${to?' move-to':''}${to&&motion?' landing':''}" style="left:${(c+.5)/9*100}%;top:${(r+.5)/10*100}%" data-r="${r}" data-c="${c}" aria-label="${name}" aria-pressed="${!!isSelected}">${p?`<span class="piece ${p.side==='red'?'is-red':''}">${pieceLabel(p)}</span>`:''}${from?'<span class="move-tag">起</span>':to?'<span class="move-tag">落</span>':''}</button>`;
 }
 $('board').innerHTML=html;$('board').setAttribute('aria-busy',String(thinking||!!motion));
 $('step').textContent=`第 ${history.length} 手`;$('move-count').textContent=`${history.length} 手`;$('mode').value=mode;$('black-role').textContent=mode==='ai'?'电脑':'同屏好友';$('undo').disabled=!history.length;
 $('status').textContent=motion?'电脑落子中…':result.over?(result.winner?`${sideName(result.winner)}获胜`:'和棋'):thinking?'电脑思考中…':`${sideName(turn)}行棋${inCheck(board,turn)?' · 将军':''}`;
 $('message').textContent=motion?'电脑正在移动，落定后连线停留 2 秒，再用 0.4 秒淡出。':result.over?(result.winner?(inCheck(board,turn)?'将死，棋局结束。':'无合法走法，棋局结束。'):result.reason):thinking?'稍等片刻，电脑正在思考。':showPath?'电脑走棋连线在落定后停留 2 秒，再用 0.4 秒淡出；可继续行棋。':mode==='ai'?'你执红方，点选棋子查看合法落点。':'双人同屏，红黑双方交替行棋。';
 $('move-notice').hidden=!showPath;$('move-notice').textContent=showPath?`${describeMove(lastEntry)} 连线在落定后停留 2 秒，再用 0.4 秒淡出；走下一步会立即清除。行从上往下、列从左往右数。`:'';
 $('moves').innerHTML=history.length?history.map((h,i)=>{const p=h.board[h.move.from[0]][h.move.from[1]],capture=h.board[h.move.to[0]][h.move.to[1]];return `<li>${i+1}. ${sideName(h.turn)} ${pieceLabel(p)}　${h.move.from[1]+1},${h.move.from[0]+1} → ${h.move.to[1]+1},${h.move.to[0]+1}${capture?'　吃'+pieceLabel(capture):''}</li>`;}).join(''):'<li class="empty">棋局未启，静候落子。</li>';$('moves').scrollTop=$('moves').scrollHeight;
}
function playTone(){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.setValueAtTime(620,audio.currentTime);o.frequency.exponentialRampToValueAtTime(180,audio.currentTime+.07);g.gain.setValueAtTime(.09,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.1);o.start();o.stop(audio.currentTime+.1);}catch{}}
function clearTrail(){clearTimeout(trailTimer);trailTimer=null;trail=null;trailExpires=0;}
function move(m,computer=false){
 clearTrail();
 const h={board,turn,move:m};history.push(h);board=applyMove(board,m);turn=other(turn);selected=null;choices=[];
 const animate=computer&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&typeof Element.prototype.animate==='function';
 motion=animate?h:null;
 if(computer){trail=h;trailExpires=performance.now()+(animate?MOVE_DURATION:0)+PATH_HOLD+PATH_FADE;const token=epoch;trailTimer=setTimeout(()=>{if(token!==epoch)return;clearTrail();render();},(animate?MOVE_DURATION:0)+PATH_HOLD+PATH_FADE);}
 persist();render();
 if(animate){
  const ghost=document.createElement('span');ghost.className='moving-piece';ghost.setAttribute('aria-hidden','true');ghost.innerHTML=`<span class="piece">${pieceLabel(h.board[m.from[0]][m.from[1]])}</span>`;$('board').append(ghost);
  const frames=movePath(h).map(([r,c])=>({left:`${(c+.5)/9*100}%`,top:`${(r+.5)/10*100}%`}));ghost.animate(frames,{duration:MOVE_DURATION,easing:'ease-in-out',fill:'forwards'});
  const token=epoch;motionTimer=setTimeout(()=>{if(token!==epoch)return;motionTimer=null;motion=null;playTone();render();},MOVE_DURATION);
 }else{playTone();maybeAI();}
}
function cancelAI(){clearTrail();epoch++;worker?.terminate();worker=null;clearTimeout(aiTimer);clearTimeout(motionTimer);aiTimer=null;motionTimer=null;motion=null;thinking=false;}
function maybeAI(){
 if(mode!=='ai'||turn!=='black'||result.over)return;cancelAI();const token=epoch,started=performance.now();thinking=true;render();
 worker=new Worker('./ai-worker.js',{type:'module'});
 worker.onmessage=({data})=>{if(token!==epoch)return;worker.terminate();worker=null;aiTimer=setTimeout(()=>{if(token!==epoch)return;aiTimer=null;thinking=false;if(data.move&&legalMoves(board,turn).some(m=>JSON.stringify(m)===JSON.stringify(data.move)))move(data.move,true);else{render();$('message').textContent='电脑暂时不可用，请悔棋或切换双人模式。';}},Math.max(0,AI_PAUSE-(performance.now()-started)));};
 worker.onerror=()=>{if(token!==epoch)return;cancelAI();render();$('message').textContent='电脑加载失败，请悔棋或重新开局。';};worker.postMessage({board,side:turn});
}
$('board').addEventListener('click',e=>{const cell=e.target.closest('.cell');if(!cell||thinking||motion||result.over||(mode==='ai'&&turn==='black'))return;const r=+cell.dataset.r,c=+cell.dataset.c;const m=choices.find(m=>m.to[0]===r&&m.to[1]===c);if(m){move(m);return;}if(board[r][c]?.side===turn){if(selected?.[0]===r&&selected?.[1]===c){selected=null;choices=[];}else{selected=[r,c];choices=movesFor(board,r,c);}}else{selected=null;choices=[];}render();});
$('undo').onclick=()=>{cancelAI();let n=mode==='ai'&&turn==='red'?2:1;while(n--&&history.length){const h=history.pop();board=h.board;turn=h.turn;}selected=null;choices=[];persist();render();};
function reset(){cancelAI();mode=pendingMode||mode;pendingMode=null;board=initialBoard();turn='red';history=[];selected=null;choices=[];persist();render();}
function requestNew(next=null){pendingMode=next;if(!history.length){reset();return;}$('confirm').showModal();}
$('new').onclick=()=>requestNew();$('mode').onchange=e=>{const next=e.target.value;e.target.value=mode;requestNew(next);};$('cancel-new').onclick=()=>{$('confirm').close();pendingMode=null;};$('confirm-new').onclick=()=>{$('confirm').close();reset();};$('confirm').addEventListener('cancel',()=>{pendingMode=null;});
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=`落子音效：${sound?'开':'关'}`;$('sound').setAttribute('aria-pressed',String(sound));if(sound)playTone();};
function network(){$('network').textContent=navigator.onLine?'在线':'离线可玩';}addEventListener('online',network);addEventListener('offline',network);
let installPrompt;addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install').hidden=false;});$('install').onclick=async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('install').hidden=true;};addEventListener('appinstalled',()=>{$('install').hidden=true;});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{$('network').title='离线缓存已就绪';}).catch(()=>{$('network').title='离线缓存失败，请联网刷新重试';});
restore();network();render();maybeAI();
