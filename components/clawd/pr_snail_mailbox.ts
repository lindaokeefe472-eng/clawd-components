import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_snail_mailbox: ComponentDef<ClawdApi> = {
name: 'pr_snail_mailbox',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour snail mailbox on a wooden post, with a domed pale-blue box, front door and handle, a small red flag, and a tiny snail perched on the side. Anchor is bottom centre at 230×280 px, suited to garden, cottage, or roadside scenes.',
  tags: ['catalog', 'outdoor', 'mailbox', 'snail', 'prop', 'ground', 'garden', 'watercolour'],
  size: [230, 280],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the idle sway and snail bob animation; use different values to desynchronise copies.' },
    flag: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls the red flag: 0 hides it, 1 shows it.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, flag = 1 } = params as { phase?: number; flag?: number };
    const { PAL } = api;
    const sway = Math.sin(t * 0.9 + phase) * 0.01;

    ctx.save();
    ctx.translate(0, -276);
    ctx.rotate(sway);
    ctx.translate(0, 276);

    // 木桩
    api.paint(ctx, api.shapes.round(-12, -150, 12, -6, 5), { wash: PAL.clay, sw: 3.2 });
    api.inkLine(ctx, api.shapes.line(-4, -140, -4, -16, 1, 8, 3), 1.1, 'rgba(90,60,45,0.3)');
    api.paint(ctx, api.shapes.ring(0, -4, 34, 8, 20), { wash: PAL.sap, sw: 0, washOp: 0.35 });

    // 箱体（半圆柱顶）
    const box: P2[] = [
      [-72, -250],
      [72, -250],
      [72, -168],
      [-72, -168],
    ];
    api.paint(ctx, box, { wash: '#d7e2e4', sw: 3.4 });
    const dome: P2[] = [];
    for (let i = 0; i <= 20; i++) {
      const a = Math.PI + (i / 20) * Math.PI;
      dome.push([Math.cos(a) * 72, -250 + Math.sin(a) * 30]);
    }
    api.paint(ctx, dome, { wash: '#cbd9dd', sw: 3.4 });
    // 正面门
    api.paint(ctx, api.shapes.round(-58, -240, 58, -176, 5), { wash: '#e6edee', sw: 2.6 });
    api.inkLine(ctx, api.shapes.line(-58, -204, 58, -204, 1, 8, 4), 1.6, 'rgba(58,47,42,0.3)');
    // 把手
    api.inkLine(ctx, api.shapes.arc(36, -206, 8, 8, -Math.PI * 0.5, Math.PI * 0.6, 10), 2.4, PAL.ink);

    // 信箱口装饰
    api.paint(ctx, api.shapes.round(-26, -232, 26, -222, 2), { wash: PAL.night, sw: 0, washOp: 0.25 });

    // 小红旗
    if (flag > 0) {
      const up = 0.5 + 0.5 * Math.sin(t * 1.5 + phase);
      api.inkLine(ctx, api.shapes.line(-72, -222, -72, -258, 0, 4, 2), 2.4, PAL.ink);
      api.paint(ctx, [[-72, -258 + up * 4], [-46, -252 + up * 6], [-72, -236 + up * 4]], { wash: PAL.rose, sw: 2 });
    }

    // 小蜗牛
    ctx.save();
    ctx.translate(52, -152 + Math.sin(t * 1.4 + phase) * 1.5);
    api.paint(ctx, api.shapes.ring(0, 0, 22, 16, 22, 0, 0.06, 6), { wash: '#e7d3a8', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(2, -4, 13, 11, 18), { wash: PAL.ochre, sw: 2.2 });
    api.inkLine(ctx, api.shapes.arc(2, -4, 8, 7, 0, Math.PI * 1.6, 14), 1.4, 'rgba(120,85,40,0.7)');
    api.inkLine(ctx, api.shapes.arc(2, -4, 4, 3.6, 0, Math.PI * 1.4, 10), 1.2, 'rgba(120,85,40,0.6)');
    // 头与触角
    api.paint(ctx, api.shapes.ring(20, 4, 9, 7, 12), { wash: '#e7d3a8', sw: 2 });
    api.inkLine(ctx, [[24, 0], [30, -10]], 1.6, PAL.ink);
    api.inkLine(ctx, [[20, -1], [22, -12]], 1.6, PAL.ink);
    api.paint(ctx, api.shapes.ring(30, -11, 2, 2, 6), { wash: PAL.ink, sw: 0 });
    api.paint(ctx, api.shapes.ring(22, -13, 2, 2, 6), { wash: PAL.ink, sw: 0 });
    ctx.restore();
    ctx.restore();
  },
};
