import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_laundry_basket: ComponentDef<ClawdApi> = {
name: 'pr_laundry_basket',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wicker laundry basket with a woven body, an elliptical rim and a tall arched handle, holding a few folded clothes that peek above the rim, plus a small laundry tag on the front. Anchor is bottom centre at 280×220 px; good as a floor prop in a laundry room, bathroom or bedroom corner.',
  tags: ['catalog', 'laundry', 'basket', 'container', 'home', 'ground', 'wicker', 'decor'],
  size: [280, 220],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the idle breathing and handle sway animation so several baskets in one scene do not move in sync.' },
    clothes: { type: 'number', default: 1, min: 0, max: 12, description: 'Number of clothes bundles showing above the rim; 0 leaves the basket empty and only the inner lining is drawn.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, clothes = 1 } = params as { phase?: number; clothes?: number };
    const { PAL } = api;
    const breathe = Math.sin(t * 1.3 + phase) * 1.6;

    // 口沿几何：篮口是椭圆，前沿（下半圈）之后画，压住衣物
    const rimY = -132;
    const rimRx = 104;
    const rimRy = 20;
    const botY = -16;
    const botRx = 80;
    const nearArc = api.shapes.arc(0, rimY, rimRx, rimRy, Math.PI, 0, 26);

    api.paint(ctx, api.shapes.ring(0, -8, 98, 10, 22, 0, 0, 9), { wash: '#8b8172', sw: 0, washOp: 0.16 });

    // 提手：一条整弧，两端正好落在口沿左右两端
    const sway = Math.sin(t * 1.1 + phase) * 1.4;
    const handle = api.shapes.arc(0, rimY, rimRx * 0.99, 74 + sway, Math.PI, Math.PI * 2, 22);
    api.inkLine(ctx, handle, 7, '#8a6039');
    api.inkLine(ctx, handle, 4.6, '#b89b6d');
    api.inkLine(ctx, handle.map((q) => [q[0], q[1] - 2] as P2), 1.8, 'rgba(255,246,230,0.45)');

    // 篮身
    api.paint(ctx, nearArc.concat([[botRx, botY], [-botRx, botY]] as P2[]), { wash: '#d9c39b', sw: 3.6 });
    // 编织纹（裁在篮身里）
    ctx.save();
    api.shapes.clip(ctx, nearArc.concat([[botRx, botY], [-botRx, botY]] as P2[]));
    for (let i = 1; i < 8; i++) {
      const a = Math.PI - (i / 8) * Math.PI;
      const tx = Math.cos(a) * rimRx * 0.99;
      const ty = rimY + Math.sin(a) * rimRy * 0.99;
      api.inkLine(ctx, api.shapes.line(tx, ty, tx * (botRx / rimRx), botY + 2, 0, 5, i + 6), 1.5, 'rgba(120,85,45,0.26)');
    }
    for (let r = 0; r < 4; r++) {
      const f = (r + 1) / 5;
      const yy = api.shapes.lerp(rimY + rimRy, botY, f);
      const half = api.shapes.lerp(rimRx * 1.05, botRx * 1.1, f);
      api.inkLine(ctx, api.shapes.line(-half, yy, half, yy, 6 * f, 12, r + 2), 1.6, 'rgba(120,85,45,0.22)');
    }
    ctx.restore();
    api.paint(ctx, api.shapes.poly([[-botRx + 10, botY], [botRx - 10, botY], [botRx - 18, botY - 10], [-botRx + 18, botY - 10]], 3),
      { wash: '#b89b6d', sw: 2.2 });

    // 篮内
    api.paint(ctx, api.shapes.ring(0, rimY, rimRx, rimRy, 28), { wash: '#a8895c', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(0, rimY + 4, rimRx - 14, rimRy - 9, 24), { wash: '#8f7449', sw: 0, washOp: 0.8 });

    // 露出的衣物（被口沿裁住）
    if (clothes > 0) {
      ctx.save();
      api.shapes.clip(ctx, api.shapes.lipClip(0, rimY, rimRx - 12, rimRy - 15));
      api.paint(ctx, api.shapes.ring(-40, rimY - 24 + breathe * 0.5, 46, 24, 20, -0.22, 0.09, 3), { wash: PAL.rose, sw: 2.4 });
      api.paint(ctx, api.shapes.ring(26, rimY - 30 - breathe * 0.5, 50, 26, 20, 0.16, 0.09, 7), { wash: PAL.paper, sw: 2.4 });
      api.paint(ctx, api.shapes.ring(-4, rimY - 48 + breathe * 0.3, 34, 20, 18, 0.42, 0.1, 11), { wash: PAL.sky, sw: 2.2 });
      api.inkLine(ctx, api.shapes.line(-32, rimY - 22, -24, rimY - 44, 2, 4, 5), 1.3, 'rgba(58,47,42,0.16)');
      ctx.restore();
    }

    // 口沿前唇
    api.paint(ctx, api.shapes.lipBand(0, rimY, rimRx, rimRy, 13, 24), { wash: '#e4d0ab', sw: 2.8 });
    api.paint(ctx, api.shapes.lipBand(0, rimY - 4, rimRx - 8, rimRy - 5, 7, 22), { wash: '#cbb489', sw: 0, washOp: 0.5 });

    // 提手固定耳（压在口沿上，遮住提手末端）
    for (let i = 0; i < 2; i++) {
      const ex = (i ? 1 : -1) * rimRx * 0.99;
      api.paint(ctx, api.shapes.round(ex - 8, rimY - 14, ex + 8, rimY + 6, 4, 3), { wash: '#8a6039', sw: 2.2 });
      api.paint(ctx, api.shapes.round(ex - 5, rimY - 11, ex + 5, rimY + 1, 3, 2), { wash: '#cbb489', sw: 0, washOp: 0.9 });
      api.paint(ctx, api.shapes.ring(ex, rimY - 5, 2.2, 2.2, 8), { wash: '#6b4f34', sw: 0 });
    }

    // 洗衣牌（挂在篮身正面）
    api.paint(ctx, api.shapes.round(-26, -92, 26, -62, 4), { wash: PAL.paper, sw: 2 });
    api.inkLine(ctx, api.shapes.line(-18, -82, 12, -82, 0, 4, 3), 1.4, 'rgba(58,47,42,0.3)');
    api.inkLine(ctx, api.shapes.line(-18, -73, 2, -73, 0, 4, 5), 1.2, 'rgba(58,47,42,0.22)');
    api.paint(ctx, api.shapes.ring(0, -95, 3, 3, 8), { wash: '#b89b6d', sw: 0, washOp: 0.8 });
  },
};
