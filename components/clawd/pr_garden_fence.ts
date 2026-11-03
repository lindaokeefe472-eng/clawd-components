import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_garden_fence: ComponentDef<ClawdApi> = {
name: 'pr_garden_fence',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour garden fence with two horizontal rails, six pointed pickets, and optional trailing vines, small leaves, and pink flowers. Anchored at bottom centre at 360×170 px, it is suited to garden edges, yard boundaries, and outdoor scene decoration.',
  tags: ['catalog', 'outdoor', 'garden', 'fence', 'picket', 'plant', 'ground', 'decor'],
  size: [360, 170],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the vine sway and flower bob animation; use different values to desynchronise copies.' },
    vine: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls the amount of visible vine, leaves, and flowers; 0 hides them and 1 shows full growth.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, vine = 1 } = params as { phase?: number; vine?: number };
    const { PAL } = api;

    // 横梁（在栏杆之后画，这里先画，让栏杆压在上层）
    api.paint(ctx, api.shapes.round(-170, -98, 170, -80, 5), { wash: '#e6d7ba', sw: 3 });
    api.paint(ctx, api.shapes.round(-170, -46, 170, -28, 5), { wash: '#e6d7ba', sw: 3 });

    // 栏杆（带尖头）
    for (let i = 0; i < 6; i++) {
      const x = -150 + i * 60;
      const h = 128 + api.shapes.hash(i + 2) * 14;
      const picket: P2[] = [
        [x - 14, 0],
        [x - 14, -h + 20],
        [x - 13, -h + 12],
        [x - 8, -h + 5],
        [x - 3, -h + 1],
        [x, -h],
        [x + 3, -h + 1],
        [x + 8, -h + 5],
        [x + 13, -h + 12],
        [x + 14, -h + 20],
        [x + 14, 0],
      ];
      api.paint(ctx, picket, { wash: '#f2e7cf', sw: 2.8 });
      api.inkLine(ctx, api.shapes.line(x - 6, -20, x - 6, -h + 32, 1, 8, i + 3), 1.1, 'rgba(90,60,45,0.22)');
      api.paint(ctx, api.shapes.ring(x, -89, 2.6, 2.6, 8), { wash: PAL.ink, sw: 0, washOp: 0.45 });
      api.paint(ctx, api.shapes.ring(x, -37, 2.6, 2.6, 8), { wash: PAL.ink, sw: 0, washOp: 0.35 });
    }

    // 藤蔓与小叶
    if (vine > 0) {
      for (let i = 0; i < 2; i++) {
        const pts: P2[] = [];
        for (let k = 0; k <= 16; k++) {
          const u = k / 16;
          pts.push([
            -140 + u * 270,
            -70 - Math.sin(u * 4.6 + i * 2 + t * 0.6 + phase) * 12,
          ]);
        }
        api.inkLine(ctx, pts, 2, 'rgba(110,140,90,0.8)');
        for (let k = 2; k <= 15; k += 3) {
          const p = pts[k];
          api.paint(ctx, api.shapes.ring(p[0], p[1] - 7, 7, 4.4, 10, -0.3 + (k % 2) * 0.6), {
            wash: i ? PAL.sap : PAL.teal,
            sw: 1.3,
            washOp: 0.85 * vine,
          });
        }
      }
      // 花
      for (let i = 0; i < 3; i++) {
        const x = -90 + i * 92;
        const y = -64 + Math.sin(t * 0.9 + i * 2 + phase) * 2;
        for (let k = 0; k < 5; k++) {
          const a = (k / 5) * Math.PI * 2;
          api.paint(ctx, api.shapes.ring(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5, 4, 8), { wash: PAL.rose, sw: 0, washOp: 0.9 });
        }
        api.paint(ctx, api.shapes.ring(x, y, 3, 3, 8), { wash: PAL.ochre, sw: 0 });
      }
    }
  },
};
