import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const cloudProp: ComponentDef<ClawdApi> = {
  name: 'pr_cloud',
  style: 'clawd',
  kind: 'prop',
  description: 'Soft watercolour puff cloud that slowly breathes; centre is 85 px above the anchor. Move it with an x Track; can rain',
  tags: ['sky', 'weather', 'decor'],
  size: [340, 170],
  params: {
    tint: { type: 'enum', default: 'cream', options: ['cream', 'rose', 'grey', 'night'], description: 'colour for day, dusk, overcast or night skies' },
    rain: { type: 'boolean', default: false, description: 'ink rain streaks below the cloud' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    const col = p.tint === 'rose' ? '#F3C1B0' : p.tint === 'grey' ? '#B8B4BE' : p.tint === 'night' ? '#4A5285' : PAL.cream;
    const s = 58 + Math.sin(t * 0.8) * 2;
    api.cloud(ctx, 0, -95, s, api.key, col, 0.88);
    if (p.rain) {
      for (let i = 0; i < 9; i++) {
        const x = -110 + i * 27 + api.hash(i) * 10;
        const ph = (t * 1.6 + api.hash(i * 3)) % 1;
        const y0 = -50 + ph * 40;
        api.subSeed('rain' + i);
        api.inkLine(ctx, [[x, y0], [x - 4, y0 + 22]], 2.2, PAL.indigo, false, 0.55 * (1 - ph));
      }
    }
  },
};
