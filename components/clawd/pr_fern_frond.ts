import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_fern_frond: ComponentDef<ClawdApi> = {
name: 'pr_fern_frond',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour fern clump with several arching pinnate fronds, each built from a curved central stem, paired leaflets and a curled tip, rising from a small ring of earth. Anchored at bottom centre and about 340×300 px, it suits garden beds, forest floor and potted greenery in a scene.',
  tags: ['catalog', 'plant', 'fern', 'foliage', 'nature', 'ground', 'decor', 'watercolour'],
  size: [340, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the wind sway timing in radians so repeated copies do not move in unison.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Strength of the side-to-side swaying of the fronds; 0 keeps them still.' },
    fronds: { type: 'number', default: 3, min: 0, max: 6, description: 'Number of fronds drawn (clamped to 1–3 in the drawing code); fewer makes a sparser, smaller clump.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wind = 1, fronds = 3 } = params as { phase?: number; wind?: number; fronds?: number };

    api.paint(ctx, api.shapes.ring(0, -10, 96, 12, 22, 0, 0.06, 5), { wash: '#b9a67d', sw: 0, washOp: 0.4 });
    api.paint(ctx, api.shapes.ring(0, -14, 62, 9, 20, 0, 0.08, 8), { wash: '#8f8a78', sw: 0, washOp: 0.35 });

    // 一片羽状复叶：主脉 + 两侧小羽片，顶端卷曲
    const frond = (baseX: number, lean: number, len: number, seed: number) => {
      const spine: P2[] = [];
      for (let s = 0; s <= 12; s++) {
        const u = s / 12;
        // 弓形弯曲 + 风
        const bend = lean * u * u * 90 + Math.sin(u * 2.2 + seed) * 14;
        const wx = Math.sin(t * 1.35 + u * 2.4 + seed + phase) * 9 * u * wind;
        spine.push([baseX + bend + wx, -12 - u * len]);
      }
      api.inkLine(ctx, spine, 2.8, 'rgba(96,128,74,0.95)');
      // 羽片
      const pairs = 8;
      for (let i = 1; i <= pairs; i++) {
        const u = i / (pairs + 1);
        const idx = Math.round(u * 12);
        const p = spine[idx];
        const nx = spine[idx + 1] ? spine[idx + 1][0] - p[0] : 0;
        const ny = spine[idx + 1] ? spine[idx + 1][1] - p[1] : -10;
        const len2 = (1 - u * 0.7) * (len * 0.19);
        for (let side = -1; side <= 1; side += 2) {
          const ex = p[0] + side * len2 * 0.9 + nx * 0.9;
          const ey = p[1] + ny * 0.9 + side * len2 * 0.28;
          // 小羽片：叶形（用两段弧组成，显得薄）
          const leafPts: P2[] = [];
          for (let s = 0; s <= 6; s++) {
            const v = s / 6;
            leafPts.push([api.shapes.lerp(p[0], ex, v) + Math.sin(v * Math.PI) * side * 4, api.shapes.lerp(p[1], ey, v) - Math.sin(v * Math.PI) * len2 * 0.24]);
          }
          for (let s = 6; s >= 0; s--) {
            const v = s / 6;
            leafPts.push([api.shapes.lerp(p[0], ex, v) - Math.sin(v * Math.PI) * side * 2, api.shapes.lerp(p[1], ey, v) + Math.sin(v * Math.PI) * len2 * 0.16]);
          }
          api.paint(ctx, leafPts, { wash: i % 2 ? '#6d8f55' : '#8fb463', sw: 1, washOp: 0.95 });
        }
      }
      // 顶端卷须
      const tip = spine[12];
      const curl: P2[] = [];
      for (let s = 0; s <= 10; s++) {
        const u = s / 10;
        const a = u * Math.PI * 2.4;
        const rr = 14 * (1 - u * 0.55);
        curl.push([tip[0] + lean * 6 + Math.cos(a) * rr, tip[1] - 6 + Math.sin(a) * rr]);
      }
      api.inkLine(ctx, curl, 2, 'rgba(96,128,74,0.9)');
    };

    const n = Math.min(3, Math.max(1, Math.round(fronds)));
    if (n > 2) frond(46, -0.5, 210, 9);
    if (n > 1) frond(-8, 0.24, 244, 5);
    frond(-52, 0.6, 190, 2);

    // 底部的小卷芽
    api.inkLine(ctx, api.shapes.arc(-84, -22, 16, 14, Math.PI * 1.1, Math.PI * 2.6, 12), 2.4, 'rgba(109,143,85,0.9)');
    api.inkLine(ctx, api.shapes.arc(72, -20, 13, 12, Math.PI * 1.1, Math.PI * 2.6, 12), 2.2, 'rgba(109,143,85,0.9)');
  },
};
