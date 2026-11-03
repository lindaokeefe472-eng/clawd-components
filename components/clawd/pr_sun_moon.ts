import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const sunMoon: ComponentDef<ClawdApi> = {
  name: 'pr_sun_moon',
  style: 'clawd',
  kind: 'prop',
  description: 'Big glowing sky body: warm sun, full moon or crescent moon, with a soft halo; centre is 210 px above the anchor. Animate y to make it rise or set',
  tags: ['sky', 'light', 'time-of-day'],
  size: [420, 420],
  params: {
    body: { type: 'enum', default: 'sun', options: ['sun', 'moon', 'crescent'], description: 'which body' },
    glow: { type: 'number', default: 0.7, min: 0, max: 1, description: 'halo strength' },
    rays: { type: 'boolean', default: false, description: 'hand-drawn sun rays (sun only)' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    const cy = -210;
    const g = Number(p.glow);
    if (p.body === 'sun') {
      api.glow(ctx, 0, cy, 200, '#FFE0A0', g);
      api.subSeed('disc');
      api.blob(ctx, 0, cy, 80, 80, '#F7D88A', 0.95, 3);
      if (p.rays) {
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * api.TAU + t * 0.15;
          api.subSeed('ray' + i);
          api.inkLine(ctx, [[Math.cos(a) * 110, cy + Math.sin(a) * 110], [Math.cos(a) * 150, cy + Math.sin(a) * 150]], 4, PAL.orange, false, 0.7);
        }
      }
    } else {
      api.glow(ctx, 0, cy, 180, '#FFF0C8', g * 0.8);
      api.subSeed('disc');
      if (p.body === 'crescent') {
        // outer left arc + inner arc of a circle shifted right = a real crescent shape (no dark patch)
        const r = 78;
        const pts: [number, number][] = [];
        for (let i = 0; i <= 14; i++) { const a = Math.PI * 0.5 + (i / 14) * Math.PI; pts.push([Math.cos(a) * r, cy + Math.sin(a) * r]); }
        for (let i = 14; i >= 0; i--) { const a = Math.PI * 0.5 + (i / 14) * Math.PI; pts.push([34 + Math.cos(a) * r * 0.86, cy - 6 + Math.sin(a) * r * 0.92]); }
        api.paint(ctx, pts, { wash: '#F7EBC8', ink: null, tex: 0.4 });
      } else {
        api.blob(ctx, 0, cy, 75, 75, '#F7EBC8', 1, 4);
      }
    }
  },
};
