import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_folding_chair: ComponentDef<ClawdApi> = {
name: 'pr_folding_chair',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour folding chair with a rose fabric seat and backrest stretched over an X-crossed grey metal frame, finished with ochre hinges and dark foot caps. It sits on a soft shadow, anchored at the bottom centre at 260×300 px, and is good for outdoor cafés, garden or patio scenes, and small gathering props.',
  tags: ['catalog', 'furniture', 'chair', 'folding', 'metal', 'fabric', 'ground', 'decor'],
  size: [260, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the gentle rocking motion between copies of the chair.' },
    wobble: { type: 'number', default: 1, min: 0, max: 2, description: 'Amount of the slow side-to-side rocking sway; 0 keeps the chair still, higher values make it tilt more.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wobble = 1 } = params as { phase?: number; wobble?: number };
    const { PAL } = api;
    const rock = Math.sin(t * 0.9 + phase) * 0.008 * wobble;
    const metal = '#9fabaa';

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 88, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(0, -6);
    ctx.rotate(rock);

    // 后腿（兼靠背立柱）
    api.inkLine(ctx, api.shapes.line(-52, -4, -44, -244, -2, 8, 2), 8, metal);
    api.inkLine(ctx, api.shapes.line(52, -4, 44, -244, 2, 8, 3), 8, metal);
    api.inkLine(ctx, api.shapes.line(-52, -4, -44, -244, -2, 8, 2), 2.6, PAL.ink);
    api.inkLine(ctx, api.shapes.line(52, -4, 44, -244, 2, 8, 3), 2.6, PAL.ink);

    // 前腿（X 交叉）
    api.inkLine(ctx, api.shapes.line(-14, -6, 62, -140, 2, 8, 4), 7, metal);
    api.inkLine(ctx, api.shapes.line(14, -6, -62, -140, -2, 8, 5), 7, metal);
    api.inkLine(ctx, api.shapes.line(-14, -6, 62, -140, 2, 8, 4), 2.4, PAL.ink);
    api.inkLine(ctx, api.shapes.line(14, -6, -62, -140, -2, 8, 5), 2.4, PAL.ink);
    // 座面横管
    api.inkLine(ctx, api.shapes.line(-66, -140, 66, -140, 1, 8, 6), 6, metal);
    api.inkLine(ctx, api.shapes.line(-66, -140, 66, -140, 1, 8, 6), 2.2, PAL.ink);
    // 顶部横管
    api.inkLine(ctx, api.shapes.line(-50, -248, 50, -248, 1, 8, 7), 6, metal);
    api.inkLine(ctx, api.shapes.line(-50, -248, 50, -248, 1, 8, 7), 2.2, PAL.ink);

    // 靠背布
    api.paint(ctx, api.shapes.poly([[-46, -240], [46, -240], [42, -152], [-42, -152]], 3), { wash: PAL.rose, sw: 3 });
    for (let i = 0; i < 2; i++) {
      api.inkLine(ctx, api.shapes.line(-38, -196 - i * 26, 38, -196 - i * 26, 1, 8, i + 4), 1.6, 'rgba(255,255,255,0.35)');
    }
    // 座面布
    api.paint(ctx, api.shapes.poly([[-64, -138], [64, -138], [58, -112], [-58, -112]], 3), { wash: PAL.rose, sw: 3, washOp: 0.96 });
    api.inkLine(ctx, api.shapes.line(-56, -126, 56, -126, 1, 8, 5), 1.6, 'rgba(255,255,255,0.32)');

    // 铰接件与脚套
    api.paint(ctx, api.shapes.ring(0, -140, 5, 5, 10), { wash: PAL.ochre, sw: 1.8 });
    api.paint(ctx, api.shapes.round(-60, -12, -46, -2, 2), { wash: PAL.ink, sw: 0, washOp: 0.55 });
    api.paint(ctx, api.shapes.round(-22, -12, -8, -2, 2), { wash: PAL.ink, sw: 0, washOp: 0.55 });
    api.paint(ctx, api.shapes.round(8, -12, 22, -2, 2), { wash: PAL.ink, sw: 0, washOp: 0.55 });
    api.paint(ctx, api.shapes.round(46, -12, 60, -2, 2), { wash: PAL.ink, sw: 0, washOp: 0.55 });
    ctx.restore();
  },
};
