import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_dish_soap: ComponentDef<ClawdApi> = {
name: 'pr_dish_soap',
  style: 'clawd',
  kind: 'prop',
  description: 'A pale teal watercolour dish-soap bottle with a pump dispenser, white label and green liquid showing through, standing on a soft shadow ring beside a yellow sponge with a green scouring pad and a few floating bubbles. Anchor is bottom centre at 340×330 px, sized for kitchen counter or sink-side scenes.',
  tags: ['catalog', 'kitchen', 'cleaning', 'bottle', 'sponge', 'prop', 'ground'],
  size: [340, 330],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the bubble bobbing cycle, used to desynchronise multiple copies.' },
    bubbles: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of foam and floating bubbles around the bottle; 0 hides them entirely.' },
    level: { type: 'number', default: 0.6, min: 0, max: 1, description: 'How full the bottle is, controlling the opacity of the green liquid wash inside.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, bubbles = 1, level = 0.6 } = params as { phase?: number; bubbles?: number; level?: number };
    const { PAL } = api;

    api.paint(ctx, api.shapes.ring(0, -8, 136, 9, 22, 0, 0, 4), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 洗洁精瓶
    api.paint(ctx, api.shapes.poly([[-62, -12], [62, -12], [58, -170], [30, -196], [-30, -196], [-58, -170]], 5), { wash: '#a9d3cf', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-50, -24], [50, -24], [46, -152], [-46, -152]], 4), { wash: '#f6efdf', sw: 0, washOp: 0.55 });
    // 液体
    api.paint(ctx, api.shapes.poly([[-56, -16], [56, -16], [52, -120], [-52, -120]], 4), { wash: PAL.sap, sw: 0, washOp: 0.35 * api.shapes.clamp01(level) });
    // 标签
    api.paint(ctx, api.shapes.poly([[-44, -64], [44, -64], [42, -132], [-42, -132]], 3), { wash: '#ffffff', sw: 1.6, washOp: 0.85 });
    api.inkLine(ctx, api.shapes.line(-30, -88, 28, -88, 0, 4, 3), 3, 'rgba(58,47,42,0.4)');
    api.inkLine(ctx, api.shapes.line(-30, -104, 12, -104, 0, 4, 4), 2, 'rgba(58,47,42,0.28)');
    // 瓶口与泵头
    api.paint(ctx, api.shapes.round(-18, -206, 18, -190, 4, 3), { wash: '#7f8a8e', sw: 2 });
    api.paint(ctx, api.shapes.poly([[-10, -206], [10, -206], [10, -232], [-10, -232]], 3), { wash: '#b9c2c2', sw: 2 });
    api.paint(ctx, api.shapes.poly([[-10, -232], [46, -238], [46, -226], [-10, -220]], 4), { wash: '#b9c2c2', sw: 2 });
    api.inkLine(ctx, api.shapes.line(46, -232, 58, -228, 0, 3, 5), 2, 'rgba(58,47,42,0.3)');
    // 瓶身高光
    api.paint(ctx, api.shapes.poly([[-46, -30], [-30, -30], [-30, -160], [-44, -158]], 4), { wash: '#ffffff', sw: 0, washOp: 0.4 });

    // 海绵（两色）
    ctx.save();
    ctx.translate(86, -22);
    ctx.rotate(0.08);
    api.paint(ctx, api.shapes.round(-6, -70, 76, -6, 8, 5), { wash: '#f2e08a', sw: 2.4 });
    api.paint(ctx, api.shapes.round(-6, -70, 76, -46, 6, 4), { wash: PAL.sap, sw: 2.2 });
    for (let i = 0; i < 6; i++) {
      api.paint(ctx, api.shapes.ring(-2 + (i % 3) * 26, -60 + Math.floor(i / 3) * 10, 3.4, 2.4, 8), { wash: '#c9d2a8', sw: 0, washOp: 0.7 });
    }
    ctx.restore();

    // 泡沫与泡泡
    if (bubbles > 0.1) {
      for (let i = 0; i < 5; i++) {
        const a = Math.sin(t * 1.4 + i * 1.3 + phase);
        const x = 78 + Math.cos(i * 1.7) * 34 + a * 3;
        const y = -96 - i * 14 + Math.sin(t * 1.1 + i) * 4;
        const r = 8 + (i % 3) * 4;
        api.paint(ctx, api.shapes.ring(x, y, r, r * 0.94, 14), { wash: '#ffffff', sw: 1.4, washOp: 0.55 * bubbles });
        api.paint(ctx, api.shapes.ring(x - r * 0.3, y - r * 0.3, r * 0.3, r * 0.3, 8), { wash: '#ffffff', sw: 0, washOp: 0.8 * bubbles });
      }
      api.paint(ctx, api.shapes.ring(-90, -20, 26, 8, 14), { wash: '#ffffff', sw: 1.2, washOp: 0.5 * bubbles });
    }
  },
};
