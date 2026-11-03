import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_washing_machine: ComponentDef<ClawdApi> = {
name: 'pr_washing_machine',
  style: 'clawd',
  kind: 'prop',
  description: 'A front-loading watercolour washing machine drawn face-on: a rounded white body with a control panel of dial and buttons, a big round glass door showing coloured laundry tumbling inside, a detergent bottle on the lid and a drain hose at the right. It measures 250×326 px with the anchor at the bottom centre, and suits laundry rooms, kitchens or other domestic interior scenes.',
  tags: ['catalog', 'home', 'appliance', 'laundry', 'prop', 'ground', 'decor'],
  size: [250, 326],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the rumble and laundry tumbling cycle so several machines do not move in sync.' },
    spin: { type: 'number', default: 1, min: 0, max: 4, description: 'Spin speed multiplier; 0 stops the laundry and body shake, higher values make the drum clothes circle faster and the body vibrate more.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, spin = 1 } = params as { phase?: number; spin?: number };
    const { PAL } = api;
    const rumble = Math.sin(t * 7 + phase) * 0.8 * spin;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 96, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(rumble * 0.6, 0);

    // 机身
    api.paint(ctx, api.shapes.round(-92, -282, 92, -8, 16, 6), { wash: '#eef1ef', sw: 3.8 });
    // 顶板
    api.paint(ctx, api.shapes.round(-88, -282, 88, -250, 10), { wash: '#e2e7e4', sw: 2.6 });
    // 控制面板
    api.paint(ctx, api.shapes.round(-88, -248, 88, -196, 6), { wash: '#dfe5e2', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(-52, -222, 13, 13, 16), { wash: PAL.paper, sw: 2.2 });
    api.inkLine(ctx, [[-52, -222], [-52, -232]], 2, PAL.ink);
    for (let i = 0; i < 3; i++) {
      api.paint(ctx, api.shapes.ring(6 + i * 22, -222, 6, 6, 10), { wash: i === 0 ? PAL.orange : '#cdd4d1', sw: 1.8 });
    }
    api.paint(ctx, api.shapes.round(52, -238, 80, -218, 4), { wash: '#cdd4d1', sw: 1.8 });

    // 舱门
    const doorCx = 0;
    const doorCy = -108;
    api.paint(ctx, api.shapes.ring(doorCx, doorCy, 68, 66, 36, 0, 0.01, 4), { wash: '#dfe6e3', sw: 3.4 });
    api.paint(ctx, api.shapes.ring(doorCx, doorCy, 54, 52, 34, 0, 0.01, 8), { wash: '#c4d3d4', sw: 2.4 });
    // 滚筒里的衣物（随转速晃动）
    for (let i = 0; i < 4; i++) {
      const a = i * 1.9 + t * 1.6 * spin;
      api.paint(
        ctx,
        api.shapes.ring(doorCx + Math.cos(a) * 26, doorCy + Math.sin(a) * 22, 17, 12, 14, a, 0.08, i + 3),
        { wash: [PAL.rose, PAL.sky, PAL.paper, PAL.ochre][i], sw: 0, washOp: 0.85 }
      );
    }
    // 玻璃高光
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(doorCx - 22, doorCy - 24, 20, 12, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    api.inkLine(ctx, api.shapes.ring(doorCx, doorCy, 54, 52, 34), 2.6, PAL.ink);
    // 门把手
    api.paint(ctx, api.shapes.round(-10, doorCy + 62, 10, doorCy + 74, 4), { wash: '#c9d0cd', sw: 2 });

    // 脚与水管
    api.paint(ctx, api.shapes.round(-76, -12, -56, -4, 3), { wash: PAL.night, sw: 0, washOp: 0.65 });
    api.paint(ctx, api.shapes.round(56, -12, 76, -4, 3), { wash: PAL.night, sw: 0, washOp: 0.65 });
    api.inkLine(ctx, api.shapes.arc(96, -180, 18, 14, -Math.PI * 0.4, Math.PI * 0.5, 10), 4, '#b9c2c0');

    // 洗衣液瓶（放在顶面右侧）
    api.paint(ctx, api.shapes.poly([[26, -284], [62, -284], [58, -308], [30, -308]], 3), { wash: PAL.teal, sw: 2.2 });
    api.paint(ctx, api.shapes.poly([[38, -308], [52, -308], [50, -318], [40, -318]], 3), { wash: PAL.clay, sw: 1.8 });
    ctx.restore();
  },
};
