import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_ac_unit: ComponentDef<ClawdApi> = {
name: 'pr_ac_unit',
  style: 'clawd',
  kind: 'prop',
  description: 'A wall-mounted air-conditioning unit seen from the front: a pale rounded casing with a top vent strip, a circular fan grille with three turning blades, a side pipe port, a small nameplate, a blinking indicator light, a metal mounting bracket and a thin drain hose. Anchored at the bottom centre at 250×210 px, it suits building facades, alley walls and rooftop scenes.',
  tags: ['catalog', 'air-conditioner', 'appliance', 'facade', 'wall', 'watercolour', 'decor'],
  size: [250, 210],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offset in radians for the blade spin and blinking light, used to desynchronise several copies.' },
    spin: { type: 'number', default: 1, min: 0, max: 4, description: 'Speed of the fan blades and the subtle body rumble; 0 freezes the fan and stops the indicator glow.' },
    leak: { type: 'number', default: 0, min: 0, max: 1, description: 'Amount of condensation dripping from the unit, fading two water droplets in and out below the casing.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, spin = 1, leak = 0 } = params as { phase?: number; spin?: number; leak?: number };
    const { PAL } = api;
    const rumble = Math.sin(t * 8 + phase) * 0.6 * spin;

    // 墙面
    api.paint(ctx, api.shapes.poly([[-125, -210], [125, -210], [125, -8], [-125, -8]], 3), { wash: '#d9d0bc', sw: 0, washOp: 0.45 });
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-125, -50 - i * 46, 125, -50 - i * 46, 0.6, 10, i + 2), 1.1, 'rgba(58,47,42,0.08)');
    }

    // 支架
    api.inkLine(ctx, api.shapes.line(-96, -34, -96, -12, 0, 4, 2), 5, '#6b7376');
    api.inkLine(ctx, api.shapes.line(96, -34, 96, -12, 0, 4, 3), 5, '#6b7376');
    api.inkLine(ctx, api.shapes.line(-100, -40, 100, -40, 0, 6, 4), 4, '#6b7376');
    api.inkLine(ctx, api.shapes.line(-100, -40, -74, -12, 1, 4, 5), 3, '#6b7376');
    api.inkLine(ctx, api.shapes.line(100, -40, 74, -12, -1, 4, 6), 3, '#6b7376');

    // 机身
    ctx.save();
    ctx.translate(rumble, 0);
    api.paint(ctx, api.shapes.round(-104, -170, 104, -30, 10, 6), { wash: '#dfe4e2', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-104, -170], [104, -170], [104, -154], [-104, -154]], 3), { wash: '#cbd3d1', sw: 2.2 });
    // 顶部散热片
    api.paint(ctx, api.shapes.round(-88, -168, 88, -156, 4), { wash: '#b9c1c0', sw: 0, washOp: 0.8 });
    // 风扇格栅
    api.paint(ctx, api.shapes.ring(-34, -104, 46, 46, 30, 0, 0.01, 4), { wash: '#cfd6d4', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(-34, -104, 40, 40, 26, 0, 0.01, 8), { wash: '#aab3b1', sw: 0 });
    // 扇叶（转速）
    ctx.save();
    ctx.translate(-34, -104);
    ctx.rotate(t * 9 * spin);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      api.paint(ctx, api.shapes.ring(Math.cos(a) * 20, Math.sin(a) * 20, 16, 7, 12, a, 0.06, i + 2), { wash: '#e8ecea', sw: 1.4, washOp: 0.85 });
    }
    ctx.restore();
    // 格栅环
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.ring(-34, -104, 40 - i * 13, 40 - i * 13, 22), 1.6, 'rgba(58,47,42,0.35)');
    }
    // 侧面管接口与铭牌
    api.paint(ctx, api.shapes.ring(66, -64, 14, 12, 16), { wash: '#b9c1c0', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(66, -64, 7, 6, 10), { wash: '#8f9b99', sw: 0 });
    api.paint(ctx, api.shapes.round(30, -150, 92, -132, 3), { wash: '#e9edeb', sw: 1.4 });
    for (let i = 0; i < 2; i++) {
      api.inkLine(ctx, api.shapes.line(38, -146 + i * 8, 78, -146 + i * 8, 0, 4, i + 3), 1.2, 'rgba(58,47,42,0.3)');
    }
    // 运行指示灯
    const k = 0.5 + 0.5 * Math.sin(t * 2.4 + phase);
    api.glow(ctx, 88, -42, 16, PAL.teal, 0.2 * k * spin);
    api.paint(ctx, api.shapes.ring(88, -42, 4, 4, 8), { wash: PAL.teal, sw: 0, washOp: 0.5 + 0.5 * k });
    ctx.restore();

    // 冷凝水
    if (leak > 0) {
      for (let i = 0; i < 2; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 2 + i * 2.3 + phase);
        api.paint(ctx, api.shapes.ring(78 + i * 6, -24 + k * 20, 3, 4.4, 8), { wash: PAL.sky, sw: 0, washOp: 0.7 * leak });
      }
    }
    // 排水管
    api.inkLine(ctx, [[84, -40], [96, -20], [102, -6]], 2.4, 'rgba(58,47,42,0.35)');
  },
};
