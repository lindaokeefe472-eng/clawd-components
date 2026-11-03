import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_alarm_clock: ComponentDef<ClawdApi> = {
name: 'pr_alarm_clock',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour twin-bell alarm clock with a round paper face, twelve tick marks, three hands, and a small base; when ringing it shakes and emits orange sound waves. It is 220×210 px with its anchor at bottom centre, suited to bedside, desk, or shelf props in a domestic scene.',
  tags: ['catalog', 'home', 'alarm-clock', 'clock', 'prop', 'tabletop', 'decor', 'watercolour'],
  size: [220, 210],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the animation timing in radians so multiple clocks tick and ring out of sync.' },
    ringing: { type: 'number', default: 0, min: 0, max: 1, description: 'Controls how strongly the clock shakes, the bells beat, and the ring waves appear; 0 is still and 1 is a full alarm.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, ringing = 0 } = params as { phase?: number; ringing?: number };
    const { PAL } = api;
    const shake = ringing > 0 ? Math.sin(t * 22 + phase) * ringing : 0;
    const cx = 0;
    const cy = -112;

    ctx.save();
    ctx.translate(shake * 0.6, 0);

    // 底座与支架
    api.inkLine(ctx, api.shapes.line(-56, -26, -44, -6, 1, 5, 2), 5, PAL.ink);
    api.inkLine(ctx, api.shapes.line(56, -26, 44, -6, 1, 5, 3), 5, PAL.ink);
    api.paint(ctx, api.shapes.round(-64, -18, 64, -6, 5), { wash: PAL.clay, sw: 2.8 });

    // 双铃
    for (let i = 0; i < 2; i++) {
      const bx = i ? 52 : -52;
      const beat = Math.sin(t * 26 + i * 2 + phase) * 3 * ringing;
      ctx.save();
      ctx.translate(bx, cy - 66);
      ctx.rotate(beat * 0.02);
      api.paint(ctx, api.shapes.arc(0, 6, 30, 24, Math.PI, Math.PI * 2, 18), { wash: PAL.ochre, sw: 3 });
      api.inkLine(ctx, api.shapes.line(0, 8, 0, 20, 0, 4, i + 4), 3, PAL.ink);
      ctx.restore();
    }
    // 铃锤
    api.inkLine(ctx, api.shapes.line(0, cy - 96, 0, cy - 78, 0, 4, 5), 3, PAL.ink);
    api.paint(ctx, api.shapes.ring(0, cy - 76, 5, 5, 10), { wash: PAL.ink, sw: 0 });

    // 表壳
    api.paint(ctx, api.shapes.ring(cx, cy, 76, 74, 40, 0, 0.012, 3), { wash: PAL.paper, sw: 3.8 });
    api.paint(ctx, api.shapes.ring(cx, cy, 66, 64, 36, 0, 0.01, 7), { wash: '#f3e7cd', sw: 2.4 });

    // 刻度
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const r0 = i % 3 === 0 ? 44 : 52;
      api.inkLine(ctx, [
        [cx + Math.cos(a) * r0, cy + Math.sin(a) * r0],
        [cx + Math.cos(a) * 58, cy + Math.sin(a) * 58],
      ], i % 3 === 0 ? 3 : 1.6, 'rgba(58,47,42,0.75)');
    }

    // 指针（时针慢、分针快、秒针飞快）
    const hA = -Math.PI / 2 + t * 0.12 + phase;
    const mA = -Math.PI / 2 + t * 0.9 + phase;
    const sA = -Math.PI / 2 + t * 3.4;
    api.inkLine(ctx, [[cx, cy], [cx + Math.cos(hA) * 34, cy + Math.sin(hA) * 34]], 4.4, PAL.ink);
    api.inkLine(ctx, [[cx, cy], [cx + Math.cos(mA) * 48, cy + Math.sin(mA) * 48]], 3, PAL.ink);
    api.inkLine(ctx, [[cx, cy], [cx + Math.cos(sA) * 54, cy + Math.sin(sA) * 54]], 1.6, PAL.orange);
    api.paint(ctx, api.shapes.ring(cx, cy, 6, 6, 12), { wash: PAL.orange, sw: 2 });

    // 玻璃高光
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx - 24, cy - 26, 20, 12, -0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 响铃波纹
    if (ringing > 0) {
      for (let i = 0; i < 3; i++) {
        const k = 0.4 + 0.6 * Math.abs(Math.sin(t * 4 + i * 1.3));
        api.inkLine(ctx, api.shapes.arc(cx + 84 + i * 12, cy - 70, 10 + i * 5, 8 + i * 4, -1.1, 1.1, 8), 2, `rgba(226,128,60,${0.5 * k})`);
      }
    }
    ctx.restore();
  },
};
