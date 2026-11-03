import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_frying_pan: ComponentDef<ClawdApi> = {
name: 'pr_frying_pan',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour cast-iron frying pan with a long handle, a fried egg and a strip of bacon inside, plus faint sizzle droplets and steam. Anchor is bottom centre at 300×165 px; suited to kitchen or campfire cooking scenes as a handheld or tabletop prop.',
  tags: ['catalog', 'frying-pan', 'cookware', 'kitchen', 'food', 'handheld', 'watercolour'],
  size: [300, 165],
  anchorNames: ['grip'],
  anchors() { return { grip: [140, -22] }; },
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises sizzle motion between copies.' },
    sizzle: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of sizzle animation; 0 hides droplets and steam, 1 gives full motion.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, sizzle = 1 } = params as { phase?: number; sizzle?: number };
    const { PAL } = api;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(-30, -5, 92, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 锅柄
    const wig = Math.sin(t * 1.4 + phase) * 0.012 * sizzle;
    ctx.save();
    ctx.translate(-30, -50);
    ctx.rotate(wig);
    api.inkLine(ctx, api.shapes.line(76, -6, 148, -22, -2, 10, 3), 9, PAL.ink);
    api.inkLine(ctx, api.shapes.line(80, -6, 146, -21, -2, 10, 3), 5, PAL.clay);
    api.paint(ctx, api.shapes.ring(150, -22, 9, 7, 12, -0.2), { wash: PAL.ink, sw: 0 });
    ctx.restore();

    // 锅体
    api.paint(ctx, api.shapes.ring(-30, -64, 88, 34, 40, 0, 0.01, 3), { wash: '#6d6a66', sw: 3.6 });
    api.paint(ctx, api.shapes.ring(-30, -70, 78, 28, 36, 0, 0.02, 6), { wash: '#4f4b48', sw: 0 });
    // 锅沿高光
    api.inkLine(ctx, api.shapes.arc(-30, -78, 84, 26, Math.PI * 1.06, Math.PI * 1.94, 22), 2.6, 'rgba(246,239,223,0.4)');

    // 煎蛋
    api.paint(ctx, api.shapes.ring(-42, -76, 34, 17, 24, 0.1, 0.05, 8), { wash: '#fdfbf2', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(-40, -78, 15, 10, 16, 0, 0.04, 5), { wash: PAL.ochre, sw: 2 });
    // 培根
    api.paint(ctx, [[14, -70], [40, -76], [56, -66], [36, -60]], { wash: '#c96a5a', sw: 2 });
    api.inkLine(ctx, api.shapes.line(20, -70, 46, -64, 1, 4, 4), 1.4, 'rgba(255,240,220,0.6)');

    // 油星与热气
    if (sizzle > 0) {
      for (let i = 0; i < 6; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 5 + i * 2.1 + phase);
        const x = -76 + i * 24 + Math.sin(t * 3 + i) * 4;
        const y = -104 - k * 20 - (i % 3) * 12;
        api.paint(ctx, api.shapes.ring(x, y, 2.2, 2.6, 6), { wash: PAL.paper, sw: 0, washOp: 0.36 + 0.3 * k });
      }
      for (let i = 0; i < 2; i++) {
        const pts: P2[] = [];
        for (let k = 0; k <= 8; k++) {
          const u = k / 8;
          pts.push([-40 + i * 46 + Math.sin(u * 4 - t * 2.4 + i) * (4 + u * 8), -96 - u * 40]);
        }
        api.inkLine(ctx, pts, 2, 'rgba(58,47,42,0.15)');
      }
    }
  },
};
