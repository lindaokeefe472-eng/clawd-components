# clawd-components

水彩手绘风的 Clawd 组件库：一个文件一个组件，共 180 个。底层依赖固定版本的 [`clawd-kit`](https://github.com/lindaokeefe472-eng/clawd-kit)。

## 安装与检查

```bash
npm install
npm test                    # 加载 + 全量门禁 + ch_critter 参数扫射
npm run gate                # 只跑门禁
npm run gate:previews       # 门禁 + 输出卡片/场景图到 out/
npm run index               # 重建 INDEX.md + index.json（不生成预览）
npm run index:previews      # 重建索引 + 生成 previews/*.png
```

需要 Node >= 22.18。渲染使用 `@napi-rs/canvas`（由 `clawd-kit` 带入），不需要浏览器。

## 目录

```
components/clawd/     180 个组件，一个 .ts 一个组件；INDEX.md / index.json 由脚本生成
scripts/gate-all.mjs  全量门禁
scripts/refresh-index.mjs  重建索引
tests/                库级测试（加载、门禁、索引一致性）
```

## 加一个组件

见 `AGENTS.md` 与 `docs/ADD_COMPONENT.md`（由 `clawd-kit` 提供同一套约定）。

## 许可

MIT。底层 `clawd-kit` 源自 [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)（MIT），
详见 `clawd-kit` 仓库的 `ATTRIBUTION.md`。
