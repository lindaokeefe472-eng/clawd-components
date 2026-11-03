import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

const SACS: ReadonlyArray<readonly [number, number, number]> = [
  [300, 420, 170], [620, 330, 190], [960, 380, 180], [1290, 320, 195], [1610, 410, 170],
  [460, 180, 120], [800, 140, 125], [1130, 150, 120], [1460, 190, 115],
];

export const bgAlveoli: ComponentDef<ClawdApi> = {
  name: 'bg_alveoli',
  style: 'clawd',
  kind: 'background',
  description: 'Inside the lung: a bunch of translucent air sacs (alveoli) like grapes across the top half, fed by a small airway, sitting on a capillary that runs left → right along the bottom (lane centre y ≈ 760, put ch_rbc_cell anchors around y 850). The capillary turns from plum (left, low oxygen) to red (right, oxygenated). Air sacs hold drifting O2 specks. Use ch_gas_bubble actors to show O2 going down into the blood and CO2 rising out',
  tags: ['bio', 'lung', 'organ', 'air', 'exchange'],
  size: [1920, 1080],
  params: {
    breathe: { type: 'number', default: 0.25, min: 0, max: 1, description: 'breaths per second (sacs swell and shrink)' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    api.subSeed('bg');
    api.washRect(ctx, -100, -100, 2120, 1300, [[0, '#F4E6E4'], [0.6, '#F1D6D3'], [1, '#E8BFBA']]);
    const br = 1 + 0.05 * Math.sin(t * Number(p.breathe) * api.TAU);
    // airway
    api.subSeed('airway');
    api.inkLine(ctx, [[960, -60], [960, 60], [940, 120]], 70, '#E7C2B9', false, 1);
    api.inkLine(ctx, [[960, -60], [960, 60], [940, 120]], 3, PAL.ink, false, 0.4);
    // capillary along the bottom: plum → red
    api.subSeed('cap');
    api.washRect(ctx, -100, 640, 2120, 240, [[0, '#9A5F98'], [1, '#DE4A3E']], false);
    api.wcolor(ctx, [[-100, 880], [2020, 880], [2020, 1200], [-100, 1200]], '#D79B90', 0.95, 3, 8);
    for (const y of [640, 880]) {
      const pts: [number, number][] = [];
      for (let i = 0; i <= 14; i++) pts.push([-80 + i * 148, y + Math.sin(i * 1.1 + t * 1.5) * 6]);
      api.subSeed('capwall' + y);
      api.inkLine(ctx, pts, 5, '#8F3A33', false, 0.7);
    }
    // air sacs
    SACS.forEach(([x, y, r], i) => {
      const rr = r * br;
      api.subSeed('sac' + i);
      api.wcolor(ctx, api.ellPts(x, y, rr, rr * 0.92, 26), '#F8EDEF', 0.85, 3, 6);
      api.inkLine(ctx, api.ellPts(x, y, rr, rr * 0.92, 26, 2), 3, '#C98A8E', true, 0.8);
      api.blob(ctx, x - rr * 0.4, y - rr * 0.45, rr * 0.25, rr * 0.14, '#FFFFFF', 0.6, 2);
      for (let k = 0; k < 4; k++) {
        const a = t * 0.6 + k * 1.7 + i;
        api.blob(ctx, x + Math.cos(a) * rr * 0.5, y + Math.sin(a * 1.3) * rr * 0.45, 7, 7, PAL.sky, 0.55, 1);
      }
    });
  },
};
