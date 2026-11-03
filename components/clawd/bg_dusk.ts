import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const bgDusk: ComponentDef<ClawdApi> = {
  name: 'bg_dusk',
  style: 'clawd',
  kind: 'background',
  description: 'Sunset hillside: violet-to-peach sky, big low sun behind the hills (≈ 960,610), rose clouds, warm hills, grass and a few flowers; ground ≈ y 800, standing band y 840–900; warm, gathering / ending mood',
  tags: ['nature', 'outdoor', 'sunset', 'evening', 'warm'],
  size: [1920, 1080],
  params: {
    sun: { type: 'boolean', default: true, description: 'the big setting sun' },
    sunY: { type: 'number', default: 610, min: 450, max: 760, description: 'sun height (larger = lower, more set)' },
  },
  draw(api, p, t) {
    const { ctx } = api;
    api.subSeed('sky');
    api.washRect(ctx, -100, -100, 2120, 920, [[0, '#A796C6'], [0.45, '#EBA68E'], [0.8, '#F6CC8E'], [1, '#F7DCA6']]);
    const sy = Number(p.sunY);
    if (p.sun) {
      api.glow(ctx, 960, sy + 10, 520, '#FFC07A', 0.55);
      api.subSeed('sun');
      api.blob(ctx, 960, sy, 130, 130, '#F8C66E', 0.95, 4);
    }
    api.cloud(ctx, 380 + t * 6, 260, 55, 'd1', '#F3C1B0', 0.8);
    api.cloud(ctx, 1450 + t * 5, 200, 48, 'd2', '#F3C1B0', 0.8);
    api.subSeed('far'); api.wcolor(ctx, api.hillPts(640, 30, 0.7, 2), '#B98D98', 0.85, 3, 10);
    api.subSeed('mid'); api.wcolor(ctx, api.hillPts(720, 22, 0.5, 4), '#A88A72', 0.9, 4, 10);
    api.subSeed('near'); api.wcolor(ctx, api.hillPts(800, 14, 0.35, 1), '#9AAE6E', 0.95, 4, 8);
    api.tufts(ctx, 30, 820, 1060, '#6F8C4C', t, 21, 1.0);
    api.flowers(ctx, 8, 860, 1040, t, 22);
  },
};
