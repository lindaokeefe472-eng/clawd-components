import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_rain_cloud: ComponentDef<ClawdApi> = {
name: 'pr_rain_cloud',
  style: 'clawd',
  kind: 'prop',
  description: 'A soft watercolour cumulus cloud with a wavy flat base, drifting gently while ink rain streaks fall from it, occasional lightning flashes, and small splash arcs on the ground beneath. Anchored at the bottom centre and about 308×278 px, it suits outdoor sky and weather scenes above ground level.',
  tags: ['catalog', 'rain', 'cloud', 'weather', 'sky', 'outdoor'],
  size: [308, 278],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the drift, puff breathing, rain and splash cycles, useful for desynchronising several clouds.' },
    rain: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of rain: at 0 the falling ink streaks disappear, at 1 they are at full length and opacity.' },
    mood: { type: 'enum', default: 'sky', options: ['sky', 'night', 'paper', 'teal'], description: 'Palette key used for the cloud\'s wash colour, changing the overall tone of the body.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, rain = 1, mood = 'sky' } = params as { phase?: number; rain?: number; mood?: string };
    const { PAL } = api;
    const drift = Math.sin(t * 0.8 + phase) * 5;
    const puff = 1 + Math.sin(t * 1.4 + phase) * 0.015;

    ctx.save();
    ctx.translate(drift, 0);

    // 云：多个圆取上包络，形成一条平滑外轮廓
    const puffs: Array<[number, number, number]> = [
      [-92, -160, 46],
      [-46, -196, 58],
      [16, -206, 62],
      [78, -178, 50],
      [116, -152, 34],
    ];
    const bottomY = -152;
    const top = (x: number): number => {
      let y = bottomY;
      for (let i = 0; i < puffs.length; i++) {
        const [px, py, pr] = puffs[i];
        const r = pr * puff;
        const d = x - px;
        if (Math.abs(d) < r) y = Math.min(y, py - Math.sqrt(r * r - d * d));
      }
      return y;
    };
    const sil: P2[] = [];
    sil.push([-136, bottomY]);
    for (let i = 0; i <= 44; i++) {
      const x = api.shapes.lerp(-136, 148, i / 44);
      sil.push([x, top(x)]);
    }
    sil.push([148, bottomY]);
    // 底边（带轻微波浪）
    for (let i = 0; i <= 20; i++) {
      const u = i / 20;
      sil.push([api.shapes.lerp(148, -112, u), bottomY + Math.sin(u * 6 + t * 1.2 + phase) * 3]);
    }
    api.paint(ctx, sil, { wash: (PAL as Record<string, string>)[mood] || PAL.sky, sw: 3.4, washOp: 0.94 });

    // 云的暗部
    api.paint(ctx, api.shapes.ring(14, -168, 96, 18, 26, 0, 0.06, 6), { wash: PAL.night, sw: 0, washOp: 0.16 });
    api.paint(ctx, api.shapes.ring(-58, -208, 34, 14, 18, 0, 0.05, 8), { wash: PAL.paper, sw: 0, washOp: 0.34 });

    // 闪电
    const flash = Math.max(0, Math.sin(t * 2.2 + phase) - 0.74) / 0.26;
    if (flash > 0.02) {
      api.glow(ctx, 8, -120, 86, '#ffe9a3', 0.3 * flash);
      api.paint(ctx, [[8, -152], [-6, -116], [8, -116], [-2, -84], [26, -124], [10, -124], [22, -152]], {
        wash: '#ffe07a',
        sw: 2.4,
        washOp: 0.45 + 0.55 * flash,
      });
    }

    // 雨丝
    if (rain > 0) {
      for (let i = 0; i < 9; i++) {
        const x = -108 + i * 27;
        const w = Math.sin(t * 2.1 + i * 0.9 + phase);
        const k = api.shapes.clamp01(w * 0.5 + 0.5);
        const y0 = -138 + (i % 3) * 18;
        const len = 22 + 24 * k;
        api.inkLine(ctx, api.shapes.line(x, y0, x - 4, y0 + len, 1, 5, i + 2), 2, `rgba(79,156,152,${0.16 + 0.24 * k})`);
      }
    }
    ctx.restore();

    // 落地水花
    for (let i = 0; i < 4; i++) {
      const x = -84 + i * 56;
      const s = 0.5 + 0.5 * Math.sin(t * 2.6 + i * 1.7 + phase);
      api.inkLine(ctx, api.shapes.arc(x, -9, 11 + 8 * s, 5 + 3 * s, Math.PI * 1.05, Math.PI * 1.95, 10), 1.6, `rgba(79,156,152,${0.22 + 0.2 * s})`);
      api.paint(ctx, api.shapes.ring(x, -8, 15, 3.2, 12), { wash: PAL.teal, sw: 0, washOp: 0.18 + 0.12 * s });
    }
  },
};
