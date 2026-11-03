import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_mirror_self: ComponentDef<ClawdApi> = {
name: 'pr_mirror_self',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour standing oval mirror on a small wooden base with two angled struts, its ochre frame enclosing pale glass that shows a faint abstract figure with a glowing rose heart. The highlight streak drifts across the glass; 250×290 px with the anchor at bottom centre, suited to interior scenes and quiet self-reflection moments.',
  tags: ['catalog', 'psychology', 'mirror', 'self', 'decor', 'ground', 'interior'],
  size: [250, 290],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the shimmer and heart-pulse animation in radians so multiple copies do not pulse in sync.' },
    shimmer: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the moving white highlight band on the glass; 0 keeps it nearly still and faint.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, shimmer = 1 } = params as { phase?: number; shimmer?: number };
    const { PAL } = api;
    const glint = Math.sin(t * 0.9 + phase);

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 78, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 支架与外框
    api.paint(ctx, api.shapes.poly([[-56, -8], [56, -8], [40, -18], [-40, -18]], 3), { wash: '#b08a63', sw: 2.8 });
    api.inkLine(ctx, api.shapes.line(-30, -18, -22, -60, 0, 4, 2), 4, '#b08a63');
    api.inkLine(ctx, api.shapes.line(30, -18, 22, -60, 0, 4, 3), 4, '#b08a63');
    api.paint(ctx, api.shapes.ring(0, -158, 92, 122, 40, 0, 0.01, 4), { wash: PAL.ochre, sw: 3.6 });
    api.paint(ctx, api.shapes.ring(0, -158, 80, 110, 36, 0, 0.01, 8), { wash: '#dfe9ea', sw: 2.6 });

    // 镜面反射（比真人稍慢半拍、左右翻转）
    ctx.save();
    ctx.globalAlpha = 0.9;
    api.paint(ctx, api.shapes.ring(0, -158, 78, 108, 30, 0, 0.02, 12), { wash: '#cfe0e4', sw: 0, washOp: 0.85 });
    // 倒影：抽象的人形轮廓
    api.paint(ctx, api.shapes.ring(0, -204, 30, 34, 22, 0, 0.03, 5), { wash: 'rgba(58,47,42,0.22)', sw: 0 });
    api.paint(ctx, api.shapes.poly([[-40, -60], [40, -60], [30, -176], [-30, -176]], 4), { wash: 'rgba(58,47,42,0.16)', sw: 0 });
    // 倒影里亮着的心（自我认知）
    const k = 0.5 + 0.5 * Math.sin(t * 1.5 + phase);
    api.glow(ctx, 0, -128, 44, PAL.rose, 0.2 + 0.16 * k);
    api.paint(ctx, api.shapes.heart(0, -128, 17 + 2 * k), { wash: PAL.rose, sw: 2, washOp: 0.85 });
    ctx.restore();

    // 镜面高光斜条
    ctx.save();
    ctx.globalAlpha = 0.3 + 0.1 * glint * shimmer;
    ctx.beginPath();
    ctx.moveTo(-46 + glint * 6, -240);
    ctx.lineTo(-10 + glint * 6, -240);
    ctx.lineTo(-56 + glint * 6, -70);
    ctx.lineTo(-78 + glint * 6, -70);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    // 边框装饰点
    for (let i = 0; i < 6; i++) {
      const a = Math.PI * 1.15 + (i / 5) * Math.PI * 0.7;
      api.paint(ctx, api.shapes.ring(Math.cos(a) * 86, -158 + Math.sin(a) * 116, 3, 3, 8), { wash: PAL.clay, sw: 0, washOp: 0.7 });
    }
  },
};
