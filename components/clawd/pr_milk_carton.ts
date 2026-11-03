import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_milk_carton: ComponentDef<ClawdApi> = {
name: 'pr_milk_carton',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour gable-top milk carton in cream paper with a pale blue label band, milk-drop motif, printed lines and a folded seam along the roof ridge; it sways gently and dribbles drops when not full. Anchor is bottom centre, 180×245 px, sized for a tabletop, fridge shelf or breakfast scene.',
  tags: ['catalog', 'prop', 'milk', 'carton', 'container', 'kitchen', 'ground', 'decor'],
  size: [180, 245],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the gentle sway (and the drip timing) between copies of the carton.' },
    full: { type: 'number', default: 1, min: 0, max: 1, description: 'Fill level of the carton; at 1 no milk escapes, and below 1 pale drops spill from the right side, becoming more visible as the value drops.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, full = 1 } = params as { phase?: number; full?: number };
    const { PAL } = api;
    const tilt = Math.sin(t * 0.9 + phase) * 0.014;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(6, -5, 58, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(0, -212);
    ctx.rotate(tilt);
    ctx.translate(0, 212);

    // 右侧面（厚度）
    api.paint(ctx, api.shapes.poly([[58, -150], [76, -162], [76, -22], [58, -10]], 3), { wash: '#e2ddcc', sw: 2.6 });
    // 正面
    api.paint(ctx, api.shapes.poly([[-58, -150], [58, -150], [58, -10], [-58, -10]], 4), { wash: '#f7f3e7', sw: 3.4 });
    // 山形屋顶：正面三角 + 侧面折面
    api.paint(ctx, api.shapes.poly([[-58, -150], [58, -150], [0, -194]], 3), { wash: '#efeada', sw: 3 });
    api.paint(ctx, api.shapes.poly([[58, -150], [0, -194], [18, -204], [76, -162]], 3), { wash: '#e2ddcc', sw: 2.6 });
    // 屋脊与折线
    api.inkLine(ctx, api.shapes.line(0, -194, 0, -150, 0, 4, 4), 1.8, 'rgba(58,47,42,0.45)');
    api.inkLine(ctx, api.shapes.line(-58, -150, 0, -194, 0, 6, 5), 1.6, 'rgba(58,47,42,0.3)');
    api.inkLine(ctx, api.shapes.line(58, -150, 0, -194, 0, 6, 6), 1.6, 'rgba(58,47,42,0.3)');
    // 顶部封口折边（沿屋脊的窄片）
    api.paint(ctx, api.shapes.poly([[-4, -196], [26, -206], [30, -198], [0, -188]], 3), { wash: '#fbf8ee', sw: 2.2 });

    // 牛奶品牌区
    api.paint(ctx, api.shapes.poly([[-58, -112], [58, -112], [58, -74], [-58, -74]], 3), { wash: PAL.sky, sw: 0, washOp: 0.72 });
    api.paint(ctx, api.shapes.ring(-14, -132, 20, 14, 18, 0, 0.06, 4), { wash: PAL.sky, sw: 0, washOp: 0.38 });
    api.inkLine(ctx, api.shapes.arc(-14, -132, 20, 14, Math.PI * 0.1, Math.PI * 0.9, 12), 1.6, 'rgba(79,156,152,0.55)');
    api.inkLine(ctx, api.shapes.line(-36, -100, 24, -100, 0, 4, 2), 3, 'rgba(246,239,223,0.92)');
    api.inkLine(ctx, api.shapes.line(-36, -88, -2, -88, 0, 4, 4), 2, 'rgba(246,239,223,0.72)');
    // 容量与日期
    api.inkLine(ctx, api.shapes.line(-42, -60, -8, -60, 0, 4, 5), 2, 'rgba(58,47,42,0.3)');
    api.inkLine(ctx, api.shapes.line(-42, -50, -18, -50, 0, 4, 7), 1.6, 'rgba(58,47,42,0.22)');
    for (let i = 0; i < 2; i++) {
      api.inkLine(ctx, api.shapes.line(-40 + i * 20, -34, -26 + i * 20, -34, 0, 3, i + 6), 1.2, 'rgba(58,47,42,0.18)');
    }
    // 奶滴图案
    api.paint(ctx, [[18, -46], [28, -64], [38, -46]], { wash: PAL.sky, sw: 1.6, washOp: 0.8 });
    api.paint(ctx, api.shapes.ring(28, -40, 11, 8, 14), { wash: PAL.sky, sw: 1.6, washOp: 0.8 });
    ctx.restore();

    // 倒出的一滴奶
    if (full > 0 && full < 1) {
      for (let i = 0; i < 3; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 2 + i * 2 + phase);
        api.paint(ctx, api.shapes.ring(74 + i * 7, -18 - k * 10, 4, 5.6, 8), { wash: '#ffffff', sw: 0, washOp: 0.8 * (1 - full) });
      }
    }
  },
};
