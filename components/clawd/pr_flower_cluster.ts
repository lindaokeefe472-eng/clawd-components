import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_flower_cluster: ComponentDef<ClawdApi> = {
name: 'pr_flower_cluster',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour cluster of daisy, bell and spike flowers with green stems and leaves rising from a soft earth mound; anchored at the bottom centre, 340×300 px. It suits garden borders, meadow foregrounds and decorative ground planting in a scene.',
  tags: ['catalog', 'flower', 'plant', 'cluster', 'ground', 'decor', 'watercolour'],
  size: [340, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the wind-sway animation so repeated clusters move out of sync.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Controls how far the stems and flower heads sway in the breeze.' },
    palette: { type: 'enum', default: 'mixed', options: ['mixed', 'rose', 'ochre'], description: 'Selects the flower colour scheme: mixed rose and ochre tones, rose only, or ochre only.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wind = 1, palette = 'mixed' } = params as { phase?: number; wind?: number; palette?: string };
    const { PAL } = api;
    const cols = palette === 'rose' ? [PAL.rose, '#d98b86'] : palette === 'ochre' ? [PAL.ochre, '#e0b45a'] : [PAL.rose, PAL.ochre, '#e8dcc0'];

    // 花丛底座与草叶
    api.paint(ctx, api.shapes.ring(0, -12, 128, 14, 24, 0, 0.07, 5), { wash: '#b9a67d', sw: 0, washOp: 0.4 });
    for (let i = 0; i < 7; i++) {
      const x = -104 + i * 34;
      const pts: P2[] = [];
      for (let s = 0; s <= 5; s++) {
        const u = s / 5;
        pts.push([x + (i % 2 ? 1 : -1) * u * 10 + Math.sin(t * 1.4 + u * 2 + i + phase) * 6 * u * wind, -12 - u * (70 + (i % 3) * 22)]);
      }
      api.inkLine(ctx, pts, 2.4, 'rgba(109,143,85,0.85)');
    }

    // 三种花型：雏菊状 / 钟形 / 穗状
    const daisy = (cx: number, hh: number, r: number, col: string, seed: number) => {
      const cy = -12 - hh;
      const k = Math.sin(t * 1.5 + seed * 1.7 + phase) * 3 * wind;
      api.inkLine(ctx, api.shapes.line(cx, -12, cx + k, cy + r * 0.4, 3, 5, seed), 2.2, 'rgba(96,128,74,0.9)');
      // 叶
      api.paint(ctx, api.shapes.ring(cx - 12, cy + r * 0.9, 16, 7, 10, 0.5), { wash: '#6d8f55', sw: 1.2 });
      api.paint(ctx, api.shapes.ring(cx + 14, cy + r * 1.3, 14, 6, 10, -0.4), { wash: '#7fab5e', sw: 1.2 });
      // 花瓣
      for (let p = 0; p < 8; p++) {
        const a = (p / 8) * Math.PI * 2 + seed * 0.3;
        api.paint(ctx, api.shapes.ring(cx + k + Math.cos(a) * r * 0.72, cy + Math.sin(a) * r * 0.72, r * 0.44, r * 0.28, 10, a), {
          wash: col,
          sw: 1.2,
        });
      }
      api.paint(ctx, api.shapes.ring(cx + k, cy, r * 0.34, r * 0.34, 12), { wash: PAL.ochre, sw: 1.4 });
      api.paint(ctx, api.shapes.ring(cx + k - 2, cy - 2, r * 0.12, r * 0.12, 8), { wash: '#fff6ea', sw: 0, washOp: 0.8 });
    };

    const bell = (cx: number, hh: number, r: number, col: string, seed: number) => {
      const cy = -12 - hh;
      const k = Math.sin(t * 1.7 + seed + phase) * 3 * wind;
      api.inkLine(ctx, api.shapes.line(cx, -12, cx + k, cy - r, 3, 5, seed + 3), 2.2, 'rgba(96,128,74,0.9)');
      // 钟形（上收下开）
      api.paint(ctx, api.shapes.poly([[cx + k - r * 0.3, cy - r], [cx + k + r * 0.3, cy - r], [cx + k + r * 0.8, cy + r * 0.2],
        [cx + k - r * 0.8, cy + r * 0.2]], 4), { wash: col, sw: 1.8 });
      api.paint(ctx, api.shapes.arc(cx + k, cy + r * 0.2, r * 0.8, r * 0.26, 0, Math.PI, 10).concat(
        api.shapes.arc(cx + k, cy + r * 0.2, r * 0.8, r * 0.26, Math.PI, 0, 10)), { wash: col, sw: 1.4 });
      api.inkLine(ctx, api.shapes.line(cx + k, cy - r * 0.2, cx + k, cy + r * 0.3, 0, 3, seed + 5), 1.2, 'rgba(120,70,60,0.35)');
      // 花蕊
      api.paint(ctx, api.shapes.ring(cx + k, cy + r * 0.34, 3.4, 3.4, 8), { wash: PAL.ochre, sw: 0 });
    };

    const spike = (cx: number, h: number, col: string, seed: number) => {
      const pts: P2[] = [];
      for (let s = 0; s <= 8; s++) {
        const u = s / 8;
        pts.push([cx + Math.sin(u * 2.4 + t * 1.3 + seed + phase) * 5 * u * wind, -12 - u * h]);
      }
      api.inkLine(ctx, pts, 2.2, 'rgba(96,128,74,0.9)');
      for (let i = 0; i < 7; i++) {
        const u = 0.18 + (i / 7) * 0.78;
        const x = cx + Math.sin(u * 2.4 + t * 1.3 + seed + phase) * 5 * u * wind;
        const y = -12 - u * h;
        api.paint(ctx, api.shapes.ring(x - 6, y, 8, 5, 8, -0.5), { wash: col, sw: 1 });
        api.paint(ctx, api.shapes.ring(x + 6, y - 4, 8, 5, 8, 0.4), { wash: col, sw: 1 });
      }
    };

    spike(-118, 214, cols[1], 2);
    bell(-64, 168, 21, cols[2], 4);
    daisy(-8, 236, 34, cols[0], 6);
    daisy(58, 192, 27, cols[1], 9);
    bell(108, 148, 18, cols[0], 12);
    daisy(28, 148, 22, cols[2], 15);
    // 小花苞
    api.paint(ctx, api.shapes.ring(-96, -252, 8, 12, 10, 0.2), { wash: cols[1], sw: 1.2 });
    api.inkLine(ctx, api.shapes.line(-96, -12, -102, -240, 3, 5, 17), 1.8, 'rgba(96,128,74,0.8)');
  },
};
