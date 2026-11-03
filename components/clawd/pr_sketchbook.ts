import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_sketchbook: ComponentDef<ClawdApi> = {
name: 'pr_sketchbook',
  style: 'clawd',
  kind: 'prop',
  description: 'An open watercolour sketchbook lying flat, with a clay-toned cover, cream page block, ink sketches of a leaf, sun and sailboat, a lifting page that flutters, an orange bookmark ribbon and a pencil resting across the top. Anchor is bottom centre at 320×150 px; good as a desk or table prop in a studio, study or artist\'s scene.',
  tags: ['catalog', 'sketchbook', 'stationery', 'paper', 'drawing', 'desk', 'decor', 'ground'],
  size: [320, 150],
  params: {
    flip: { type: 'number', default: 1, min: -1, max: 1, description: 'Facing and page-lift switch: values above 0 draw the animated lifted page, values at or below 0 keep the book flat.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the page flutter and pencil wobble, used to desynchronise multiple copies.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { flip = 1, phase = 0 } = params as { flip?: number; phase?: number };
    const { PAL } = api;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 148, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 书封
    api.paint(ctx, api.shapes.round(-154, -96, 154, -16, 9), { wash: PAL.clay, sw: 3.6 });
    // 页面块
    api.paint(ctx, api.shapes.round(-146, -90, 146, -22, 6), { wash: PAL.paper, sw: 2.6 });
    // 页缘线
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-142, -30 + i * 3, 142, -30 + i * 3, 0.6, 10, i + 7), 1.1, 'rgba(58,47,42,0.28)');
    }

    // 书脊阴影
    api.paint(ctx, [[-9, -88], [9, -88], [9, -24], [-9, -24]], { wash: PAL.clay, sw: 0, washOp: 0.35 });
    api.inkLine(ctx, api.shapes.line(0, -88, 0, -24, 0.5, 8, 3), 2.2, 'rgba(58,47,42,0.6)');

    // 左页：速写线 + 一片叶子
    for (let i = 0; i < 3; i++) {
      const y = -80 + i * 10;
      api.inkLine(ctx, api.shapes.line(-126, y, -40, y + 2 + api.shapes.jit(i, 1.4), 2, 8, i + 3), 1.4, 'rgba(58,47,42,0.4)');
    }
    api.paint(ctx, api.shapes.ring(-92, -48, 27, 11, 22, -0.12, 0.05, 9), { wash: PAL.sap, sw: 1.8, washOp: 0.7 });
    api.inkLine(ctx, api.shapes.line(-118, -54, -66, -43, 1, 6, 5), 1.4, 'rgba(58,47,42,0.55)');

    // 右页：太阳 + 帆船
    api.paint(ctx, api.shapes.ring(112, -76, 10, 10, 16), { wash: PAL.ochre, sw: 1.6, washOp: 0.85 });
    api.inkLine(ctx, api.shapes.line(-118, -46, 128, -46, 0, 12, 4), 1.4, 'rgba(58,47,42,0.3)');
    api.inkLine(ctx, api.shapes.line(48, -50, 122, -50, 0, 6, 2), 2, PAL.ink);
    api.paint(ctx, [[70, -52], [70, -80], [46, -52]], { wash: PAL.teal, sw: 1.8 });
    api.paint(ctx, [[74, -52], [74, -84], [96, -52]], { wash: PAL.rose, sw: 1.8 });
    api.inkLine(ctx, api.shapes.line(72, -50, 72, -86, 0, 5, 4), 2, PAL.ink);
    api.inkLine(ctx, api.shapes.arc(60, -50, 40, 5, 0, Math.PI * 0.85, 10), 1.4, 'rgba(58,47,42,0.4)');

    // 翻起的一页
    if (flip > 0) {
      const f = 0.5 + 0.5 * Math.sin(t * 1.5 + phase);
      const lift = 6 + 26 * f;
      ctx.save();
      ctx.globalAlpha = 0.9;
      const page: P2[] = [[8, -86], [140, -86], [128, -92 - lift], [30, -88 - lift * 0.8]];
      api.paint(ctx, page, { wash: PAL.paper, sw: 2 });
      ctx.restore();
    }

    // 书签丝带
    api.paint(ctx, [[-124, -92], [-108, -94], [-110, -120], [-116, -112], [-122, -120]], { wash: PAL.orange, sw: 2.2 });

    // 铅笔（横放于书面上）
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(-0.05 + Math.sin(t * 0.85 + phase) * 0.01);
    api.paint(ctx, api.shapes.round(-30, -118, 62, -104, 4), { wash: PAL.ochre, sw: 2.4 });
    api.paint(ctx, [[62, -118], [62, -104], [80, -111]], { wash: PAL.clay, sw: 2.2 });
    api.paint(ctx, [[74, -113.5], [74, -108.5], [80, -111]], { wash: PAL.ink, sw: 0 });
    api.inkLine(ctx, api.shapes.line(-24, -112, -8, -112, 0, 3, 6), 1.4, 'rgba(58,47,42,0.35)');
    ctx.restore();
  },
};
