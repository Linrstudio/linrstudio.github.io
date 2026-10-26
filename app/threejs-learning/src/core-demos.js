import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const COLORS = {
  navy: 0x0a0e1a,
  mint: 0x77edbf,
  coral: 0xff9676,
  violet: 0xa9a0ff,
  ink: 0xdce7ff,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function fieldLabel(id, label, control) {
  return `<label for="${id}">${label}${control}</label>`;
}

function controlsFor(id) {
  if (id === 'materials') {
    return `<p class="demo-help">拖动参数观察 PBR 材质如何响应环境光；可旋转镜头查看高光。</p>
      ${fieldLabel('demo-metalness', '金属度 ', '<input id="demo-metalness" type="range" min="0" max="1" step="0.01" value="0.72"><output id="demo-metalness-value">0.72</output>')}
      ${fieldLabel('demo-roughness', '粗糙度 ', '<input id="demo-roughness" type="range" min="0.05" max="1" step="0.01" value="0.28"><output id="demo-roughness-value">0.28</output>')}
      ${fieldLabel('demo-light-intensity', '光照强度 ', '<input id="demo-light-intensity" type="range" min="0" max="5" step="0.1" value="2.2"><output id="demo-light-intensity-value">2.2</output>')}`;
  }
  if (id === 'ai') {
    return `<p class="demo-help">这是本地规则演示，不调用 AI API。输入关键词或编辑受限 JSON，然后应用。</p>
      <label for="demo-prompt">关键词 <input id="demo-prompt" type="text" value="mint ring spiral"></label>
      <button id="demo-prompt-apply" type="button">应用关键词</button>
      <label for="demo-ai-json">配置 JSON <textarea id="demo-ai-json" rows="4" spellcheck="false">{"theme":"mint","layout":"ring","count":36,"shape":"sphere","speed":0.7}</textarea></label>
      <button id="demo-ai-json-apply" type="button">应用 JSON</button>
      <div id="demo-ai-status" role="status" aria-live="polite">就绪：等待本地规则或 JSON 配置。</div>
      <div class="demo-presets"><button id="demo-preset-mint" type="button">薄荷环</button><button id="demo-preset-sunset" type="button">日落网格</button><button id="demo-preset-violet" type="button">紫色螺旋</button></div>`;
  }
  if (id === 'scale') {
    return `<p class="demo-help">批量重复网格会合批；InstancedMesh 只更新一个 group，实例旋转不逐个 CPU 更新。普通 Mesh 上限 2000，避免卡死。</p>
      ${fieldLabel('demo-scale-count', '数量 ', '<select id="demo-scale-count"><option value="500">500</option><option value="2000" selected>2,000</option><option value="10000">10,000</option><option value="50000">50,000</option></select>')}
      <label for="demo-scale-mode">模式 <select id="demo-scale-mode"><option value="instanced">InstancedMesh（合批）</option><option value="mesh">普通 Mesh（最多 2,000）</option></select></label>
      ${fieldLabel('demo-resolution', '分辨率 ', '<input id="demo-resolution" type="range" min="0.5" max="1.5" step="0.5" value="1"><output id="demo-resolution-value">1×</output>')}
      <div id="demo-scale-note" role="status">DPR 像素数量约 1×（实际设备 DPR 原始值参与计算）</div>`;
  }
  return `<p class="demo-help">拖动镜头观察 Scene、Camera 与 Mesh 的关系。网格是世界参考，轴线可辅助定位。</p>
    <label for="demo-shape">形状 <select id="demo-shape"><option value="cube">Cube</option><option value="sphere">Sphere</option><option value="torus">Torus</option></select></label>
    ${fieldLabel('demo-object-color', '物体颜色 ', '<input id="demo-object-color" type="color" value="#77edbf">')}
    ${fieldLabel('demo-rotation-speed', '旋转速度 ', '<input id="demo-rotation-speed" type="range" min="0" max="2" step="0.05" value="0.7"><output id="demo-rotation-speed-value">0.70</output>')}
    <label><input id="demo-wireframe" type="checkbox"> Wireframe</label><label><input id="demo-pause" type="checkbox"> 暂停</label><label><input id="demo-axes" type="checkbox" checked> 显示坐标轴</label>`;
}

function createMaterial(params = {}) {
  return new THREE.MeshStandardMaterial({ color: params.color ?? COLORS.mint, roughness: params.roughness ?? 0.3, metalness: params.metalness ?? 0.35, emissive: params.emissive ?? 0x071c25, emissiveIntensity: params.emissiveIntensity ?? 0.15 });
}

function geometryFor(shape, size = 1) {
  if (shape === 'sphere') return new THREE.SphereGeometry(size, 32, 20);
  if (shape === 'torus') return new THREE.TorusGeometry(size * 0.72, size * 0.24, 16, 40);
  return new THREE.BoxGeometry(size, size, size);
}

function addGrid(scene) {
  const grid = new THREE.GridHelper(28, 28, COLORS.violet, 0x17243b);
  grid.material.transparent = true;
  grid.material.opacity = 0.42;
  grid.position.y = -2.1;
  scene.add(grid);
  return grid;
}

function addLights(scene, intensity = 2) {
  const key = new THREE.DirectionalLight(COLORS.mint, intensity);
  key.position.set(5, 8, 6);
  const fill = new THREE.PointLight(COLORS.coral, intensity * 1.25, 18);
  fill.position.set(-5, 2, 3);
  const rim = new THREE.PointLight(COLORS.violet, intensity * 1.1, 16);
  rim.position.set(3, -1, -6);
  scene.add(key, fill, rim);
  return [key, fill, rim];
}

function useCamera(camera, controls, target = new THREE.Vector3()) {
  camera.position.set(7, 4.8, 8);
  controls.target.copy(target);
  controls.update();
}

function makeFoundation(scene) {
  const group = new THREE.Group();
  group.name = 'FoundationMesh';
  const material = createMaterial({ color: COLORS.mint, metalness: 0.38, roughness: 0.24 });
  const mesh = new THREE.Mesh(geometryFor('cube', 2.35), material);
  mesh.castShadow = true;
  mesh.position.y = 0.15;
  group.add(mesh);
  scene.add(group);
  return { group, mesh, material };
}

function makeMaterials(scene, renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environmentTarget = pmrem.fromScene(room, 0.04);
  const environment = environmentTarget.texture;
  scene.environment = environment;
  room.dispose();
  pmrem.dispose();
  const group = new THREE.Group();
  const material = createMaterial({ color: COLORS.coral, metalness: 0.72, roughness: 0.28 });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.55, 48, 32), material);
  const torusMaterial = createMaterial({ color: COLORS.mint, metalness: 0.72, roughness: 0.28 });
  const torus = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.18, 24, 80), torusMaterial);
  torus.rotation.x = Math.PI / 2.8;
  group.add(sphere, torus);
  scene.add(group);
  return { group, sphere, torus, material, torusMaterial, environment, environmentTarget };
}

const AI_DEFAULTS = { theme: 'mint', layout: 'ring', count: 36, shape: 'sphere', speed: 0.7 };
const AI_COLORS = { mint: COLORS.mint, sunset: COLORS.coral, violet: COLORS.violet };
const AI_LAYOUTS = ['ring', 'grid', 'spiral'];
const AI_SHAPES = ['box', 'sphere', 'torus'];
function validateAI(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('配置必须是 JSON 对象');
  const allowedKeys = new Set(Object.keys(AI_DEFAULTS));
  const unknownKeys = Object.keys(raw).filter((key) => !allowedKeys.has(key));
  if (unknownKeys.length) throw new Error(`不支持的字段：${unknownKeys.join('、')}`);
  const value = { ...AI_DEFAULTS, ...raw };
  if (!Object.hasOwn(AI_COLORS, value.theme)) throw new Error('theme 只能是 mint、sunset 或 violet');
  if (!AI_LAYOUTS.includes(value.layout)) throw new Error('layout 只能是 ring、grid 或 spiral');
  if (!AI_SHAPES.includes(value.shape)) throw new Error('shape 只能是 box、sphere 或 torus');
  if (!Number.isInteger(value.count) || value.count < 8 || value.count > 200) throw new Error('count 必须是 8 到 200 的整数');
  if (typeof value.speed !== 'number' || !Number.isFinite(value.speed) || value.speed < 0 || value.speed > 2) throw new Error('speed 必须在 0 到 2 之间');
  return value;
}
function aiPosition(layout, i, count) {
  if (layout === 'grid') {
    const side = Math.ceil(Math.sqrt(count));
    return new THREE.Vector3((i % side - (side - 1) / 2) * 1.15, (Math.floor(i / side) - (side - 1) / 2) * 1.15, 0);
  }
  const t = i / Math.max(1, count);
  const angle = t * Math.PI * 2 * (layout === 'spiral' ? 2.5 : 1);
  const radius = layout === 'spiral' ? 1.3 + t * 3.2 : 3.2;
  return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(t * Math.PI * 2 * 2) * 0.65, Math.sin(angle) * radius);
}
function makeAI(scene, config) {
  const group = new THREE.Group();
  const material = createMaterial({ color: AI_COLORS[config.theme], roughness: 0.24, metalness: 0.42, emissive: AI_COLORS[config.theme], emissiveIntensity: 0.12 });
  const geometry = geometryFor(config.shape, config.shape === 'torus' ? 0.42 : 0.46);
  for (let i = 0; i < config.count; i += 1) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(aiPosition(config.layout, i, config.count));
    mesh.rotation.set(i * 0.13, i * 0.21, i * 0.08);
    group.add(mesh);
  }
  scene.add(group);
  group.userData.geometry = geometry;
  group.userData.material = material;
  return group;
}

function makeScale(scene, config) {
  const group = new THREE.Group();
  const count = config.count;
  const color = COLORS.mint;
  const geometry = new THREE.IcosahedronGeometry(0.08, 0);
  const material = createMaterial({ color, roughness: 0.48, metalness: 0.18, emissive: color, emissiveIntensity: 0.08 });
  const side = Math.ceil(Math.cbrt(count));
  const spacing = count > 10000 ? 0.34 : count > 2000 ? 0.48 : 0.72;
  const positionFor = (i) => new THREE.Vector3((i % side - (side - 1) / 2) * spacing, (Math.floor(i / side) % side - (side - 1) / 2) * spacing, (Math.floor(i / (side * side)) - (side - 1) / 2) * spacing);
  if (config.mode === 'instanced') {
    const instances = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i += 1) { dummy.position.copy(positionFor(i)); dummy.updateMatrix(); instances.setMatrixAt(i, dummy.matrix); }
    instances.instanceMatrix.needsUpdate = true;
    instances.computeBoundingBox();
    instances.computeBoundingSphere();
    group.add(instances);
  } else {
    for (let i = 0; i < Math.min(count, 2000); i += 1) { const mesh = new THREE.Mesh(geometry, material); mesh.position.copy(positionFor(i)); group.add(mesh); }
  }
  scene.add(group);
  return { group, geometry, material, shown: config.mode === 'instanced' ? count : Math.min(count, 2000) };
}

function fitScaleView(scale, camera, controls) {
  const bounds = new THREE.Box3().setFromObject(scale.group);
  const center = bounds.getCenter(new THREE.Vector3());
  const radius = Math.max(0.5, bounds.getBoundingSphere(new THREE.Sphere()).radius);
  const distance = radius / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * 1.25;
  controls.target.copy(center);
  camera.position.copy(center).add(new THREE.Vector3(1, 0.7, 1).normalize().multiplyScalar(distance));
  camera.near = Math.max(0.01, distance - radius * 2.5);
  camera.far = Math.max(100, distance + radius * 3.5);
  controls.maxDistance = Math.max(100, distance * 3);
  controls.update();
}

function meshCount(scene) {
  let count = 0;
  scene.traverse((object) => { if (object.isMesh) count += 1; });
  return count;
}

export async function mountCoreDemo({ id, canvas, onMetrics } = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('mountCoreDemo 需要 HTMLCanvasElement');
  const demoId = ['foundations', 'materials', 'ai', 'scale'].includes(id) ? id : 'foundations';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setClearColor(COLORS.navy, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.navy);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  useCamera(camera, controls);
  const grid = addGrid(scene);
  const lights = addLights(scene, demoId === 'materials' ? 2.2 : 1.7);
  const axes = new THREE.AxesHelper(3.2);
  axes.visible = demoId === 'foundations';
  scene.add(axes);

  let foundation; let materials; let aiConfig = { ...AI_DEFAULTS }; let aiGroup; let scale; let scaleConfig = { count: 2000, mode: 'instanced' }; let resolution = 1;
  if (demoId === 'foundations') foundation = makeFoundation(scene);
  if (demoId === 'materials') materials = makeMaterials(scene, renderer);
  if (demoId === 'ai') aiGroup = makeAI(scene, aiConfig);
  if (demoId === 'scale') { scale = makeScale(scene, scaleConfig); fitScaleView(scale, camera, controls); }

  let disposed = false; let raf = 0; let last = performance.now(); let reportAt = last; let frameCount = 0; let unbound = false; let foundationSpeed = 0.7;
  const resize = () => { if (disposed) return; const width = Math.max(1, canvas.clientWidth || canvas.width || 1); const height = Math.max(1, canvas.clientHeight || canvas.height || 1); const pixelRatio = resolution * Math.min(window.devicePixelRatio || 1, 2); renderer.setPixelRatio(pixelRatio); renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); };
  const observer = new ResizeObserver(resize); observer.observe(canvas); resize();

  const rootRequired = (root, selector) => root?.querySelector?.(selector);
  const setText = (root, selector, value) => { const node = rootRequired(root, selector); if (node) node.textContent = String(value); };
  const rebuildAI = (next, root) => { if (aiGroup) { scene.remove(aiGroup); aiGroup.userData.geometry?.dispose(); aiGroup.userData.material?.dispose(); } aiConfig = next; aiGroup = makeAI(scene, aiConfig); setText(root, '#demo-ai-status', `已应用：${next.theme} / ${next.layout} / ${next.count} 个 / ${next.shape}`); };
  const bindControls = (root) => {
    if (!root || unbound) return; unbound = true;
    if (demoId === 'foundations') {
      const shape = rootRequired(root, '#demo-shape'); const color = rootRequired(root, '#demo-object-color'); const speed = rootRequired(root, '#demo-rotation-speed'); const wire = rootRequired(root, '#demo-wireframe'); const pause = rootRequired(root, '#demo-pause'); const axesInput = rootRequired(root, '#demo-axes');
      shape?.addEventListener('change', () => { const old = foundation.mesh; foundation.group.remove(old); old.geometry.dispose(); foundation.mesh = new THREE.Mesh(geometryFor(shape.value, 2.35), foundation.material); foundation.mesh.position.y = 0.15; foundation.group.add(foundation.mesh); });
      color?.addEventListener('input', () => foundation.material.color.set(color.value)); speed?.addEventListener('input', () => { foundationSpeed = Number(speed.value); setText(root, '#demo-rotation-speed-value', foundationSpeed.toFixed(2)); }); wire?.addEventListener('change', () => { foundation.material.wireframe = wire.checked; }); pause?.addEventListener('change', () => { foundation.group.userData.paused = pause.checked; }); axesInput?.addEventListener('change', () => { axes.visible = axesInput.checked; });
    }
    if (demoId === 'materials') {
      const metal = rootRequired(root, '#demo-metalness'); const rough = rootRequired(root, '#demo-roughness'); const light = rootRequired(root, '#demo-light-intensity');
      metal?.addEventListener('input', () => { materials.material.metalness = Number(metal.value); materials.torusMaterial.metalness = Number(metal.value); setText(root, '#demo-metalness-value', metal.value); });
      rough?.addEventListener('input', () => { materials.material.roughness = Number(rough.value); materials.torusMaterial.roughness = Number(rough.value); setText(root, '#demo-roughness-value', rough.value); });
      light?.addEventListener('input', () => { lights.forEach((item) => { item.intensity = Number(light.value) * (item === lights[1] ? 1.25 : item === lights[2] ? 1.1 : 1); }); setText(root, '#demo-light-intensity-value', light.value); });
    }
    if (demoId === 'ai') {
      const json = rootRequired(root, '#demo-ai-json'); const apply = () => { try { const next = validateAI(JSON.parse(json.value)); rebuildAI(next, root); } catch (error) { setText(root, '#demo-ai-status', `配置错误：${error.message}`); } };
      rootRequired(root, '#demo-ai-json')?.addEventListener('change', apply); rootRequired(root, '#demo-ai-json-apply')?.addEventListener('click', apply); rootRequired(root, '#demo-prompt-apply')?.addEventListener('click', () => { const prompt = String(rootRequired(root, '#demo-prompt')?.value || '').toLowerCase(); const next = { ...aiConfig }; if (prompt.includes('sunset') || prompt.includes('coral') || prompt.includes('日落') || prompt.includes('珊瑚')) next.theme = 'sunset'; else if (prompt.includes('violet') || prompt.includes('purple') || prompt.includes('紫色')) next.theme = 'violet'; else if (prompt.includes('mint') || prompt.includes('green') || prompt.includes('薄荷') || prompt.includes('绿色')) next.theme = 'mint'; if (prompt.includes('grid') || prompt.includes('网格')) next.layout = 'grid'; else if (prompt.includes('spiral') || prompt.includes('螺旋')) next.layout = 'spiral'; else if (prompt.includes('ring') || prompt.includes('环形')) next.layout = 'ring'; if (prompt.includes('box') || prompt.includes('cube') || prompt.includes('方块')) next.shape = 'box'; else if (prompt.includes('torus') || prompt.includes('donut') || prompt.includes('圆环')) next.shape = 'torus'; else if (prompt.includes('sphere') || prompt.includes('球体')) next.shape = 'sphere'; json.value = JSON.stringify(next); rebuildAI(validateAI(next), root); });
      [['#demo-preset-mint', { theme: 'mint', layout: 'ring', count: 36, shape: 'sphere', speed: 0.7 }], ['#demo-preset-sunset', { theme: 'sunset', layout: 'grid', count: 64, shape: 'box', speed: 0.45 }], ['#demo-preset-violet', { theme: 'violet', layout: 'spiral', count: 96, shape: 'torus', speed: 1.1 }]].forEach(([selector, value]) => rootRequired(root, selector)?.addEventListener('click', () => { json.value = JSON.stringify(value); rebuildAI(value, root); }));
    }
    if (demoId === 'scale') {
      const count = rootRequired(root, '#demo-scale-count'); const mode = rootRequired(root, '#demo-scale-mode'); const resolutionInput = rootRequired(root, '#demo-resolution');
      const updateNote = () => setText(root, '#demo-scale-note', `${scaleConfig.mode === 'mesh' ? '普通 Mesh 实际显示：' : 'InstancedMesh 实际实例：'}${scale.shown.toLocaleString()}；DPR 像素数量约 ${resolution ** 2}×（设备 DPR 原始值参与计算）`);
      const rebuild = () => { scaleConfig = { count: Number(count.value), mode: mode.value }; if (scaleConfig.mode === 'mesh') scaleConfig.count = Math.min(scaleConfig.count, 2000); scene.remove(scale.group); scale.geometry.dispose(); scale.material.dispose(); scale = makeScale(scene, scaleConfig); fitScaleView(scale, camera, controls); updateNote(); };
      count?.addEventListener('change', rebuild); mode?.addEventListener('change', rebuild); resolutionInput?.addEventListener('input', () => { resolution = Number(resolutionInput.value); setText(root, '#demo-resolution-value', `${resolution}×`); updateNote(); resize(); });
      updateNote();
    }
  };

  const animate = (now) => { if (disposed) return; const dt = Math.min(0.1, (now - last) / 1000); last = now; frameCount += 1; controls.update();
    if (demoId === 'foundations' && !foundation.group.userData.paused) foundation.group.rotation.y += dt * foundationSpeed;
    if (demoId === 'materials') { materials.group.rotation.y += dt * 0.35; materials.torus.rotation.z += dt * 0.22; }
    if (demoId === 'ai') { aiGroup.rotation.y += dt * aiConfig.speed * 0.45; aiGroup.rotation.x = Math.sin(now * 0.00045) * 0.16; }
    if (demoId === 'scale') scale.group.rotation.y += dt * 0.16;
    renderer.render(scene, camera);
    if (now - reportAt >= 500) { const elapsed = Math.max(0.001, now - reportAt); onMetrics?.({ fps: frameCount * 1000 / elapsed, drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, objects: demoId === 'scale' ? scale.shown : meshCount(scene), note: demoId === 'scale' ? `${scaleConfig.mode} ${scale.shown.toLocaleString()} instances` : demoId }); frameCount = 0; reportAt = now; }
    raf = requestAnimationFrame(animate);
  };
  raf = requestAnimationFrame(animate);

  const disposeObject = (object) => { const geometries = new Set(); const materialsToDispose = new Set(); object?.traverse?.((item) => { if (item.geometry) geometries.add(item.geometry); const mats = Array.isArray(item.material) ? item.material : [item.material]; mats.filter(Boolean).forEach((mat) => materialsToDispose.add(mat)); }); geometries.forEach((geometry) => geometry.dispose()); materialsToDispose.forEach((mat) => { Object.values(mat).forEach((value) => { if (value?.isTexture) value.dispose(); }); mat.dispose(); }); };
  return { controlsHTML: controlsFor(demoId), bindControls, dispose() { if (disposed) return; disposed = true; cancelAnimationFrame(raf); observer.disconnect(); controls.dispose(); disposeObject(scene); materials?.environmentTarget?.dispose(); renderer.renderLists.dispose(); renderer.dispose(); renderer.forceContextLoss?.(); } };
}
