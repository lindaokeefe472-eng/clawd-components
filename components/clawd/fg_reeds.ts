import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const reeds: ComponentDef<ClawdApi> = {
  name: 'fg_reeds',
  style: 'clawd',
  kind: 'foreground',
  description: 'Foreground clump of cattails / reeds swaying in front of everything; frame a shot edge or hide a critter peeking out',
  tags: ['pond', 'plant', 'foreground', 'frame'],
  size: [260, 360],
  params: {
    count: { type: 'number', default: 8, min: 3, max: 14, description: 'number of stems' },
    sway: { type: 'number', default: 1, min: 0, max: 3, description: 'wind strength' },
    dark: { type: 'boolean', default: false, description: 'dark silhouette (for night or strong foreground)' },
  },
  draw(api, p, t) {
    const { ctx } = api;
    const n = Math.round(Number(p.count));
    const stem = p.dark ? '#22304E' : '#5E7F45';
    const head = p.dark ? '#1A2340' : '#8A5A3A';
    for (let i = 0; i < n; i++) {
      api.subSeed('reed' + i);
      const rx = -110 + (i / Math.max(1, n - 1)) * 220 + (api.hash(i) - 0.5) * 20;
      const h = 220 + api.hash(i * 4) * 120;
      const sw = Math.sin(t * 1.3 + i) * 10 * Number(p.sway);
      api.inkLine(ctx, [[rx, 0], [rx + sw * 0.5, -h * 0.5], [rx + sw, -h]], 4.5, stem);
      if (i % 2 === 0) api.paint(ctx, [[rx + sw - 8, -h + 10], [rx + sw + 8, -h + 10], [rx + sw + 8, -h + 66], [rx + sw - 8, -h + 66]], { wash: head, sw: 2, tex: 0.5 });
      else {
        // a long blade curving out of the stem
        const bx = rx + sw * 0.4, by = -h * 0.45, side = i % 4 === 1 ? 1 : -1;
        api.inkLine(ctx, [[bx, by], [bx + side * 28 + sw * 0.6, by - 70], [bx + side * 46 + sw, by - 120]], 3.2, stem, false, 0.9);
      }
    }
  },
};
