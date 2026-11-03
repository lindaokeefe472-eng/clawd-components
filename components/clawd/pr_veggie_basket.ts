import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_veggie_basket: ComponentDef<ClawdApi> = {
name: 'pr_veggie_basket',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wicker basket with a looped handle, filled with lettuce, eggplant, carrots, tomatoes and potatoes; anchored at the bottom centre at 430×320 px. It suits a kitchen, market or harvest scene as a grounded container prop.',
  tags: ['catalog', 'kitchen', 'veggie', 'basket', 'container', 'ground', 'prop'],
  size: [430, 320],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; desynchronises the gentle sway animation between copies.' },
    full: { type: 'number', default: 1, min: 0, max: 1, description: 'Fill level; values above 0.5 draw the handle and its mounting ears, lower values omit them.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, full = 1 } = params as { phase?: number; full?: number };
    const { PAL } = api;
    const sway = Math.sin(t * 1.2 + phase) * 1.6;

    const rimY = -160;
    const rimRx = 190;
    const rimRy = 30;
    const botY = -16;
    const botRx = 156;
    const nearArc = api.shapes.arc(0, rimY, rimRx, rimRy, Math.PI, 0, 30);

    api.paint(ctx, api.shapes.ring(0, -10, 182, 11, 26, 0, 0, 6), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 提手：两端落在口沿左右两端
    if (full > 0.5) {
      const h = Math.sin(t * 1.6 + phase) * 2.4;
      const handle = api.shapes.arc(0, rimY, rimRx * 0.99, 128 + h, Math.PI, Math.PI * 2, 26);
      api.inkLine(ctx, handle, 9, '#8a6039');
      api.inkLine(ctx, handle, 6.5, '#a97b4f');
      api.inkLine(ctx, handle.map((q) => [q[0], q[1] - 2.6] as P2), 2.4, 'rgba(255,246,230,0.42)');
    }

    // 篮身
    api.paint(ctx, nearArc.concat([[botRx, botY], [-botRx, botY]] as P2[]), { wash: '#bd8f5e', sw: 3.4 });
    for (let i = 1; i < 9; i++) {
      const a = Math.PI - (i / 9) * Math.PI;
      const tx = Math.cos(a) * rimRx * 0.99;
      const ty = rimY + Math.sin(a) * rimRy * 0.99;
      api.inkLine(ctx, api.shapes.line(tx, ty, tx * (botRx / rimRx), botY + 2, 0, 5, i + 2), 1.5, 'rgba(120,80,44,0.28)');
    }
    ctx.save();
    api.shapes.clip(ctx, nearArc.concat([[botRx, botY], [-botRx, botY]] as P2[]));
    for (let r = 0; r < 4; r++) {
      const f = (r + 1) / 5;
      const yy = api.shapes.lerp(rimY + rimRy, botY, f);
      const half = api.shapes.lerp(rimRx * 1.04, botRx * 1.1, f);
      api.inkLine(ctx, api.shapes.line(-half, yy, half, yy, 7 * f, 12, r + 7), 1.5, 'rgba(120,80,44,0.24)');
    }
    ctx.restore();
    api.paint(ctx, api.shapes.poly([[-botRx + 14, botY], [botRx - 14, botY], [botRx - 22, botY - 11], [-botRx + 22, botY - 11]], 3), { wash: '#a97b4f', sw: 2.4 });

    // 篮内
    api.paint(ctx, api.shapes.ring(0, rimY, rimRx, rimRy, 32), { wash: '#7c5c3c', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(0, rimY + 6, rimRx - 20, rimRy - 14, 28), { wash: '#936d46', sw: 0, washOp: 0.85 });

    // 蔬菜：统一被口沿内圈裁住
    ctx.save();
    api.shapes.clip(ctx, api.shapes.lipClip(0, rimY, rimRx - 18, rimRy - 24));

    // 生菜（后层）
    for (let i = 0; i < 4; i++) {
      const x = -126 + i * 40;
      api.paint(ctx, api.shapes.ring(x, -212 + i * 5 + sway * 0.4, 40, 30, 16, -0.5 + i * 0.4, 0.09, i + 3), { wash: PAL.sap, sw: 1.8, washOp: 0.95 });
    }
    api.inkLine(ctx, api.shapes.line(-100, -186, -88, -158, 3, 4, 3), 1.8, 'rgba(70,110,60,0.5)');

    // 茄子（后右）
    api.paint(ctx, api.shapes.ring(112, -212, 27, 44, 18, 0.22), { wash: '#6b5b8f', sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[100, -250], [126, -266], [132, -242], [106, -234]], 3), { wash: PAL.sap, sw: 1.6 });

    // 胡萝卜（前左，斜放）
    for (let i = 0; i < 2; i++) {
      ctx.save();
      ctx.translate(-140 + i * 16, -180 + i * 16);
      ctx.rotate(-0.22 + i * 0.06);
      api.paint(ctx, api.shapes.poly([[0, 0], [80, -14], [96, 6], [10, 24]], 4), { wash: PAL.orange, sw: 2.2 });
      for (let s = 0; s < 3; s++) {
        api.paint(ctx, api.shapes.poly([[86, -12], [110 + s * 3, -34 + s * 9], [96, -2]], 3), { wash: PAL.sap, sw: 1.4 });
      }
      for (let s = 0; s < 3; s++) {
        api.inkLine(ctx, api.shapes.line(26 + s * 22, 8, 30 + s * 22, -2, 0, 3, s + i + 2), 1.2, 'rgba(150,80,30,0.36)');
      }
      ctx.restore();
    }

    // 番茄（中前）
    for (let i = 0; i < 3; i++) {
      const x = 6 + i * 42;
      const y = -178 + (i % 2) * 14;
      api.paint(ctx, api.shapes.ring(x, y, 27, 25, 18), { wash: '#b8563f', sw: 2.4 });
      api.paint(ctx, api.shapes.ring(x - 8, y - 9, 9, 6, 10), { wash: '#ffffff', sw: 0, washOp: 0.3 });
      api.inkLine(ctx, api.shapes.line(x - 11, y - 23, x + 11, y - 23, 0, 3, i + 4), 2, 'rgba(70,110,60,0.75)');
    }

    // 土豆（左前，压在胡萝卜上）
    api.paint(ctx, api.shapes.ring(-58, -166, 32, 21, 16), { wash: '#d3b98a', sw: 2 });
    for (let i = 0; i < 3; i++) {
      api.paint(ctx, api.shapes.ring(-70 + i * 14, -170 + (i % 2) * 8, 2.4, 2, 7), { wash: '#a88f60', sw: 0, washOp: 0.7 });
    }
    ctx.restore();

    // 口沿前唇
    api.paint(ctx, api.shapes.lipBand(0, rimY, rimRx, rimRy, 22, 28), { wash: '#b2835a', sw: 2.8 });
    api.paint(ctx, api.shapes.lipBand(0, rimY - 6, rimRx - 12, rimRy - 8, 11, 26), { wash: '#d2a976', sw: 0, washOp: 0.55 });
    api.inkLine(ctx, api.shapes.arc(0, rimY, rimRx - 19, rimRy - 21, 0, Math.PI, 26), 1.6, 'rgba(58,47,42,0.32)');
    // 提手固定耳
    if (full > 0.5) {
      for (let i = 0; i < 2; i++) {
        const ex = (i ? 1 : -1) * rimRx * 0.99;
        api.paint(ctx, api.shapes.round(ex - 11, rimY - 18, ex + 11, rimY + 6, 5, 3), { wash: '#8a6039', sw: 2.4 });
        api.paint(ctx, api.shapes.round(ex - 7, rimY - 14, ex + 7, rimY + 1, 4, 2), { wash: '#b98a5c', sw: 0, washOp: 0.9 });
        api.paint(ctx, api.shapes.ring(ex, rimY - 6, 2.8, 2.8, 8), { wash: '#6b4f34', sw: 0 });
      }
    }
  },
};
