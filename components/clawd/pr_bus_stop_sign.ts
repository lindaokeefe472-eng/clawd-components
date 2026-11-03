import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_bus_stop_sign: ComponentDef<ClawdApi> = {
name: 'pr_bus_stop_sign',
  style: 'clawd',
  kind: 'prop',
  description: 'A slim grey pole rising from a small ground shadow, topped with a round teal disc showing a simple bus, and a cream timetable panel clamped to its right side with coloured route blocks, six time rows and a small status lamp. The anchor is bottom centre at 220×350 px, making it a roadside marker for street, pavement or transit-stop scenes.',
  tags: ['catalog', 'street', 'bus-stop', 'sign', 'pole', 'timetable', 'ground', 'decor'],
  size: [220, 350],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the gentle sway of the disc and panel and the blinking of the status lamp, so repeated signs do not move in sync.' },
    arrive: { type: 'number', default: 0, min: 0, max: 1, description: 'Fades in an orange glow and lamp at the bottom of the timetable, indicating an arriving bus; 0 leaves the lamp as a plain grey dot.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, arrive = 0 } = params as { phase?: number; arrive?: number };
    const { PAL } = api;

    // 地面阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 36, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 立杆（从地面一直到顶端）
    api.inkLine(ctx, api.shapes.line(0, -4, 0, -336, 0, 12, 2), 8, '#8f9b99');
    api.inkLine(ctx, api.shapes.line(0, -4, 0, -336, 0, 12, 2), 2.6, PAL.ink);
    api.paint(ctx, api.shapes.ring(0, -6, 22, 6, 16), { wash: '#a3aeac', sw: 2.2 });

    // 顶部圆形站牌
    ctx.save();
    ctx.translate(0, -288);
    ctx.rotate(Math.sin(t * 0.9 + phase) * 0.01);
    api.paint(ctx, api.shapes.ring(0, 0, 54, 54, 32, 0, 0.006, 4), { wash: PAL.teal, sw: 3.6 });
    api.paint(ctx, api.shapes.ring(0, 0, 45, 45, 28, 0, 0.006, 8), { wash: '#5fa8a3', sw: 0 });
    // 公交车
    api.paint(ctx, api.shapes.round(-26, -14, 26, 8, 5, 4), { wash: PAL.paper, sw: 2 });
    api.paint(ctx, api.shapes.round(-21, -10, -4, 2, 2), { wash: '#5fa8a3', sw: 1 });
    api.paint(ctx, api.shapes.round(2, -10, 20, 2, 2), { wash: '#5fa8a3', sw: 1 });
    api.paint(ctx, api.shapes.ring(-14, 13, 5, 5, 8), { wash: PAL.paper, sw: 1.6 });
    api.paint(ctx, api.shapes.ring(14, 13, 5, 5, 8), { wash: PAL.paper, sw: 1.6 });
    ctx.restore();

    // 时刻表牌（挂在杆右侧）
    ctx.save();
    ctx.translate(0, -196);
    ctx.rotate(Math.sin(t * 0.7 + phase) * 0.006);
    api.paint(ctx, api.shapes.round(-52, -66, 52, 66, 6, 4), { wash: '#fbf6ea', sw: 3 });
    api.paint(ctx, api.shapes.round(-45, -59, 45, 59, 4, 3), { wash: '#fdfaf1', sw: 0, washOp: 0.9 });
    // 线路号色块
    api.paint(ctx, api.shapes.round(-40, -54, -8, -36, 4), { wash: PAL.teal, sw: 1.6 });
    api.inkLine(ctx, api.shapes.line(-34, -45, -14, -45, 0, 3, 3), 2.2, 'rgba(246,239,223,0.9)');
    api.paint(ctx, api.shapes.round(0, -54, 40, -36, 4), { wash: PAL.ochre, sw: 1.6 });
    // 时刻行
    for (let i = 0; i < 6; i++) {
      const y = -24 + i * 15;
      api.inkLine(ctx, api.shapes.line(-40, y, 8 + api.shapes.jit(i, 14), y, 0.8, 6, i + 2), 1.4, 'rgba(58,47,42,0.3)');
      api.paint(ctx, api.shapes.ring(34, y, 3.6, 3.6, 8), { wash: i % 2 ? PAL.ochre : PAL.teal, sw: 1, washOp: 0.8 });
    }
    // 到站提示
    const k = 0.5 + 0.5 * Math.sin(t * 2 + phase);
    if (arrive > 0) {
      api.glow(ctx, -36, 46, 24, PAL.orange, 0.3 * arrive * k);
      api.paint(ctx, api.shapes.ring(-36, 46, 5.6, 5.6, 10), { wash: PAL.orange, sw: 0, washOp: 0.4 + 0.5 * k * arrive });
    } else {
      api.paint(ctx, api.shapes.ring(-36, 46, 5.6, 5.6, 10), { wash: '#cfd8d6', sw: 1.4 });
    }
    api.inkLine(ctx, api.shapes.line(-16, 46, 26, 46, 0, 4, 4), 1.6, 'rgba(58,47,42,0.3)');
    ctx.restore();

    // 固定在杆上的卡箍
    for (let i = 0; i < 2; i++) {
      api.paint(ctx, api.shapes.round(-9, -262 + i * 130, 9, -246 + i * 130, 3), { wash: '#8f9b99', sw: 1.8 });
    }
  },
};
