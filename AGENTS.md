# AGENTS.md — 组件库工作约定

本仓库是 **clawd-components**：只有组件，没有引擎。引擎、角色套件与门禁来自固定版本的 `clawd-kit`。

## 1. 环境

```bash
node --version     # >= 22.18
npm install        # 会安装 pinned 的 clawd-kit
```

## 2. 命令

| 命令 | 用途 |
|---|---|
| `npm test` | 全库加载 + 门禁 + 参数扫射 |
| `npm run gate` | 只跑门禁 |
| `npm run gate -- ch_critter` | 只跑指定组件 |
| `npm run gate:previews` | 门禁 + 输出 `out/cards/*.png` 与 `out/context/*.png` |
| `npm run index` | 重建 `INDEX.md` / `index.json` |
| `npm run index:previews` | 重建索引并生成 `previews/*.png` |

## 3. “做完”的定义

1. `npm test` 通过；
2. 用 `npm run gate:previews -- <组件名>` 生成卡片与场景图，**两张都打开放大看过**；
3. 说明里写清楚新增/修改了哪个文件、参数是什么。

只看代码不算完成。第一版 `cross_arms` 就是因为没放大，折臂像一撇胡子。

## 4. 加组件

一个文件一个组件：`components/clawd/<前缀>_<名字>.ts`。

- `bg_` 背景、`ch_` 角色、`pr_` 道具、`fg_` 前景。
- 只允许 `import type`；值 import 会被门禁拒绝。
- 不要 `Math.random` / `process` / `fetch` / 自己播种。
- `draw(api, params, t, lt)` 必须是纯函数。
- 要能被挂住就声明 `anchorNames` + `anchors`；背景要能站人就实现 `surface`。
- 详细契约：`node_modules/clawd-kit/docs/ADD_COMPONENT.md`。

## 5. 已知的坑

- `flip` 是屏幕镜像，`x` 仍是地面点。
- `rot` / `dx` 是屏幕空间。
- 远侧手臂先画，近侧后画。
- 位移交给分镜：组件里不要用 `frac()` 做循环位移（门禁会抓“滑一段再跳回”）。
- 同一角色的 enum 状态保持主体大小一致，大小变化交给分镜的 `scale`。

## 6. 依赖升级

`package.json` 里的 `clawd-kit` 固定到具体 commit。升级步骤：

1. 改 `package.json` 的 commit；
2. `npm install`；
3. `npm test` + `npm run gate:previews`；
4. 单独一个 PR，说明套件改了什么、哪些组件受影响。
