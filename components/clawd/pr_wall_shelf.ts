import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_wall_shelf: ComponentDef<ClawdApi> = {
name: 'pr_wall_shelf',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wall shelf with two triangular wooden brackets and a broad board, holding a stack of books, a small potted plant that sways gently, a jar and three tiny coloured objects. It is 280×220 px with its anchor at the bottom centre and works as interior wall decor in a room scene.',
  tags: ['catalog', 'wall', 'shelf', 'decor', 'container', 'plant', 'wood', 'interior'],
  size: [280, 220],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the plant\'s sway animation cycle in radians; change it to desynchronise multiple shelf copies.' },
    plants: { type: 'number', default: 1, min: 0, max: 12, description: 'Controls whether the potted plant is drawn: 0 hides it, while any value above 0 shows one plant.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, plants = 1 } = params as { phase?: number; plants?: number };
    const { PAL } = api;
    const sway = Math.sin(t * 1.1 + phase) * 1.6;

    // 三角支架
    api.paint(ctx, api.shapes.poly([[-102, -46], [-84, -46], [-102, -6]], 3), { wash: '#b08a63', sw: 2.8 });
    api.paint(ctx, api.shapes.poly([[102, -46], [84, -46], [102, -6]], 3), { wash: '#b08a63', sw: 2.8 });

    // 隔板
    api.paint(ctx, api.shapes.poly([[-128, -60], [128, -60], [128, -40], [-128, -40]], 4), { wash: PAL.clay, sw: 3.2 });
    api.inkLine(ctx, api.shapes.line(-120, -48, 120, -48, 0.8, 10, 4), 1.2, 'rgba(90,60,45,0.28)');

    // 书本堆
    api.paint(ctx, api.shapes.round(-108, -74, -30, -60, 3), { wash: PAL.teal, sw: 2.4 });
    api.paint(ctx, api.shapes.round(-104, -88, -36, -74, 3), { wash: PAL.rose, sw: 2.4 });
    api.paint(ctx, api.shapes.round(-100, -100, -42, -88, 3), { wash: PAL.ochre, sw: 2.4 });

    // 小盆栽
    if (plants > 0) {
      ctx.save();
      ctx.translate(18, -58);
      ctx.rotate(sway * 0.008);
      api.paint(ctx, [[-20, 0], [20, 0], [14, -34], [-14, -34]], { wash: '#d7b48c', sw: 2.8 });
      api.paint(ctx, api.shapes.ring(0, -34, 14, 5, 14), { wash: '#c19b70', sw: 2 });
      // 叶片
      for (let i = 0; i < 5; i++) {
        const a = -1.9 + i * 0.5;
        api.paint(
          ctx,
          api.shapes.ring(Math.cos(a) * 14 + sway * 0.5, -46 + Math.sin(a) * 12, 13, 6, 12, a + 0.6, 0.06, i + 2),
          { wash: PAL.sap, sw: 1.8 }
        );
      }
      ctx.restore();
    }

    // 罐子与香薰
    api.paint(ctx, api.shapes.round(58, -84, 92, -58, 8), { wash: '#e7edee', sw: 2.4 });
    api.paint(ctx, api.shapes.round(62, -84, 88, -74, 4), { wash: PAL.clay, sw: 1.8 });
    for (let i = 0; i < 3; i++) {
      const x = -28 + i * 30;
      api.paint(ctx, api.shapes.ring(x, -64, 6, 7, 10), { wash: [PAL.ochre, PAL.rose, PAL.teal][i], sw: 1.4, washOp: 0.85 });
    }
  },
};
