import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_maslow_pyramid: ComponentDef<ClawdApi> = {
name: 'pr_maslow_pyramid',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour Maslow hierarchy pyramid built from five stacked trapezoid tiers topped by a small triangle holding a heart, each tier carrying a small white pictogram (bowl, house, two figures, star, heart) and a soft glow when lit. Anchor is bottom centre, 300×280 px, and it works as a tabletop chart or classroom prop in explanatory or diagram scenes.',
  tags: ['catalog', 'psychology', 'diagram', 'pyramid', 'watercolour', 'decor', 'ground'],
  size: [300, 280],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the pulsing glow cycle, used to desynchronise multiple copies.' },
    level: { type: 'number', default: 5, min: 0, max: 5, description: 'Controls how many tiers are lit and glowing (level divided by 5, clamped); higher values light more tiers from the bottom up.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, level = 5 } = params as { phase?: number; level?: number };
    const { PAL } = api;
    const lit = Math.round(api.shapes.clamp01(level / 5) * 5);

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 132, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 五层色块（自下而上）
    const cols = ['#cbb99b', PAL.sap, PAL.ochre, PAL.rose, PAL.teal];
    for (let i = 0; i < 5; i++) {
      const yb = -12 - i * 42;
      const yt = yb - 42;
      const wb = 128 - i * 24;
      const wt = 128 - (i + 1) * 24;
      const on = i < lit;
      api.paint(ctx, api.shapes.poly([[-wb, yb], [wb, yb], [wt, yt], [-wt, yt]], 4), {
        wash: cols[i],
        sw: 3,
        washOp: on ? 0.95 : 0.4,
      });
      if (on) {
        const k = 0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.9 + phase);
        api.glow(ctx, -wb + 16, (yb + yt) / 2, 22, cols[i], 0.12 * k);
      }
    }
    // 顶部小三角
    api.paint(ctx, api.shapes.poly([[-30, -222], [30, -222], [0, -258]], 3), { wash: PAL.ochre, sw: 3 });
    api.paint(ctx, api.shapes.heart(0, -240, 9), { wash: PAL.rose, sw: 0, washOp: 0.9 });

    // 每层一个白色小图标：碗 / 房子 / 两个人 / 星 / 心
    api.paint(ctx, api.shapes.poly([[-104, -32], [-80, -32], [-86, -22], [-98, -22]], 3), { wash: PAL.paper, sw: 1.4, washOp: 0.92 });
    api.paint(ctx, api.shapes.poly([[-82, -96], [-70, -96], [-70, -84], [-82, -84]], 3), { wash: PAL.paper, sw: 1.4, washOp: 0.92 });
    api.paint(ctx, api.shapes.poly([[-82, -84], [-70, -84], [-76, -78]], 3), { wash: PAL.paper, sw: 1.4, washOp: 0.92 });
    for (let i = 0; i < 2; i++) {
      api.paint(ctx, api.shapes.ring(-44 + i * 16, -136, 6, 6, 12), { wash: PAL.paper, sw: 1.2, washOp: 0.92 });
      api.paint(ctx, api.shapes.poly([[-51 + i * 16, -132], [-37 + i * 16, -132], [-40 + i * 16, -118], [-48 + i * 16, -118]], 3), {
        wash: PAL.paper,
        sw: 1.2,
        washOp: 0.92,
      });
    }
    const star: P2[] = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
      const r = i % 2 ? 4.5 : 10;
      star.push([Math.cos(a) * r, -186 + Math.sin(a) * r]);
    }
    api.paint(ctx, star, { wash: PAL.paper, sw: 1.2, washOp: 0.92 });
  },
};
