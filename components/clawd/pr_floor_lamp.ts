import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_floor_lamp: ComponentDef<ClawdApi> = {
name: 'pr_floor_lamp',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour floor lamp: a slim dark pole rising from a low round base into a trapezoid fabric shade, with a soft warm glow and a downward light cone when lit, plus a small swinging charm tied to the pole. Anchor is bottom centre at 220×488 px, good as interior decor and a warm light source in room scenes.',
  tags: ['catalog', 'home', 'lamp', 'floor', 'light', 'decor', 'interior', 'ground'],
  size: [220, 488],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the flicker, sway and charm swing so copies do not animate in sync.' },
    on: { type: 'number', default: 1, min: 0, max: 1, description: 'Switches the lamp on or off: 1 gives a warm glowing shade with bulb and light cone, 0 gives a dull unlit fabric shade.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, on = 1 } = params as { phase?: number; on?: number };
    const { PAL } = api;
    const flick = 0.9 + 0.1 * Math.sin(t * 2.6 + phase);
    const sway = Math.sin(t * 0.6 + phase) * 0.008;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 62, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(0, -12);
    ctx.rotate(sway);

    // 底座
    api.paint(ctx, api.shapes.ring(0, -2, 52, 12, 28), { wash: PAL.night, sw: 3 });
    api.paint(ctx, api.shapes.ring(0, -8, 40, 9, 24), { wash: PAL.teal, sw: 2.2, washOp: 0.8 });

    // 立杆
    api.inkLine(ctx, api.shapes.line(0, -12, 0, -272, 1.2, 12, 2), 5, '#8d9b99');
    api.inkLine(ctx, api.shapes.line(0, -12, 0, -272, 1.2, 12, 2), 2.2, PAL.ink);

    // 灯罩（梯形，保留直边直角）
    const shade: P2[] = api.shapes.poly([[-72, -270], [72, -270], [46, -344], [-46, -344]], 4);
    if (on > 0) {
      api.glow(ctx, 0, -400, 190, '#ffe7b4', 0.28 * flick * on);
      api.glow(ctx, 0, -350, 90, '#fff4d4', 0.3 * flick * on);
    }
    api.paint(ctx, shade, { wash: on > 0 ? '#f3d79c' : '#d8d2c4', sw: 3.4 });
    // 灯罩布纹
    for (let i = 0; i < 3; i++) {
      const yy = -288 - i * 18;
      const halfW = 66 - i * 7;
      api.inkLine(ctx, api.shapes.line(-halfW, yy, halfW, yy, 0.6, 6, i + 3), 1.2, 'rgba(120,90,50,0.22)');
    }
    api.inkLine(ctx, api.shapes.line(-72, -270, 72, -270, 1, 8, 6), 3, PAL.ink);
    api.inkLine(ctx, api.shapes.line(-74, -272, 74, -272, 1, 8, 4), 2.6, 'rgba(58,47,42,0.5)');

    // 灯泡
    if (on > 0) {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = '#fff8dc';
      ctx.beginPath();
      ctx.ellipse(0, -266, 26, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // 光锥
      ctx.save();
      ctx.globalAlpha = 0.14 * on * flick;
      ctx.beginPath();
      ctx.moveTo(-40, -268);
      ctx.lineTo(-96, -100);
      ctx.lineTo(96, -100);
      ctx.lineTo(40, -268);
      ctx.closePath();
      ctx.fillStyle = '#ffe6a8';
      ctx.fill();
      ctx.restore();
    }

    // 搭在杆上的小挂饰
    ctx.save();
    ctx.translate(30, -200 + Math.sin(t * 1.8 + phase) * 2);
    ctx.rotate(Math.sin(t * 1.5 + phase) * 0.08);
    api.inkLine(ctx, [[0, -14], [0, 4]], 1.6, 'rgba(58,47,42,0.5)');
    api.paint(ctx, [[-4, 4], [4, 4], [0, 16]], { wash: PAL.ochre, sw: 1.6 });
    ctx.restore();
    ctx.restore();
  },
};
