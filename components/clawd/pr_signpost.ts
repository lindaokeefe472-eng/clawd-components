import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_signpost: ComponentDef<ClawdApi> = {
name: 'pr_signpost',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wooden signpost: a clay-brown post with two arrow-shaped boards (ochre pointing right, teal pointing left), a small rose flag on top, and a tuft of grass at the base. Anchored at the bottom centre at 240×290 px, it sways gently and suits roadside, garden or village scenes as a wayfinding prop.',
  tags: ['catalog', 'outdoor', 'signpost', 'prop', 'wood', 'ground', 'decor', 'wayfinding'],
  size: [240, 290],
  params: {
    sway: { type: 'number', default: 1, min: 0, max: 3, description: 'Amount the two boards rock back and forth; 0 keeps them still.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the sway and flag motion, to desynchronise copies of the signpost.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { sway = 1, phase = 0 } = params as { sway?: number; phase?: number };
    const { PAL } = api;

    // 地面草丛
    api.paint(ctx, api.shapes.ring(0, -10, 82, 13, 30, 0, 0.03, 5), { wash: PAL.sap, sw: 2.4, washOp: 0.45 });
    for (let i = 0; i < 5; i++) {
      const x = -66 + i * 33;
      api.inkLine(ctx, [[x, -14], [x - 6 + api.shapes.jit(i, 4), -30 - Math.abs(api.shapes.jit(i + 2, 10))]], 1.8, 'rgba(125,155,98,0.9)');
    }

    // 立柱
    api.paint(ctx, api.shapes.round(-14, -262, 14, -10, 5), { wash: PAL.clay, sw: 3.4 });
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-6 + i * 5, -250, -6 + i * 5, -26, 2, 8, i + 4), 1.1, 'rgba(90,60,45,0.32)');
    }

    // 上方指示牌
    const s1 = Math.sin(t * 1.6 + phase) * 0.012 * sway;
    ctx.save();
    ctx.translate(0, -224);
    ctx.rotate(s1);
    const b1 = api.shapes.round(-82, -40, 70, 2, 7);
    api.paint(ctx, b1, { wash: PAL.ochre, sw: 3.4 });
    // 箭头尖
    api.paint(ctx, [[68, -6], [96, -19], [68, -32]], { wash: PAL.ochre, sw: 3.2 });
    api.inkLine(ctx, api.shapes.line(-64, -12, 46, -12, 1, 8, 3), 2.4, 'rgba(58,47,42,0.5)');
    api.inkLine(ctx, api.shapes.line(-64, -26, 26, -26, 1, 8, 6), 2.4, 'rgba(58,47,42,0.45)');
    api.paint(ctx, api.shapes.ring(-70, -19, 3.5, 3.5, 8), { wash: PAL.ink, sw: 0 });
    ctx.restore();

    // 下方指示牌（反向）
    ctx.save();
    ctx.translate(0, -160);
    ctx.rotate(-s1 * 1.4);
    const b2 = api.shapes.round(-70, -36, 82, 0, 7);
    api.paint(ctx, b2, { wash: PAL.teal, sw: 3.4 });
    api.paint(ctx, [[-68, -8], [-96, -20], [-68, -32]], { wash: PAL.teal, sw: 3.2 });
    api.inkLine(ctx, api.shapes.line(-36, -13, 64, -13, 1, 8, 9), 2.4, 'rgba(246,239,223,0.8)');
    api.inkLine(ctx, api.shapes.line(-14, -25, 64, -25, 1, 8, 2), 2.4, 'rgba(246,239,223,0.65)');
    api.paint(ctx, api.shapes.ring(70, -19, 3.5, 3.5, 8), { wash: PAL.ink, sw: 0 });
    ctx.restore();

    // 柱顶小旗
    const flag = 0.5 + 0.5 * Math.sin(t * 2.4 + phase);
    api.inkLine(ctx, api.shapes.line(0, -262, 0, -288, 0, 4, 7), 2.4, PAL.ink);
    api.paint(ctx, [[2, -288], [36, -280 + flag * 5], [2, -270]], { wash: PAL.rose, sw: 2.2 });
  },
};
