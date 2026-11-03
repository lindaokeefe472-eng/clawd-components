import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const lotusLeaf: ComponentDef<ClawdApi> = {
  name: 'pr_lotus_leaf',
  style: 'clawd',
  kind: 'prop',
  description: 'Flat green lily pad floating on water, with the classic notch and gentle bob; a critter can sit on it: give the leaf a "depth" smaller than the critter y and put the critter feet ≈ 45 px × scale above the leaf anchor',
  tags: ['pond', 'water', 'plant', 'platform'],
  size: [300, 80],
  params: {
    flower: { type: 'boolean', default: false, description: 'a small pink lotus flower on the pad' },
    bob: { type: 'number', default: 1, min: 0, max: 3, description: 'bobbing amount' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    const rx = 135, ry = 30;
    const y = -ry - 4 + Math.sin(t * 1.3) * 3 * Number(p.bob);
    api.subSeed('ring');
    api.inkLine(ctx, api.ellPts(0, y + 6, rx + 18, ry + 8, 26), 2, PAL.cream, true, 0.35);
    api.subSeed('pad');
    const pts = api.ellPts(0, y, rx, ry, 22, ry * 0.05);
    // notch on the far side of the pad (points ~250°–290°), pointing at the centre
    pts.splice(15, 3, [rx * 0.04, y - ry * 0.1]);
    api.paint(ctx, pts, { wash: '#4F8A57', dk: '#2F5A3A', sw: 2.6, tex: 0.8 });
    for (let i = 0; i < 5; i++) {
      const a = 0.25 + i * 0.62;
      api.inkLine(ctx, [[0, y], [Math.cos(a) * rx * 0.8, y + Math.sin(a) * ry * 0.8]], 1.4, '#2F5A3A', false, 0.45);
    }
    if (p.flower) {
      api.subSeed('flower');
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i - 2) * 0.45;
        api.paint(ctx, api.ellPts(-60 + Math.cos(a) * 14, y - 18 + Math.sin(a) * 14, 9, 18, 10, 1), { wash: PAL.rose, sw: 1.6, tex: 0.3 });
      }
      api.blob(ctx, -60, y - 14, 8, 6, PAL.ochre, 1, 2);
    }
  },
};
