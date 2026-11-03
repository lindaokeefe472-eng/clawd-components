import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_grass_patch: ComponentDef<ClawdApi> = {
name: 'pr_grass_patch',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour clump of grass made of ten inked tufts with soft green wash patches beneath them and up to three small five-petal flowers on thin stems. It measures 420×180 px with its anchor at the bottom centre, so it sits flush on ground lines and works as low meadow cover or a foreground border in a scene.',
  tags: ['catalog', 'plants', 'grass', 'patch', 'ground', 'decor', 'meadow'],
  size: [420, 180],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the sway and flower-bob cycle in radians so several copies do not move in unison.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Scales how far the grass tips and flower heads lean and drift; 0 gives a still patch, higher values look breezy.' },
    flowers: { type: 'number', default: 1, min: 0, max: 14, description: 'Controls the presence and opacity of the small blossoms; below about 0.2 no flowers are drawn, and larger values make them fully opaque.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wind = 1, flowers = 1 } = params as { phase?: number; wind?: number; flowers?: number };
    const { PAL } = api;

    // 土色斑块底
    api.paint(ctx, api.shapes.ring(0, -14, 176, 15, 26, 0, 0.07, 5), { wash: '#b9a67d', sw: 0, washOp: 0.45 });
    api.paint(ctx, api.shapes.ring(0, -14, 140, 12, 24, 0, 0.06, 9), { wash: PAL.sap, sw: 0, washOp: 0.35 });

    // 底部绿色底衬（避免只剩线条）
    api.paint(ctx, api.shapes.ring(0, -22, 150, 20, 26, 0, 0.12, 11), { wash: '#8fb463', sw: 0, washOp: 0.5 });
    api.paint(ctx, api.shapes.ring(-30, -30, 96, 16, 22, 0, 0.1, 17), { wash: '#7fa356', sw: 0, washOp: 0.4 });

    // 草丛：每一束由 3–5 根弯曲线条组成
    const tuft = (cx: number, h0: number, seed: number, lean: number) => {
      const n = 3 + (seed % 3);
      for (let i = 0; i < n; i++) {
        const spread = (i - (n - 1) / 2) / Math.max(1, (n - 1) / 2);
        const hh = h0 * (0.72 + api.shapes.hash(seed + i) * 0.5);
        const bend = spread * (8 + hh * 0.18) + lean * 0.7;
        const pts: P2[] = [];
        for (let s = 0; s <= 6; s++) {
          const u = s / 6;
          // 顶端受风偏移更大
          const wsway = Math.sin(t * 1.5 + u * 2.2 + seed * 0.7 + phase) * 5.5 * u * wind;
          pts.push([cx + spread * 6 + bend * u * u + wsway, -12 - hh * u]);
        }
        api.inkLine(ctx, pts, 2.6, i % 3 === 0 ? 'rgba(88,122,66,0.9)' : 'rgba(109,143,85,0.85)');
        // 叶尖小三角
        const tip = pts[6];
        api.paint(ctx, api.shapes.poly([[tip[0] - 3.4, tip[1] + 6], [tip[0] + 3.4, tip[1] + 6], [tip[0], tip[1] - 2]], 2),
          { wash: '#7fab5e', sw: 0, washOp: 0.9 });
      }
    };

    tuft(-146, 84, 3, -6);
    tuft(-108, 118, 27, -6);
    tuft(-64, 132, 7, 2);
    tuft(-26, 96, 31, -3);
    tuft(6, 116, 11, -2);
    tuft(44, 86, 35, 4);
    tuft(72, 140, 15, 6);
    tuft(108, 104, 39, 8);
    tuft(140, 90, 19, 10);
    tuft(-20, 74, 23, 4);

    // 小花
    if (flowers > 0.2) {
      const spots = [
        { x: -104, y: -96, col: '#f2e08a' },
        { x: 40, y: -116, col: PAL.paper },
        { x: 108, y: -86, col: PAL.rose },
      ];
      for (let i = 0; i < 3; i++) {
        const s = spots[i];
        const k = Math.sin(t * 1.7 + i * 2 + phase) * 2 * wind;
        api.inkLine(ctx, api.shapes.line(s.x, -12, s.x + k, s.y + 4, 2, 4, i + 3), 1.6, 'rgba(88,122,66,0.8)');
        for (let p = 0; p < 5; p++) {
          const a = (p / 5) * Math.PI * 2;
          api.paint(ctx, api.shapes.ring(s.x + k + Math.cos(a) * 6.4, s.y + Math.sin(a) * 5, 5.4, 4.4, 8, a), {
            wash: s.col,
            sw: 1,
            washOp: 0.95 * flowers,
          });
        }
        api.paint(ctx, api.shapes.ring(s.x + k, s.y, 3.4, 3.4, 8), { wash: PAL.ochre, sw: 0, washOp: flowers });
      }
    }
  },
};
