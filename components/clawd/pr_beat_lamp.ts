import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const beatLamp: ComponentDef<ClawdApi> = {
  name: 'pr_beat_lamp',
  style: 'clawd',
  kind: 'prop',
  description: 'Little paper lantern on a wooden post that flashes warm gold every time a swing (pr_mv_swing) passes its lowest point — the beat of the swing made visible (it follows film time, so it is always in step with pr_mv_swing). miss tints the flash violet ("you missed the beat"). Lantern ~ 230 px above the anchor',
  tags: ['prop', 'rhythm', 'beat', 'light', 'timing'],
  size: [140, 300],
  params: {
    on: { type: 'boolean', default: true, description: 'flashing (off = dark lantern)' },
    miss: { type: 'boolean', default: false, description: 'violet flash: the beat was missed' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    // mv_swing: lowest point every 2 beats at 69 BPM
    const phase = t / (2 * (60 / 69));
    const flash = p.on ? Math.exp(-(phase - Math.floor(phase)) * 5) : 0;
    const col = p.miss ? PAL.violet : '#FFC766';
    api.subSeed('post');
    api.paint(ctx, api.rectPts(-9, -200, 18, 200, 1.5), { wash: '#8A5A3C', sw: 2.5, tex: 0.5 });
    api.inkLine(ctx, [[0, -200], [34, -214], [34, -196]], 3);
    if (flash > 0.02) api.glow(ctx, 34, -150, 70 + 70 * flash, col, flash);
    api.subSeed('lantern');
    api.paint(ctx, api.ellPts(34, -150, 34, 42, 18, 1.5), { wash: api.mixCol('#F6E3C0', col, 0.25 + 0.6 * flash), sw: 2.8, tex: 0.4 });
    api.inkLine(ctx, [[14, -182], [54, -182]], 2.5);
    api.inkLine(ctx, [[14, -118], [54, -118]], 2.5);
    api.inkLine(ctx, [[34, -192], [34, -184]], 2.5);
  },
};
