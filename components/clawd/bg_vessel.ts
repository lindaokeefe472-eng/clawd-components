import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const bgVessel: ComponentDef<ClawdApi> = {
  name: 'bg_vessel',
  style: 'clawd',
  kind: 'background',
  description: 'Inside a blood vessel, flowing left → right: soft wet walls top and bottom, plasma specks drifting with the flow. artery = warm red and wide; vein = plum-blue with a pair of valve flaps at x≈1250; capillary = walls pinch to a narrow lane around y 470–650. Travel lane centre y ≈ 560 (capillary 560); put ch_rbc_cell anchors around y 650 (capillary: 660)',
  tags: ['bio', 'blood', 'vessel', 'tunnel', 'interior'],
  size: [1920, 1080],
  params: {
    kind: { type: 'enum', default: 'artery', options: ['artery', 'vein', 'capillary'], description: 'which vessel' },
    flow: { type: 'number', default: 1, min: 0, max: 4, description: 'flow speed of the plasma specks (artery near the heart ≈ 3)' },
    valve: { type: 'number', default: 1, min: 0, max: 1, description: 'vein only: valve opening (1 open for forward flow, 0 shut against backflow)' },
  },
  draw(api, p, t) {
    const { ctx } = api;
    const kind = String(p.kind);
    const pal = kind === 'vein'
      ? { lumen: ['#E3C7D8', '#CDA9C4'] as const, wall: '#8A5E92', wallDk: '#5D3F6E', cellCol: '#B48BB8' }
      : { lumen: ['#F7CDBE', '#EDAA98'] as const, wall: '#C4544B', wallDk: '#8E3330', cellCol: '#E08B7E' };
    const half = kind === 'capillary' ? 95 : kind === 'vein' ? 300 : 330;
    const mid = 560;
    api.subSeed('lumen');
    api.washRect(ctx, -100, -100, 2120, 1300, [[0, pal.lumen[1]], [0.5, pal.lumen[0]], [1, pal.lumen[1]]]);
    // plasma specks drift with the flow (wrap around deterministically)
    const sp = Number(p.flow) * 140;
    for (let i = 0; i < 46; i++) {
      const y = mid + (api.hash(i * 2.7) * 2 - 1) * (half - 30);
      const x = ((api.hash(i * 9.1) * 2300 + t * sp * (0.6 + api.hash(i) * 0.8)) % 2300) - 190;
      api.subSeed('speck' + i);
      api.blob(ctx, x, y, 6 + api.hash(i * 5) * 8, 4 + api.hash(i * 3) * 5, api.mixCol(pal.lumen[1], '#FFFFFF', 0.45), 0.6, 1);
    }
    // walls: wavy membranes with lining cells
    const wall = (sign: number, part: string): void => {
      const pts: [number, number][] = [];
      for (let i = 0; i <= 14; i++) {
        const x = -80 + i * 148;
        const pinch = kind === 'capillary' ? 0 : Math.sin(i * 0.9 + 1.3) * 18;
        pts.push([x, mid + sign * (half + pinch + Math.sin(t * 2.2 + i) * 4)]);
      }
      const edge = pts.map(([x, y]) => [x, y] as [number, number]);
      pts.push([2000, mid + sign * 900], [-80, mid + sign * 900]);
      api.subSeed(part);
      api.wcolor(ctx, pts, pal.wall, 0.92, 4, 10);
      api.inkLine(ctx, edge, 4, pal.wallDk, false, 0.7);
      for (let k = 0; k < 9; k++) {
        const x = 40 + k * 230 + api.hash(k + sign) * 60;
        const y = mid + sign * (half + 40 + api.hash(k * 3 + sign) * 60);
        api.subSeed(part + 'c' + k);
        api.blob(ctx, x, y, 70, 22, pal.cellCol, 0.55, 2);
        api.blob(ctx, x + 10, y, 12, 8, pal.wallDk, 0.45, 1);
      }
    };
    wall(-1, 'top');
    wall(1, 'bottom');
    if (kind === 'vein') {
      const open = api.clamp(Number(p.valve));
      const vx = 1250;
      for (const s of [-1, 1]) {
        const base: [number, number] = [vx, mid + s * (half - 6)];
        // open flaps lean downstream (right) against the wall; shut flaps meet in the middle
        const ang = (Math.PI / 2) * (0.15 + 0.75 * open);
        const len = half - 10;
        const tip: [number, number] = [vx + Math.sin(ang) * len, mid + s * (half - 6) - s * Math.cos(ang) * len];
        api.subSeed('valve' + s);
        api.paint(ctx, [[base[0] - 30, base[1]], [base[0] + 40, base[1]], [tip[0] + 14, tip[1]], [tip[0] - 6, tip[1]]], { wash: '#C9A4CF', sw: 3.5, tex: 0.4 });
      }
    }
  },
};
