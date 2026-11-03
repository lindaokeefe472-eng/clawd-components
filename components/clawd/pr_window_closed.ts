import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_window_closed: ComponentDef<ClawdApi> = {
name: 'pr_window_closed',
  style: 'clawd',
  kind: 'prop',
  description: 'A closed watercolour casement window with a pale frame, four-pane glass, cross mullions, a pair of gathered curtains, a sill with a small potted flowering plant, and a soft moving highlight on the glass. It measures 316×300 px with the anchor at bottom centre, and is good for dressing house and shop facades in exterior street scenes.',
  tags: ['catalog', 'window', 'facade', 'closed', 'wall', 'exterior', 'decor', 'prop'],
  size: [316, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the glass shimmer and flower sway, so repeated windows do not move in sync.' },
    lit: { type: 'number', default: 0.4, min: 0, max: 1, description: 'How much warm interior light shows through the glass; higher values turn the panes yellow and add a stronger glow behind them.' },
    curtain: { type: 'enum', default: 'rose', options: ['rose', 'ochre', 'sap', 'sky', 'cream'], description: 'Palette wash used for the two curtain drapes hanging at the sides of the window.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, lit = 0.4, curtain = 'rose' } = params as { phase?: number; lit?: number; curtain?: string };
    const { PAL } = api;
    const curtainWash = (PAL as Record<string, string>)[curtain] || PAL.rose;
    const shimmer = Math.sin(t * 0.7 + phase) * 6;

    // 窗框外沿
    api.paint(ctx, api.shapes.poly([[-150, -300], [150, -300], [150, -10], [-150, -10]], 3), { wash: '#cfc6b2', sw: 3.2 });
    // 玻璃
    api.paint(ctx, api.shapes.poly([[-132, -284], [132, -284], [132, -32], [-132, -32]], 3), {
      wash: lit > 0.55 ? '#f3e2b2' : '#c8dadd',
      sw: 2.4,
    });
    if (lit > 0.1) {
      api.glow(ctx, 0, -158, 120, '#ffe7b0', 0.1 + 0.16 * lit);
      // 室内暖光
      api.paint(ctx, api.shapes.poly([[-132, -284], [132, -284], [132, -32], [-132, -32]], 3), { wash: '#ffe9bd', sw: 0, washOp: 0.42 * lit });
    }
    // 十字窗棂
    api.paint(ctx, api.shapes.poly([[-9, -284], [9, -284], [9, -32], [-9, -32]], 3), { wash: '#d8cfba', sw: 2.2 });
    api.paint(ctx, api.shapes.poly([[-132, -166], [132, -166], [132, -148], [-132, -148]], 3), { wash: '#d8cfba', sw: 2.2 });

    // 窗帘（两侧各一束）
    for (let i = 0; i < 2; i++) {
      const dir = i ? 1 : -1;
      const pts: P2[] = [
        [dir * 128, -282],
        [dir * 66, -284],
        [dir * 58, -190],
        [dir * 74, -120],
        [dir * 62, -36],
        [dir * 128, -34],
      ];
      api.paint(ctx, api.shapes.poly(pts, 3), { wash: curtainWash, sw: 2.4, washOp: 0.92 });
      for (let k = 0; k < 3; k++) {
        api.inkLine(ctx, api.shapes.line(dir * 96, -270, dir * (82 + k * 5), -50, dir * 2, 8, i * 3 + k + 2), 1.3, 'rgba(255,255,255,0.35)');
      }
    }

    // 玻璃反光
    ctx.save();
    ctx.globalAlpha = 0.22 + 0.06 * Math.sin(t * 0.9 + phase);
    ctx.beginPath();
    ctx.moveTo(-100 + shimmer, -284);
    ctx.lineTo(-46 + shimmer, -284);
    ctx.lineTo(-118 + shimmer, -32);
    ctx.lineTo(-132 + shimmer * 0.4, -32);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    // 窗台 + 小花
    api.paint(ctx, api.shapes.poly([[-158, -18], [158, -18], [150, 0], [-150, 0]], 3), { wash: '#c2b8a2', sw: 3 });
    api.paint(ctx, api.shapes.poly([[-46, -18], [46, -18], [38, -46], [-38, -46]], 3), { wash: '#c98a6b', sw: 2.6 });
    for (let i = 0; i < 4; i++) {
      const x = -26 + i * 18;
      const k = Math.sin(t * 1.2 + i * 1.4 + phase) * 2;
      api.inkLine(ctx, api.shapes.line(x, -44, x + k, -66, 1, 4, i + 3), 2, PAL.sap);
      api.paint(ctx, api.shapes.ring(x + k, -70, 5, 5, 10, 0.3), { wash: i % 2 ? PAL.rose : PAL.ochre, sw: 1.4 });
    }
  },
};
