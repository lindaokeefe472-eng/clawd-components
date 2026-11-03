import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_snow_pile: ComponentDef<ClawdApi> = {
name: 'pr_snow_pile',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour snow pile: a broad flat ground drift with two rounded domes of white snow, soft blue shadow bands at the base, a few bare twigs poking out and a twinkling sparkle cross. Anchor is bottom centre, 420×240 px; good for dressing winter ground, paths or yard edges in a scene.',
  tags: ['catalog', 'snow', 'pile', 'terrain', 'ground', 'winter', 'prop'],
  size: [420, 240],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the sparkle twinkle between multiple copies of the pile.' },
    sparkle: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of animated sparkle: below 0.2 the glitter crosses are hidden, higher values fade them in at full brightness.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, sparkle = 1 } = params as { phase?: number; sparkle?: number };

    // 地面雪层
    const ground: P2[] = [[-206, -4], [-206, -14]];
    for (let i = 0; i <= 16; i++) {
      const u = i / 16;
      ground.push([-206 + u * 412, -14 - Math.abs(Math.sin(u * 6.2)) * 6]);
    }
    ground.push([206, -14], [206, -4]);
    api.paint(ctx, ground, { wash: '#f2f8f7', sw: 2.4 });

    // 圆顶轮廓
    const dome = (x0: number, x1: number, peak: number, k: number): P2[] => {
      const pts: P2[] = [];
      for (let i = 0; i <= 18; i++) {
        const u = i / 18;
        pts.push([api.shapes.lerp(x0, x1, u), -12 - Math.pow(Math.sin(u * Math.PI), k) * peak]);
      }
      pts.push([x1, -10], [x0, -10]);
      return pts;
    };
    const bigPts = dome(-182, 112, 118, 0.6);
    api.paint(ctx, bigPts, { wash: '#fbfdfb', sw: 3.2 });
    api.paint(ctx, dome(44, 194, 66, 0.58), { wash: '#ffffff', sw: 3 });

    // 底部阴影（贴着地的一条软带）
    api.paint(ctx, api.shapes.ring(0, -26, 140, 22, 24, 0, 0.05, 9), { wash: '#c9dfea', sw: 0, washOp: 0.5 });
    api.paint(ctx, api.shapes.ring(-96, -22, 78, 14, 20, 0, 0.06, 11), { wash: '#b7d3e0', sw: 0, washOp: 0.45 });
    api.paint(ctx, api.shapes.ring(120, -20, 52, 10, 16, 0, 0.08, 13), { wash: '#cfe3ee', sw: 0, washOp: 0.5 });
    // 顶部受光
    api.paint(ctx, api.shapes.ring(-56, -96, 72, 26, 20, -0.1, 0.07, 17), { wash: '#ffffff', sw: 0, washOp: 0.95 });
    api.paint(ctx, api.shapes.ring(96, -50, 40, 14, 16, 0.08, 0.08, 19), { wash: '#ffffff', sw: 0, washOp: 0.9 });
    // 雪面的浅色脊线（坡面的柔和高光）
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.arc(-92 + i * 46, -46, 96, 42, Math.PI * 1.22, Math.PI * 1.78, 10), 2.2, 'rgba(255,255,255,0.85)');
    }
    // 雪面颗粒
    for (let i = 0; i < 18; i++) {
      const x = -168 + api.shapes.hash(i + 5) * 268;
      const u = Math.min(1, Math.max(0, (x + 182) / 294));
      const lift = Math.pow(Math.sin(u * Math.PI), 0.6) * 110;
      api.paint(ctx, api.shapes.ring(x, -22 - lift * (0.25 + api.shapes.hash(i + 15) * 0.55), 2 + api.shapes.hash(i) * 2.6, 1.6, 6), { wash: '#ffffff', sw: 0, washOp: 0.9 });
    }
    // 枯枝
    api.inkLine(ctx, api.shapes.line(-18, -120, -4, -162, 2, 5, 4), 2.8, 'rgba(150,120,88,0.85)');
    api.inkLine(ctx, api.shapes.line(-10, -146, -30, -158, 2, 4, 6), 2, 'rgba(150,120,88,0.8)');
    api.inkLine(ctx, api.shapes.line(-6, -154, 14, -166, 2, 4, 7), 2, 'rgba(150,120,88,0.8)');
    // 闪光
    if (sparkle > 0.2) {
      for (let i = 0; i < 6; i++) {
        const u = (i + 0.5) / 6;
        const x = api.shapes.lerp(-150, 96, u);
        const y = -26 - Math.pow(Math.sin(u * Math.PI), 0.6) * 78;
        const k = 0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.7 + phase);
        const s = 3 + k * 4;
        api.inkLine(ctx, api.shapes.line(x - s, y, x + s, y, 0, 3, i + 3), 1.8, 'rgba(255,255,255,0.9)');
        api.inkLine(ctx, api.shapes.line(x, y - s, x, y + s, 0, 3, i + 9), 1.8, 'rgba(255,255,255,0.9)');
      }
    }
  },
};
