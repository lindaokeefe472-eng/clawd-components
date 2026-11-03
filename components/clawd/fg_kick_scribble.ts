import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';
import type { Pt } from '../../src/styles/clawd/paint.ts';

export const kickScribble: ComponentDef<ClawdApi> = {
  name: 'fg_kick_scribble',
  style: 'clawd',
  kind: 'foreground',
  description: 'Frantic effort marks: magenta-violet zigzag scribbles and sweat drops bursting outward around a point, flickering on the boil — "kicking hard for nothing". power 0..1 sets how many and how big (0 = nothing). Spreads ~ 280 px wide around a centre 90 px above the anchor; put the anchor under the kicking legs',
  tags: ['effect', 'effort', 'motion', 'fail'],
  size: [300, 200],
  params: {
    power: { type: 'number', default: 0.8, min: 0, max: 1, description: 'how hard the kicking is' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    const pw = Number(p.power);
    if (pw <= 0.02) return;
    const cy = -90;
    const n = Math.round(3 + pw * 5);
    for (let i = 0; i < n; i++) {
      api.subSeed(`z${i}`);
      const a = -Math.PI * 0.95 + (i / Math.max(1, n - 1)) * Math.PI * 1.9 + Math.sin(t * 7 + i) * 0.08;
      const r0 = 60 + 10 * Math.sin(t * 9 + i * 2);
      const len = (55 + 70 * pw) * (0.8 + 0.4 * api.hash(i));
      const pts: Pt[] = [];
      for (let k = 0; k <= 4; k++) {
        const r = r0 + (len * k) / 4;
        const side = (k % 2 ? 1 : -1) * 8;
        pts.push([Math.cos(a) * r - Math.sin(a) * side, cy + Math.sin(a) * r * 0.65 + Math.cos(a) * side]);
      }
      api.inkLine(ctx, pts, 6 + 4 * pw, api.mixCol('#C2185B', PAL.violet, api.hash(i + 9)), false, 0.95);
    }
    for (let i = 0; i < Math.round(1 + pw * 3); i++) {
      api.subSeed(`drop${i}`);
      const x = (api.hash(i + 20) - 0.5) * 220;
      const y = cy - 40 - api.hash(i + 21) * 50 + Math.sin(t * 5 + i) * 4;
      api.paint(ctx, [[x, y - 14], [x + 8, y + 2], [x, y + 9], [x - 8, y + 2]], { wash: PAL.sky, sw: 2, tex: 0 });
    }
  },
};
