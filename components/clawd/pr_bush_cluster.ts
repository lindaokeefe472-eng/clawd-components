import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_bush_cluster: ComponentDef<ClawdApi> = {
name: 'pr_bush_cluster',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour bush cluster made of rounded green leaf lobes on short woody stems, with scattered leaves, a soft shadow, and optional red berries that sway in the wind. It is anchored at the bottom centre and sized 300×240 px, useful as garden undergrowth or a layered foreground/background plant in a scene.',
  tags: ['catalog', 'plant', 'bush', 'foliage', 'watercolor', 'ground', 'decor'],
  size: [300, 240],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the wind cycle so copies sway out of sync.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Wind strength; 0 holds still, higher values increase leaf and branch sway.' },
    berries: { type: 'number', default: 1, min: 0, max: 1, description: 'Berry amount; 0 hides berries, 1 shows the full scattered red berries.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wind = 1, berries = 1 } = params as { phase?: number; wind?: number; berries?: number };
    const { PAL } = api;

    // 影子
    api.paint(ctx, api.shapes.ring(0, -10, 128, 11, 22, 0, 0, 5), { wash: PAL.night, sw: 0, washOp: 0.1 });

    // 主干（短）
    api.inkLine(ctx, api.shapes.line(0, -12, -2, -56, 2, 4, 3), 7, '#8a6d4e');
    api.inkLine(ctx, api.shapes.line(-2, -48, -26, -78, 2, 4, 4), 4, '#8a6d4e');
    api.inkLine(ctx, api.shapes.line(0, -50, 24, -82, 2, 4, 5), 4, '#8a6d4e');

    // 三团主要的叶簇（后 → 前），每团随风轻摆
    const lobes = [
      { x: -66, y: -128, r: 62, k: 0.7 },
      { x: 62, y: -134, r: 58, k: 0.9 },
      { x: -6, y: -168, r: 74, k: 1 },
      { x: 30, y: -108, r: 46, k: 0.6 },
    ];
    for (let i = 0; i < lobes.length; i++) {
      const L = lobes[i];
      const dx = Math.sin(t * 1.35 + i * 1.4 + phase) * 4 * L.k * wind;
      const dy = Math.sin(t * 1.7 + i * 0.8 + phase) * 2 * L.k * wind;
      // 底色团
      api.paint(ctx, api.shapes.ring(L.x + dx, L.y + dy, L.r, L.r * 0.82, 18, 0, 0.16, i + 2), { wash: PAL.sap, sw: 0 });
      // 边缘叶点（小圆，做出蓬松轮廓）
      for (let s = 0; s < 9; s++) {
        const a = (s / 9) * Math.PI * 2 + i * 0.6;
        const rr = L.r * (0.86 + api.shapes.hash(s + i * 3) * 0.24);
        api.paint(ctx, api.shapes.ring(L.x + dx + Math.cos(a) * rr, L.y + dy + Math.sin(a) * rr * 0.82, 13, 11, 10, a, 0.2, s + i),
          { wash: s % 2 ? '#6d8f55' : PAL.sap, sw: 0 });
      }
      // 顶部提亮
      api.paint(ctx, api.shapes.ring(L.x + dx - L.r * 0.2, L.y + dy - L.r * 0.34, L.r * 0.5, L.r * 0.34, 16, 0, 0.1, i + 7),
        { wash: '#a3c07a', sw: 0, washOp: 0.55 });
      // 暗部
      api.paint(ctx, api.shapes.ring(L.x + dx + L.r * 0.2, L.y + dy + L.r * 0.4, L.r * 0.6, L.r * 0.28, 14, 0, 0.12, i + 11),
        { wash: '#56763f', sw: 0, washOp: 0.45 });
      // 墨线轮廓（只在外缘勾几笔，避免死板）
      for (let s = 0; s < 5; s++) {
        const a0 = Math.PI * 1.02 + (s / 5) * Math.PI * 0.96;
        api.inkLine(ctx, api.shapes.arc(L.x + dx, L.y + dy, L.r, L.r * 0.82, a0, a0 + 0.42, 5), 2.2, 'rgba(70,100,55,0.55)');
      }
    }

    // 叶片细节：散点小叶
    for (let i = 0; i < 10; i++) {
      const x = -104 + api.shapes.hash(i + 2) * 208;
      const y = -80 - api.shapes.hash(i + 13) * 110;
      const a = api.shapes.hash(i + 5) * 1.2 - 0.6 + Math.sin(t * 1.6 + i + phase) * 0.08 * wind;
      api.paint(ctx, api.shapes.ring(x, y, 9, 4.4, 10, a), { wash: i % 3 ? '#7fab5e' : '#5f8a46', sw: 1, washOp: 0.85 });
    }

    // 浆果
    if (berries > 0.2) {
      for (let i = 0; i < 7; i++) {
        const x = -88 + api.shapes.hash(i + 21) * 176;
        const y = -92 - api.shapes.hash(i + 31) * 96;
        api.paint(ctx, api.shapes.ring(x, y, 6.4, 6.4, 10), { wash: i % 2 ? '#b8563f' : PAL.rose, sw: 1.2, washOp: 0.9 * berries });
        api.paint(ctx, api.shapes.ring(x - 1.8, y - 1.8, 2, 2, 6), { wash: '#fff6ea', sw: 0, washOp: 0.7 * berries });
      }
    }
    // 根部草丛
    for (let i = 0; i < 6; i++) {
      const x = -96 + i * 38;
      api.inkLine(ctx, api.shapes.line(x, -10, x + 6 + Math.sin(t + i) * 2, -34, 1, 4, i + 3), 2.2, 'rgba(70,100,55,0.6)');
    }
  },
};
