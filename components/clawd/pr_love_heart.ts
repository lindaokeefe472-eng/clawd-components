import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_love_heart: ComponentDef<ClawdApi> = {
name: 'pr_love_heart',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour love heart with a soft rose wash, paper highlight, stitched heartbeat line, and four small orbiting hearts, casting a faint shadow beneath. Anchored at the bottom centre at 230×220 px, it suits romantic or affection-themed scene accents and UI props.',
  tags: ['catalog', 'love', 'heart', 'prop', 'decor', 'psychology', 'floating'],
  size: [230, 220],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the pulse and orbiting-heart positions to desynchronise multiple copies.' },
    beat: { type: 'number', default: 1, min: 0, max: 4, description: 'Heartbeat pulse and glow strength multiplier; 0 removes visible pulsing and glow, higher values make it stronger.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, beat = 1 } = params as { phase?: number; beat?: number };
    const { PAL } = api;
    const pulse = 1 + Math.sin(t * 3.4 + phase) * 0.045 * beat;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -6, 62, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(0, -104);
    ctx.scale(pulse, pulse);

    api.glow(ctx, 0, 0, 120, PAL.rose, 0.22 * beat);
    api.paint(ctx, api.shapes.heart(0, 0, 74), { wash: PAL.rose, sw: 3.6 });
    // 内部高光与血管感的水彩层次
    api.paint(ctx, api.shapes.heart(-12, -14, 42, -0.12), { wash: PAL.paper, sw: 0, washOp: 0.22 });
    api.paint(ctx, api.shapes.ring(-26, -30, 12, 8, 12, -0.6), { wash: '#ffffff', sw: 0, washOp: 0.45 });
    // 心跳折线
    api.inkLine(ctx, [
      [-46, 4], [-28, 4], [-20, -10], [-10, 22], [0, -4], [10, 6], [22, 4], [46, 4],
    ], 2.2, 'rgba(246,239,223,0.75)');
    ctx.restore();

    // 环绕的小心心
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + t * 0.6 + phase;
      const rx = 74 + Math.sin(t * 1.3 + i) * 6;
      const x = Math.cos(a) * rx;
      const y = -104 + Math.sin(a) * 58;
      const s = 8 + 3 * (0.5 + 0.5 * Math.sin(t * 2 + i * 1.7));
      api.paint(ctx, api.shapes.heart(x, y, s, Math.sin(t + i) * 0.3), { wash: i % 2 ? PAL.ochre : PAL.clay, sw: 1.8, washOp: 0.9 });
    }
  },
};
