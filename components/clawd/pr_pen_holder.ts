import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_pen_holder: ComponentDef<ClawdApi> = {
name: 'pr_pen_holder',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour desk pen holder: a tapered brown cylindrical cup with an elliptical rim and base, holding a pencil, a ballpoint pen, a paintbrush and a slanted ruler that sway slightly; an eraser and a small clip sit at its foot. It is 240×250 px with the anchor at the bottom centre, and is good for populating a desk, studio or office scene.',
  tags: ['catalog', 'office', 'stationery', 'pen-holder', 'container', 'desk', 'decor'],
  size: [240, 250],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the pen sway between multiple copies.' },
    wobble: { type: 'number', default: 1, min: 0, max: 2, description: 'Amount the pens and ruler sway inside the cup; 0 keeps them still.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wobble = 1 } = params as { phase?: number; wobble?: number };
    const { PAL } = api;
    const k = Math.sin(t * 0.9 + phase) * 0.012 * wobble;

    api.paint(ctx, api.shapes.ring(0, -8, 86, 10, 20, 0, 0, 3), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 笔筒（圆筒 + 底部椭圆）
    api.paint(ctx, api.shapes.poly([[-62, -96], [62, -96], [56, -18], [-56, -18]], 5), { wash: '#b98a5c', sw: 3 });
    api.paint(ctx, api.shapes.ring(0, -18, 56, 12, 20), { wash: '#a97b4f', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(0, -96, 62, 14, 20), { wash: '#8a6d4e', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(0, -96, 52, 10, 18), { wash: '#5f4a36', sw: 0, washOp: 0.55 });
    // 筒身竖纹与高光
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-40 + i * 40, -94, -36 + i * 40, -22, 0.6, 6, i + 3), 1.2, 'rgba(255,246,230,0.3)');
    }
    api.paint(ctx, api.shapes.poly([[-52, -92], [-34, -92], [-28, -22], [-48, -22]], 4), { wash: '#ffffff', sw: 0, washOp: 0.14 });

    // 里面的笔：铅笔、圆珠笔、画笔、尺子
    ctx.save();
    ctx.translate(0, -96);
    ctx.rotate(k);
    // 铅笔
    api.paint(ctx, api.shapes.poly([[-30, 0], [-18, 0], [-14, -104], [-26, -104]], 3), { wash: PAL.ochre, sw: 2 });
    api.paint(ctx, api.shapes.poly([[-26, -104], [-18, -104], [-22, -120]], 3), { wash: '#e8dcc0', sw: 1.6 });
    api.paint(ctx, api.shapes.poly([[-24, -112], [-20, -112], [-22, -120]], 3), { wash: '#3a2f2a', sw: 0 });
    // 圆珠笔
    api.paint(ctx, api.shapes.poly([[-6, 4], [6, 4], [8, -88], [-8, -88]], 3), { wash: PAL.teal, sw: 2 });
    api.paint(ctx, api.shapes.poly([[8, -88], [-8, -88], [-4, -102], [4, -102]], 3), { wash: '#9aa3a5', sw: 1.6 });
    api.inkLine(ctx, api.shapes.line(-6, -40, 7, -40, 0, 3, 4), 3.4, '#8f9b99');
    // 画笔
    api.paint(ctx, api.shapes.poly([[16, 2], [28, 2], [26, -74], [18, -74]], 3), { wash: '#c79a6a', sw: 2 });
    api.paint(ctx, api.shapes.poly([[18, -74], [26, -74], [24, -92], [20, -92]], 3), { wash: '#9aa3a5', sw: 1.6 });
    api.paint(ctx, api.shapes.poly([[19, -92], [25, -92], [22, -112]], 3), { wash: PAL.rose, sw: 1.4 });
    // 尺子（斜插）
    ctx.save();
    ctx.rotate(0.3);
    api.paint(ctx, api.shapes.poly([[34, 0], [46, -4], [58, -96], [46, -92]], 3), { wash: '#e8dcc0', sw: 1.8 });
    for (let i = 0; i < 5; i++) {
      api.inkLine(ctx, api.shapes.line(46 + i * 2.4, -30 - i * 12, 52 + i * 2.4, -32 - i * 12, 0, 2, i + 3), 1.2, 'rgba(58,47,42,0.35)');
    }
    ctx.restore();
    ctx.restore();

    // 橡皮与小夹子
    api.paint(ctx, api.shapes.round(-64, -20, -34, -8, 3), { wash: PAL.rose, sw: 1.8 });
    api.paint(ctx, api.shapes.round(-40, -16, -22, -8, 2), { wash: '#e8dcc0', sw: 1.4 });
    api.paint(ctx, api.shapes.ring(58, -12, 10, 7, 12), { wash: '#8f9b99', sw: 1.4 });
  },
};
