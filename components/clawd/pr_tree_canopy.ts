import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_tree_canopy: ComponentDef<ClawdApi> = {
name: 'pr_tree_canopy',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour tree canopy built from overlapping leafy lobes in layered light and dark washes, with fine ink outline fragments, scattered single leaves and a small hanging branch. Anchor is bottom centre at 460×440 px; it sits on a trunk as foliage for park, forest or garden scenes.',
  tags: ['catalog', 'plant', 'tree', 'foliage', 'decor', 'ground', 'watercolour'],
  size: [460, 440],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the wind sway cycle in radians so several canopies do not move in unison.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Strength of the sway and bobbing of the leaf lobes; above 0.4 a few loose leaves drift off to the right.' },
    season: { type: 'enum', default: 'green', options: ['green', 'spring', 'autumn'], description: 'Chooses the palette: summer green, pale fresh spring green, or warm gold and rust autumn tones.' },
    density: { type: 'number', default: 1, min: 0, max: 1, description: 'Number of fluffy edge blobs around each lobe; lower values give a sparser, more open silhouette.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wind = 1, season = 'green', density = 1 } = params as { phase?: number; wind?: number; season?: string; density?: number };
    const { PAL } = api;
    const base = season === 'autumn' ? '#c9933f' : season === 'spring' ? '#8fbb69' : PAL.sap;
    const light = season === 'autumn' ? '#e0b45a' : season === 'spring' ? '#b6d68f' : '#a3c07a';
    const dark = season === 'autumn' ? '#a8642c' : season === 'spring' ? '#6d9a4e' : '#56763f';
    // 树冠底部中心 = 树干顶端
    const cy = -236;

    // 树冠由 6 团组成，越靠上摆幅越大（模拟风吹树冠）
    const lobes = [
      { x: -126, y: cy + 60, r: 78, amp: 0.5 },
      { x: 122, y: cy + 54, r: 74, amp: 0.55 },
      { x: -58, y: cy - 30, r: 96, amp: 0.8 },
      { x: 66, y: cy - 40, r: 92, amp: 0.85 },
      { x: 2, y: cy - 118, r: 82, amp: 1 },
      { x: -150, y: cy - 66, r: 62, amp: 0.7 },
      { x: 158, y: cy - 62, r: 58, amp: 0.7 },
    ];

    // 先铺一层整体暗底，避免出现镂空
    api.paint(ctx, api.shapes.ring(0, cy, 200, 150, 26, 0, 0.1, 4), { wash: dark, sw: 0, washOp: 0.5 });

    for (let i = 0; i < lobes.length; i++) {
      const L = lobes[i];
      const dx = Math.sin(t * 1.25 + i * 1.3 + phase) * 12 * L.amp * wind;
      const dy = Math.sin(t * 1.9 + i * 0.9 + phase) * 4 * L.amp * wind;
      const cx = L.x + dx;
      const cyy = L.y + dy;
      // 叶团本体
      api.paint(ctx, api.shapes.ring(cx, cyy, L.r, L.r * 0.88, 20, 0, 0.18, i + 2), { wash: base, sw: 0 });
      // 蓬松边缘
      const nEdge = Math.round(10 * density);
      for (let s = 0; s < nEdge; s++) {
        const a = (s / nEdge) * Math.PI * 2 + i;
        const rr = L.r * (0.84 + api.shapes.hash(s + i * 5) * 0.26);
        api.paint(ctx, api.shapes.ring(cx + Math.cos(a) * rr, cyy + Math.sin(a) * rr * 0.88, 15, 13, 10, a, 0.22, s + i),
          { wash: s % 3 === 0 ? dark : s % 3 === 1 ? base : light, sw: 0 });
      }
      // 受光面（左上）
      api.paint(ctx, api.shapes.ring(cx - L.r * 0.26, cyy - L.r * 0.32, L.r * 0.5, L.r * 0.36, 16, -0.3, 0.1, i + 9),
        { wash: light, sw: 0, washOp: 0.6 });
      // 暗面（右下）
      api.paint(ctx, api.shapes.ring(cx + L.r * 0.22, cyy + L.r * 0.4, L.r * 0.56, L.r * 0.26, 14, 0, 0.12, i + 13),
        { wash: dark, sw: 0, washOp: 0.5 });
      // 外缘墨线（断续）
      for (let s = 0; s < 6; s++) {
        const a0 = (s / 6) * Math.PI * 2 + i * 0.4;
        api.inkLine(ctx, api.shapes.arc(cx, cyy, L.r * 0.98, L.r * 0.86, a0, a0 + 0.36, 4), 2.2, 'rgba(64,92,52,0.45)');
      }
    }

    // 叶簇之间的空隙（透出亮色，显得蓬松）
    for (let i = 0; i < 7; i++) {
      const x = -140 + api.shapes.hash(i + 3) * 280;
      const y = cy - 120 + api.shapes.hash(i + 11) * 200;
      api.paint(ctx, api.shapes.ring(x, y, 12, 9, 10, 0.4, 0.25, i + 6), { wash: '#ffffff', sw: 0, washOp: 0.12 });
    }

    // 单叶细节
    for (let i = 0; i < 16; i++) {
      const x = -172 + api.shapes.hash(i + 21) * 344;
      const y = cy - 150 + api.shapes.hash(i + 31) * 226;
      const a = api.shapes.hash(i + 41) * 1.4 - 0.7 + Math.sin(t * 1.5 + i + phase) * 0.1 * wind;
      api.paint(ctx, api.shapes.ring(x, y, 10, 5, 10, a), { wash: i % 4 === 0 ? light : i % 4 === 1 ? base : dark, sw: 0, washOp: 0.75 });
    }

    // 风吹时飞出的几片叶子
    if (wind > 0.4) {
      for (let i = 0; i < 4; i++) {
        const u = (i + 0.5) / 4;
        const x = 150 + u * 60 + Math.sin(t * 1.6 + i + phase) * 10 * wind;
        const y = cy - 40 - u * 80 + Math.cos(t * 1.2 + i) * 8 * wind;
        api.paint(ctx, api.shapes.ring(x, y, 9, 4.6, 10, 0.6 + Math.sin(t * 1.4 + i) * 0.4), { wash: base, sw: 1, washOp: 0.8 });
      }
    }
    // 悬挂的枝
    api.inkLine(ctx, api.shapes.line(-20, cy + 120, -34, cy + 158, 2, 5, 3), 4, '#8a6d4e');
    api.inkLine(ctx, api.shapes.line(-34, cy + 158, -52, cy + 168, 2, 4, 4), 3, '#8a6d4e');
  },
};
