import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_broom: ComponentDef<ClawdApi> = {
name: 'pr_broom',
  style: 'clawd',
  kind: 'prop',
  description: 'A straw broom with a long pale wooden handle, a hanging ring at the top, and a trapezoidal brush head bound with a clay-coloured band, its straw strands drawn individually and small dust puffs at the tips. It sways gently around its anchor at the bottom centre, 200×320 px, and suits wall-hung or door-side household scenes.',
  tags: ['catalog', 'broom', 'tool', 'household', 'hanging', 'wall', 'straw', 'prop'],
  size: [200, 320],
  anchorNames: ['grip'],
  anchors() { return { grip: [24, -200] }; },
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the sway and dust-puff animation between copies.' },
    sway: { type: 'number', default: 1, min: 0, max: 3, description: 'Amount of tilting sway; 0 keeps the broom nearly still, higher values widen the oscillation.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, sway = 1 } = params as { phase?: number; sway?: number };
    const { PAL } = api;
    const tilt = 0.1 + Math.sin(t * 0.8 + phase) * 0.012 * sway;

    ctx.save();
    ctx.translate(24, -6);
    ctx.rotate(tilt);

    // 手柄
    api.inkLine(ctx, api.shapes.line(0, 0, 0, -290, 1.5, 12, 2), 6, '#c9a978');
    api.inkLine(ctx, api.shapes.line(0, 0, 0, -290, 1.5, 12, 2), 2.6, PAL.ink);
    // 挂孔
    api.paint(ctx, api.shapes.ring(0, -296, 6, 8, 12), { wash: PAL.paper, sw: 2 });

    // 草编扫帚头（梯形 + 绑带 + 草茎）
    api.paint(ctx, [[-16, -96], [16, -96], [46, 0], [-46, 0]], { wash: '#dcc48f', sw: 3.2 });
    // 草茎线
    for (let i = 0; i < 11; i++) {
      const u = i / 10;
      const x0 = -14 + u * 28;
      const x1 = -42 + u * 84;
      api.inkLine(ctx, api.shapes.line(x0, -92, x1 + Math.sin(t * 1.4 + i) * 1.5, -4, 1, 6, i + 3), 1.3, 'rgba(140,105,55,0.6)');
    }
    // 绑带
    api.paint(ctx, api.shapes.round(-20, -104, 20, -86, 5), { wash: PAL.clay, sw: 2.6 });
    api.inkLine(ctx, api.shapes.line(-20, -95, 20, -95, 0, 6, 4), 1.6, 'rgba(90,50,30,0.35)');

    // 扫帚毛尖的小尘团
    for (let i = 0; i < 3; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 1.8 + i * 2 + phase);
      api.paint(ctx, api.shapes.ring(-34 + i * 34, -6 + k * 3, 10 + k * 4, 4, 10), { wash: PAL.paper, sw: 0, washOp: 0.3 + 0.2 * k });
    }
    ctx.restore();
  },
};
