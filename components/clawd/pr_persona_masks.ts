import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_persona_masks: ComponentDef<ClawdApi> = {
name: 'pr_persona_masks',
  style: 'clawd',
  kind: 'prop',
  description: 'Two watercolour theatre masks hang from cords, a pale smiling mask in front and a darker weeping mask behind, anchored at the bottom centre and sized 280×240 px. Useful as a wall-hung or handheld symbol of persona, mood, or performance in a scene.',
  tags: ['catalog', 'psychology', 'persona', 'masks', 'prop', 'decor', 'hanging', 'wall'],
  size: [280, 240],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the gentle swaying animation in radians; use different values to desynchronise multiple copies.' },
    flip: { type: 'number', default: 1, min: -1, max: 1, description: 'Sets facing direction: -1 faces left and 1 faces right; values in between reduce the swing and lean.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, flip = 1 } = params as { phase?: number; flip?: number };
    const { PAL } = api;
    const turn = Math.sin(t * 0.9 + phase) * 0.06 * flip;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 96, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 后面的面具（哭脸，暗一档）
    ctx.save();
    ctx.translate(52, -96);
    ctx.rotate(0.3 + turn * 0.4);
    api.inkLine(ctx, [ [0, 30], [0, 96] ], 3, 'rgba(58,47,42,0.45)');
    api.paint(ctx, api.shapes.ring(0, 0, 46, 58, 30, 0, 0.03, 6), { wash: '#b7c0c4', sw: 3 });
    api.inkLine(ctx, api.shapes.arc(-16, -12, 12, 7, Math.PI * 0.1, Math.PI * 0.9, 8), 2.4, PAL.ink);
    api.inkLine(ctx, api.shapes.arc(16, -12, 12, 7, Math.PI * 0.1, Math.PI * 0.9, 8), 2.4, PAL.ink);
    api.inkLine(ctx, api.shapes.arc(0, 32, 18, 13, Math.PI * 1.15, Math.PI * 1.85, 10), 2.6, PAL.ink);
    // 泪滴
    api.paint(ctx, [[-20, 6], [-14, 22], [-26, 22]], { wash: PAL.sky, sw: 1.6, washOp: 0.8 });
    ctx.restore();

    // 前面的面具（笑脸，亮）
    ctx.save();
    ctx.translate(-42, -120);
    ctx.rotate(-0.16 - turn);
    api.inkLine(ctx, [ [0, 34], [0, 108] ], 3.4, 'rgba(58,47,42,0.5)');
    api.paint(ctx, api.shapes.ring(0, 0, 56, 68, 32, 0, 0.02, 3), { wash: '#f4ecda', sw: 3.6 });
    api.paint(ctx, api.shapes.ring(0, -8, 48, 58, 28, 0, 0.02, 9), { wash: '#fbf6ea', sw: 0 });
    // 眼洞（干净的镂空 + 一点点深色）
    for (let i = 0; i < 2; i++) {
      const ex = i ? 20 : -20;
      api.paint(ctx, api.shapes.arc(ex, -14, 13, 8, 0, Math.PI * 2, 14), { wash: 'rgba(58,47,42,0.8)', sw: 2 });
      api.paint(ctx, api.shapes.ring(ex - 3, -17, 3.4, 2.4, 8, -0.4), { wash: '#fbf6ea', sw: 0, washOp: 0.5 });
      api.inkLine(ctx, api.shapes.arc(ex, -34, 14, 6, Math.PI * 1.15, Math.PI * 1.85, 8), 2, 'rgba(58,47,42,0.55)');
    }
    // 笑嘴
    api.inkLine(ctx, api.shapes.arc(0, 20, 24, 18, Math.PI * 0.12, Math.PI * 0.88, 12), 2.8, PAL.ink);
    api.paint(ctx, api.shapes.arc(0, 20, 24, 18, 0, Math.PI, 12), { wash: PAL.rose, sw: 0, washOp: 0.5 });
    // 眉心红点
    api.paint(ctx, api.shapes.ring(0, -40, 5, 5, 10), { wash: PAL.clay, sw: 1.4 });
    ctx.restore();

    // 面具背后的绳结
    api.inkLine(ctx, api.shapes.arc(-34, -140, 40, 26, Math.PI * 0.9, Math.PI * 1.7, 12), 1.8, 'rgba(58,47,42,0.35)');
  },
};
