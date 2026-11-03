import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';
import type { Pt } from '../../src/styles/clawd/paint.ts';

export const swingGauge: ComponentDef<ClawdApi> = {
  name: 'pr_swing_gauge',
  style: 'clawd',
  kind: 'prop',
  description: 'Hand-painted half-dial "how high does the swing go" meter on a little wooden stand: ticks every 10° from 0 (left) to 90 (right), a cool-to-warm watercolour band, an ink needle that eases to deg (Track it to show the swing growing or not), and a faint ghost needle at peak. Dial 300 px wide, centre ~ 70 px above the anchor',
  tags: ['prop', 'meter', 'gauge', 'physics', 'measure'],
  size: [320, 240],
  params: {
    deg: { type: 'number', default: 20, min: 0, max: 90, description: 'swing angle the needle shows' },
    peak: { type: 'number', default: 0, min: 0, max: 90, description: 'ghost needle at the best so far (0 = hidden)' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    const cy = -70;
    const R = 145;
    const at = (deg: number, r: number): Pt => {
      const a = Math.PI + (deg / 90) * Math.PI;
      return [Math.cos(a) * r, cy + Math.sin(a) * r];
    };
    api.subSeed('stand');
    api.paint(ctx, api.rectPts(-22, cy, 44, -cy, 2), { wash: '#A9784F', sw: 2.5, tex: 0.5 });
    api.paint(ctx, api.roundRectPts(-70, -14, 140, 14, 6, 1.5), { wash: '#8A5A3C', sw: 2.5 });
    api.subSeed('face');
    const face: Pt[] = [];
    for (let i = 0; i <= 24; i++) face.push(at(i * 3.75, R));
    face.push([R, cy + 6], [-R, cy + 6]);
    api.paint(ctx, face, { wash: PAL.cream, sw: 3.2, tex: 0.3 });
    // band: cool (low) to warm (high)
    for (let i = 0; i < 9; i++) {
      api.subSeed(`band${i}`);
      const seg: Pt[] = [at(i * 10, R - 14), at(i * 10 + 10, R - 14), at(i * 10 + 10, R - 40), at(i * 10, R - 40)];
      api.paint(ctx, seg, { wash: api.mixCol(PAL.sky, PAL.orange, i / 8), washOp: 0.7, ink: null, tex: 0.4 });
    }
    for (let d = 0; d <= 90; d += 10) {
      api.subSeed(`tick${d}`);
      api.inkLine(ctx, [at(d, R - 44), at(d, R - (d % 30 === 0 ? 62 : 54))], d % 30 === 0 ? 3 : 2);
    }
    const needle = (deg: number, col: string, w: number): void => {
      const tip = at(api.clamp(deg, 0, 90), R - 30);
      api.inkLine(ctx, [[0, cy], tip], w, col);
    };
    const peak = Number(p.peak);
    if (peak > 0) {
      api.subSeed('ghost');
      needle(peak, 'rgba(43,34,51,0.28)', 4);
    }
    api.subSeed('needle');
    needle(Number(p.deg) + Math.sin(t * 2.4) * 0.8, PAL.ink, 5);
    api.paint(ctx, api.ellPts(0, cy, 12, 12, 12, 1), { wash: PAL.rose, sw: 2.5 });
  },
};
