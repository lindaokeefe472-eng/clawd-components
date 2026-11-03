import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_shower_head: ComponentDef<ClawdApi> = {
name: 'pr_shower_head',
  style: 'clawd',
  kind: 'prop',
  description: 'A wall-mounted watercolour shower head: a vertical pipe with a rounded elbow and horizontal arm holds a tilted round disc with teal spray nozzles, and animated water streams fall from it to a small floor drain below. Anchor is bottom centre at 250×320 px; it suits bathroom interiors and washing or morning-routine scenes.',
  tags: ['catalog', 'bathroom', 'shower', 'plumbing', 'water', 'wall', 'prop'],
  size: [250, 320],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the swing and water-stream animation so multiple copies do not move in sync.' },
    water: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of falling water: 0 removes the streams entirely, 1 gives full-length streams with droplets.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, water = 1 } = params as { phase?: number; water?: number };
    const { PAL } = api;
    const swing = Math.sin(t * 0.7 + phase) * 0.015;

    ctx.save();
    ctx.translate(0, -312);
    ctx.rotate(swing);
    ctx.translate(0, 312);

    // 墙管（竖直）+ 圆角弯头 + 横臂，三段一体
    const pipe: P2[] = [];
    for (let i = 0; i <= 6; i++) pipe.push([-96, api.shapes.lerp(-312, -276, i / 6)]);
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI + (i / 8) * (Math.PI / 2);
      pipe.push([-78 + Math.cos(a) * 18, -260 + Math.sin(a) * 16]);
    }
    for (let i = 0; i <= 8; i++) pipe.push([api.shapes.lerp(-78, 6, i / 8), api.shapes.lerp(-244, -252, i / 8)]);
    api.inkLine(ctx, pipe, 9, '#cbd5d3');
    api.inkLine(ctx, pipe, 3, PAL.ink);
    api.paint(ctx, api.shapes.ring(6, -252, 7, 7, 12), { wash: '#b9c4c2', sw: 2.2 });

    // 花洒头（略倾斜的圆盘）
    ctx.save();
    ctx.translate(30, -252);
    ctx.rotate(0.22);
    api.paint(ctx, api.shapes.ring(0, 0, 66, 26, 34, 0, 0.015, 4), { wash: '#e2e9e6', sw: 3.4 });
    api.paint(ctx, api.shapes.ring(0, 5, 56, 20, 30, 0, 0.015, 8), { wash: '#c9d4d2', sw: 0 });
    // 出水孔
    for (let r = 0; r < 2; r++) {
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + r * 0.45;
        api.paint(ctx, api.shapes.ring(Math.cos(a) * (12 + r * 20), 6 + Math.sin(a) * (5 + r * 7), 2.6, 1.8, 6), {
          wash: PAL.teal,
          sw: 0,
          washOp: 0.5,
        });
      }
    }
    api.inkLine(ctx, api.shapes.ring(0, 0, 66, 26, 34), 3, PAL.ink);
    // 颈部
    api.paint(ctx, api.shapes.poly([[-6, -22], [10, -26], [16, -6], [2, -2]], 3), { wash: '#b9c4c2', sw: 2.4 });
    ctx.restore();

    // 水流
    if (water > 0) {
      for (let i = 0; i < 11; i++) {
        const x = -24 + i * 12;
        const k = 0.5 + 0.5 * Math.sin(t * 3 + i * 0.9 + phase);
        const y0 = -222 + Math.abs(x) * 0.16;
        const len = (28 + 84 * k) * water;
        api.inkLine(ctx, api.shapes.line(x, y0, x - 2, y0 + len, 1, 5, i + 2), 1.8, `rgba(79,156,152,${0.14 + 0.24 * k})`);
        if (i % 4 === 1) {
          api.paint(ctx, api.shapes.ring(x - 2, y0 + len + 6, 2.6, 4, 8), { wash: PAL.sky, sw: 0, washOp: 0.6 * water });
        }
      }
    }

    // 地漏
    api.paint(ctx, api.shapes.ring(10, -12, 54, 11, 24), { wash: '#c3cccb', sw: 2.4, washOp: 0.9 });
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-30 + i * 20, -16, -26 + i * 20, -8, 0, 3, i + 3), 1.4, 'rgba(58,47,42,0.3)');
    }
    ctx.restore();
  },
};
