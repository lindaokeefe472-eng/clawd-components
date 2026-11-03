import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_rail_track: ComponentDef<ClawdApi> = {
name: 'pr_rail_track',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour railway track receding in perspective, with two steel rails, wooden sleepers that crowd toward the horizon, gravel ballast, and a faint tunnel mouth with a small green signal light at the vanishing point. Anchored at the bottom centre, 520×240 px, it works as a ground-level prop for platforms, countryside or tunnel-mouth scenes.',
  tags: ['catalog', 'traffic', 'rail', 'track', 'ground', 'prop', 'vehicle', 'watercolour'],
  size: [520, 240],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the timing of the gravel rattle so several copies of the track do not shake in unison.' },
    rattle: { type: 'number', default: 0.4, min: 0, max: 1, description: 'Amount of side-to-side jitter on the foreground gravel stones; 0 is still, 1 is a lively tremble.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, rattle = 0.4 } = params as { phase?: number; rattle?: number };
    const { PAL } = api;
    const shake = Math.sin(t * 9 + phase) * 1.1 * rattle;

    // 透视参数
    const vpY = -206;
    const nearL = -168;
    const nearR = 168;
    const farL = -78;
    const farR = 78;
    const railY = -10;

    // 近景道砟
    api.paint(ctx, api.shapes.poly([[-250, railY], [250, railY], [210, vpY + 26], [-210, vpY + 26]], 4), { wash: '#c8bfae', sw: 0, washOp: 0.55 });
    // 远处地面 / 天际
    api.paint(ctx, api.shapes.poly([[-260, vpY + 26], [260, vpY + 26], [260, vpY - 14], [-260, vpY - 14]], 3), { wash: '#dfd8c6', sw: 0, washOp: 0.6 });

    // 枕木（远密近疏）
    const sleepers = 11;
    for (let i = sleepers - 1; i >= 0; i--) {
      const u = i / (sleepers - 1);
      const y = railY - 4 - Math.pow(u, 0.85) * 178;
      const halfW = api.shapes.lerp(192, 88, u);
      const th = api.shapes.lerp(16, 3.4, u);
      api.paint(ctx, api.shapes.poly([[-halfW, y - th], [halfW, y - th], [halfW, y], [-halfW, y]], 3), {
        wash: i % 2 ? '#8a6d4e' : '#7a5f44',
        sw: api.shapes.lerp(2, 0.7, u),
        washOp: 0.95,
      });
    }

    // 钢轨：粗带 + 亮部高光 + 内侧阴影
    const rail = (nearX: number, farX: number) => {
      const wn = 13;
      const wf = 5.4;
      api.paint(
        ctx,
        api.shapes.poly([[nearX - wn, railY - 2], [nearX + wn, railY - 2], [farX + wf, vpY + 20], [farX - wf, vpY + 20]], 4),
        { wash: '#8b949a', sw: 1.8 }
      );
      api.inkLine(ctx, api.shapes.line(nearX - wn * 0.45, railY - 3, farX - wf * 0.45, vpY + 21, 0, 8, 3), 3, 'rgba(246,239,223,0.6)');
      api.inkLine(ctx, api.shapes.line(nearX + wn * 0.7, railY - 3, farX + wf * 0.7, vpY + 21, 0, 8, 5), 1.6, 'rgba(58,47,42,0.28)');
    };
    rail(nearL, farL);
    rail(nearR, farR);

    // 扣件
    for (let i = 0; i < 8; i++) {
      const u = (i + 0.5) / 8;
      const y = railY - 8 - Math.pow(u, 0.85) * 172;
      const hx = api.shapes.lerp(nearR, farR, u);
      for (let s = 0; s < 2; s++) {
        api.paint(ctx, api.shapes.ring(s ? hx : -hx, y, api.shapes.lerp(5, 1.8, u), api.shapes.lerp(3.4, 1.2, u), 8), { wash: '#6b7376', sw: 0.7, washOp: 0.85 });
      }
    }

    // 远端：隧道口轮廓 + 信号灯
    api.paint(ctx, api.shapes.arc(0, vpY + 30, 96, 62, Math.PI, Math.PI * 2, 16), { wash: '#6d6560', sw: 0, washOp: 0.22 });
    api.paint(ctx, api.shapes.ring(60, vpY + 50, 5, 5, 10), { wash: PAL.sap, sw: 1, washOp: 0.85 });
    api.glow(ctx, 60, vpY + 50, 26, PAL.sap, 0.18);

    // 近景碎石
    for (let i = 0; i < 14; i++) {
      const x = -224 + i * 34 + api.shapes.jit(i, 7);
      const y = railY - 2 - api.shapes.hash(i + 5) * 7;
      api.paint(ctx, api.shapes.ring(x + shake * (i % 3), y, 3 + api.shapes.hash(i) * 3, 2 + api.shapes.hash(i + 1) * 2, 7), { wash: '#a79c88', sw: 0, washOp: 0.5 });
    }
  },
};
