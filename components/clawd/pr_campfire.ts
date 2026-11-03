import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_campfire: ComponentDef<ClawdApi> = {
name: 'pr_campfire',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour campfire built from two crossed logs with pale ring-marked ends, a ring of grey stones, and layered orange-to-cream flame tongues that flicker and throw a warm glow. Embers drift upward, and the 260×230 px sprite is anchored at the bottom centre, making it a ready ground prop for night camps, forest clearings, or hearth-side scenes.',
  tags: ['catalog', 'outdoor', 'campfire', 'fire', 'ground', 'decor', 'warm'],
  size: [260, 230],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the flicker, sway, and ember motion in radians, so multiple campfires can be placed without animating in sync.' },
    embers: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls the number and brightness of floating sparks above the flames; 0 removes them entirely, 1 gives the full drifting ember trail.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, embers = 1 } = params as { phase?: number; embers?: number };
    const { PAL } = api;
    const flick = Math.sin(t * 6.1 + phase) * 0.5 + Math.sin(t * 3.7 + phase * 2) * 0.5;

    // 火光
    api.glow(ctx, 0, -74, 150, PAL.orange, 0.28 + 0.06 * flick);
    api.glow(ctx, 0, -84, 74, '#ffd98a', 0.3);

    // 前景石圈
    for (let i = 0; i < 5; i++) {
      const a = Math.PI * 0.08 + (i / 4) * Math.PI * 0.84;
      api.paint(ctx, api.shapes.ring(Math.cos(a) * 96, -10 - Math.sin(a) * 18, 16, 11, 12, 0.2 * i, 0.14, i + 2), {
        wash: i % 2 ? '#cfc8ba' : '#b3ada0',
        sw: 2.4,
      });
    }

    // 木柴
    api.paint(ctx, api.shapes.round(-64, -30, 62, -14, 7), { wash: '#8a5f42', sw: 3 });
    api.paint(ctx, api.shapes.round(-58, -46, 58, -30, 7), { wash: '#7a5339', sw: 3 });
    api.inkLine(ctx, api.shapes.line(-40, -38, 30, -38, 1, 8, 4), 1.4, 'rgba(50,34,24,0.4)');
    // 柴端年轮
    api.paint(ctx, api.shapes.ring(-62, -22, 5, 6, 10), { wash: '#c99a6b', sw: 1.6 });
    api.paint(ctx, api.shapes.ring(60, -22, 5, 6, 10), { wash: '#c99a6b', sw: 1.6 });

    // 火焰：多簇尖舌叠加
    const tongue = (bx: number, h: number, w: number, lean: number): P2[] => {
      const out: P2[] = [];
      const steps = 12;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const y = -26 - u * h;
        const halfW = w * Math.pow(1 - u, 0.75) * (0.55 + 0.45 * Math.sin(u * 5.2 - t * 4.2 + phase));
        const x = bx + lean * u * u * h * 0.28 + Math.sin(u * 6 - t * 5 + phase + bx) * w * 0.14 * u;
        out.push([x - Math.max(1.2, halfW), y]);
      }
      for (let i = steps; i >= 0; i--) {
        const u = i / steps;
        const y = -26 - u * h;
        const halfW = w * Math.pow(1 - u, 0.75) * (0.55 + 0.45 * Math.sin(u * 5.2 - t * 4.2 + phase + 1.7));
        const x = bx + lean * u * u * h * 0.28 + Math.sin(u * 6 - t * 5 + phase + bx + 1.2) * w * 0.14 * u;
        out.push([x + Math.max(1.2, halfW), y]);
      }
      return out;
    };
    // 背面石圈
    for (let i = 0; i < 5; i++) {
      const a = Math.PI * 1.08 + (i / 4) * Math.PI * 0.84;
      api.paint(ctx, api.shapes.ring(Math.cos(a) * 96, -10 - Math.sin(a) * 22, 15, 10, 12, 0.2 * i, 0.12, i + 7), {
        wash: '#c9c3b6',
        sw: 2.2,
      });
    }
    // 外焰
    api.paint(ctx, tongue(-16, 96, 30, 1), { wash: PAL.orange, sw: 0, washOp: 0.8 });
    api.paint(ctx, tongue(24, 74, 24, -1.2), { wash: PAL.orange, sw: 0, washOp: 0.75 });
    api.paint(ctx, tongue(0, 142, 38, 0.5), { wash: PAL.orange, sw: 0, washOp: 0.85 });
    // 内焰
    api.paint(ctx, tongue(-8, 92, 21, 0.8), { wash: '#f4a94e', sw: 0, washOp: 0.92 });
    api.paint(ctx, tongue(20, 62, 16, -0.9), { wash: '#f4a94e', sw: 0, washOp: 0.9 });
    api.paint(ctx, tongue(2, 100, 24, 0.4), { wash: '#f4a94e', sw: 0, washOp: 0.9 });
    // 焰心
    api.paint(ctx, tongue(0, 56, 14, 0.3), { wash: '#ffeab4', sw: 0, washOp: 0.95 });

    // 火星
    if (embers > 0) {
      for (let i = 0; i < 7; i++) {
        const u = 0.35 + 0.65 * ((i + 1) / 8);
        const x = Math.sin(t * 1.4 + i * 2.2 + phase) * (20 + i * 6);
        const y = -110 - u * 100 + Math.sin(t * 2.1 + i) * 6;
        const s = 1.6 + 1.6 * (0.5 + 0.5 * Math.sin(t * 3 + i * 1.7));
        api.glow(ctx, x, y, s * 5, PAL.ochre, 0.22 * embers);
        api.paint(ctx, api.shapes.ring(x, y, s, s, 8), { wash: '#ffe6a8', sw: 0, washOp: 0.9 * embers });
      }
    }
  },
};
