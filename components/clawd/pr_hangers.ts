import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_hangers: ComponentDef<ClawdApi> = {
name: 'pr_hangers',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour laundry rail with up to three wooden and metal clothes hangers hanging from it, one or two draped with a washed shirt; a small teal clip basket hangs at the left. Anchor is bottom centre at 420×280 px, good for a bathroom, utility room or laundry corner of a scene.',
  tags: ['catalog', 'laundry', 'hangers', 'clothing', 'household', 'hanging', 'decor'],
  size: [420, 280],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the sway animation cycle in radians so repeated copies do not swing in sync.' },
    count: { type: 'number', default: 3, min: 0, max: 12, description: 'Number of hangers drawn; the value is rounded and clamped to 1–3, filling from left to right.' },
    sway: { type: 'number', default: 1, min: 0, max: 3, description: 'Multiplier on the rocking motion of the hangers; 0 keeps them still, higher values swing them more.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, count = 3, sway = 1 } = params as { phase?: number; count?: number; sway?: number };
    const { PAL } = api;
    const rock = Math.sin(t * 0.9 + phase) * 0.02 * sway;

    // 挂衣杆
    api.inkLine(ctx, api.shapes.line(-176, -258, 176, -258, 0, 10, 3), 6, '#8f9b99');
    api.inkLine(ctx, api.shapes.line(-176, -261, 176, -261, 0, 10, 5), 2, 'rgba(255,255,255,0.5)');
    for (let i = 0; i < 2; i++) {
      api.paint(ctx, api.shapes.round(-182 + i * 356, -268, -166 + i * 356, -248, 6, 3), { wash: '#6b7376', sw: 2 });
    }

    // 三只衣架
    const hanger = (cx: number, rot: number, col: string, withCloth: number) => {
      ctx.save();
      ctx.translate(cx, -258);
      ctx.rotate(rot + rock * (1 + cx / 400));
      // 挂钩
      api.inkLine(ctx, api.shapes.arc(0, -10, 12, 14, Math.PI * 0.15, Math.PI * 1.35, 12), 3, col);
      api.inkLine(ctx, api.shapes.line(0, -2, 0, 12, 0, 3, 3), 3, col);
      // 肩部
      api.inkLine(ctx, api.shapes.line(0, 12, -76, 44, -3, 6, 4), 4, col);
      api.inkLine(ctx, api.shapes.line(0, 12, 76, 44, 3, 6, 5), 4, col);
      // 横杆
      api.inkLine(ctx, api.shapes.line(-74, 46, 74, 46, 0, 6, 6), 3.6, col);
      if (withCloth > 0.4) {
        // 挂着的衬衫/围巾
        api.paint(
          ctx,
          api.shapes.poly([[-70, 40], [0, 26], [70, 40], [64, 132], [10, 140], [-8, 132], [-64, 128]], 3),
          { wash: withCloth > 1.5 ? PAL.ochre : PAL.sky, sw: 2.4, washOp: 0.95 }
        );
        api.inkLine(ctx, api.shapes.line(0, 30, 0, 138, 0, 5, 7), 1.4, 'rgba(58,47,42,0.25)');
        for (let i = 0; i < 2; i++) {
          api.paint(ctx, api.shapes.ring(-22 + i * 44, 60, 3, 3, 8), { wash: '#f6efdf', sw: 0, washOp: 0.8 });
        }
      }
      ctx.restore();
    };

    const n = Math.min(3, Math.max(1, Math.round(count)));
    if (n > 2) hanger(112, 0.04, '#a97b4f', 0);
    if (n > 1) hanger(16, -0.02, '#8f9b99', 2);
    hanger(-96, 0.03, '#a97b4f', 1);

    // 地上的鞋盒？不需要——补一个夹子衣架
    api.paint(ctx, api.shapes.round(-196, -180, -170, -140, 4, 3), { wash: PAL.teal, sw: 2, washOp: 0.9 });
    for (let i = 0; i < 2; i++) {
      api.paint(ctx, api.shapes.round(-208 + i * 30, -140, -188 + i * 30, -126, 3, 3), { wash: '#b9b2a2', sw: 1.2 });
    }
  },
};
