import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_stone_stack: ComponentDef<ClawdApi> = {
name: 'pr_stone_stack',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour cairn of five rounded stones stacked from largest to smallest, with a grassy base ring and a few blades sprouting from the top stone. Anchored at the bottom centre at 220×260 px, it works as a small ground prop in gardens, paths or outdoor landscape scenes.',
  tags: ['catalog', 'outdoor', 'stone', 'stack', 'ground', 'decor', 'plant'],
  size: [220, 260],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the stone wobble and grass sway between copies.' },
    wobble: { type: 'number', default: 1, min: 0, max: 2, description: 'Amount of gentle rocking applied to the stacked stones; 0 keeps the stack still.' },
    grass: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of grass around the base and on top; 0 removes the grass entirely.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wobble = 1, grass = 1 } = params as { phase?: number; wobble?: number; grass?: number };
    const { PAL } = api;

    // 草地
    if (grass > 0) {
      api.paint(ctx, api.shapes.ring(0, -8, 92, 12, 28, 0, 0.05, 3), { wash: PAL.sap, sw: 2.2, washOp: 0.4 });
      for (let i = 0; i < 6; i++) {
        const x = -70 + i * 28;
        const h = 12 + Math.abs(api.shapes.jit(i + 4, 10));
        api.inkLine(ctx, [[x, -12], [x - 5 + Math.sin(t * 1.6 + i) * 3, -12 - h]], 1.8, 'rgba(125,155,98,0.85)');
      }
    }

    // 叠石：从下到上，逐块带极小的摇摆
    const stones: Array<[number, number, number, number, number, string]> = [
      [0, -34, 72, 26, 0.6, '#b9b2a3'],
      [-6, -84, 56, 22, 1.9, '#c8c1b1'],
      [8, -128, 44, 19, 3.1, '#a9a292'],
      [-2, -166, 32, 15, 4.4, '#c2bbac'],
      [4, -196, 21, 11, 5.6, '#b2ab9c'],
    ];
    for (let i = 0; i < stones.length; i++) {
      const [x, y, rx, ry, ph, col] = stones[i];
      const w = Math.sin(t * 0.9 + ph + phase) * 0.012 * wobble * (i + 1) * 0.4;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(w);
      api.paint(ctx, api.shapes.ring(0, 0, rx, ry, 26, 0, 0.06, i + 5), { wash: col, sw: 3 });
      // 石面高光与裂纹
      api.paint(ctx, api.shapes.ring(-rx * 0.22, -ry * 0.3, rx * 0.36, ry * 0.3, 14, 0, 0.1, i + 9), {
        wash: PAL.paper,
        sw: 0,
        washOp: 0.3,
      });
      api.inkLine(ctx, api.shapes.line(-rx * 0.5, ry * 0.15, rx * 0.2, ry * 0.35, 1.5, 6, i + 2), 1.1, 'rgba(58,47,42,0.25)');
      ctx.restore();
    }

    // 顶部的小草
    const s = Math.sin(t * 1.8 + phase);
    api.inkLine(ctx, [[4, -206], [1 + s * 4, -226]], 1.8, PAL.sap);
    api.inkLine(ctx, [[6, -206], [12 + s * 5, -222]], 1.8, PAL.sap);
    api.paint(ctx, api.shapes.ring(8 + s * 3, -228, 4, 3, 8), { wash: PAL.ochre, sw: 0 });
  },
};
