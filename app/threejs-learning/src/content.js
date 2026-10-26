export const levels = [
  {
    "id": "beginner",
    "label": "入门",
    "title": "从空场景到可交互的 3D 画布",
    "eyebrow": "FOUNDATIONS",
    "description": "先建立可运行的心智模型，再逐步把模型、光照、动画和资源接到浏览器事件上。每节都能在一个小页面中验证。",
    "prerequisite": "会写基本 JavaScript、模块导入和 DOM；不需要数学或 WebGL 背景。",
    "outcome": "能独立搭建响应式 Three.js 场景，理解坐标、渲染循环、光照、尺寸与基础资源生命周期。",
    "duration": "约 6 小时（含实践）",
    "accent": "#65d7c1",
    "lessons": [
      {
        "id": "b-scene",
        "title": "第一幅画面：Scene、Camera 与 Renderer",
        "duration": "35 分钟",
        "summary": "把三种核心对象接成一条最小渲染链，看到第一个可控的立方体。",
        "concepts": [
          "Scene",
          "PerspectiveCamera",
          "WebGLRenderer"
        ],
        "sections": [
          {
            "title": "五分钟准备开发环境",
            "body": "先安装 Node.js LTS。新建空目录并执行 `npm init -y`、`npm install three@0.186.1`、`npm install -D vite`。新建 index.html，在 body 内加入 `<script type=\"module\" src=\"./main.js\"></script>`，再把下面 JavaScript 放进 main.js。执行 `npx vite`，打开终端给出的本地地址。不要双击 HTML 用 file:// 打开，因为模块、模型和纹理需要 HTTP 环境。"
          },
          {
            "title": "先建立渲染链",
            "body": "Scene 是对象的容器，Camera 决定从哪里看，WebGLRenderer 把相机看到的结果画进 canvas。透视相机的第一个参数是视野角，后两个是近、远裁剪面；物体落在范围外就不会显示。Three.js 版本固定为 three@0.186.1，建议用 npm 安装并从 `three` 导入。"
          },
          {
            "title": "逐项排错",
            "body": "如果画面全黑，先确认 renderer.domElement 已插入文档，再确认相机 z 大于 0、物体在裁剪面之间。调用 `renderer.setAnimationLoop` 可先画静态帧；等动画课再更新状态。不要把 renderer 当成场景，它只负责把当前场景提交给 GPU。"
          }
        ],
        "code": {
          "language": "js",
          "text": "import * as THREE from 'three';\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);\ncamera.position.z = 4;\nconst renderer = new THREE.WebGLRenderer({ antialias: true });\ndocument.body.append(renderer.domElement);\nrenderer.setSize(innerWidth, innerHeight);\nscene.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial()));\nrenderer.render(scene, camera);"
        },
        "exercise": "新建页面并把背景设为深灰，加入一个球体；分别改动相机 z 和 far，观察哪些设置会让对象消失。",
        "checkpoint": {
          "question": "谁负责把相机看到的场景画到 canvas？",
          "options": [
            "Scene",
            "Camera",
            "WebGLRenderer",
            "Mesh"
          ],
          "answer": 2,
          "explanation": "Renderer 执行渲染命令并管理 canvas；Scene 只保存对象，Camera 只描述观察。"
        },
        "demo": "foundations",
        "prompt": "请解释一个可运行的 Three.js 最小场景，但不要生成任何外部依赖。"
      },
      {
        "id": "b-mesh",
        "title": "对象与坐标：Geometry、Material、Mesh",
        "duration": "40 分钟",
        "summary": "理解“形状 + 外观 = 可渲染对象”，并用位置、旋转、缩放把它放到场景里。",
        "concepts": [
          "Mesh",
          "Geometry",
          "Material",
          "position/rotation/scale"
        ],
        "sections": [
          {
            "title": "三个部件的职责",
            "body": "Geometry 保存顶点、法线和 UV 等形状数据；Material 描述颜色、粗糙度以及是否受光；Mesh 将二者组合成 Scene 可管理的对象。Three.js 使用右手坐标系，默认 y 向上；相机朝自身局部 -Z 方向观察。若相机位于世界 +Z 轴并看向原点，世界 +Z 就朝向你，而不是远离你。`position.set` 改平移，`rotation.y` 改绕 y 轴旋转，`scale` 改局部尺寸。"
          },
          {
            "title": "别混淆局部与世界",
            "body": "子对象的 transform 会继承父对象。把零件挂到 Group 后，零件的 `(0,0,0)` 是父组原点，不再是世界原点。修改 geometry 本身通常影响所有共享它的 Mesh；若只想改变一个实例的大小，应改 Mesh 的 scale。完成后为不再使用的 geometry 和 material 规划 dispose。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const geometry = new THREE.TorusKnotGeometry(0.7, 0.2, 64, 16);\nconst material = new THREE.MeshStandardMaterial({ color: 0x44ccaa, roughness: 0.35 });\nconst mesh = new THREE.Mesh(geometry, material);\nmesh.position.set(0, 0.3, 0); mesh.rotation.y = Math.PI / 5;\nmesh.scale.setScalar(0.9); scene.add(mesh);"
        },
        "exercise": "用 Group 组合一个底座和圆柱，把 Group 移到 x=-1，再让圆柱绕自己的 y 轴旋转；记录父子坐标的差异。",
        "checkpoint": {
          "question": "只改变一个 Mesh 的大小，最安全的做法是什么？",
          "options": [
            "修改共享 Geometry",
            "修改 Mesh.scale",
            "修改 Scene.scale",
            "重建 Renderer"
          ],
          "answer": 1,
          "explanation": "Mesh.scale 是对象自身的变换，不会修改共享几何体。"
        },
        "demo": "foundations",
        "prompt": "为一个机械装置规划 Geometry、Material、Mesh 的分工，输出短步骤。"
      },
      {
        "id": "b-animation",
        "title": "时间与动画循环：让状态持续变化",
        "duration": "35 分钟",
        "summary": "用时钟而不是帧数驱动运动，确保不同刷新率的设备看到相近速度。",
        "concepts": [
          "performance.now",
          "setAnimationLoop",
          "delta time"
        ],
        "sections": [
          {
            "title": "帧不是时间",
            "body": "60Hz 屏幕每秒可能绘制 60 次，低端设备也许只有 30 次。若每帧固定加 0.01，运动速度会随帧率改变。用动画回调的高精度时间戳求出两帧间隔秒数，再乘以每秒速度。页面从后台恢复时可能有很大的间隔，需做上限保护。"
          },
          {
            "title": "组织更新顺序",
            "body": "把“读取时间、更新状态、渲染”写在一个循环中；输入事件只修改目标状态，不直接调用很多次 render。可以对 delta 做 `Math.min(delta, 0.1)` 限制，以免页面恢复时物体瞬移。停止动画时记得取消监听或使用一个 running 标志，避免组件卸载后继续持有引用。"
          }
        ],
        "code": {
          "language": "js",
          "text": "let last = performance.now();\nrenderer.setAnimationLoop(now => {\n  const delta = Math.min((now - last) / 1000, 0.1);\n  last = now;\n  mesh.rotation.y += delta * 1.2;\n  mesh.position.y = Math.sin(now * 0.002) * 0.25;\n  renderer.render(scene, camera);\n});"
        },
        "exercise": "让三个不同颜色的 Mesh 以不同角速度转动，并在页面切到后台再回来时检查是否发生异常跳跃。",
        "checkpoint": {
          "question": "为什么旋转增量应乘以 delta？",
          "options": [
            "让材质更亮",
            "让速度不依赖每秒帧数",
            "让相机自动对焦",
            "让 GPU 释放纹理"
          ],
          "answer": 1,
          "explanation": "delta 是真实时间间隔，乘速度后得到跨帧应增加的角度。"
        },
        "demo": "foundations",
        "prompt": "给出一个用 delta 驱动呼吸动画的伪代码，包含大间隔保护。"
      },
      {
        "id": "b-light",
        "title": "光照与尺寸：可见性不是“加颜色”",
        "duration": "40 分钟",
        "summary": "通过物理直觉理解法线、光源、阴影和世界单位，避免黑球与比例失控。",
        "concepts": [
          "AmbientLight",
          "DirectionalLight",
          "shadows",
          "units"
        ],
        "sections": [
          {
            "title": "材质需要光",
            "body": "MeshStandardMaterial 和 MeshPhysicalMaterial 会根据法线与光源计算明暗；没有光时它们可能接近黑色。AmbientLight 提供均匀基础光，DirectionalLight 可模拟太阳方向。光的强度、距离和颜色要一起调，不要用过曝代替正确曝光。先禁用阴影排错，再逐项打开。"
          },
          {
            "title": "统一尺度",
            "body": "Three.js 不规定“1 等于 1 米”，但你的项目必须规定。若小物体和相机近裁剪面尺度不匹配，会有闪烁或深度精度问题。尺寸变化后同步检查相机 near/far、光源距离和阴影相机范围。阴影贴图会消耗显存和绘制时间，只给必要光源和对象开启。"
          }
        ],
        "code": {
          "language": "js",
          "text": "scene.add(new THREE.HemisphereLight(0xbad8ff, 0x332211, 1.2));\nconst sun = new THREE.DirectionalLight(0xffffff, 2);\nsun.position.set(3, 5, 4); sun.castShadow = true; scene.add(sun);\nmesh.castShadow = mesh.receiveShadow = true;\nrenderer.shadowMap.enabled = true;"
        },
        "exercise": "设定“1 单位 = 1 米”，建一个 2 米高柱体和 5 米远的光源；调阴影相机范围，保证阴影清晰但不过度浪费。",
        "checkpoint": {
          "question": "标准材质在没有合适光源时为何可能近乎黑色？",
          "options": [
            "Geometry 没有顶点",
            "它按光照模型计算颜色",
            "Renderer 不支持颜色",
            "Camera 会删除颜色"
          ],
          "answer": 1,
          "explanation": "Standard/Physical 材质的亮度来自光照计算，不是把颜色直接填满。"
        },
        "demo": "foundations",
        "prompt": "为室内小场景列出光源、阴影和统一尺度的排错顺序。"
      },
      {
        "id": "b-resize",
        "title": "响应式尺寸与交互：输入改变状态",
        "duration": "40 分钟",
        "summary": "让画布适配窗口，并用 Pointer 事件把用户输入转换为可测试的场景状态。",
        "concepts": [
          "resize",
          "PointerEvent",
          "Raycaster"
        ],
        "sections": [
          {
            "title": "尺寸同步",
            "body": "窗口改变时，透视相机的 aspect 必须更新，renderer 的绘制缓冲也要更新。CSS 宽高和 drawing buffer 不是同一个概念；用 `renderer.setSize(width, height, false)` 保持 CSS 布局，再用像素比上限控制高 DPR 设备的成本。不要无限制使用 `devicePixelRatio`。"
          },
          {
            "title": "先处理交互坐标",
            "body": "PointerEvent 坐标通常是页面像素，Raycaster 需要归一化设备坐标 [-1,1]。用 canvas 的 bounding rect 计算，避免页面有边距时偏移。点击后只改选中状态，在循环里平滑更新；触控设备要考虑 pointer capture 和可访问的键盘替代方案。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const canvas = renderer.domElement;\nfunction resize() { const w = canvas.clientWidth, h = canvas.clientHeight;\n  camera.aspect = w / h; camera.updateProjectionMatrix();\n  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(w, h, false); }\naddEventListener('resize', resize); resize();\nconst raycaster = new THREE.Raycaster();\ncanvas.addEventListener('pointerdown', e => { const r = canvas.getBoundingClientRect();\n  const ndc = new THREE.Vector2((e.clientX-r.left)/r.width*2-1, -(e.clientY-r.top)/r.height*2+1);\n  raycaster.setFromCamera(ndc, camera); });"
        },
        "exercise": "做一个点击变色的立方体：命中时保存 selected=true，渲染循环用颜色过渡；给按钮添加“聚焦选中物”的键盘操作。",
        "checkpoint": {
          "question": "Raycaster 的点击坐标为什么要换算到 [-1,1]？",
          "options": [
            "这是材质颜色范围",
            "这是相机投影的 NDC 坐标",
            "这是纹理尺寸",
            "这是 CSS 像素范围"
          ],
          "answer": 1,
          "explanation": "相机投影使用归一化设备坐标，页面像素必须先按 canvas 矩形换算。"
        },
        "demo": "foundations",
        "prompt": "说明如何限制 DPR 并给出窗口 resize 的两条必要更新。"
      },
      {
        "id": "b-assets",
        "title": "资源加载与清理：从图片到 glTF 的边界",
        "duration": "45 分钟",
        "summary": "学习加载器的异步形态、错误处理和销毁路径，避免空白画面与长期内存泄漏。",
        "concepts": [
          "TextureLoader",
          "GLTFLoader",
          "dispose"
        ],
        "sections": [
          {
            "title": "异步不是魔法",
            "body": "纹理和 glTF 都要等待网络与解码。界面应有 loading、error、retry 三种状态，而不是在 promise 尚未完成时访问结果。glTF 返回 scene、animations 等内容，加载后先调整尺度和包围盒，再加入主场景。为相对 URL 配置稳定的资源根路径。"
          },
          {
            "title": "卸载整棵树",
            "body": "移除 Mesh 只断开场景引用，不会自动释放 geometry、material、texture。遍历加载的对象，释放几何体和材质；材质上的 map、normalMap 等纹理也要按引用计数决定是否 dispose。若模型被多个视图共享，不能无条件释放。网络缓存与 GPU 资源是两套生命周期。"
          }
        ],
        "code": {
          "language": "js",
          "text": "import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';\nconst loader = new GLTFLoader();\nloader.load('/assets/robot.glb', gltf => {\n  const root = gltf.scene; root.scale.setScalar(0.01); scene.add(root);\n}, undefined, err => console.error('模型加载失败', err));\nfunction release(root) { root.traverse(o => {\n  if (!o.isMesh) return; o.geometry.dispose();\n  for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {\n    for (const k of ['map','normalMap','roughnessMap']) m?.[k]?.dispose?.(); m?.dispose?.();\n  }\n}); }"
        },
        "exercise": "加载一个 glTF，显示进度或错误；切换模型时先从场景移除旧根节点并执行有引用意识的清理。",
        "checkpoint": {
          "question": "移除 Mesh 后，GPU 几何体会自动释放吗？",
          "options": [
            "总会自动释放",
            "只有调用 geometry.dispose 才明确释放",
            "刷新相机即可",
            "改背景色即可"
          ],
          "answer": 1,
          "explanation": "场景图引用移除与 GPU 资源释放不同，需按共享关系调用 dispose。"
        },
        "demo": "foundations",
        "prompt": "设计一个模型切换函数，列出加载成功、失败、卸载三种状态。"
      }
    ]
  },
  {
    "id": "intermediate",
    "label": "中级",
    "title": "从真实材质到可验证的 AI 工作流",
    "eyebrow": "MATERIALS & TOOLS",
    "description": "进入 PBR、色彩管理、资产拾取、shader 与粒子，并把 AI 当作受约束的辅助工具而不是不可审计的黑箱。",
    "prerequisite": "完成入门；会使用 npm、async/await 和浏览器开发者工具。",
    "outcome": "能制作可读的材质与粒子效果，加载并拾取 glTF，安全地把结构化 AI 输出接入创作流程。",
    "duration": "约 7 小时（含实践）",
    "accent": "#ffbd69",
    "lessons": [
      {
        "id": "i-pbr",
        "title": "PBR 材质：roughness 与 metalness 的证据链",
        "duration": "45 分钟",
        "summary": "用材质参数表达表面，而不是靠随机颜色模拟金属和塑料。",
        "concepts": [
          "MeshStandardMaterial",
          "MeshPhysicalMaterial",
          "PBR"
        ],
        "sections": [
          {
            "title": "读懂参数",
            "body": "roughness 控制高光扩散，0 更锐利、1 更宽；metalness 只用于金属与非金属之间的物理类别，不是“闪亮程度”。金属的基础色主要出现在反射，高光行为依赖环境。先用统一灰材质校验形状，再逐个加颜色和贴图，才能区分模型问题与材质问题。"
          },
          {
            "title": "环境比单盏灯可靠",
            "body": "PBR 在均匀环境贴图下更容易稳定观察，但环境图的色彩空间必须正确。Physical 材质的 clearcoat、ior 等增强项会增加理解成本与性能开销，先确认场景需要。避免把曝光、灯光强度和 baseColor 同时乱调；保留一组可复现的基准参数。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const mat = new THREE.MeshStandardMaterial({ color: 0x8c6b52,\n  metalness: 0.05, roughness: 0.72 });\nconst metal = new THREE.MeshPhysicalMaterial({ color: 0x9aa4b2,\n  metalness: 1, roughness: 0.25, clearcoat: 0.1 });\nmesh.material = mat; scene.environment = envTexture;"
        },
        "exercise": "制作三种同形状材料：橡胶、拉丝金属、上釉陶瓷；记录每次只改一个参数后的视觉证据。",
        "checkpoint": {
          "question": "roughness 主要控制什么？",
          "options": [
            "网格顶点数",
            "高光的扩散程度",
            "相机视野",
            "纹理下载速度"
          ],
          "answer": 1,
          "explanation": "roughness 越低高光越集中，越高越宽散；它不是几何细分参数。"
        },
        "demo": "materials",
        "prompt": "为一个 PBR 试验台设计可复现的参数表，指出哪些参数不要同时修改。"
      },
      {
        "id": "i-color",
        "title": "纹理与色彩：采样正确才谈美术",
        "duration": "45 分钟",
        "summary": "处理纹理色彩空间、UV、各向异性和像素比，避免发灰、过亮或错位。",
        "concepts": [
          "colorSpace",
          "UV",
          "anisotropy"
        ],
        "sections": [
          {
            "title": "颜色纹理与数据纹理不同",
            "body": "颜色贴图承载人眼看到的颜色，应标为 sRGB；roughness、normal 等是数据，通常保持线性解释。加载后设置 `texture.colorSpace = THREE.SRGBColorSpace`，再交给材质。不要把所有图片一律转 sRGB。纹理重复、翻转和 UV 错误应在材质调试球上单独排查。"
          },
          {
            "title": "清晰不等于无限放大",
            "body": "纹理过滤和各向异性改善斜视表面，但会增加采样成本。开启 mipmap 通常利于远处稳定；贴图尺寸要结合目标屏幕覆盖范围决定。高 DPR 只提高绘制缓冲，不会创造不存在的纹理细节。用浏览器性能工具验证修改是否值得。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const color = new THREE.TextureLoader().load('/assets/albedo.jpg');\ncolor.colorSpace = THREE.SRGBColorSpace;\ncolor.wrapS = color.wrapT = THREE.RepeatWrapping; color.repeat.set(3, 3);\ncolor.anisotropy = renderer.capabilities.getMaxAnisotropy();\nconst mat = new THREE.MeshStandardMaterial({ map: color, roughness: 0.8 });"
        },
        "exercise": "用一张棋盘图检查 UV，分别将 albedo 与 normal 设为正确/错误色彩空间，写下画面差异而非只凭感觉。",
        "checkpoint": {
          "question": "roughness 贴图通常应如何解释？",
          "options": [
            "当作 sRGB 颜色",
            "作为线性数据",
            "必须删除",
            "作为字体"
          ],
          "answer": 1,
          "explanation": "粗糙度是数值数据，不是显示颜色，应避免颜色空间转换。"
        },
        "demo": "materials",
        "prompt": "写出颜色纹理和数据纹理的加载检查清单。"
      },
      {
        "id": "i-gltf",
        "title": "glTF 资产管线：从文件到可控对象",
        "duration": "50 分钟",
        "summary": "掌握 glTF 的节点、动画和材质边界，建立可替换、可测量的资产加载层。",
        "concepts": [
          "GLTFLoader",
          "AnimationMixer",
          "bounding box"
        ],
        "sections": [
          {
            "title": "加载后不要盲猜尺度",
            "body": "glTF 可能包含多个节点、相机、灯和动画。加载完成后遍历层级、统计 Mesh 数量，并用 Box3 计算包围盒。根据目标单位统一缩放，把根节点放在场景约定的原点。动画需要 AnimationMixer，并在循环中用 delta 更新；不要把动画时间写死成帧数。"
          },
          {
            "title": "资产契约",
            "body": "在项目约定中明确贴图色彩、轴向、命名和最大三角形数。加载器回调里只做解析和验证，渲染层通过接口拿到经过检查的 root。若文件来自不可信来源，不能执行其中的脚本；glTF 数据也要限制大小和数量，避免恶意资源拖垮页面。"
          }
        ],
        "code": {
          "language": "js",
          "text": "import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';\nconst gltf = await new GLTFLoader().loadAsync('/assets/scene.glb');\nconst root = gltf.scene; const box = new THREE.Box3().setFromObject(root);\nconst size = box.getSize(new THREE.Vector3()); root.scale.setScalar(2 / Math.max(size.x, size.y, size.z));\nconst mixer = new THREE.AnimationMixer(root);\nconst action = gltf.animations[0] && mixer.clipAction(gltf.animations[0]).play();\nscene.add(root); // 循环中 mixer.update(delta)"
        },
        "exercise": "为加载器加一个验证器：拒绝超过文件大小、节点数量或纹理尺寸阈值的资产，并在 UI 中显示拒绝原因。",
        "checkpoint": {
          "question": "为什么加载 glTF 后要先计算包围盒？",
          "options": [
            "为了改变颜色",
            "为了统一尺度与相机 framing",
            "为了安装依赖",
            "为了关闭深度测试"
          ],
          "answer": 1,
          "explanation": "包围盒提供实际尺寸，可用于缩放、居中和设置相机/裁剪面。"
        },
        "demo": "materials",
        "prompt": "给 glTF 加载层定义三个输入限制和两个可观测指标。"
      },
      {
        "id": "i-ray",
        "title": "Raycaster：拾取、过滤与反馈",
        "duration": "40 分钟",
        "summary": "将射线命中转化为稳定的选择模型，而不是把交互逻辑散落在每个 Mesh 上。",
        "concepts": [
          "Raycaster",
          "Layers",
          "intersections"
        ],
        "sections": [
          {
            "title": "命中结果要排序",
            "body": "intersectObjects 返回按距离排序的交集，最近项通常是用户想选的对象，但透明外壳、辅助线和隐藏层可能抢走命中。把可交互对象放入数组或使用 Layers，再明确过滤 `object.userData.pickable`。递归参数会遍历子节点，复杂模型可先做粗略代理。"
          },
          {
            "title": "选择是状态机",
            "body": "命中后保存 selectedId，而不是永久把材质颜色改掉。渲染层根据状态显示 outline、颜色或信息面板，取消选择时恢复原状。移动指针时要节流或只在坐标变化后测试；触控点击和键盘选择也应走同一个 `select(id)` 函数，便于测试与无障碍。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const pickables = [buttonMesh, dialMesh];\nfunction pick(event) { const r = renderer.domElement.getBoundingClientRect();\n  pointer.set((event.clientX-r.left)/r.width*2-1, -(event.clientY-r.top)/r.height*2+1);\n  raycaster.setFromCamera(pointer, camera);\n  const hit = raycaster.intersectObjects(pickables, true).find(x => x.object.userData.pickable);\n  select(hit?.object.userData.id ?? null); }"
        },
        "exercise": "给一个 glTF 模型的三个节点写 pickable/id，点击后更新侧栏；测试点击透明外壳时是否符合你的过滤规则。",
        "checkpoint": {
          "question": "为何不要直接把命中 Mesh 的颜色当作唯一选择状态？",
          "options": [
            "颜色不能显示",
            "状态与渲染反馈应分离",
            "Raycaster 不支持颜色",
            "材质不可修改"
          ],
          "answer": 1,
          "explanation": "独立状态可支持取消、键盘操作、重渲染和多种反馈而不破坏原材质。"
        },
        "demo": "materials",
        "prompt": "设计一个 select(id) 接口，说明鼠标、键盘都如何调用它。"
      },
      {
        "id": "i-shader",
        "title": "Shader 与粒子：只在需要时下沉",
        "duration": "50 分钟",
        "summary": "用 ShaderMaterial 和点云理解 GPU 批量计算，同时知道自定义 shader 的维护边界。",
        "concepts": [
          "ShaderMaterial",
          "Points",
          "uniform"
        ],
        "sections": [
          {
            "title": "uniform 是输入契约",
            "body": "顶点着色器决定顶点位置，片元着色器决定像素颜色；uniform 是 CPU 每帧传给 GPU 的少量参数。粒子常用 BufferGeometry 的 position 属性和 PointsMaterial，数量大时避免每粒子一个 Mesh。自定义 shader 要明确坐标空间、透明混合和深度写入，否则会出现排序伪影。"
          },
          {
            "title": "先测批量收益",
            "body": "shader 并不自动更快：高分辨率片元计算、分支和透明 overdraw 都可能成为瓶颈。先用实例或点云减少对象提交，再用 shader 做统一变形。把时间作为 uniform 更新，不要每帧重建字符串或 BufferGeometry。用 draw calls、GPU 时间近似指标和视觉结果一起判断。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const geo = new THREE.BufferGeometry();\nconst pos = new Float32Array(12000); for (let i=0;i<pos.length;i++) pos[i]=(Math.random()-0.5)*8;\ngeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));\nconst points = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x66ddff, size: 0.035 })); scene.add(points);\n// 更复杂效果：ShaderMaterial 的 uTime 驱动顶点，而非每帧改所有坐标"
        },
        "exercise": "做 4,000 个粒子，用一个时间 uniform 形成波浪；分别记录 Points、独立 Mesh 两种方案的 draw calls 和帧时间。",
        "checkpoint": {
          "question": "大量粒子首先应避免什么？",
          "options": [
            "使用一个 BufferGeometry",
            "每个粒子一个独立 Mesh",
            "统一更新 uniform",
            "测量 draw calls"
          ],
          "answer": 1,
          "explanation": "独立 Mesh 会增加对象与绘制提交；点云或实例化可批量处理。"
        },
        "demo": "materials",
        "prompt": "写出将每粒子 CPU 更新改成 uniform/顶点计算前要检查的两个瓶颈。"
      },
      {
        "id": "i-ai",
        "title": "AI 辅助创作：结构化、验证、可回滚",
        "duration": "55 分钟",
        "summary": "把 AI 放在提示、草图和配置建议的位置，建立不泄露密钥且可审计的工作流。",
        "concepts": [
          "AI workflow",
          "JSON Schema",
          "validation"
        ],
        "sections": [
          {
            "title": "静态站的真实边界",
            "body": "本课程站是静态前端，内置示例没有 AI 接口；页面里的提示词演示不是真 AI 调用，也不应假装生成了模型或贴图。生产环境应由受控后端持有密钥，前端只提交经过筛选的任务并接收结果。密钥绝不能放在前端 bundle、localStorage 或公开 URL。"
          },
          {
            "title": "输出必须不可信",
            "body": "让模型输出受 JSON Schema 约束的场景配置，再用代码校验类型、枚举、数量、URL allowlist、纹理大小和颜色范围。验证失败就拒绝或回退到人工版本，保留 prompt、版本和输入摘要便于回滚。不要执行 AI 输出中的任意 JavaScript；配置只能驱动白名单 API。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const schema = { type: 'object', required: ['objects'],\n  properties: { objects: { type: 'array', maxItems: 100 } } };\nfunction acceptAiConfig(value) {\n  if (!value || !Array.isArray(value.objects) || value.objects.length > schema.properties.objects.maxItems) throw new Error('invalid config');\n  return value.objects.map(o => ({ kind: ['box','sphere'].includes(o.kind) ? o.kind : 'box',\n    color: /^#[0-9a-f]{6}$/i.test(o.color) ? o.color : '#ffffff' }));\n}\n// 静态演示只展示 prompt，不发起 AI 请求，也不放密钥。"
        },
        "exercise": "设计一个 AI 生成“展台布局”的 JSON 配置协议，写出三条拒绝规则，并用固定样例测试验证器。",
        "checkpoint": {
          "question": "哪项做法符合安全的 AI 前端架构？",
          "options": [
            "把密钥写入源码",
            "直接执行模型返回的 JS",
            "后端保管密钥并验证 JSON",
            "相信关键词演示是真调用"
          ],
          "answer": 2,
          "explanation": "密钥应留在受控后端，模型输出必须被当作不可信数据验证。"
        },
        "demo": "ai",
        "prompt": "为静态 Three.js 站写一段诚实的 AI 辅助提示词，明确它只产出 JSON 草案。"
      }
    ]
  },
  {
    "id": "advanced",
    "label": "高级",
    "title": "规模化渲染与高分辨率图像工程",
    "eyebrow": "SCALE & HI-RES",
    "description": "从 CPU 提交、可见性和资源生命周期出发，建立大场景与超大画布的工程化方案，明确 WebGL 与 WebGPU 的边界。",
    "prerequisite": "完成中级；理解矩阵、纹理、glTF 与浏览器性能面板。",
    "outcome": "能量测并优化大规模场景，设计分块流式和高分辨率导出管线，避免显存、内存与浏览器安全边界。",
    "duration": "约 8 小时（含实践）",
    "accent": "#a88bff",
    "lessons": [
      {
        "id": "a-instancing",
        "title": "Draw calls 与 InstancedMesh",
        "duration": "55 分钟",
        "summary": "先定位 CPU 提交瓶颈，再用实例化把同形状对象压成少量绘制。",
        "concepts": [
          "draw calls",
          "InstancedMesh",
          "frustumCulled"
        ],
        "sections": [
          {
            "title": "对象多不等于三角形多",
            "body": "每次 draw call 都有状态设置和命令提交成本；一万个独立 Mesh 即便几何很简单，也可能被 CPU 提交拖慢。InstancedMesh 共享 geometry/material，用 instanceMatrix 表达每个实例的变换，适合树、石头、标记等同形状对象。每实例颜色可用 setColorAt，但要标记 instanceColor.needsUpdate。"
          },
          {
            "title": "实例化的取舍",
            "body": "实例仍会被整体视锥裁剪；一个巨大实例组只要有一部分可见就可能整组绘制。可按空间分组，给每组维护包围体。Raycaster 对实例命中会提供 instanceId，选择反馈应映射回业务数据。测量 draw calls、三角形数和帧时间，不要仅凭“用了 InstancedMesh”宣称优化。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const count = 10000;\nconst inst = new THREE.InstancedMesh(geo, mat, count);\nconst m = new THREE.Matrix4();\nfor (let i=0; i<count; i++) { m.makeTranslation((i%100)-50, 0, Math.floor(i/100)-50); inst.setMatrixAt(i, m); }\ninst.instanceMatrix.needsUpdate = true; scene.add(inst);\nconsole.log('draw calls target: one group, instances:', count);"
        },
        "exercise": "把 2,000 个独立立方体与一个 InstancedMesh 对照，记录 renderer.info.render.calls 和平均帧时间。",
        "checkpoint": {
          "question": "InstancedMesh 的核心收益是什么？",
          "options": [
            "让每个实例拥有独立 Geometry",
            "减少相同材质/几何的提交次数",
            "自动提高纹理分辨率",
            "取消视锥裁剪"
          ],
          "answer": 1,
          "explanation": "实例共享资源并批量绘制，但仍需考虑分组、裁剪和更新成本。"
        },
        "demo": "scale",
        "prompt": "设计把实例按网格分组的策略，说明何时拆组。"
      },
      {
        "id": "a-stream",
        "title": "分块、LOD、裁剪与流式加载",
        "duration": "60 分钟",
        "summary": "将无限大世界拆为可管理的块，只让摄像机附近和需要的细节进入 GPU。",
        "concepts": [
          "LOD",
          "frustum culling",
          "streaming"
        ],
        "sections": [
          {
            "title": "可见性是多层筛选",
            "body": "视锥裁剪只排除相机外对象；距离 LOD 再按屏幕贡献选择高、中、低细节；遮挡剔除则需要额外数据结构。把世界按固定大小 chunk 划分，每块有包围盒、状态和优先级。相机移动时先加载近处低模，再异步替换高模，避免一帧塞入所有资源。"
          },
          {
            "title": "流式状态机",
            "body": "chunk 可经历 unloaded、loading、ready、evicting 四态；重复请求要合并，失败要退避重试。卸载前移除场景引用，再按共享资源引用计数 dispose。预取范围不能无限增长，要受内存预算控制。LOD 切换可加滞后阈值，避免相机在边界来回抖动。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const lod = new THREE.LOD();\nlod.addLevel(highRoot, 0); lod.addLevel(midRoot, 30); lod.addLevel(lowRoot, 90);\nfunction updateChunks(camera) { for (const chunk of chunks) {\n  const d = chunk.bounds.distanceToPoint(camera.position);\n  if (d < 180) requestChunk(chunk); else if (d > 240) evictChunk(chunk);\n} }\n// 180/240 的滞后避免反复加载与卸载"
        },
        "exercise": "实现 3x3 chunk 邻域：摄像机进入新块时先加载低模，离开 240 单位后淘汰；在 Network 面板验证并发请求上限。",
        "checkpoint": {
          "question": "为什么加载/卸载阈值要有滞后？",
          "options": [
            "提升颜色饱和度",
            "避免边界附近反复抖动",
            "关闭深度测试",
            "让 far 自动增大"
          ],
          "answer": 1,
          "explanation": "不同进入和退出距离可避免相机在边界来回触发请求。"
        },
        "demo": "scale",
        "prompt": "为一个 chunk 状态机列出转移条件和内存预算。"
      },
      {
        "id": "a-memory",
        "title": "显存、压缩与资源销毁",
        "duration": "55 分钟",
        "summary": "把纹理、几何和中间目标当作有限预算管理，而不是等浏览器替你善后。",
        "concepts": [
          "VRAM budget",
          "KTX2Loader",
          "dispose"
        ],
        "sections": [
          {
            "title": "估算先于优化",
            "body": "RGBA8 一张 W×H 纹理至少约为 W×H×4 字节，mipmap、深度、MSAA 和中间 framebuffer 还要另计；压缩纹理降低带宽和显存，但会有格式与质量取舍。maxTextureSize 是上限而非可用预算，设备实际资源可能更紧。先记录纹理清单、尺寸、格式和用途，再决定压缩。"
          },
          {
            "title": "资源生命周期",
            "body": "场景切换、缩略图缓存和后处理都会制造短命资源。用资源管理器登记 geometry、material、texture、render target 的所有者与引用数；淘汰时执行 dispose 并清空缓存。不要频繁调用 `renderer.dispose()` 作为日常清理，它适合彻底销毁 renderer，且会影响共享上下文。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const max = renderer.capabilities.maxTextureSize;\nconst bytes = (w, h, channels = 4) => w * h * channels;\nconsole.log({ maxTextureSize: max, rgba8_4096: bytes(4096, 4096) });\n// 生产中用 KTX2/Basis 压缩并依据设备支持选择格式；\n// renderTarget.dispose(); texture.dispose(); geometry.dispose();"
        },
        "exercise": "做一个资源面板，估算 RGBA8 纹理与 mipmap 的字节数，超过预算时拒绝加载而不是等崩溃。",
        "checkpoint": {
          "question": "RGBA8 的 W×H×4 估算遗漏了什么？",
          "options": [
            "相机焦距",
            "深度/MSAA/中间缓冲与 mipmap",
            "HTML 标题",
            "对象名称"
          ],
          "answer": 1,
          "explanation": "基础颜色缓冲只是起点，实际渲染常有额外附件和多级纹理。"
        },
        "demo": "scale",
        "prompt": "解释 maxTextureSize 与设备可用显存的区别，并给出一个保守策略。"
      },
      {
        "id": "a-measure",
        "title": "性能量测与 WebGPU 边界",
        "duration": "50 分钟",
        "summary": "建立可复现的基准，理解公开 WebGLRenderer API 能做到什么，以及 WebGPU 何时只是方向。",
        "concepts": [
          "renderer.info",
          "Performance API",
          "WebGPU boundary"
        ],
        "sections": [
          {
            "title": "先形成基线",
            "body": "固定相机路径、对象数量、窗口尺寸和 DPR，预热资源后多帧采样。记录 `renderer.info.render.calls`、triangles、纹理数量与 `performance.now()` 帧间隔，并区分 CPU、GPU、网络和解码时间。开发者工具中的 FPS 只是线索，不能替代具体指标。每次优化只改一个变量。"
          },
          {
            "title": "不要假设 WebGPU",
            "body": "本课程的可运行示例只使用 three@0.186.1 的公开稳定 WebGLRenderer API。WebGPURenderer 可作为进阶方向，但浏览器、驱动、功能覆盖和部署条件并不普遍一致；不能把 WebGPU 当作所有用户的默认后端，也不要为了“未来”调用未验证 API。为能力检测准备 WebGL 回退。"
          }
        ],
        "code": {
          "language": "js",
          "text": "let last = performance.now();\nconst samples = [];\nrenderer.setAnimationLoop(now => {\n  samples.push(now - last); last = now;\n  renderer.render(scene, camera);\n  if (samples.length === 120) {\n    samples.sort((a, b) => a - b);\n    console.table({ medianFrameMs: samples[60],\n      calls: renderer.info.render.calls, triangles: renderer.info.render.triangles });\n    samples.length = 0;\n  }\n});\n// rAF 间隔是帧节奏，不是独立 GPU 耗时。\n// renderer.render() 的同步耗时仅反映 CPU 提交；GPU 计时需受支持的异步查询。"
        },
        "exercise": "制作固定 10 秒基准：分别改变 DPR、实例数量和后处理开关，导出 CSV，写出“收益/画质/风险”三列结论。",
        "checkpoint": {
          "question": "WebGPU 在本课程中应如何定位？",
          "options": [
            "假设所有浏览器都支持",
            "作为有能力检测的进阶方向",
            "取代所有 WebGL 代码",
            "不用测量直接启用"
          ],
          "answer": 1,
          "explanation": "WebGPU 支持与 API 覆盖仍需检测；稳定 WebGLRenderer 是默认基线。"
        },
        "demo": "scale",
        "prompt": "列出一个公平基准的固定条件，以及至少四个要记录的指标。"
      },
      {
        "id": "a-export",
        "title": "高分辨率分块导出：像素预算而非口号",
        "duration": "60 分钟",
        "summary": "在不把整个超大画布塞进单个 framebuffer 的前提下，拼接可验证的高分辨率图像。",
        "concepts": [
          "maxTextureSize",
          "tile render",
          "readPixels"
        ],
        "sections": [
          {
            "title": "先算内存",
            "body": "目标 W×H 的 RGBA8 一缓冲约 W×H×4 字节；深度、MSAA、后处理和临时缓冲另计。即使设备报告 maxTextureSize 足够，也不代表一次分配就安全。高分辨率输出只是更多真实像素，不等于超分辨率增强；细节仍受几何、材质、采样和相机影响。先设预算并分块。"
          },
          {
            "title": "分块相机与接缝",
            "body": "透视相机用 `camera.setViewOffset(fullW, fullH, x, y, tileW, tileH)` 设置子视锥，其中 x/y 从完整画面的左上角计算。冻结动画与镜头，逐块渲染并回读；WebGL 回读的行从下到上，拼接时要翻转。实验未使用屏幕空间后处理；若加入 Bloom、模糊或卷积，需为 tile 加 halo 邻域、裁边后拼接，并另行处理全局效果。"
          }
        ],
        "code": {
          "language": "js",
          "text": "const capture = camera.clone(); // 冻结镜头与场景动画\nconst target = new THREE.WebGLRenderTarget(tile, tile);\ntry {\n  for (let y = 0; y < fullH; y += tile) {\n    for (let x = 0; x < fullW; x += tile) {\n      const w = Math.min(tile, fullW - x), h = Math.min(tile, fullH - y);\n      target.setSize(w, h);\n      capture.setViewOffset(fullW, fullH, x, y, w, h);\n      renderer.setRenderTarget(target); renderer.render(scene, capture);\n      const rgba = new Uint8Array(w * h * 4);\n      renderer.readRenderTargetPixels(target, 0, 0, w, h, rgba);\n      // 将 rgba 的行翻转后写入整图 (x, y)；完整实现见高清实验。\n      await new Promise(requestAnimationFrame); // 让出主线程\n    }\n  }\n} finally { renderer.setRenderTarget(null); target.dispose(); }"
        },
        "exercise": "做 2x2 分块导出测试，用纯色四象限验证边界坐标；再加入 halo，比较后处理边缘是否有接缝。",
        "checkpoint": {
          "question": "为什么 8K 不能直接宣称“超分增强”？",
          "options": [
            "8K 没有像素",
            "输出像素增多不等于生成真实细节",
            "相机不支持颜色",
            "RGBA8 没有内存"
          ],
          "answer": 1,
          "explanation": "更大画布只是更高采样尺寸，真实细节仍由场景数据和算法决定。"
        },
        "demo": "hires",
        "prompt": "给出高分辨率导出前的预算公式，明确至少三类额外缓冲。"
      },
      {
        "id": "a-pyramid",
        "title": "图像金字塔、Tiles 与 Worker",
        "duration": "65 分钟",
        "summary": "把超大图像当作可按视口请求的多级瓦片，并用 Worker 隔离拼接和解码压力。",
        "concepts": [
          "image pyramid",
          "tiles",
          "Web Worker",
          "halo"
        ],
        "sections": [
          {
            "title": "只请求看得见的层级",
            "body": "图像金字塔把同一内容存成多级分辨率；当前缩放决定 level，视口决定 x/y tile。先请求低级别快速显示，再补充更细瓦片，缓存键应包含 source、level、x、y 和版本。瓦片边缘需要 halo 或重叠采样，否则缩放、卷积和锐化会出现接缝。"
          },
          {
            "title": "Worker 不是无限加速",
            "body": "Worker 适合图像解码、拼接、缩放和导出，主线程保留交互与 WebGL 提交。用可转移 ArrayBuffer 减少复制，并限制并发和缓存大小；取消过期请求，避免用户拖拽缩放时堆积任务。跨域图片需正确 CORS，否则 canvas 会被污染，无法安全读取像素。"
          }
        ],
        "code": {
          "language": "js",
          "text": "// main.js\nconst worker = new Worker(new URL('./tile-worker.js', import.meta.url), { type: 'module' });\nworker.postMessage({ level: 3, x: 4, y: 2, url: '/tiles/3/4/2.jpg' });\nworker.onmessage = ({ data }) => { if (data.kind === 'bitmap') {\n  const tex = new THREE.CanvasTexture(data.bitmap); tex.colorSpace = THREE.SRGBColorSpace;\n  // 更新可见 tile；过期 tile 及时 dispose\n} };\n// worker 内部负责 fetch/createImageBitmap/拼接，不执行不可信脚本"
        },
        "exercise": "实现一个两级金字塔查看器：拖动时只保留当前视口周围 2 圈瓦片，缩放结束后请求更高 level；记录缓存命中率和取消次数。",
        "checkpoint": {
          "question": "Worker 图像任务为何要限制并发？",
          "options": [
            "并发越多越安全",
            "避免内存、网络和过期任务失控",
            "让相机变成正交",
            "自动提升纹理色彩"
          ],
          "answer": 1,
          "explanation": "并发与缓存无上限会造成内存峰值和无用解码，尤其在连续缩放时。"
        },
        "demo": "image",
        "prompt": "设计 tile 缓存键、淘汰规则和 halo 处理步骤，说明跨域要求。"
      }
    ]
  }
];

export const demos = [
  {
    "id": "foundations",
    "title": "基础场景实验室",
    "tag": "FOUNDATIONS",
    "description": "切换几何形状、颜色与线框，调节动画，拖动镜头观察三维坐标。",
    "level": "beginner",
    "concepts": [
      "Scene 保存对象，Camera 描述视角，Renderer 负责把结果画到 canvas。",
      "切换形状只更换 Geometry；颜色和线框由 Material 决定。",
      "旋转速度乘以真实时间间隔，避免运动依赖设备刷新率。"
    ]
  },
  {
    "id": "materials",
    "title": "PBR 材质试验台",
    "tag": "MATERIALS",
    "description": "实时调整金属度、粗糙度与灯光强度，观察环境反射和表面高光。",
    "level": "intermediate",
    "concepts": [
      "roughness 控制高光扩散，metalness 表达金属与非金属特性。",
      "环境反射决定 PBR 的观感，不能只靠把灯光调亮来制造金属感。",
      "一次只改一个参数；纹理色彩和 glTF 加载的完整流程见关联课程。"
    ]
  },
  {
    "id": "ai",
    "title": "AI 场景配置工作台",
    "tag": "AI × 3D",
    "description": "用本地关键词和受限 JSON 搭建环形、网格与螺旋场景，不调用在线 AI。",
    "level": "intermediate",
    "concepts": [
      "本地规则不是 AI：课程提供外部 AI 提示词，演示负责验证和预览配置。",
      "只允许白名单字段和受限数量，不运行生成的任意 JavaScript。",
      "真正接入 AI 时必须用服务端保护密钥，并限制请求、资源和输出。"
    ]
  },
  {
    "id": "scale",
    "title": "海量实例渲染实验",
    "tag": "SCALE",
    "description": "对比普通 Mesh 与最多 50,000 个实例，测量真实 draw calls 与像素负载。",
    "level": "advanced",
    "concepts": [
      "同几何、同材质的重复对象适合 InstancedMesh，可大幅减少 CPU 提交。",
      "draw calls 降低不代表 GPU 像素负载也降低；DPR 的像素成本近似平方增长。",
      "本实验验证实例化；LOD、分块裁剪和流式状态机在高级课程继续扩展。"
    ]
  },
  {
    "id": "hires",
    "title": "高分辨率分块导出",
    "tag": "HI-RES",
    "description": "真实分块渲染并拼接 2048 或 4096 像素宽 PNG，查看预算与导出进度。",
    "level": "advanced",
    "concepts": [
      "setViewOffset 为每块设置子视锥，冻结场景后复用一个渲染目标。",
      "readRenderTargetPixels 的行序需翻转；分块降低 GPU 峰值，但 CPU 仍拼接整图。",
      "本例不含屏幕空间后处理；加入 Bloom、模糊等效果时需额外 halo 和全局处理。"
    ]
  },
  {
    "id": "image",
    "title": "本地图像 Shader 工坊",
    "tag": "IMAGE PIPELINE",
    "description": "本地加载图像，用 GPU 调整亮度、对比度、饱和度与锐化，下载处理预览。",
    "level": "advanced",
    "concepts": [
      "上传仅在当前浏览器内读取，不会发到服务器；颜色与数据纹理需区别处理。",
      "本例限制 24 MP 和最大边 8192，导出最大边 2048 的预览，并非全尺寸流式编辑器。",
      "超大图生产方案见课程：图像金字塔、可见 tiles、Worker 解码、LRU 缓存与 halo。"
    ]
  }
];

export const sources = [
  {
    "title": "Three.js Manual",
    "url": "https://threejs.org/manual/"
  },
  {
    "title": "Three.js Documentation",
    "url": "https://threejs.org/docs/"
  },
  {
    "title": "Optimize Lots of Objects",
    "url": "https://threejs.org/manual/pages/optimize-lots-of-objects.html"
  },
  {
    "title": "Three.js Tips",
    "url": "https://threejs.org/manual/pages/tips.html"
  },
  {
    "title": "Three.js Cleanup",
    "url": "https://threejs.org/manual/pages/cleanup.html"
  }
];

export const version = "three@0.186.1";
