import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_vine_trellis: ComponentDef<ClawdApi> = {
name: 'pr_vine_trellis',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour vine trellis: a wooden frame with two posts, three horizontal rails and a top beam, covered by a climbing vine with leaves, tendrils and small blossoms. The anchor is bottom centre and the size is 380×460 px, making it useful as a garden ground prop or façade decoration behind a scene.',
  tags: ['catalog', 'plant', 'vine', 'trellis', 'wood', 'garden', 'ground', 'decor'],
  size: [380, 460],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the swaying motion of copies.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Wind strength; controls how far the vine, branches, leaves and flowers sway.' },
    flowers: { type: 'number', default: 1, min: 0, max: 14, description: 'Number of blossoms; 0 hides them, and higher values make the flower clusters more prominent.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wind = 1, flowers = 1 } = params as { phase?: number; wind?: number; flowers?: number };
    const { PAL } = api;

    // 花架（木格）
    api.paint(ctx, api.shapes.ring(0, -10, 120, 10, 20, 0, 0, 4), { wash: '#8b8172', sw: 0, washOp: 0.2 });
    for (let i = 0; i < 2; i++) {
      const x = i ? 132 : -132;
      api.paint(ctx, api.shapes.poly([[x - 9, -10], [x + 9, -10], [x + 9, -420], [x - 9, -420]], 4), { wash: '#b98a5c', sw: 2.6 });
    }
    for (let i = 0; i < 3; i++) {
      const y = -110 - i * 120;
      api.paint(ctx, api.shapes.poly([[-140, y], [140, y], [140, y - 12], [-140, y - 12]], 3), { wash: '#c79a6a', sw: 2.2 });
    }
    // 顶部横梁
    api.paint(ctx, api.shapes.poly([[-148, -420], [148, -420], [148, -436], [-148, -436]], 3), { wash: '#a97b4f', sw: 2.4 });

    // 主藤：从地面沿左侧立柱爬到顶部，再横过来
    const vine: P2[] = [];
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      const x = -128 + Math.sin(u * 7 + phase) * 16 + u * 40;
      const y = -14 - u * 400;
      vine.push([x + Math.sin(t * 1.3 + u * 3 + phase) * 4 * u * wind, y]);
    }
    api.inkLine(ctx, vine, 5, '#5f7a4f');
    api.inkLine(ctx, vine.map((p) => [p[0] - 1.4, p[1]] as P2), 1.6, 'rgba(255,255,255,0.25)');

    // 分支藤（三根）
    const branch = (startU: number, dir: number, len: number, seed: number) => {
      const i0 = Math.round(startU * 24);
      const p0 = vine[i0];
      const pts: P2[] = [];
      for (let s = 0; s <= 10; s++) {
        const u = s / 10;
        pts.push([
          p0[0] + dir * u * len + Math.sin(u * 4 + seed) * 10,
          p0[1] - u * 46 + Math.sin(u * 3 + seed) * 14 + Math.sin(t * 1.5 + u * 2 + seed + phase) * 4 * u * wind,
        ]);
      }
      api.inkLine(ctx, pts, 3, '#6d8f55');
      return pts;
    };
    const b1 = branch(0.22, 1, 86, 2);
    const b2 = branch(0.46, 1, 92, 5);
    const b3 = branch(0.68, -1, 62, 8);

    // 叶子：沿主藤与分支分布
    const leafAt = (x: number, y: number, seed: number, size = 15) => {
      const a = seed % 2 ? 0.7 : -0.7;
      const k = Math.sin(t * 1.7 + seed + phase) * 0.14 * wind;
      api.paint(ctx, api.shapes.ring(x, y, size, size * 0.56, 12, a + k), { wash: seed % 3 === 0 ? '#7fab5e' : seed % 3 === 1 ? '#6d8f55' : '#8fb463', sw: 1.3 });
      api.inkLine(ctx, api.shapes.line(x - Math.cos(a) * size * 0.8, y - Math.sin(a) * size * 0.8, x + Math.cos(a) * size * 0.9, y + Math.sin(a) * size * 0.9, 0, 3, seed),
        1, 'rgba(70,100,55,0.45)');
    };
    for (let i = 2; i < 24; i += 3) {
      const p = vine[i];
      leafAt(p[0] + (i % 2 ? 18 : -18), p[1] - 6, i);
    }
    for (let i = 1; i < 10; i += 2) {
      leafAt(b1[i][0], b1[i][1], i + 20, 12);
      leafAt(b2[i][0], b2[i][1], i + 30, 13);
      leafAt(b3[i][0], b3[i][1], i + 40, 11);
    }

    // 卷须
    for (let i = 0; i < 4; i++) {
      const p = vine[5 + i * 5];
      const dir = i % 2 ? 1 : -1;
      const curl: P2[] = [];
      for (let s = 0; s <= 12; s++) {
        const u = s / 12;
        const a = u * Math.PI * 2.2;
        const rr = 12 * (1 - u * 0.5);
        curl.push([p[0] + dir * (16 + Math.cos(a) * rr), p[1] - 10 - u * 18 + Math.sin(a) * rr]);
      }
      api.inkLine(ctx, curl, 1.6, 'rgba(96,128,74,0.85)');
    }

    // 小花
    if (flowers > 0.2) {
      const spots = [
        { x: b1[9][0], y: b1[9][1], col: '#e8dcc0' },
        { x: b2[9][0], y: b2[9][1], col: PAL.rose },
        { x: vine[16][0] + 20, y: vine[16][1], col: '#e8dcc0' },
      ];
      for (let i = 0; i < 3; i++) {
        const s = spots[i];
        const k = Math.sin(t * 1.8 + i * 2 + phase) * 2 * wind;
        for (let p = 0; p < 5; p++) {
          const a = (p / 5) * Math.PI * 2;
          api.paint(ctx, api.shapes.ring(s.x + k + Math.cos(a) * 7, s.y + Math.sin(a) * 6, 6, 4.6, 8, a), { wash: s.col, sw: 1, washOp: 0.95 * flowers });
        }
        api.paint(ctx, api.shapes.ring(s.x + k, s.y, 3.4, 3.4, 8), { wash: PAL.ochre, sw: 0, washOp: flowers });
      }
    }
  },
};
