import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_desk_lamp: ComponentDef<ClawdApi> = {
name: 'pr_desk_lamp',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour desk lamp with a round base, two-segment articulated arm and ochre shade, shown with a glowing bulb and soft light cone when switched on. Anchor is bottom centre at 250×270 px, suitable for desks, studies and indoor interior scenes.',
  tags: ['catalog', 'home', 'desk', 'lamp', 'light', 'decor', 'indoor'],
  size: [250, 270],
  params: {
    on: { type: 'number', default: 1, min: 0, max: 1, description: 'Turns the bulb glow and light cone on (1) or off (0).' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises flicker and sway between copies.' },
    aim: { type: 'number', default: 0, min: 0, max: 1, description: 'Adds to the arm sway angle, tilting the lamp head and light direction.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { on = 1, phase = 0, aim = 0 } = params as { on?: number; phase?: number; aim?: number };
    const { PAL } = api;
    const flick = 0.92 + 0.08 * Math.sin(t * 3.1 + phase) * Math.sin(t * 1.3);
    const swayA = Math.sin(t * 0.7 + phase) * 0.02 + aim;

    // 底座
    api.paint(ctx, api.shapes.ring(0, -14, 54, 13, 30), { wash: PAL.night, sw: 3.2 });
    api.paint(ctx, api.shapes.ring(0, -20, 40, 9, 26), { wash: PAL.teal, sw: 2.4, washOp: 0.85 });

    // 灯臂（两段）
    ctx.save();
    ctx.translate(0, -24);
    ctx.rotate(swayA);
    api.inkLine(ctx, api.shapes.line(0, 0, 18, -96, 4, 10, 3), 5.5, PAL.night);
    api.inkLine(ctx, api.shapes.line(18, -96, -16, -178, -10, 10, 6), 5.5, PAL.night);
    // 关节
    api.paint(ctx, api.shapes.ring(18, -96, 6, 6, 12), { wash: PAL.ochre, sw: 2.2 });

    // 灯罩
    ctx.save();
    ctx.translate(-16, -178);
    ctx.rotate(-0.42);
    const shade: P2[] = [[-42, -14], [42, -14], [24, 26], [-24, 26]];
    api.paint(ctx, shade, { wash: PAL.ochre, sw: 3.4 });
    api.paint(ctx, [[-42, -14], [42, -14], [34, -4], [-34, -4]], { wash: PAL.orange, sw: 0, washOp: 0.5 });
    // 灯泡 & 光
    if (on > 0) {
      api.glow(ctx, 0, 30, 110, '#ffe6a4', 0.4 * flick * on);
      api.glow(ctx, 0, 30, 42, '#fff6d0', 0.6 * flick * on);
      ctx.save();
      ctx.globalAlpha = 0.85 * on;
      ctx.fillStyle = '#fff8dc';
      ctx.beginPath();
      ctx.ellipse(0, 26, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      api.paint(ctx, api.shapes.arc(0, 26, 14, 9, 0, Math.PI * 2, 14), { wash: '#cfd6d3', sw: 2.2 });
    }
    // 灯口金属边
    api.inkLine(ctx, api.shapes.line(-24, 26, 24, 26, 0, 8, 5), 2.4, PAL.ink);
    ctx.restore();

    // 光锥
    if (on > 0) {
      ctx.save();
      ctx.globalAlpha = 0.16 * on * flick;
      ctx.beginPath();
      ctx.moveTo(-12, -72);
      ctx.lineTo(-46, -140);
      ctx.lineTo(64, -140);
      ctx.lineTo(18, -70);
      ctx.closePath();
      ctx.fillStyle = '#ffe6a4';
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  },
};
