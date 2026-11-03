import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_moon_lantern: ComponentDef<ClawdApi> = {
name: 'pr_moon_lantern',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour crescent-moon lantern suspended from a short cord, with a warm pulsing halo, a few star flecks, a small hanging ring and a teal bead pendant below. Anchor is bottom centre, 200×300 px; suited to night scenes hung under eaves, branches or shop fronts.',
  tags: ['catalog', 'lantern', 'moon', 'night', 'hanging', 'decor', 'glow'],
  size: [200, 300],
  params: {
    glow: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the warm halo around the moon and the opacity of the star flecks; 0 leaves a flat, unlit lantern.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the swing and glow pulse, so multiple copies animate out of sync.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { glow = 1, phase = 0 } = params as { glow?: number; phase?: number };
    const { PAL } = api;
    const swing = Math.sin(t * 0.9 + phase) * 0.05;

    ctx.save();
    ctx.translate(0, -296);
    ctx.rotate(swing);
    ctx.translate(0, 296);

    // 吊线
    api.inkLine(ctx, api.shapes.line(0, -296, 0, -248, 1, 8, 3), 2, PAL.ink);

    // 月牙本体：外圆长弧 + 内圆凹弧，两个交点精确闭合
    const cx = 0;
    const cy = -176;
    const R = 60;
    const dx = 34;
    const ix = dx / 2;
    const iy = Math.sqrt(Math.max(1, R * R - ix * ix));
    const pts: P2[] = [];
    const aTop = Math.atan2(iy, ix);
    const aBot = Math.atan2(-iy, ix);
    for (let i = 0; i <= 30; i++) {
      const a = api.shapes.lerp(aTop, aBot + Math.PI * 2, i / 30);
      pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]);
    }
    const bBot = Math.atan2(-iy, ix - dx);
    const bTop = Math.atan2(iy, ix - dx);
    for (let i = 0; i <= 24; i++) {
      const a = api.shapes.lerp(bBot, bTop - Math.PI * 2, i / 24);
      pts.push([cx + dx + Math.cos(a) * R, cy + Math.sin(a) * R]);
    }

    const pulse = 0.8 + 0.2 * Math.sin(t * 1.7 + phase);
    api.glow(ctx, -10, cy, 150, '#f3d27a', 0.2 * glow * pulse);
    api.paint(ctx, pts, { wash: '#f7e3a6', sw: 3.4 });
    api.paint(ctx, api.shapes.ring(-24, cy - 8, 26, 34, 20, -0.2), { wash: '#fff6d4', sw: 0, washOp: 0.45 });

    // 挂环
    api.paint(ctx, api.shapes.ring(0, -240, 7, 7, 12), { wash: PAL.ochre, sw: 2.2 });

    // 小星屑
    for (let i = 0; i < 6; i++) {
      const a = i * 1.7 + phase;
      const x = 58 + Math.cos(a) * (22 + i * 6);
      const y = cy - 10 + Math.sin(a * 1.3) * (54 + i * 3);
      const s = 2 + 2.2 * (0.5 + 0.5 * Math.sin(t * 2 + i * 2.1));
      api.paint(ctx, [
        [x, y - s * 2],
        [x + s * 0.6, y],
        [x, y + s * 2],
        [x - s * 0.6, y],
      ], { wash: '#f3d27a', sw: 0, washOp: 0.22 + 0.25 * glow });
    }

    // 底部小坠子
    api.inkLine(ctx, api.shapes.line(4, -118, 4, -96, 0, 5, 9), 1.6, 'rgba(58,47,42,0.6)');
    api.paint(ctx, api.shapes.ring(0, -88, 8, 10, 14), { wash: PAL.teal, sw: 2.2 });
    ctx.restore();
  },
};
