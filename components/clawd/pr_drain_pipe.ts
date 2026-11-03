import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_drain_pipe: ComponentDef<ClawdApi> = {
name: 'pr_drain_pipe',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour exterior drain pipe with a top hopper, clamped vertical downpipe, bottom elbow spout, animated trickle and puddle, wall stains, moss and optional climbing ivy. Anchor is bottom centre, 170×420 px, and it is good for building facades, alleys and courtyard walls.',
  tags: ['catalog', 'facade', 'drain-pipe', 'pipe', 'wall', 'exterior', 'water', 'ivy'],
  size: [170, 420],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the water and ivy animation; use different values to desynchronise repeated pipes.' },
    flow: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of animated water at the spout: 0 is dry, 1 is a full trickle with puddle.' },
    ivy: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of climbing ivy: 0 removes the vine, 1 gives full vine and leaves.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, flow = 1, ivy = 1 } = params as { phase?: number; flow?: number; ivy?: number };
    const { PAL } = api;

    // 墙面
    api.paint(ctx, api.shapes.poly([[-85, -420], [85, -420], [85, 0], [-85, 0]], 5), { wash: '#d9d0bc', sw: 0, washOp: 0.42 });
    for (let i = 0; i < 5; i++) {
      api.inkLine(ctx, api.shapes.line(-85, -50 - i * 78, 85, -50 - i * 78, 0.5, 10, i + 2), 1, 'rgba(58,47,42,0.08)');
    }

    // 顶部集水斗
    api.paint(ctx, api.shapes.poly([[-40, -412], [40, -412], [28, -376], [-28, -376]], 5), { wash: '#8f9b99', sw: 2.8 });
    api.paint(ctx, api.shapes.ring(0, -412, 40, 9, 20), { wash: '#a3aeac', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(0, -410, 30, 6, 16), { wash: '#6b7376', sw: 0, washOp: 0.5 });

    // 立管：整根 + 两处接头
    api.paint(ctx, api.shapes.poly([[-20, -376], [20, -376], [20, -34], [-20, -34]], 6), { wash: '#9aa3a5', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-14, -368], [-4, -368], [-6, -40], [-16, -40]], 5), { wash: '#c6cfd1', sw: 0, washOp: 0.7 });
    for (let i = 0; i < 2; i++) {
      const y = -258 + i * 118;
      api.paint(ctx, api.shapes.poly([[-26, y], [26, y], [26, y + 18], [-26, y + 18]], 4), { wash: '#7f8a8e', sw: 2.4 });
    }
    // 固定卡箍
    for (let i = 0; i < 3; i++) {
      const y = -326 + i * 118;
      api.paint(ctx, api.shapes.round(-30, y - 8, 30, y + 8, 3), { wash: '#6b7376', sw: 1.8 });
      api.paint(ctx, api.shapes.ring(-30, y, 5, 5, 8), { wash: '#8f9b99', sw: 1 });
    }

    // 底部弯头 + 出水口
    api.paint(ctx, api.shapes.ring(0, -34, 20, 14, 18), { wash: '#9aa3a5', sw: 3 });
    api.paint(ctx, api.shapes.poly([[14, -40], [52, -40], [52, -18], [14, -18]], 5), { wash: '#9aa3a5', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(52, -29, 6, 11, 12), { wash: '#6b7376', sw: 2 });

    // 流水
    if (flow > 0) {
      for (let i = 0; i < 2; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 3 + i * 2 + phase);
        api.inkLine(ctx, api.shapes.line(54, -20, 54, -20 + 12 + k * 10, 0, 3, i + 2), 2.6, `rgba(79,156,152,${0.42 + 0.3 * k})`);
        api.paint(ctx, api.shapes.ring(58, -8 - k * 6, 3, 4.4, 8), { wash: PAL.sky, sw: 0, washOp: 0.6 * flow });
      }
      api.paint(ctx, api.shapes.ring(60, -4, 18, 4, 12, 0, 0.1, 5), { wash: PAL.sky, sw: 0, washOp: 0.28 * flow });
    }

    // 墙上的水渍与青苔
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-34 - i * 10, -120 - i * 60, -32 - i * 10, -60 - i * 60, 1, 6, i + 4), 1.6, 'rgba(90,110,90,0.2)');
    }
    api.paint(ctx, api.shapes.ring(-38, -26, 22, 12, 14, 0, 0.18, 6), { wash: PAL.sap, sw: 0, washOp: 0.3 });

    // 爬藤
    if (ivy > 0) {
      const vine: P2[] = [];
      for (let i = 0; i <= 18; i++) {
        const u = i / 18;
        vine.push([26 + Math.sin(u * 6 + phase) * 12 * ivy, -370 + u * 330]);
      }
      api.inkLine(ctx, vine, 2.2, 'rgba(90,130,70,0.7)');
      for (let i = 0; i < 8; i++) {
        const u = (i + 0.5) / 8;
        const x = 26 + Math.sin(u * 6 + phase) * 12 * ivy;
        const y = -370 + u * 330;
        const s = Math.sin(t * 1.2 + i) * 1.4;
        api.paint(ctx, api.shapes.ring(x + 11 * (i % 2 ? 1 : -1), y + s, 10, 5.4, 10, (i % 2 ? 0.35 : -0.35), 0.1, i + 3), {
          wash: PAL.sap,
          sw: 1.4,
          washOp: 0.9 * ivy,
        });
      }
    }
  },
};
