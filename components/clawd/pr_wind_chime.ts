import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_wind_chime: ComponentDef<ClawdApi> = {
name: 'pr_wind_chime',
  style: 'clawd',
  kind: 'prop',
  description: 'A hanging watercolour wind chime: a small wooden hook and cord support a two-tiered wooden disc with four staggered metal tubes in blue-green washes, and a clay-coloured wooden wind-catcher plate swings beneath on a central cord, with faint breeze lines beside it. Anchor is bottom centre, 160×300 px, suited to porches, garden eaves or window frames where a light swinging motion is wanted.',
  tags: ['catalog', 'outdoor', 'wind', 'chime', 'hanging', 'decor', 'garden'],
  size: [160, 300],
  params: {
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Strength of the gust animation; 0 keeps the tubes and plate still, higher values swing them further and faster.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the swing cycle, used to desynchronise several chimes in the same scene.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { wind = 1, phase = 0 } = params as { wind?: number; phase?: number };
    const { PAL } = api;
    const gust = Math.sin(t * 1.05 + phase) * 0.5 + Math.sin(t * 2.3 + phase * 1.7) * 0.15;

    // 吊顶支架
    api.inkLine(ctx, api.shapes.arc(0, -290, 26, 10, Math.PI * 1.05, Math.PI * 1.95, 12), 3, PAL.ink);
    api.paint(ctx, api.shapes.round(-34, -292, 34, -284, 4), { wash: PAL.clay, sw: 2.6 });

    // 中央吊线
    api.inkLine(ctx, api.shapes.line(0, -286, 0, -238, 1, 6, 2), 2.2, PAL.ink);

    // 顶盘
    api.paint(ctx, api.shapes.ring(0, -236, 34, 9, 26), { wash: PAL.ochre, sw: 3 });
    api.paint(ctx, api.shapes.ring(0, -230, 30, 8, 26), { wash: PAL.clay, sw: 2.4, washOp: 0.8 });

    // 金属管
    const xs = [-24, -8, 8, 24];
    const lens = [92, 116, 104, 80];
    for (let i = 0; i < 4; i++) {
      const swing = gust * (0.9 + i * 0.12) * wind;
      const ang = swing * 0.16;
      ctx.save();
      ctx.translate(xs[i], -228);
      ctx.rotate(ang);
      api.inkLine(ctx, api.shapes.line(0, 0, 0, 12, 0, 4, i + 1), 1.6, 'rgba(58,47,42,0.6)');
      const top = 12;
      const bot = 12 + lens[i];
      api.paint(ctx, api.shapes.round(-7, top, 7, bot, 4), { wash: i % 2 ? PAL.sky : PAL.teal, sw: 2.6 });
      api.inkLine(ctx, api.shapes.line(-2, top + 8, -2, bot - 8, 0, 4, i + 5), 1.1, 'rgba(246,239,223,0.7)');
      api.paint(ctx, api.shapes.ring(0, bot + 4, 4, 4, 10), { wash: PAL.ochre, sw: 1.8 });
      ctx.restore();
    }

    // 风铃木片
    const s = 0.5 + 0.5 * Math.sin(t * 2.8 + phase);
    const ang = gust * 0.3;
    api.inkLine(ctx, api.shapes.line(0, -228, 0, -104, 0, 6, 3), 1.8, 'rgba(58,47,42,0.7)');
    ctx.save();
    ctx.translate(0, -104);
    ctx.rotate(ang);
    api.paint(ctx, api.shapes.round(-26, 0, 26, 54, 10), { wash: PAL.clay, sw: 3 });
    api.inkLine(ctx, api.shapes.arc(0, 20, 12, 12, 0, Math.PI * 2, 16), 1.8, 'rgba(58,47,42,0.6)');
    api.inkLine(ctx, api.shapes.line(-16, 40, 16, 40, 1, 6, 4), 1.6, 'rgba(58,47,42,0.5)');
    ctx.restore();

    // 周围微光/微风线
    for (let i = 0; i < 2; i++) {
      const a = 0.12 + 0.06 * s;
      api.inkLine(ctx, [
        [-58 - i * 14, -190 + i * 46 + Math.sin(t * 1.8 + i) * 6],
        [-34 - i * 10, -186 + i * 46 + Math.sin(t * 1.8 + i) * 4],
      ], 1.6, `rgba(79,156,152,${a})`);
    }
  },
};
