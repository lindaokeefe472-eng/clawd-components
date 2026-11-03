import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_door_wood: ComponentDef<ClawdApi> = {
name: 'pr_door_wood',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wooden front door with a pale frame, panelled leaf, metal hinges and handle, house-number plate, mail slot, stone step, doormat, and a small potted plant; anchor is bottom centre at 280×400 px. It is suited to a building facade or street entrance in a scene.',
  tags: ['catalog', 'door', 'wood', 'facade', 'entrance', 'ground', 'decor'],
  size: [280, 400],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Shifts the timing of the plant\'s sway so copies do not move in sync.' },
    open: { type: 'number', default: 0, min: 0, max: 1, description: 'Rotates the door leaf inward from shut to fully open, revealing a warm glow behind.' },
    welcome: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls the doormat and, above 0.5, shows the small potted plant beside the step.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, open = 0, welcome = 1 } = params as { phase?: number; open?: number; welcome?: number };
    const { PAL } = api;
    const op = api.shapes.clamp01(open);

    // 门框
    api.paint(ctx, api.shapes.poly([[-125, -400], [125, -400], [125, 0], [-125, 0]], 4), { wash: '#cfc6b2', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-104, -386], [104, -386], [104, -12], [-104, -12]], 4), { wash: '#3f342b', sw: 2.6 });
    if (op > 0) {
      api.paint(ctx, api.shapes.poly([[-104, -386], [104, -386], [104, -12], [-104, -12]], 4), { wash: '#f2d99b', sw: 0, washOp: 0.65 * op });
      api.glow(ctx, -30, -180, 120, PAL.ochre, 0.22 * op);
    }

    // 门扇（右侧铰链，向内开）
    ctx.save();
    ctx.translate(104, -200);
    ctx.rotate(-0.92 * op);
    ctx.translate(-104, 200);

    api.paint(ctx, api.shapes.poly([[-100, -382], [100, -382], [100, -14], [-100, -14]], 3), { wash: '#b98a5c', sw: 3.4 });
    // 竖向板缝
    for (let i = 0; i < 3; i++) {
      const x = -50 + i * 50;
      api.inkLine(ctx, api.shapes.line(x, -376, x, -20, 0.5, 12, i + 2), 1.2, 'rgba(100,66,36,0.3)');
    }
    // 2×2 凹板
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const x0 = -80 + c * 84;
        const y0 = -352 + r * 166;
        api.paint(ctx, api.shapes.poly([[x0, y0], [x0 + 76, y0], [x0 + 76, y0 + 138], [x0, y0 + 138]], 3), { wash: '#a97b4f', sw: 2.6 });
        api.inkLine(ctx, api.shapes.poly([[x0 + 9, y0 + 9], [x0 + 67, y0 + 9], [x0 + 67, y0 + 129], [x0 + 9, y0 + 129]], 3), 1.5, 'rgba(96,62,34,0.45)');
        api.inkLine(ctx, api.shapes.line(x0 + 16, y0 + 18, x0 + 16, y0 + 120, 0, 3, r * 2 + c + 3), 1.4, 'rgba(255,246,230,0.28)');
      }
    }
    // 铰链
    for (let i = 0; i < 2; i++) {
      const y = -318 + i * 214;
      api.paint(ctx, api.shapes.poly([[-100, y], [-74, y + 6], [-74, y + 26], [-100, y + 20]], 3), { wash: '#8f9b99', sw: 1.8 });
      api.paint(ctx, api.shapes.ring(-92, y + 13, 3.4, 3.4, 8), { wash: '#6b7376', sw: 0.8 });
    }
    // 把手与锁
    api.paint(ctx, api.shapes.poly([[54, -214], [80, -214], [80, -166], [54, -166]], 3), { wash: '#8f9b99', sw: 1.8 });
    api.paint(ctx, api.shapes.ring(64, -196, 10, 10, 14), { wash: PAL.ochre, sw: 2.2 });
    api.paint(ctx, api.shapes.ring(64, -196, 4, 4, 8), { wash: '#b8802a', sw: 0 });
    // 门牌
    api.paint(ctx, api.shapes.poly([[26, -366], [76, -366], [76, -338], [26, -338]], 3), { wash: '#efe3c6', sw: 1.6 });
    api.inkLine(ctx, api.shapes.line(36, -352, 66, -352, 0, 4, 3), 2.6, 'rgba(58,47,42,0.55)');
    // 信箱口
    api.paint(ctx, api.shapes.poly([[-52, -108], [24, -108], [24, -92], [-52, -92]], 3), { wash: '#6d5a45', sw: 1.6 });
    ctx.restore();

    // 台阶 + 门垫
    api.paint(ctx, api.shapes.poly([[-125, -12], [125, -12], [140, 0], [-140, 0]], 3), { wash: '#c2b8a2', sw: 2.6 });
    if (welcome > 0) {
      api.paint(ctx, api.shapes.poly([[-60, -2], [60, -2], [50, -12], [-50, -12]], 3), { wash: PAL.rose, sw: 1.6, washOp: 0.82 * welcome });
      for (let i = 0; i < 3; i++) {
        api.inkLine(ctx, api.shapes.line(-34 + i * 22, -9, -22 + i * 22, -9, 0, 2, i + 2), 1.2, 'rgba(120,60,60,0.35)');
      }
    }
    // 门边的小盆栽
    if (welcome > 0.5) {
      const sway = Math.sin(t * 1.1 + phase) * 1.6;
      api.paint(ctx, api.shapes.poly([[96, -8], [124, -8], [120, -34], [100, -34]], 3), { wash: PAL.ochre, sw: 1.8 });
      for (let i = 0; i < 3; i++) {
        api.paint(ctx, api.shapes.ring(102 + i * 8 + sway, -46 - i * 6, 9, 5, 10, -0.4 + i * 0.4), { wash: PAL.sap, sw: 1.3, washOp: 0.9 });
      }
    }
  },
};
