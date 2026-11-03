import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_sandcastle: ComponentDef<ClawdApi> = {
name: 'pr_sandcastle',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour sandcastle with a central keep and two flanking towers topped by crenellations, an arched gate, a small shell and pebbles at its base, and a thin pole with a flapping orange pennant. It measures 300×190 px with its anchor at the bottom centre, and suits beach, seaside or children\'s-play scenes on the ground.',
  tags: ['catalog', 'beach', 'sandcastle', 'sand', 'prop', 'ground', 'play', 'decor'],
  size: [300, 190],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the flag flutter and drifting sand-grain animation, used to desynchronise multiple copies.' },
    flag: { type: 'number', default: 1, min: 0, max: 1, description: 'Visibility/strength of the pennant on top of the keep; 0 removes the flag and pole, 1 shows the full fluttering flag.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, flag = 1 } = params as { phase?: number; flag?: number };
    const { PAL } = api;
    const sand = '#e8cfa0';

    // 沙滩基底
    api.paint(ctx, api.shapes.ring(0, -14, 136, 20, 34, 0, 0.04, 3), { wash: sand, sw: 2.6 });

    // 城墙
    api.paint(ctx, api.shapes.round(-96, -70, 96, -14, 4), { wash: sand, sw: 3.2 });
    // 中央塔
    api.paint(ctx, api.shapes.round(-44, -134, 44, -32, 4), { wash: '#eed7ab', sw: 3.2 });
    // 两侧小塔
    api.paint(ctx, api.shapes.round(-104, -110, -56, -40, 3), { wash: '#e3c894', sw: 2.8 });
    api.paint(ctx, api.shapes.round(56, -110, 104, -40, 3), { wash: '#e3c894', sw: 2.8 });

    // 城垛
    const crenel = (x0: number, y: number, n: number, bw: number) => {
      for (let i = 0; i < n; i++) {
        api.paint(ctx, api.shapes.round(x0 + i * bw * 1.9, y - 16, x0 + i * bw * 1.9 + bw, y, 2), { wash: '#eed7ab', sw: 2.4 });
      }
    };
    crenel(-44, -134, 3, 22);
    crenel(-104, -110, 2, 18);
    crenel(56, -110, 2, 18);
    crenel(-96, -70, 4, 22);

    // 城门
    api.paint(ctx, api.shapes.arc(0, -32, 18, 22, Math.PI, Math.PI * 2, 14), { wash: '#b98f63', sw: 2.4 });
    api.paint(ctx, api.shapes.round(-18, -32, 18, -14, 2), { wash: '#b98f63', sw: 2.2 });

    // 沙纹与贝壳
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-86 + i * 12, -54 + i * 8, -44 + i * 4, -52 + i * 8, 1, 6, i + 3), 1.2, 'rgba(150,115,70,0.3)');
    }
    api.paint(ctx, api.shapes.ring(74, -22, 10, 7, 12), { wash: PAL.rose, sw: 1.6, washOp: 0.9 });
    api.inkLine(ctx, api.shapes.line(70, -22, 78, -24, 0, 4, 5), 1, 'rgba(58,47,42,0.3)');
    api.paint(ctx, api.shapes.ring(-118, -18, 8, 6, 10), { wash: PAL.paper, sw: 1.4 });

    // 塔顶小旗
    if (flag > 0) {
      const f = 0.5 + 0.5 * Math.sin(t * 2.2 + phase);
      api.inkLine(ctx, api.shapes.line(0, -150, 0, -176 + Math.sin(t * 1.4 + phase) * 1.5, 0, 5, 4), 2.2, PAL.clay);
      api.paint(ctx, [[2, -174], [36, -166 + f * 5], [2, -156]], { wash: PAL.orange, sw: 2 });
    }

    // 飘散沙粒
    for (let i = 0; i < 4; i++) {
      const y = -30 - i * 16 + Math.sin(t * 1.8 + i * 1.4 + phase) * 4;
      api.paint(ctx, api.shapes.ring(108 + i * 8, y, 2, 2, 6), { wash: sand, sw: 0, washOp: 0.7 });
    }
  },
};
