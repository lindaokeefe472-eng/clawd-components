import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_manhole_cover: ComponentDef<ClawdApi> = {
name: 'pr_manhole_cover',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour street manhole cover seen in perspective: a grey road patch with an elliptical iron seat ring, a darker lid carrying rings of diamond anti-slip treads, a small central hole, edge highlight, hairline cracks and optional drifting steam plumes. It measures 220×120 px with the anchor at the bottom centre and works as ground-level street dressing or a subtle steaming vent in a scene.',
  tags: ['catalog', 'street', 'manhole', 'cover', 'ground', 'metal', 'steam', 'decor'],
  size: [220, 120],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the steam animation between copies.' },
    steam: { type: 'number', default: 1, min: 0, max: 2, description: 'Steam strength; 0 removes the plumes entirely, higher values thicken and lift the wisps.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, steam = 1 } = params as { phase?: number; steam?: number };
    const { PAL } = api;

    // 路面
    api.paint(ctx, api.shapes.poly([[-110, 0], [110, 0], [102, -34], [-102, -34]], 3), { wash: '#82807a', sw: 2.6 });
    for (let i = 0; i < 10; i++) {
      api.paint(ctx, api.shapes.ring(api.shapes.jit(i * 3.7, 92), -6 - Math.abs(api.shapes.jit(i * 2.1, 22)), 2, 1.4, 6), { wash: '#9a978f', sw: 0, washOp: 0.45 });
    }

    // 井座（比盖大一圈的环）
    api.paint(ctx, api.shapes.ring(0, -46, 92, 34, 40, 0, 0.006, 2), { wash: '#5f5d58', sw: 2.6 });
    // 井盖
    api.paint(ctx, api.shapes.ring(0, -48, 78, 28, 40, 0, 0.006, 5), { wash: '#75736c', sw: 3.4 });
    api.paint(ctx, api.shapes.ring(0, -50, 66, 22, 34, 0, 0.006, 9), { wash: '#85837b', sw: 0 });

    // 菱形防滑纹（沿椭圆铺开）
    for (let ring = 0; ring < 3; ring++) {
      const n = 6 + ring * 6;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + ring * 0.35;
        const x = Math.cos(a) * (14 + ring * 17);
        const y = -50 + Math.sin(a) * (4 + ring * 6);
        api.paint(ctx, api.shapes.poly([[x - 5, y], [x, y - 3], [x + 5, y], [x, y + 3]], 2), { wash: '#6a6862', sw: 0, washOp: 0.6 });
      }
    }
    // 中孔
    api.paint(ctx, api.shapes.ring(0, -50, 6, 2.6, 10), { wash: '#4a4844', sw: 1.2 });
    // 边缘高光
    api.inkLine(ctx, api.shapes.arc(0, -48, 74, 26, Math.PI * 1.12, Math.PI * 1.74, 14), 2.2, 'rgba(246,239,223,0.4)');
    // 路面裂缝
    api.inkLine(ctx, [[92, -18], [74, -12], [66, -2]], 1.4, 'rgba(58,47,42,0.35)');
    api.inkLine(ctx, [[-96, -26], [-84, -16], [-70, -14]], 1.2, 'rgba(58,47,42,0.3)');

    // 蒸汽
    if (steam > 0) {
      for (let i = 0; i < 3; i++) {
        const pts: P2[] = [];
        for (let k = 0; k <= 9; k++) {
          const u = k / 9;
          pts.push([
            -16 + i * 16 + Math.sin(u * 4 - t * 2 + i * 1.7 + phase) * (3 + u * 9),
            -58 - u * 42,
          ]);
        }
        api.inkLine(ctx, pts, 2, `rgba(58,47,42,${0.16 - i * 0.03})`);
      }
      for (let i = 0; i < 3; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 1.6 + i * 2 + phase);
        api.paint(ctx, api.shapes.ring(-14 + i * 14, -98 - k * 12, 8 + k * 4, 5, 12), { wash: PAL.paper, sw: 0, washOp: 0.18 + 0.16 * k });
      }
    }
  },
};
