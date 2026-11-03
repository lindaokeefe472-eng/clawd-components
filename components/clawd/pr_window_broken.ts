import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_window_broken: ComponentDef<ClawdApi> = {
name: 'pr_window_broken',
  style: 'clawd',
  kind: 'prop',
  description: 'A tall watercolour window frame with dark broken-out glass, jagged glass shards along the edges, radial cracks around a central impact point, and two strips of tape crossed in an X over the pane. A stone sill with scattered glass sits at the bottom centre anchor (316×300 px), with faint wind lines and a drifting leaf adding motion; it is good for dressing a weathered or abandoned facade.',
  tags: ['catalog', 'facade', 'window', 'broken', 'exterior', 'decor', 'wall'],
  size: [316, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the swaying wind and leaf animation between copies.' },
    draft: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the wind sway and leaf drift; 0 keeps the air still, 1 gives full motion.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, draft = 1 } = params as { phase?: number; draft?: number };
    const { PAL } = api;
    const sway = Math.sin(t * 1.3 + phase) * 3 * draft;

    // 窗框
    api.paint(ctx, api.shapes.poly([[-150, -300], [150, -300], [150, -10], [-150, -10]], 3), { wash: '#c5bba6', sw: 3.2 });
    // 破洞里透出的黑
    api.paint(ctx, api.shapes.poly([[-132, -284], [132, -284], [132, -32], [-132, -32]], 3), { wash: '#3f4750', sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[-132, -284], [132, -284], [132, -32], [-132, -32]], 3), { wash: '#2f353d', sw: 0, washOp: 0.5 });

    // 残留的玻璃碎片（沿边缘一圈锯齿）
    const shards: P2[] = [
      [-132, -284], [-96, -284], [-104, -238], [-70, -262], [-84, -284],
    ];
    api.paint(ctx, api.shapes.poly(shards, 3), { wash: '#cfe0e2', sw: 2, washOp: 0.85 });
    const shards2: P2[] = [
      [132, -284], [132, -160], [104, -190], [116, -238], [86, -264], [98, -284],
    ];
    api.paint(ctx, api.shapes.poly(shards2, 3), { wash: '#cfe0e2', sw: 2, washOp: 0.85 });
    const shards3: P2[] = [
      [-132, -32], [-60, -32], [-84, -70], [-118, -58],
    ];
    api.paint(ctx, api.shapes.poly(shards3, 3), { wash: '#cfe0e2', sw: 2, washOp: 0.85 });

    // 放射状裂纹
    const crack = (a: number, len: number, seed: number) => {
      const pts: P2[] = [[0, -158]];
      for (let i = 1; i <= 4; i++) {
        const u = i / 4;
        pts.push([Math.cos(a) * len * u + api.shapes.jit(i * 2.3 + seed, 7), -158 + Math.sin(a) * len * u + api.shapes.jit(i * 1.7 + seed, 7)]);
      }
      api.inkLine(ctx, pts, 1.6, 'rgba(246,239,223,0.8)');
    };
    for (let i = 0; i < 7; i++) {
      crack((i / 7) * Math.PI * 2 + 0.3, 80 + (i % 3) * 26, i);
    }
    // 击破点
    api.paint(ctx, api.shapes.ring(0, -158, 13, 13, 14, 0, 0.18, 3), { wash: 'rgba(246,239,223,0.35)', sw: 1.8 });

    // 贴着的胶带 X
    api.paint(ctx, api.shapes.poly([[-118, -252], [-92, -256], [110, -52], [84, -48]], 3), { wash: '#efe2c0', sw: 1.8, washOp: 0.75 });
    api.paint(ctx, api.shapes.poly([[-96, -54], [-70, -50], [104, -252], [78, -256]], 3), { wash: '#efe2c0', sw: 1.8, washOp: 0.75 });

    // 窗台碎玻璃
    api.paint(ctx, api.shapes.poly([[-158, -18], [158, -18], [150, 0], [-150, 0]], 3), { wash: '#b8ae99', sw: 3 });
    for (let i = 0; i < 6; i++) {
      const x = -120 + i * 46 + api.shapes.jit(i, 12);
      api.paint(ctx, api.shapes.poly([[x, -18], [x + 10, -24], [x + 16, -18]], 2), { wash: '#d6e6e8', sw: 1, washOp: 0.9 });
    }

    // 飘进来的风与落叶
    for (let i = 0; i < 3; i++) {
      const pts: P2[] = [];
      for (let k = 0; k <= 7; k++) {
        const u = k / 7;
        pts.push([-60 + i * 44 + Math.sin(u * 5 + t * 2 + i) * 10, -140 - u * 40 + sway * u]);
      }
      api.inkLine(ctx, pts, 1.6, 'rgba(246,239,223,0.3)');
    }
    api.paint(ctx, api.shapes.ring(-70 + sway * 2, -46, 7, 3.4, 8, 0.6 + sway * 0.05), { wash: PAL.sap, sw: 1.2, washOp: 0.85 });
  },
};
