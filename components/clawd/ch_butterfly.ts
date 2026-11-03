import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';
import type { Pt } from '../../src/styles/clawd/paint.ts';

export const butterfly: ComponentDef<ClawdApi> = {
  name: 'ch_butterfly',
  style: 'clawd',
  kind: 'actor',
  description: 'Watercolour butterfly with flapping rose / ochre wings and ink antennae; can perch (slow wing breathing) and glow like a little lamp at night. Body centre is 55 px above the anchor; fly it with x/y Tracks',
  tags: ['insect', 'nature', 'flying', 'small'],
  size: [130, 110],
  params: {
    flap: { type: 'number', default: 2.4, min: 0.5, max: 6, description: 'wing beats per second while flying' },
    perched: { type: 'boolean', default: false, description: 'resting: wings breathe slowly' },
    glow: { type: 'number', default: 0, min: 0, max: 1, description: 'night glow' },
    wings: { type: 'enum', default: 'rose', options: ['rose', 'sky', 'ochre', 'violet'], description: 'upper wing colour' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    const s = 22;
    const cy = -55;
    const k = p.perched ? 0.35 + 0.25 * Math.abs(Math.sin(t * 1.4)) : 0.18 + 0.82 * Math.abs(Math.sin(t * Number(p.flap) * Math.PI));
    const ga = Number(p.glow);
    if (ga > 0) { api.glow(ctx, 0, cy, s * 9, '#FFE29A', ga); api.glow(ctx, 0, cy, s * 3, '#FFF3C8', ga); }
    const upCol = p.wings === 'sky' ? PAL.sky : p.wings === 'ochre' ? PAL.orange : p.wings === 'violet' ? PAL.violet : PAL.rose;
    ctx.save();
    ctx.translate(0, cy);
    ctx.rotate(Math.sin(t * 3) * 0.12);
    const sw = Math.max(1.2, s * 0.16);
    for (const side of [-1, 1]) {
      api.subSeed(side < 0 ? 'wingL' : 'wingR');
      ctx.save();
      ctx.scale(side * k, 1);
      const up: Pt[] = [[0, -0.1 * s], [0.9 * s, -1.7 * s], [2.1 * s, -1.6 * s], [2.0 * s, -0.4 * s], [0.8 * s, 0.2 * s]];
      const lo: Pt[] = [[0, 0.1 * s], [1.3 * s, 0.4 * s], [1.4 * s, 1.3 * s], [0.6 * s, 1.5 * s]];
      api.paint(ctx, api.jitPts(lo, s * 0.05), { wash: PAL.ochre, sw, tex: 0.5 });
      api.paint(ctx, api.jitPts(up, s * 0.05), { wash: upCol, sw, tex: 0.5 });
      api.paint(ctx, api.ellPts(1.4 * s, -1.0 * s, 0.32 * s, 0.32 * s, 8), { wash: PAL.cream, ink: null, tex: 0 });
      ctx.restore();
    }
    api.subSeed('body');
    api.inkLine(ctx, [[0, -0.7 * s], [0, 1.1 * s]], s * 0.38);
    api.inkLine(ctx, [[0, -0.7 * s], [-0.5 * s, -1.6 * s], [-0.8 * s, -1.7 * s]], sw * 0.6);
    api.inkLine(ctx, [[0, -0.7 * s], [0.5 * s, -1.6 * s], [0.8 * s, -1.7 * s]], sw * 0.6);
    ctx.restore();
  },
};
