import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_subway_car: ComponentDef<ClawdApi> = {
name: 'pr_subway_car',
  style: 'clawd',
  kind: 'prop',
  description: 'A side-on watercolour subway car standing on a short platform strip, with a pale body, teal and ochre livery bands, three double doors, warm-lit side windows, roof vents, two bogies with wheels, a headlight and a destination board. It is 700×300 px with its anchor at the bottom centre, and suits station platforms, transit scenes and background rail traffic.',
  tags: ['catalog', 'vehicle', 'subway', 'train', 'ground', 'watercolour', 'transport'],
  size: [700, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offset in radians for the sway, light flicker and speed-line cycle, so repeated copies animate out of sync.' },
    speed: { type: 'number', default: 0.6, min: 0, max: 4, description: 'Overall motion amount: above 0.35 drifting speed lines appear beside the car, and above 0.5 the body sways sideways.' },
    doors: { type: 'number', default: 0, min: 0, max: 1, description: 'Door opening: 0 keeps the double doors closed, 1 slides both leaves fully apart.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, speed = 0.6, doors = 0 } = params as { phase?: number; speed?: number; doors?: number };
    const { PAL } = api;
    const slide = speed > 0.5 ? Math.sin(t * 1.4 + phase) * 3 : 0;
    const flick = 0.9 + 0.1 * Math.sin(t * 2.4 + phase);

    // 站台地面与阴影
    api.paint(ctx, api.shapes.poly([[-320, -26], [320, -26], [320, 0], [-320, 0]], 3), { wash: '#c8bfae', sw: 0, washOp: 0.5 });
    api.paint(ctx, api.shapes.poly([[-300, -26], [300, -26], [300, -20], [-300, -20]], 3), { wash: PAL.ochre, sw: 0, washOp: 0.4 });
    api.paint(ctx, api.shapes.ring(0, -24, 286, 10, 24, 0, 0, 6), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    ctx.save();
    ctx.translate(slide, 0);

    // 车身
    api.paint(ctx, api.shapes.poly([[-312, -30], [-318, -170], [-300, -214], [-268, -232], [268, -232], [300, -214], [318, -170], [312, -30]], 5), {
      wash: '#dfe3de',
      sw: 3.4,
    });
    // 下部裙板
    api.paint(ctx, api.shapes.poly([[-312, -30], [312, -30], [310, -78], [-310, -78]], 4), { wash: '#8f9b99', sw: 2.2 });
    // 色带（两条）
    api.paint(ctx, api.shapes.poly([[-312, -170], [312, -170], [312, -152], [-312, -152]], 3), { wash: PAL.teal, sw: 1.8, washOp: 0.85 });
    api.paint(ctx, api.shapes.poly([[-312, -146], [312, -146], [312, -138], [-312, -138]], 3), { wash: PAL.ochre, sw: 1.4, washOp: 0.8 });

    // 车顶受电弓支架 / 通风口
    for (let i = 0; i < 4; i++) {
      api.paint(ctx, api.shapes.round(-190 + i * 128, -246, -128 + i * 128, -234, 4), { wash: '#b9b2a2', sw: 1.6 });
    }

    // 门窗排布：门-窗-门-窗-门
    const doorW = 62;
    const doorXs = [-206, -16, 174];
    const glass = (x0: number, x1: number, y0: number, y1: number, a = 0.9) => {
      api.paint(ctx, api.shapes.poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 4), { wash: '#f3e2b2', sw: 2.2, washOp: a });
      api.paint(ctx, api.shapes.poly([[x0, y0], [x1, y0], [x1, y0 + 14], [x0, y0 + 14]], 4), { wash: '#ffffff', sw: 0, washOp: 0.22 });
    };

    for (let i = 0; i < 3; i++) {
      const x0 = doorXs[i];
      const x1 = x0 + doorW;
      // 门框
      api.paint(ctx, api.shapes.poly([[x0 - 4, -212], [x1 + 4, -212], [x1 + 4, -34], [x0 - 4, -34]], 3), { wash: '#c3c7c1', sw: 2 });
      // 双开门（中缝）
      const open = api.shapes.clamp01(doors);
      for (let s = 0; s < 2; s++) {
        const dx = s ? x1 - doorW / 2 + open * 18 : x0 - open * 18;
        const ww = doorW / 2;
        api.paint(ctx, api.shapes.poly([[dx, -208], [dx + ww, -208], [dx + ww, -38], [dx, -38]], 3), { wash: '#e7e9e3', sw: 2 });
        api.paint(ctx, api.shapes.poly([[dx + 6, -196], [dx + ww - 6, -196], [dx + ww - 6, -120], [dx + 6, -120]], 3), { wash: '#f0dda8', sw: 1.6, washOp: 0.9 });
      }
      // 门缝阴影
      api.inkLine(ctx, api.shapes.line(x0 + doorW / 2, -206, x0 + doorW / 2, -40, 0, 6, i + 3), 1.6, 'rgba(58,47,42,0.35)');
      // 门边指示灯
      api.paint(ctx, api.shapes.ring(x0 - 12, -190, 5, 5, 10), { wash: PAL.rose, sw: 1.2, washOp: 0.9 });
      api.glow(ctx, x0 - 12, -190, 22, PAL.rose, 0.14);
    }

    // 侧窗（门之间的三块大窗）
    glass(-128, -36, -206, -104);
    glass(62, 154, -206, -104);
    glass(252, 300, -206, -104);
    // 车厢内暖光
    api.glow(ctx, 0, -150, 210, '#ffe4a8', 0.16 * flick);
    api.glow(ctx, 210, -150, 90, '#ffe4a8', 0.14 * flick);

    // 车头端（左侧）：驾驶室窗 + 大灯
    api.paint(ctx, api.shapes.poly([[-312, -206], [-262, -212], [-262, -140], [-312, -150]], 4), { wash: '#c6d8db', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(-292, -96, 12, 12, 14), { wash: '#fff6ea', sw: 1.8 });
    api.glow(ctx, -306, -96, 44, '#fff6ea', 0.22 + 0.06 * Math.sin(t * 3 + phase));

    // 目的地牌
    api.paint(ctx, api.shapes.poly([[196, -226], [276, -226], [276, -212], [196, -212]], 3), { wash: '#3f464b', sw: 1.6 });
    api.inkLine(ctx, api.shapes.line(206, -219, 266, -219, 0, 4, 3), 2, 'rgba(246,236,196,0.85)');

    // 转向架 + 车轮
    for (let b = 0; b < 2; b++) {
      const bx = b ? 196 : -196;
      api.paint(ctx, api.shapes.round(bx - 78, -54, bx + 78, -22, 4), { wash: '#6b7376', sw: 2.2 });
      for (let w = 0; w < 2; w++) {
        const wx = bx + (w ? 34 : -34);
        api.paint(ctx, api.shapes.ring(wx, -14, 15, 15, 16), { wash: '#3a4147', sw: 2 });
        api.paint(ctx, api.shapes.ring(wx, -14, 6, 6, 10), { wash: '#b9b2a2', sw: 1 });
      }
    }
    ctx.restore();

    // 速度线（车身两侧的水平气流）
    if (speed > 0.35) {
      for (let i = 0; i < 4; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 6 + i * 1.4 + phase);
        api.inkLine(ctx, api.shapes.line(320, -60 - i * 44, 336 + k * 10, -60 - i * 44, 1, 5, i + 3), 2, `rgba(120,150,150,${0.14 + 0.14 * k})`);
      }
    }
  },
};
