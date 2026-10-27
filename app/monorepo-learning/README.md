# Monorepo Field Guide · 可视化工程课

一个面向中文前端工程师的独立静态教学 Demo，介绍 Monorepo 的心智模型、workspaces、依赖边界、affected 构建、任务缓存与版本发布，并附带可筛选面试题和自测题。

## 页面入口

- `index.html`：完整学习路径与交互实验。
- `styles.css`：响应式页面样式。
- `app.js`：依赖传播、缓存模拟、进度、面试题筛选和快测逻辑。

## 本地预览

无需安装依赖，可直接打开 `index.html`，也可启动静态服务器：

```sh
python3 -m http.server 8080
# 打开 http://localhost:8080
```

本目录资源全部使用相对路径，可独立放入静态站点或 GitHub Pages 子目录。

## 交互边界

项目图展示的是本页定义的教学依赖关系；构建器只在浏览器中确定性模拟 affected 范围和缓存命中，不执行 shell、不调用 Nx/Turborepo，也不会真正读写构建缓存。面试题是工程实践要点的学习卡片，不声称来自某个统计榜单或特定公司的原题。学习进度使用当前浏览器的 `localStorage`。
