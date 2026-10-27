(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('meadow'), ctx = canvas.getContext('2d');
  const WW = 1100, WH = 700, MAX = 40;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const names = ['小麦','团团','云朵','栗子','棉花','露珠','奶糖','小满','芝麻','桃酥','铃铛','阿福'];
  const rivers = [{x:310,w:70,a:30,p:.4},{x:655,w:62,a:39,p:2.2},{x:910,w:47,a:24,p:4.1}];
  let width=1,height=1,dpr=1,sheep=[],selected=null,nextId=1,last=performance.now();
  let pointer=null,stroke=[],drawing=false,toastTimer;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const center=(r,y)=>r.x+Math.sin(y*.009+r.p)*r.a;
  const spriteScale=()=>width<600?1.45:1.15;
  function resize(){
    const b=canvas.getBoundingClientRect();width=b.width;height=b.height;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr*width/WW,0,0,dpr*height/WH,0,0);
  }
  function riverAt(x,y,pad=0){return rivers.find(r=>Math.abs(x-center(r,y))<r.w/2+pad)||null;}
  function onLand(x,y,pad=22){return x>34&&x<WW-34&&y>46&&y<WH-35&&!riverAt(x,y,pad);}
  function grassPoint(x,y){
    x=clamp(x,36,WW-36);y=clamp(y,48,WH-38);
    for(const r of rivers){const c=center(r,y);if(Math.abs(x-c)<r.w/2+29)x=c+(x<c?-1:1)*(r.w/2+30);}
    return {x:clamp(x,36,WW-36),y};
  }
  function clearPath(a,b){
    const n=Math.max(2,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/9));
    for(let i=1;i<=n;i++){const p=i/n;if(!onLand(a.x+(b.x-a.x)*p,a.y+(b.y-a.y)*p,23))return false;}
    return true;
  }
  function makeSheep(x,y){
    const p=grassPoint(x,y),id=nextId++;
    return {id,name:names[(id-1)%names.length]+(id>12?'·'+id:''),x:p.x,y:p.y,tx:p.x,ty:p.y,dir:id%2?1:-1,phase:Math.random()*6.28,scale:.94+Math.random()*.11,state:'吃草',action:null,lift:0,idleUntil:performance.now()+3500+Math.random()*5000,born:0};
  }
  function say(message){
    $('statusText').textContent=message;$('toast').textContent=message;$('toast').classList.remove('hide');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.add('hide'),3000);
  }
  function updatePanel(){
    $('sheepCount').textContent=sheep.length;$('capacity').textContent=`${sheep.length} / ${MAX} 只`;
    $('selectedName').textContent=selected?selected.name:'还没有选中';
    $('selectedState').textContent=selected?selected.state:'轻点草地上的一只羊';
    $('selectedCard').classList.toggle('has-selection',!!selected);$('actions').hidden=!selected;
    document.querySelectorAll('[data-action]').forEach(b=>{b.disabled=!selected;b.setAttribute('aria-pressed',String(!!selected&&selected.action===b.dataset.action));});
  }
  function reset(){
    nextId=1;selected=null;pointer=null;drawing=false;stroke=[];
    sheep=[[.13,.30],[.21,.65],[.44,.38],[.72,.66],[.94,.32]].map(p=>makeSheep(p[0]*WW,p[1]*WH));
    updatePanel();say('风吹过矮草，小羊们正在慢悠悠地吃草。');
  }
  function jumpTarget(s){
    const candidates=rivers.map(r=>({r,d:Math.abs(s.x-center(r,s.y))})).sort((a,b)=>a.d-b.d);
    const near=candidates[0];
    if(near.d<near.r.w/2+142){
      const c=center(near.r,s.y),side=s.x<c?-1:1;
      const p=grassPoint(c-side*(near.r.w/2+43),s.y);
      if(onLand(p.x,p.y,20))return p;
    }
    let p=grassPoint(s.x+s.dir*106,s.y);
    if(!clearPath(s,p))p=grassPoint(s.x-s.dir*82,s.y);
    return p;
  }
  function chooseAction(action){
    if(!selected)return;
    const s=selected,now=performance.now();
    // A new request is queued until landing, keeping a jumping sheep out of the water.
    if(s.action==='jump'&&now<s.until){say(`${s.name}还在空中呢，等它轻轻落地吧。`);return;}
    s.lift=0;s.action=action;s.from={x:s.x,y:s.y};s.start=now;
    s.until=now+({jump:1050,run:3600,rest:6200,graze:4300}[action]||2000);
    s.state={jump:'开心跳跃',run:'撒腿奔跑',rest:'舒服趴着',graze:'专心吃草'}[action];
    if(action==='jump'){s.to=jumpTarget(s);s.dir=s.to.x<s.x?-1:1;}
    updatePanel();say(`${s.name}：${s.state}`);
  }
  function finish(s,t){s.action=null;s.lift=0;s.state='吃草';s.tx=s.x;s.ty=s.y;s.idleUntil=t+3000+Math.random()*4500;if(s===selected)updatePanel();}
  function walkTarget(s,t){
    for(let i=0;i<16;i++){
      const angle=Math.random()*Math.PI*2,dist=45+Math.random()*110;
      const p={x:s.x+Math.cos(angle)*dist,y:s.y+Math.sin(angle)*dist};
      if(clearPath(s,p)){s.tx=p.x;s.ty=p.y;s.dir=p.x<s.x?-1:1;s.state='慢慢散步';if(s===selected)updatePanel();return;}
    }
    s.idleUntil=t+2500;
  }
  function update(s,dt,t){
    if(s.action){
      const p=clamp((t-s.start)/(s.until-s.start),0,1);
      if(s.action==='jump'){
        const ease=p*p*(3-2*p);s.x=s.from.x+(s.to.x-s.from.x)*ease;s.y=s.from.y+(s.to.y-s.from.y)*ease;s.lift=Math.sin(p*Math.PI)*85;
      }else if(s.action==='run'){
        const nx=s.x+s.dir*dt*.18;
        if(clearPath(s,{x:nx,y:s.y}))s.x=nx;else s.dir*=-1;
      }
      if(p>=1)finish(s,t);
      return;
    }
    const dx=s.tx-s.x,dy=s.ty-s.y,d=Math.hypot(dx,dy);
    if(d>1){
      const step=Math.min(d,dt*.027),p={x:s.x+dx/d*step,y:s.y+dy/d*step};
      if(clearPath(s,p)){s.x=p.x;s.y=p.y;}else{s.tx=s.x;s.ty=s.y;}
      if(d<2){s.state='吃草';s.idleUntil=t+2800+Math.random()*6500;if(s===selected)updatePanel();}
    }else if(t>s.idleUntil){
      if(Math.random()<.62)walkTarget(s,t);else s.idleUntil=t+2500+Math.random()*4000;
    }
  }
  function pos(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*WW,y:(e.clientY-r.top)/r.height*WH};}
  function hitSheep(p){
    for(let i=sheep.length-1;i>=0;i--){const s=sheep[i],dy=(p.y-(s.y-s.lift))*height/WH/(width/WW);if(Math.hypot(p.x-s.x,dy)<34*s.scale*spriteScale())return s;}
    return null;
  }
  function validLoop(points){
    if(points.length<12)return null;
    let length=0,area=0,minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    for(let i=0;i<points.length;i++){
      const p=points[i],q=points[(i+1)%points.length];area+=p.x*q.y-q.x*p.y;
      if(i)length+=Math.hypot(p.x-points[i-1].x,p.y-points[i-1].y);
      minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
    }
    const box=(maxX-minX)*(maxY-minY),a=Math.abs(area)/2,closure=Math.hypot(points[0].x-points.at(-1).x,points[0].y-points.at(-1).y);
    if(length<110||a<900||box<1200||a/box<.25||closure>Math.min(94,length*.22))return null;
    return{x:(minX+maxX)/2,y:(minY+maxY)/2};
  }
  canvas.addEventListener('pointerdown',e=>{
    if(pointer!==null||e.button!==0)return;e.preventDefault();pointer=e.pointerId;canvas.setPointerCapture(e.pointerId);
    const p=pos(e),hit=hitSheep(p);stroke=[];
    if(hit){selected=hit;drawing=false;updatePanel();say(`${hit.name}在看你呢，选个动作和它玩吧。`);return;}
    selected=null;updatePanel();drawing=true;stroke=[p];$('toast').classList.add('hide');
  });
  canvas.addEventListener('pointermove',e=>{
    if(e.pointerId!==pointer||!drawing)return;e.preventDefault();const p=pos(e),q=stroke.at(-1);
    if(Math.hypot(p.x-q.x,p.y-q.y)>3)stroke.push(p);
  });
  function endPointer(e,cancel=false){
    if(e.pointerId!==pointer)return;pointer=null;
    if(!drawing)return;drawing=false;
    const drawn=stroke.length>3,loop=!cancel?validLoop(stroke):null;stroke=[];
    if(cancel)return;
    if(loop){
      if(sheep.length>=MAX){say('40 只小羊已经很热闹啦，先陪它们玩一会吧。');return;}
      const p=grassPoint(loop.x,loop.y),s=makeSheep(p.x,p.y);s.born=performance.now();sheep.push(s);selected=s;updatePanel();
      say(riverAt(loop.x,loop.y,20)?'河水凉凉的，新朋友在岸边等你啦。':'圈得刚刚好！一只新羊来啦。');
    }else if(drawn)say('差一点点：把圈画大些，再回到起点试试。');
  }
  canvas.addEventListener('pointerup',e=>endPointer(e));canvas.addEventListener('pointercancel',e=>endPointer(e,true));
  document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>chooseAction(b.dataset.action)));
  $('resetBtn').addEventListener('click',reset);
  function ellipse(x,y,rx,ry,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
  function background(t){
    ctx.fillStyle='#adbf87';ctx.fillRect(0,0,WW,WH);
    // Quiet, organic patches of sunlight, drawn in logical world coordinates.
    for(let i=0;i<8;i++){ellipse((i*197+50)%WW,(i*143+40)%WH,110+(i%3)*30,70+(i%2)*25,i%2?'#b7c993':'#a6ba7d');}
    for(const r of rivers){
      ctx.beginPath();for(let y=-10;y<=WH+10;y+=8){const x=center(r,y)-r.w/2;if(y===-10)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
      for(let y=WH+10;y>=-10;y-=8)ctx.lineTo(center(r,y)+r.w/2,y);
      ctx.closePath();ctx.fillStyle='#86b9b5';ctx.fill();ctx.strokeStyle='#c2d4ad';ctx.lineWidth=7;ctx.stroke();
      ctx.strokeStyle='#d2e5d6';ctx.lineWidth=1.7;
      for(let j=0;j<8;j++){const y=(j*101+r.x)%WH,x=center(r,y),wave=reduced?0:Math.sin(t*.0017+j)*4;ctx.beginPath();ctx.moveTo(x-11+wave,y);ctx.quadraticCurveTo(x,y-3,x+9+wave,y);ctx.stroke();}
    }
    const r=rivers[0],by=445,bx=center(r,by),bw=r.w+34;
    ctx.fillStyle='#516f4920';ctx.fillRect(bx-bw/2+3,by-11,bw,40);
    ctx.fillStyle='#b89268';ctx.fillRect(bx-bw/2,by-17,bw,29);
    ctx.strokeStyle='#94734f';ctx.lineWidth=1.6;
    for(let x=bx-bw/2+4;x<bx+bw/2;x+=12){ctx.beginPath();ctx.moveTo(x,by-15);ctx.lineTo(x,by+10);ctx.stroke();}
    ctx.strokeStyle='#d6b18a';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(bx-bw/2,by-18);ctx.lineTo(bx+bw/2,by-18);ctx.moveTo(bx-bw/2,by+14);ctx.lineTo(bx+bw/2,by+14);ctx.stroke();
    for(let i=0;i<100;i++){
      const x=(i*137+41)%WW,y=(i*79+21)%WH;if(riverAt(x,y,16))continue;
      const sway=reduced?0:Math.sin(t*.0014+i)*1.5;ctx.strokeStyle=i%3?'#8ca36a80':'#78965c88';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(x,y+4);ctx.quadraticCurveTo(x-2,y-3,x-4+sway,y-7);ctx.moveTo(x,y+4);ctx.quadraticCurveTo(x+1,y-2,x+4+sway,y-5);ctx.stroke();
      if(i%9===0){const c=['#efd293','#e5b1a2','#f5edcf'][i%3];for(let a=0;a<5;a++)ellipse(x+Math.cos(a*1.256)*3,y-8+Math.sin(a*1.256)*3,2.4,2.4,c);ellipse(x,y-8,1.8,1.8,'#d5af65');}
      if(i%23===0)ellipse(x+10,y+7,5,3,'#a4aa87');
    }
  }
  function drawSheep(s,t){
    const jumping=s.action==='jump',resting=s.action==='rest',running=s.action==='run';
    const walking=!s.action&&Math.hypot(s.tx-s.x,s.ty-s.y)>2,grazing=s.action==='graze'||(!s.action&&!walking);
    const scale=s.scale*spriteScale(),ratio=(width/WW)/(height/WH),phase=t*.008+s.phase;
    // Shadows remain on the ground while the woolly body leaves it.
    ctx.save();ctx.translate(s.x,s.y+17*ratio);ctx.scale(scale,scale*ratio);
    ellipse(0,0,25-s.lift*.08,6-s.lift*.015,`rgba(66,87,49,${.17-s.lift*.001})`);ctx.restore();
    ctx.save();ctx.translate(s.x,s.y-s.lift);ctx.scale(s.dir*scale,scale*ratio);
    if(resting)ctx.translate(0,8);
    const swing=(walking||running)&&!reduced?Math.sin(phase*(running?2:1))*5:0;
    ctx.strokeStyle='#4c5548';ctx.lineWidth=3.8;ctx.lineCap='round';
    for(let i=0;i<4;i++){const x=-14+i*9;ctx.beginPath();ctx.moveTo(x,6);ctx.lineTo(x+(i%2?swing:-swing),resting?10:20);ctx.stroke();}
    // Small overlapping wool puffs produce a soft, recognizable silhouette.
    ellipse(-1,-2,25,17,'#f5f1df');
    for(const [x,y,r] of [[-20,-5,9],[-13,-16,10],[0,-20,11],[13,-14,10],[20,-3,9],[10,7,10],[-5,9,10],[-18,6,8]])ellipse(x,y,r,r,'#fff9e8');
    ellipse(-28,-2,6,5,'#fff9e8');
    const headY=grazing?8:-5,headX=grazing?25:23;
    ctx.save();ctx.translate(headX,headY);if(grazing)ctx.rotate(.25);
    ellipse(-5,-9,7,3,'#64705b');ellipse(1,3,10,12,'#52604e');ellipse(7,-1,1.6,1.9,'#f8f5e7');ellipse(7.3,-1,0.8,1.1,'#273d2c');
    if(resting){ctx.strokeStyle='#eee9d7';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(4,-1);ctx.lineTo(8,-1);ctx.stroke();}
    if(grazing){ctx.strokeStyle='#63804a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(7,11);ctx.lineTo(13,9+(reduced?0:Math.sin(t*.013)*2));ctx.stroke();}
    ctx.restore();
    if(s===selected){
      ctx.strokeStyle='#f5dfa5';ctx.lineWidth=1.5;ctx.setLineDash([3,4]);ctx.beginPath();ctx.ellipse(0,-1,37,32,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
    }
    ctx.restore();
    if(s===selected){
      ctx.save();ctx.translate(s.x,s.y-s.lift-45*ratio*scale);ctx.scale(scale,scale*ratio);
      ctx.fillStyle='#fff9e8';ctx.beginPath();ctx.roundRect(-25,-10,50,19,9);ctx.fill();ctx.fillStyle='#65754f';ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillText(s.name,0,3);ctx.restore();
    }
    const age=t-s.born;
    if(s.born&&age<1400){
      const p=age/1400;ctx.save();ctx.translate(s.x,s.y);ctx.scale(1,ratio);ctx.globalAlpha=1-p;ctx.strokeStyle='#fff2bc';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,17,30+p*35,9+p*10,0,0,Math.PI*2);ctx.stroke();
      for(let i=0;i<7;i++){const a=i*.897;ellipse(Math.cos(a)*(27+p*35),Math.sin(a)*(27+p*35)-10,2.5,2.5,'#fff1b2');}ctx.restore();
    }
  }
  function draw(t){
    ctx.clearRect(0,0,WW,WH);background(t);
    if(drawing&&stroke.length>1){
      ctx.strokeStyle='#fff5d8';ctx.lineWidth=width<600?5:3.5;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor='#4b693c33';ctx.shadowBlur=3;
      ctx.beginPath();ctx.moveTo(stroke[0].x,stroke[0].y);for(const p of stroke.slice(1))ctx.lineTo(p.x,p.y);ctx.stroke();ctx.shadowBlur=0;
      ellipse(stroke[0].x,stroke[0].y,4,4,'#fff5d8');
    }
    [...sheep].sort((a,b)=>a.y-b.y).forEach(s=>drawSheep(s,t));
  }
  function loop(t){const dt=Math.min(40,t-last);last=t;sheep.forEach(s=>update(s,dt,t));draw(t);requestAnimationFrame(loop);}
  window.meadowDebug=Object.freeze({snapshot:()=>({worldWidth:WW,worldHeight:WH,sheepCount:sheep.length,selected:selected?{id:selected.id,name:selected.name}:null,sheep:sheep.map(s=>({id:s.id,name:s.name,x:s.x,y:s.y,state:s.state,action:s.action,lift:s.lift}))}),reset});
  new ResizeObserver(resize).observe(canvas);resize();reset();requestAnimationFrame(loop);
})();
