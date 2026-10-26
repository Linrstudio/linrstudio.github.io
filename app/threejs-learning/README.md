# Three Lab · Three.js 学习站

中文 Three.js 入门、中级、高级课程，共 18 节小课和 6 个相互链接的交互实验。纯静态站点，无后端，无外部运行时 CDN，无前端 API 密钥。

## 入口

- `index.html`：学习路径、实验索引与 AI 工作流。
- `course.html?level=beginner`：基础场景、几何、相机、光照、交互、资源管理。
- `course.html?level=intermediate`：PBR、纹理/glTF、Raycaster、Shader 与 AI 安全工作流。
- `course.html?level=advanced`：实例化、分块/LOD、显存与性能、高分辨率输出和图像金字塔。
- `lab.html?demo=foundations|materials|ai|scale|hires|image`：六个真实浏览器实验。

每节课包含概念、解释、代码片段、练习、AI 提示词和知识检查。学习进度只保存在本浏览器的 localStorage，不跨设备同步。

## 开发和发布

固定依赖 `three@0.186.1`，使用 WebGLRenderer / WebGL 2。需要现代浏览器和硬件加速。

```sh
npm ci
npm run build
npm run serve
# http://localhost:8080
```

HTML、CSS、`assets/`、`favicon.svg` 和 `THREE-LICENSE.txt` 为直接发布文件；`src/` 和构建配置用于维护。全部资源使用相对路径，可放到 GitHub Pages 的 `app/threejs-learning/` 目录。无需改根目录 Pages 配置或 CNAME。

```sh
npm test  # 本地服务已运行时执行 Playwright 交互检查；需本机 Chromium
```

## 实验的真实边界

**AI 配置工作台**是本地关键词规则和受限 JSON 验证演示，不是在线 AI。可在外部 AI 工具中使用课程的提示词，把返回的受限 JSON 复制到工作台。生产接入应通过自己的后端保护密钥，限制请求与输出，验证字段/类型/数量/资源 URL，不执行生成的任意代码。

**规模化渲染**对比普通 Mesh 与 InstancedMesh。普通模式限 2,000；实例化最高 50,000。FPS、draw calls 和三角形数来自当前设备的实际渲染，性能不作跨设备承诺。DPR 缩放对像素数量的影响近似平方关系。生产场景还需要分块、裁剪、LOD、压缩和流式资源预算。

**高分辨率导出**真实使用 `PerspectiveCamera.setViewOffset` 和可复用 `WebGLRenderTarget` 分块渲染、GPU 回读、CPU 画布拼接。提供 2048×1152 与 4096×2304 PNG、256/512/1024 tile 和取消。RGBA8 最低颜色预算是 `W×H×4` 字节，深度、编码、中间拷贝和浏览器开销另计。分块降低 GPU 峰值，但不会消除整图 CPU 拼接内存。更大规模需流式编码、服务端或桌面管线。含 Bloom/SSAO 等屏幕空间效果时，还必须处理 tile halo 与全局效果，不能直接照搬本例。高分辨率渲染不是 AI 超分辨率增强。

**本地图像 Shader**支持亮度、对比度、饱和度和锐化。上传文件留在浏览器，不上传；限制 24 MP、最大边 8192，并检查 GPU 限制。导出是最大边 2048 的处理预览，非全尺寸流式编辑器。生产超大图应使用多级图像金字塔、按需 tiles、Worker 解码、LRU 缓存、halo 邻域和纹理释放。

## 官方参考与许可

这是 LinrStudio 的独立学习项目，不是 Three.js 官方课程。Three.js 源码使用 MIT 许可，完整声明在 `THREE-LICENSE.txt`，打包代码保留第三方许可注释。项目所在仓库原有许可仍适用。

- [Three.js 手册](https://threejs.org/manual/)
- [Three.js API](https://threejs.org/docs/)
- [大量物体优化](https://threejs.org/manual/pages/optimize-lots-of-objects.html)
- [画布截图与渲染提示](https://threejs.org/manual/pages/tips.html)
- [资源释放](https://threejs.org/manual/pages/cleanup.html)
