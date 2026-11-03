import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_rug: ComponentDef<ClawdApi> = {
name: 'pr_rug',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour area rug drawn as a slightly tapered trapezoid with layered borders, a diamond or block motif, warp lines and fringe at both short ends. It is anchored at bottom centre and measures 460×260 px, suitable for placing under furniture or defining a floor area in an interior scene.',
  tags: ['catalog', 'household', 'rug', 'textile', 'ground', 'decor'],
  size: [460, 260],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the ripple and fringe sway to desynchronise repeated rugs.' },
    pattern: { type: 'enum', default: 'diamond', options: ['diamond', 'grid'], description: 'Selects the motif: \'diamond\' draws diamond medallions, \'grid\' draws an alternating block grid.' },
    lift: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls the ripple and fringe sway amplitude; 0 is still and 1 is full motion.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, pattern = 'diamond', lift = 1 } = params as { phase?: number; pattern?: string; lift?: number };
    const { PAL } = api;
    const ripple = Math.sin(t * 0.9 + phase) * 1.6 * lift;

    // 地毯：略带透视的梯形，近边略下垂
    const near = 224;
    const far = 196;
    const top = -244;
    const bot = -10;
    const body: P2[] = [
      [-far, top],
      [far, top],
      [near, bot + ripple],
      [-near, bot + ripple],
    ];
    api.paint(ctx, api.shapes.poly(body, 6), { wash: '#b9827a', sw: 3.4 });
    // 内边
    api.paint(ctx, api.shapes.poly([[-far + 18, top + 16], [far - 18, top + 16], [near - 20, bot - 12 + ripple], [-near + 20, bot - 12 + ripple]], 5), {
      wash: '#e8dcc0',
      sw: 2.2,
      washOp: 0.9,
    });
    api.paint(ctx, api.shapes.poly([[-far + 42, top + 34], [far - 42, top + 34], [near - 44, bot - 30 + ripple], [-near + 44, bot - 30 + ripple]], 5), {
      wash: '#8f5b56',
      sw: 2,
      washOp: 0.75,
    });

    // 纹样：菱形 + 小方块
    if (pattern === 'diamond') {
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          const cx = -132 + c * 132;
          const cy = -190 + r * 84;
          const d = 34;
          api.paint(ctx, api.shapes.poly([[cx, cy - d], [cx + d, cy], [cx, cy + d], [cx - d, cy]], 3), { wash: '#e8dcc0', sw: 2, washOp: 0.92 });
          api.paint(ctx, api.shapes.poly([[cx, cy - d * 0.5], [cx + d * 0.5, cy], [cx, cy + d * 0.5], [cx - d * 0.5, cy]], 3), { wash: PAL.ochre, sw: 1.6, washOp: 0.9 });
        }
      }
    } else {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          const cx = -144 + c * 96;
          const cy = -206 + r * 62;
          api.paint(ctx, api.shapes.round(cx - 20, cy - 18, cx + 20, cy + 18, 4, 3), { wash: (r + c) % 2 ? '#e8dcc0' : PAL.ochre, sw: 1.8, washOp: 0.9 });
        }
      }
    }
    // 经线纹理
    for (let i = 0; i < 9; i++) {
      const u = (i + 0.5) / 9;
      const xt = api.shapes.lerp(-far, far, u);
      const xb = api.shapes.lerp(-near, near, u);
      api.inkLine(ctx, api.shapes.line(xt, top + 8, xb, bot - 6 + ripple, 0, 5, i + 2), 1, 'rgba(120,70,66,0.18)');
    }

    // 两端流苏
    for (let i = 0; i < 12; i++) {
      const u = (i + 0.5) / 12;
      const x = api.shapes.lerp(-far, far, u);
      const k = Math.sin(t * 1.4 + i * 1.3 + phase) * 2 * lift;
      api.inkLine(ctx, api.shapes.line(x, top - 2, x + k, top - 16, 0, 3, i + 3), 1.8, 'rgba(232,220,192,0.9)');
      const x2 = api.shapes.lerp(-near, near, u);
      api.inkLine(ctx, api.shapes.line(x2, bot + ripple, x2 + k, bot + 6 + ripple, 0, 3, i + 9), 1.8, 'rgba(232,220,192,0.9)');
    }
  },
};
