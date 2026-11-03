import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_street_lamp: ComponentDef<ClawdApi> = {
name: 'pr_street_lamp',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour street lamp with a stepped stone base, a tall slim post ringed with ochre bands, and a curved arm holding a trapezoid lantern that glows warm yellow with a light cone and circling insects. Anchor is bottom centre, 210×400 px; it suits street, square or park scenes, especially evening and night settings.',
  tags: ['catalog', 'street', 'lamp', 'light', 'prop', 'ground', 'night', 'decor'],
  size: [210, 400],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the flicker, sway and insect orbits between copies.' },
    on: { type: 'number', default: 1, min: 0, max: 1, description: 'Switches the lantern between lit (1) and unlit (0), changing the glass colour, glow and light cone.' },
    sway: { type: 'number', default: 1, min: 0, max: 3, description: 'Amount the curved arm and lantern swing back and forth; 0 keeps the arm still.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, on = 1, sway = 1 } = params as { phase?: number; on?: number; sway?: number };
    const { PAL } = api;
    const flick = 0.86 + 0.14 * Math.sin(t * 2.3 + phase) * Math.sin(t * 0.7 + phase * 2);
    const swing = Math.sin(t * 0.8 + phase) * 0.012 * sway;

    // 地面阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 48, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 灯座
    api.paint(ctx, api.shapes.poly([[-28, -4], [28, -4], [20, -22], [-20, -22]], 3), { wash: '#8f9b99', sw: 2.8 });
    api.paint(ctx, api.shapes.poly([[-16, -22], [16, -22], [12, -44], [-12, -44]], 3), { wash: '#a3aeac', sw: 2.4 });

    // 灯杆
    api.inkLine(ctx, api.shapes.line(0, -40, 0, -330, 0.6, 12, 2), 8, '#8f9b99');
    api.inkLine(ctx, api.shapes.line(0, -40, 0, -330, 0.6, 12, 2), 2.6, PAL.ink);
    for (let i = 0; i < 3; i++) {
      api.paint(ctx, api.shapes.ring(0, -92 - i * 74, 8, 3.6, 12), { wash: PAL.ochre, sw: 1.4, washOp: 0.7 });
    }

    // 弯臂（先向右上，再向右下收）
    ctx.save();
    ctx.translate(0, -330);
    ctx.rotate(swing);
    const arm: P2[] = [];
    for (let i = 0; i <= 14; i++) {
      const u = i / 14;
      arm.push([u * 74, -Math.sin(u * Math.PI * 0.62) * 30 - u * 4]);
    }
    api.inkLine(ctx, arm, 7, '#8f9b99');
    api.inkLine(ctx, arm, 2.4, PAL.ink);

    // 灯头：帽 + 梯形灯罩 + 玻璃底盘
    ctx.save();
    ctx.translate(72, -24);
    if (on > 0) api.glow(ctx, 0, 30, 96, '#ffe7b0', 0.22 * flick * on);
    api.paint(ctx, api.shapes.poly([[-8, -14], [8, -14], [4, -2], [-4, -2]], 3), { wash: '#8f9b99', sw: 2 });
    api.paint(ctx, api.shapes.poly([[-34, -4], [34, -4], [26, 10], [-26, 10]], 3), { wash: on > 0 ? '#f6e2b0' : '#dfe4e2', sw: 3 });
    api.paint(ctx, api.shapes.ring(0, 11, 26, 7, 18), { wash: on > 0 ? '#fff8e0' : '#cfd6d4', sw: 2.4 });
    if (on > 0) {
      api.paint(ctx, api.shapes.ring(0, 12, 12, 4, 12), { wash: '#fffdf2', sw: 0, washOp: 0.95 * flick });
      // 光锥
      ctx.save();
      ctx.globalAlpha = 0.1 * on * flick;
      ctx.beginPath();
      ctx.moveTo(-24, 14);
      ctx.lineTo(-92, 210);
      ctx.lineTo(92, 210);
      ctx.lineTo(24, 14);
      ctx.closePath();
      ctx.fillStyle = '#ffe7b0';
      ctx.fill();
      ctx.restore();
      // 飞虫
      for (let i = 0; i < 3; i++) {
        const a = t * 2.2 + i * 2.1 + phase;
        api.paint(ctx, api.shapes.ring(Math.cos(a) * 24, 18 + Math.sin(a * 1.4) * 12, 2, 1.6, 6), { wash: PAL.ink, sw: 0, washOp: 0.32 });
      }
    }
    ctx.restore();
    ctx.restore();
  },
};
