import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const BG = 0x0a0e1a;
const MAX_IMAGE_PIXELS = 24 * 1000 * 1000;
const MAX_IMAGE_EDGE = 8192;
const uid = `hires-demo-${Math.random().toString(36).slice(2, 9)}`;

const raf = () => new Promise((resolve) => requestAnimationFrame(resolve));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function makeRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setClearColor(BG, 1);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  return renderer;
}

function metricsLoop(renderer, scene, onMetrics, getNote, isDisposed) {
  let last = performance.now(); let frames = 0; let fps = 0; let rafId;
  const tick = (now) => {
    if (isDisposed()) return;
    frames++;
    if (now - last >= 500) { fps = frames * 1000 / (now - last); frames = 0; last = now; }
    const objects = scene ? scene.children.reduce((n, o) => n + (o.visible ? 1 : 0), 0) : 0;
    onMetrics?.({ fps: Math.round(fps * 10) / 10, drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, objects, note: getNote?.() || '' });
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

function resizeBinding(renderer, camera, canvas, onResize) {
  const resize = () => {
    const w = Math.max(1, canvas.clientWidth || canvas.width || 1);
    const h = Math.max(1, canvas.clientHeight || canvas.height || 1);
    renderer.setSize(w, h, false);
    if (camera.isPerspectiveCamera) { camera.aspect = w / h; camera.updateProjectionMatrix(); }
    onResize?.(w, h);
  };
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(canvas); else window.addEventListener('resize', resize);
  resize();
  return () => { ro?.disconnect(); if (!ro) window.removeEventListener('resize', resize); };
}

function controlMarkup(mode) {
  const prefix = `${uid}-${mode}`;
  if (mode === 'hires') return `<fieldset data-demo-controls="${prefix}"><legend>高分辨率导出</legend>
    <label>预览 <select data-role="preview"><option value="on">旋转</option><option value="off">暂停</option></select></label>
    <label>导出尺寸 <select data-role="size"><option value="2048">2048×1152</option><option value="4096" selected>4096×2304</option></select> px</label>
    <label>Tile <select data-role="tile"><option value="256">256</option><option value="512" selected>512</option><option value="1024">1024</option></select> px</label>
    <button type="button" data-role="export">导出 PNG</button><button type="button" data-role="cancel" disabled>取消</button>
    <output data-role="status" aria-live="polite">就绪</output><progress data-role="progress" max="1" value="0" hidden></progress>
    <small data-role="budget"></small></fieldset>`;
  return `<fieldset data-demo-controls="${prefix}"><legend>本地图像 shader</legend>
    <label>图像 <input data-role="file" type="file" accept="image/*"></label>
    <label>亮度 <input data-role="brightness" type="range" min="0" max="1" step="0.01" value="0.5"></label>
    <label>对比度 <input data-role="contrast" type="range" min="0" max="1" step="0.01" value="0.5"></label>
    <label>饱和度 <input data-role="saturation" type="range" min="0" max="1" step="0.01" value="0.5"></label>
    <label>锐化 <input data-role="sharpen" type="range" min="0" max="1" step="0.01" value="0"></label>
    <label><input data-role="effect" type="checkbox" checked>效果</label>
    <button type="button" data-role="download">下载处理后 PNG</button><output data-role="status" aria-live="polite">内置测试图</output>
    <small>生产方案：pyramid → tile cache → worker decode → 可见 tiles upload → filter halo → 释放。</small></fieldset>`;
}

function createHires(canvas, onMetrics) {
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(BG);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100); camera.position.set(6, 4.5, 8);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.target.set(0, 0.4, 0);
  const group = new THREE.Group(); scene.add(group);
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.35, 0.38, 192, 32), new THREE.MeshStandardMaterial({ color: 0x77edbf, metalness: 0.3, roughness: 0.25 })); group.add(knot);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.035, 12, 128), new THREE.MeshBasicMaterial({ color: 0xff9676 })); ring.rotation.x = Math.PI / 2.4; group.add(ring);
  const poly = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 1), new THREE.MeshStandardMaterial({ color: 0xa9a0ff, metalness: 0.65, roughness: 0.2 })); poly.position.set(-2.6, 1.15, 0.1); group.add(poly);
  const grid = new THREE.GridHelper(10, 20, 0x315066, 0x182a3a); grid.position.y = -1.65; group.add(grid);
  scene.add(new THREE.HemisphereLight(0x9fdcff, 0x111326, 1.4)); const key = new THREE.DirectionalLight(0xffd2c4, 2.8); key.position.set(4, 6, 5); scene.add(key);
  let disposed = false; let rotating = true; let exporting = false; let abortExport = false; let target = null; let rafId;
  const note = () => exporting ? '导出中' : `GPU maxTextureSize ${renderer.capabilities.maxTextureSize}`;
  const stopMetrics = metricsLoop(renderer, scene, onMetrics, note, () => disposed);
  const unresize = resizeBinding(renderer, camera, canvas);
  let last = performance.now();
  const animate = (now) => { if (disposed) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; if (!exporting) { if (rotating) group.rotation.y += dt * 0.28; controls.update(); renderer.render(scene, camera); } rafId = requestAnimationFrame(animate); };
  rafId = requestAnimationFrame(animate);

  const rootControls = () => document.querySelector(`[data-demo-controls="${uid}-hires"]`);
  const setStatus = (s) => { const el = rootControls()?.querySelector('[data-role="status"]'); if (el) el.textContent = s; };
  const updateBudget = () => { const r = rootControls(); if (!r) return; const size = Number(r.querySelector('[data-role="size"]')?.value || 4096); const tile = Number(r.querySelector('[data-role="tile"]')?.value || 512); const bytes = size * Math.ceil(size * 0.5625) * 4; const tileBytes = tile * tile * 4; const max = renderer.capabilities.maxTextureSize; r.querySelector('[data-role="budget"]').textContent = `预算：RGBA8 颜色最低 ${ (bytes / 1048576).toFixed(1) } MiB + 单 tile ${ (tileBytes / 1048576).toFixed(1) } MiB（不含深度、编码、拷贝）；GPU maxTextureSize=${max}。tile 只降低 GPU 峰值，拼接整图仍占 CPU 内存。`; };
  const exportPNG = async () => {
    if (exporting) return; const r = rootControls(); const size = Number(r.querySelector('[data-role="size"]').value); const tile = Number(r.querySelector('[data-role="tile"]').value); const fullW = size; const fullH = Math.max(1, Math.round(size * 0.5625));
    if (tile > renderer.capabilities.maxTextureSize) { setStatus(`单 tile 尺寸超过 GPU maxTextureSize ${renderer.capabilities.maxTextureSize}，请降低 tile。`); return; }
    exporting = true; abortExport = false; r.querySelector('[data-role="export"]').disabled = true; r.querySelector('[data-role="cancel"]').disabled = false; const progress = r.querySelector('[data-role="progress"]'); progress.hidden = false; progress.value = 0;
    const stitch = document.createElement('canvas'); stitch.width = fullW; stitch.height = fullH; const ctx = stitch.getContext('2d'); target = new THREE.WebGLRenderTarget(Math.min(tile, fullW), Math.min(tile, fullH), { format: THREE.RGBAFormat, type: THREE.UnsignedByteType, colorSpace: THREE.SRGBColorSpace, depthBuffer: true, stencilBuffer: false });
    const pixels = new Uint8Array(target.width * target.height * 4); const exportCamera = camera.clone(); controls.enabled = false;
    try {
      const nx = Math.ceil(fullW / tile), ny = Math.ceil(fullH / tile), total = nx * ny; let done = 0;
      for (let y = 0; y < fullH && !abortExport; y += tile) for (let x = 0; x < fullW && !abortExport; x += tile) {
        const tw = Math.min(tile, fullW - x), th = Math.min(tile, fullH - y); if (target.width !== tw || target.height !== th) { target.setSize(tw, th); pixels.fill(0); }
        // setViewOffset 与拼接画布的 y 坐标都从顶部计数；readback 行仍需上下翻转。
        exportCamera.setViewOffset(fullW, fullH, x, y, tw, th); exportCamera.updateProjectionMatrix(); renderer.setRenderTarget(target); renderer.clear(); renderer.render(scene, exportCamera); renderer.readRenderTargetPixels(target, 0, 0, tw, th, pixels);
        const image = new ImageData(tw, th); for (let row = 0; row < th; row++) image.data.set(pixels.subarray(row * tw * 4, (row + 1) * tw * 4), (th - 1 - row) * tw * 4); ctx.putImageData(image, x, y);
        done++; progress.value = done / total; setStatus(`导出 ${done}/${total} tile (${Math.round(done / total * 100)}%)`); await raf();
      }
      if (abortExport) { setStatus('已取消导出'); return; }
      const blob = await new Promise((resolve) => stitch.toBlob(resolve, 'image/png')); if (!blob) throw new Error('PNG 编码失败'); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `three-hires-${fullW}x${fullH}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); setStatus(`已导出 ${fullW}×${fullH} PNG`);
    } catch (e) { setStatus(`导出失败：${e.message}`); } finally { renderer.setRenderTarget(null); target?.dispose(); target = null; controls.enabled = true; exporting = false; r.querySelector('[data-role="export"]').disabled = false; r.querySelector('[data-role="cancel"]').disabled = true; progress.hidden = true; }
  };
  return { controlsHTML: controlMarkup('hires'), bindControls(root) { const r = root.querySelector(`[data-demo-controls="${uid}-hires"]`) || root; r.querySelector('[data-role="preview"]')?.addEventListener('change', (e) => { rotating = e.target.value === 'on'; }); r.querySelector('[data-role="size"]')?.addEventListener('change', updateBudget); r.querySelector('[data-role="tile"]')?.addEventListener('change', updateBudget); r.querySelector('[data-role="export"]')?.addEventListener('click', exportPNG); r.querySelector('[data-role="cancel"]')?.addEventListener('click', () => { abortExport = true; }); updateBudget(); }, dispose() { disposed = true; abortExport = true; cancelAnimationFrame(rafId); stopMetrics(); unresize(); controls.dispose(); target?.dispose(); scene.traverse((o) => { o.geometry?.dispose(); if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose()); else o.material?.dispose(); }); renderer.dispose(); } };
}

function createTestCanvas() { const c = document.createElement('canvas'); c.width = 1200; c.height = 700; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 1200, 700); g.addColorStop(0, '#071b36'); g.addColorStop(0.5, '#77edbf'); g.addColorStop(1, '#ff9676'); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); x.strokeStyle = '#a9a0ff'; x.lineWidth = 12; for (let i = -700; i < 1800; i += 80) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 700, 700); x.stroke(); } x.fillStyle = 'rgba(10,14,26,.72)'; x.fillRect(60, 60, 560, 170); x.fillStyle = '#fff'; x.font = 'bold 72px sans-serif'; x.fillText('LOCAL TEST', 95, 165); x.font = '24px sans-serif'; x.fillText('Three.js shader pipeline', 98, 205); return c; }

function createImage(canvas, onMetrics) {
  const renderer = makeRenderer(canvas); renderer.toneMapping = THREE.NoToneMapping; const scene = new THREE.Scene(); scene.background = new THREE.Color(BG); const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); const quadScene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(2, 2); const textureCanvas = createTestCanvas(); let texture = new THREE.CanvasTexture(textureCanvas); texture.colorSpace = THREE.SRGBColorSpace;
  const fit = new THREE.Vector2(1, 1);
  const setFit = (w, h) => { const imageAspect = (texture.image.width || 1) / (texture.image.height || 1); const viewportAspect = w / Math.max(1, h); fit.set(viewportAspect > imageAspect ? imageAspect / viewportAspect : 1, viewportAspect > imageAspect ? 1 : viewportAspect / imageAspect); };
  const material = new THREE.ShaderMaterial({ uniforms: { map: { value: texture }, resolution: { value: new THREE.Vector2(textureCanvas.width, textureCanvas.height) }, fit: { value: fit }, brightness: { value: 0.5 }, contrast: { value: 0.5 }, saturation: { value: 0.5 }, sharpen: { value: 0 }, enabled: { value: true } }, vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}`, fragmentShader: `precision highp float; uniform sampler2D map; uniform vec2 resolution,fit; uniform float brightness,contrast,saturation,sharpen,enabled; varying vec2 vUv; vec3 luma(vec3 c){return vec3(dot(c,vec3(.2126,.7152,.0722)));} void main(){vec2 uv=(vUv-.5)/fit+.5; bool inside=all(greaterThanEqual(uv,vec2(0.)))&&all(lessThanEqual(uv,vec2(1.))); vec4 base=inside?texture2D(map,uv):vec4(0.039,0.055,0.102,1.); vec3 c=base.rgb; if(enabled>=.5&&inside){vec2 p=1.0/resolution; float b=brightness*0.4-0.2; c+=b; c=mix(luma(c),c,saturation*2.0); c=(c-.5)*(contrast*2.0)+.5; vec3 blur=(texture2D(map,uv+vec2(p.x,0.)).rgb+texture2D(map,uv-vec2(p.x,0.)).rgb+texture2D(map,uv+vec2(0.,p.y)).rgb+texture2D(map,uv-vec2(0.,p.y)).rgb)/4.; c+=(c-blur)*sharpen*1.8;} gl_FragColor=vec4(clamp(c,0.,1.),base.a);
#include <colorspace_fragment>
}` }); quadScene.add(new THREE.Mesh(geometry, material)); let disposed = false; let rafId; const unresize = resizeBinding(renderer, camera, canvas, (w, h) => setFit(w, h)); const stopMetrics = metricsLoop(renderer, quadScene, onMetrics, () => 'shader fullscreen', () => disposed); const render = () => { if (disposed) return; renderer.render(quadScene, camera); rafId = requestAnimationFrame(render); }; rafId = requestAnimationFrame(render);
  const rootControls = () => document.querySelector(`[data-demo-controls="${uid}-image"]`); const status = (s) => { const el = rootControls()?.querySelector('[data-role="status"]'); if (el) el.textContent = s; };
  const download = () => { const sourceW = texture.image.width || 1, sourceH = texture.image.height || 1, scale = Math.min(1, 2048 / Math.max(sourceW, sourceH)), w = Math.max(1, Math.round(sourceW * scale)), h = Math.max(1, Math.round(sourceH * scale)); const savedSize = renderer.getSize(new THREE.Vector2()); const savedPixelRatio = renderer.getPixelRatio(); try { renderer.setPixelRatio(1); renderer.setSize(w, h, false); setFit(w, h); renderer.render(quadScene, camera); const a = document.createElement('a'); a.href = renderer.domElement.toDataURL('image/png'); a.download = `shader-preview-${w}x${h}.png`; a.click(); status(`已下载 ${w}×${h} 预览 PNG（最大边2048）`); } finally { renderer.setPixelRatio(savedPixelRatio); renderer.setSize(savedSize.x, savedSize.y, false); setFit(savedSize.x, savedSize.y); } };
  const loadFile = (file) => { if (!file) return; const url = URL.createObjectURL(file); const img = new Image(); img.onload = () => { URL.revokeObjectURL(url); const pixels = img.width * img.height; if (pixels > MAX_IMAGE_PIXELS || img.width > MAX_IMAGE_EDGE || img.height > MAX_IMAGE_EDGE) { status(`拒绝：${img.width}×${img.height} 超过 24MP 或最大边8192；未创建 bitmap。`); return; } if (Math.max(img.width, img.height) > renderer.capabilities.maxTextureSize) { status(`拒绝：图像最大边超过 GPU maxTextureSize ${renderer.capabilities.maxTextureSize}。生产请用图像金字塔/按需 tile 流式。`); return; } texture.dispose(); texture = new THREE.Texture(img); texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true; material.uniforms.map.value = texture; material.uniforms.resolution.value.set(img.width, img.height); setFit(canvas.clientWidth || canvas.width || 1, canvas.clientHeight || canvas.height || 1); status(`已读取本地 ${img.width}×${img.height}（不上传）`); }; img.onerror = () => { URL.revokeObjectURL(url); status('读取图像失败'); }; img.src = url; };
  return { controlsHTML: controlMarkup('image'), bindControls(root) { const r = root.querySelector(`[data-demo-controls="${uid}-image"]`) || root; for (const name of ['brightness','contrast','saturation','sharpen']) r.querySelector(`[data-role="${name}"]`)?.addEventListener('input', (e) => { material.uniforms[name].value = Number(e.target.value); }); r.querySelector('[data-role="effect"]')?.addEventListener('change', (e) => { material.uniforms.enabled.value = e.target.checked; }); r.querySelector('[data-role="file"]')?.addEventListener('change', (e) => loadFile(e.target.files?.[0])); r.querySelector('[data-role="download"]')?.addEventListener('click', download); }, dispose() { disposed = true; cancelAnimationFrame(rafId); stopMetrics(); unresize(); geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose(); } };
}

export async function mountHiresDemo({ id, canvas, onMetrics } = {}) { if (!canvas) throw new Error('mountHiresDemo 需要 canvas'); if (id !== 'hires' && id !== 'image') throw new Error(`未知 demo id: ${escapeHTML(id)}`); return id === 'hires' ? createHires(canvas, onMetrics) : createImage(canvas, onMetrics); }
