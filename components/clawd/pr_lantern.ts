import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_lantern: ComponentDef<ClawdApi> = {
name: 'pr_lantern',
  style: 'clawd',
  kind: 'prop',
  description: 'A hanging paper lantern with clay wood caps top and bottom, a curved wire hook and cord, a ribbed ochre paper body with glowing inner core, and a short fringe of tassels below. Anchored at its bottom centre at 150×280 px, it sways gently and suits festival, street or doorway scenes as a hanging light source.',
  tags: ['catalog', 'lantern', 'light', 'hanging', 'paper', 'outdoor', 'decor', 'prop'],
  size: [150, 280],
  anchorNames: ['grip'],
  anchors() { return { grip: [0, -270] }; },
  params: {
    sway: { type: 'number', default: 1, min: 0, max: 3, description: 'Amount of pendulum swing; 0 keeps it still, higher values widen the arc.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offset in radians for the sway and flicker cycles, so several lanterns do not move in sync.' },
    lit: { type: 'number', default: 1, min: 0, max: 1, description: 'Brightness of the inner glow and halo; 0 leaves the paper body unlit.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { sway = 1, phase = 0, lit = 1 } = params as { sway?: number; phase?: number; lit?: number };
    const { PAL } = api;
    const pivot = -272;
    const swing = Math.sin(t * 1.15 + phase) * 0.06 * sway;
    ctx.save();
    ctx.translate(0, pivot);
    ctx.rotate(swing);
    ctx.translate(0, -pivot);

    const pulse = 0.75 + 0.25 * Math.sin(t * 2.1 + phase);

    // 吊绳与钩子
    api.inkLine(ctx, [[0, pivot], [3, pivot + 30], [-2, pivot + 62], [0, -190]], 3, PAL.ink);
    api.inkLine(ctx, api.shapes.arc(0, pivot + 2, 12, 9, Math.PI * 0.9, Math.PI * 2.05, 10), 3, PAL.ink);

    // 上下木盖
    api.paint(ctx, api.shapes.round(-30, -194, 30, -172, 6), { wash: PAL.clay, sw: 3.2 });
    api.paint(ctx, api.shapes.round(-34, -78, 34, -54, 6), { wash: PAL.clay, sw: 3.2 });

    // 灯笼纸体
    const body = api.shapes.ring(0, -126, 56, 52, 44, 0, 0.03, 3);
    api.glow(ctx, 0, -126, 160, PAL.ochre, 0.24 + 0.12 * pulse * lit);
    api.paint(ctx, body, { wash: '#f3c96b', sw: 3.4 });
    api.paint(ctx, api.shapes.ring(-18, -140, 26, 20, 18, -0.4), { wash: PAL.paper, sw: 0, washOp: 0.35 });

    // 灯笼骨架（经线）
    for (let i = -2; i <= 2; i++) {
      const pts: P2[] = [];
      for (let k = 0; k <= 12; k++) {
        const u = k / 12;
        pts.push([i * 0.5 * 56 * Math.sin(u * Math.PI) * 1.02, -176 + u * 100]);
      }
      api.inkLine(ctx, pts, i === 0 ? 1.6 : 1.2, 'rgba(90,60,40,0.4)');
    }
    // 纬线（三道箍）
    for (let j = -1; j <= 1; j++) {
      const yy = -126 + j * 26;
      const ww = 56 * Math.sqrt(Math.max(0, 1 - Math.pow((yy + 126) / 52, 2)));
      api.inkLine(ctx, api.shapes.arc(0, yy, ww, 9, 0, Math.PI * 2, 26), 1.2, 'rgba(90,60,40,0.35)');
    }

    // 发光内芯
    api.glow(ctx, 0, -124, 52, '#fff3c8', 0.55 * lit);
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#fff8e0';
    ctx.beginPath();
    ctx.ellipse(0, -124, 19, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 底部流苏
    for (let i = 0; i < 5; i++) {
      const x = -16 + i * 8;
      const sw2 = Math.sin(t * 2.4 + phase + i) * 3;
      api.inkLine(ctx, api.shapes.line(x, -54, x + sw2, -24 + (i % 2) * 6, 2, 6, i + 2), 3.4, i % 2 ? PAL.orange : PAL.clay);
    }
    ctx.restore();
  },
};
