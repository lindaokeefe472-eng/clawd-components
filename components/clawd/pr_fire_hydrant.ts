import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_fire_hydrant: ComponentDef<ClawdApi> = {
name: 'pr_fire_hydrant',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour fire hydrant: a tapered red column on a flanged base, with a side outlet cap on each side, a top nozzle, a small dust chain and scattered rust spots. Anchored at the bottom centre and sized 160×210 px, it sits on a pavement or street corner and can be given a slow dripping leak.',
  tags: ['catalog', 'street', 'hydrant', 'prop', 'metal', 'ground', 'watercolour'],
  size: [160, 210],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the chain sway and drip timing between copies.' },
    leak: { type: 'number', default: 0, min: 0, max: 1, description: 'Amount of leakage: 0 is dry, higher values make two water drops pulse below the left outlet with increasing opacity.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, leak = 0 } = params as { phase?: number; leak?: number };
    const { PAL } = api;
    const red = '#c4553f';

    // 地面阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 54, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 底座法兰
    api.paint(ctx, api.shapes.poly([[-46, -4], [46, -4], [38, -22], [-38, -22]], 3), { wash: '#a04a3a', sw: 2.8 });
    api.paint(ctx, api.shapes.poly([[-34, -22], [34, -22], [30, -34], [-30, -34]], 3), { wash: red, sw: 2.6 });

    // 柱身
    api.paint(ctx, api.shapes.poly([[-30, -32], [30, -32], [26, -128], [-26, -128]], 3), { wash: red, sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-20, -44], [-16, -122], [-2, -122], [-6, -44]], 3), { wash: '#e0866f', sw: 0, washOp: 0.6 });

    // 腰部凸缘
    api.paint(ctx, api.shapes.poly([[-38, -92], [38, -92], [34, -108], [-34, -108]], 3), { wash: '#b04d3a', sw: 2.6 });

    // 出水口（左右）
    for (let i = 0; i < 2; i++) {
      const dir = i ? 1 : -1;
      api.paint(ctx, api.shapes.ring(dir * 36, -72, 14, 14, 18, 0, 0.02, i + 3), { wash: '#b04d3a', sw: 2.6 });
      api.paint(ctx, api.shapes.ring(dir * 40, -72, 9, 9, 14), { wash: '#8f9b99', sw: 2 });
      api.paint(ctx, api.shapes.ring(dir * 40, -72, 3.4, 3.4, 8), { wash: PAL.ochre, sw: 0, washOp: 0.9 });
    }

    // 顶部奶嘴口
    api.paint(ctx, api.shapes.poly([[-20, -128], [20, -128], [16, -146], [-16, -146]], 3), { wash: '#b04d3a', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(0, -150, 17, 8, 16), { wash: '#8f9b99', sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[-6, -150], [6, -150], [0, -166], [-4, -166]], 3), { wash: PAL.ochre, sw: 1.8 });

    // 防尘链
    ctx.save();
    ctx.translate(-40, -84);
    for (let i = 0; i < 6; i++) {
      api.paint(ctx, api.shapes.ring(Math.sin(i * 0.9 + t * 0.6 + phase) * 2, i * 7, 3.2, 2.2, 8), { wash: '#8f9b99', sw: 1.2, washOp: 0.85 });
    }
    ctx.restore();

    // 滴水
    if (leak > 0) {
      for (let i = 0; i < 2; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 2.4 + i * 2 + phase);
        api.paint(ctx, api.shapes.ring(-40 - i * 4, -64 + k * 26, 3, 4.2, 8), { wash: PAL.sky, sw: 0, washOp: 0.7 * leak });
      }
    }
    // 锈斑
    for (let i = 0; i < 4; i++) {
      api.paint(ctx, api.shapes.ring(api.shapes.jit(i * 2.3, 20), -50 - Math.abs(api.shapes.jit(i * 1.9, 70)), 4, 3, 8, 0.3, 0.2, i + 4), {
        wash: '#8a5a3a',
        sw: 0,
        washOp: 0.3,
      });
    }
  },
};
