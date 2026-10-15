# 广美 · 校园漫游 / GAFA Campus Atlas

基于 `../gafa-campus-source` 的校园资料，重新设计的独立对照版本。原项目保持不变。

## 运行

需要 Node.js 22 或更新版本。

```sh
npm ci
npm run dev
```

本地地址见终端，默认 http://127.0.0.1:5180 。生产构建：`npm run build`；构建预览：`npm run preview`。

## 实现

- React 19、TypeScript、Three.js、React Three Fiber 9、Drei 10、Vite。
- R3F Canvas 管理渲染生命周期；Drei OrbitControls 管理镜头，Line 绘制路线与选中房间轮廓。
- 沿用原项目 37 个地点、步行路网、14 份楼层数据、参考照片和参数化建筑几何。几何装配保存在 `src/campus-model.ts`，以 R3F primitive 接入；并未声称建筑模型是重新测绘或原创建模。
- 地图采用正交斜俯视、暖白沙盘配色、日夜两种环境；去掉外围无交互的装饰城市。
- 标注投影在屏幕坐标中排布，限制可见数量，检测文字框碰撞，用建筑包围盒近似检测遮挡，保留上次可见标签的优先权以减少跳动。不使用跨越画面的长引线。
- 可搜索、按类别/区域筛选、收藏地点、指定出发点、预览路线、切换楼层、选择房间、查看平面/立体/原图。
- 手机采用底部可展开面板；平面楼层保留可读尺寸并支持横向滚动，选择房间时滚到对应位置。
- 收藏及 CSV/JSON 课表只存储在当前浏览器。课表点击定位至楼栋，不声称自动导航到室内房间。

## 资料与功能边界

坐标、建筑尺寸和路径是原项目的近似示意，不是测绘或实时定位数据；不包含 GPS 实时导航、无障碍路线承诺或室内实时定位。活动页面明确使用原项目的历史公告快照，不进行实时同步。新版未移植原站 PDF/OCR 课表识别、实时天气接口及雨天特效。

校园照片与楼层标注图来自原项目。保留原资料的不确定性说明；任何对外使用需由资料所有者确认授权。

## 设计参考

参考下列公开技能的交互、资源管理和地图视觉层级原则，没有把它们作为完整校园导览模板：

- https://github.com/EnzeD/r3f-skills （r3f-fundamentals、r3f-interaction）
- https://github.com/maplibre/maplibre-agent-skills （maplibre-cartography；只借鉴制图原则，没有引入 MapLibre）
- https://github.com/CloudAI-X/threejs-skills

## 修改入口

| 内容 | 文件 |
| --- | --- |
| 页面、搜索、收藏、课表、详情 | src/App.tsx |
| 视觉与响应式布局 | src/style.css |
| R3F 场景、相机、标注规则 | src/CampusScene.tsx |
| 建筑几何和材质 | src/campus-model.ts |
| 地点和路网 | src/data/campus.ts |
| 校园细部 | src/data/campus-detail.ts |
| 楼层与房间交互 | src/IndoorExplorer.tsx |

原项目已有楼层数据覆盖 A 栋 2、4 楼，B/C 栋 2–7 楼。新版保留这些覆盖范围。
