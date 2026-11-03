import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const bgMeadow: ComponentDef<ClawdApi> = {
  name: 'bg_meadow',
  style: 'clawd',
  kind: 'background',
  description: 'Sunny spring meadow: pale blue sky, three rolling green hills, grass tufts and scattered flowers; ground line ≈ y 800, good standing band y 820–900',
  tags: ['nature', 'outdoor', 'day', 'grass', 'spring'],
  size: [1920, 1080],
  params: {
    sun: { type: 'boolean', default: true, description: 'draw the sun (top right); turn off to place a pr_sun_moon prop yourself' },
    clouds: { type: 'boolean', default: true, description: 'three slowly drifting clouds' },
    flowers: { type: 'number', default: 0.6, min: 0, max: 1, description: 'flower density' },
  },
  draw(api, p, t) {
    const { ctx } = api;
    api.subSeed('sky');
    api.washRect(ctx, -100, -100, 2120, 920, [[0, '#A9CFE6'], [0.6, '#D4E6E4'], [1, '#EEEBD6']]);
    if (p.sun) {
      api.glow(ctx, 1560, 210, 320, '#FFE0A0', 0.7);
      api.subSeed('sun');
      api.blob(ctx, 1560, 210, 70, 70, '#F7D88A', 0.9, 3);
    }
    if (p.clouds) {
      api.cloud(ctx, 300 + t * 14, 200, 60, 'm1');
      api.cloud(ctx, 1100 + t * 9, 140, 45, 'm2');
      api.cloud(ctx, 1750 + t * 11, 330, 38, 'm3');
    }
    api.subSeed('far'); api.wcolor(ctx, api.hillPts(600, 30, 0.8, 1), '#AFC8B0', 0.8, 3, 10);
    api.subSeed('mid'); api.wcolor(ctx, api.hillPts(690, 24, 0.6, 3), '#94BB78', 0.9, 4, 10);
    api.subSeed('near'); api.wcolor(ctx, api.hillPts(790, 10, 0.4, 0.5), '#A7C982', 0.95, 4, 8);
    api.tufts(ctx, 26, 700, 780, '#6E9A55', t, 1, 0.7);
    api.flowers(ctx, Math.round(Number(p.flowers) * 24), 820, 1040, t, 2);
    api.tufts(ctx, 34, 800, 1060, '#5E8B48', t, 3, 1.1);
  },
};
