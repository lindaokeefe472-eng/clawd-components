import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_rubber_hand: ComponentDef<ClawdApi> = {
name: 'pr_rubber_hand',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour scene of the rubber-hand illusion: a pale rubber hand lies flat on a small table, a wooden divider hides a real hand peeking out behind it, and a brush sweeps back and forth over the fake hand with faint teal motion marks. Anchor is bottom centre, 300×210 px; useful for psychology-lab interiors, close-up inserts or classroom diagrams.',
  tags: ['catalog', 'psychology', 'rubber-hand', 'illusion', 'brush', 'table', 'prop', 'ground'],
  size: [300, 210],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the brush sweep and finger wobble, so several copies do not animate in sync.' },
    stroke: { type: 'number', default: 1, min: 0, max: 1, description: 'Stroke intensity: scales the brush\'s travel distance and the opacity of the teal motion trails (0 keeps the brush nearly still with no trails).' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, stroke = 1 } = params as { phase?: number; stroke?: number };
    const { PAL } = api;
    const brush = Math.sin(t * 1.6 + phase) * 34 * stroke;

    // 桌面
    api.paint(ctx, api.shapes.poly([[-150, 0], [150, 0], [140, -18], [-140, -18]], 3), { wash: '#d8c7a6', sw: 3 });
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-126, -6 - i * 4, 126, -6 - i * 4, 1, 10, i + 3), 1.1, 'rgba(120,90,55,0.2)');
    }

    // 隔板（挡住真手）
    api.paint(ctx, api.shapes.poly([[52, -18], [76, -18], [76, -168], [52, -168]], 3), { wash: '#cbb999', sw: 2.8 });
    api.paint(ctx, api.shapes.poly([[52, -168], [76, -168], [82, -158], [58, -158]], 3), { wash: '#beac8c', sw: 2.2 });
    // 真手从板后露出一点
    api.paint(ctx, api.shapes.round(78, -30, 96, -18, 6, 4), { wash: '#e8c3ab', sw: 2.2, washOp: 0.95 });
    api.inkLine(ctx, api.shapes.line(88, -26, 94, -22, 0, 3, 4), 1.2, 'rgba(150,100,80,0.45)');

    // 橡胶假手：掌在右，手指朝左摊平
    ctx.save();
    ctx.translate(-52, -34);
    for (let i = 0; i < 4; i++) {
      const y = -26 + i * 15;
      const len = 46 - Math.abs(i - 1.3) * 7;
      const wig = Math.sin(t * 1.1 + i * 1.4 + phase) * 1.2;
      api.paint(ctx, api.shapes.round(-len, y - 6 + wig, 8, y + 6 + wig, 6, 4), { wash: '#e8c3ab', sw: 2.6 });
    }
    api.paint(ctx, api.shapes.round(-12, -36, 34, 30, 13, 5), { wash: '#e8c3ab', sw: 3 });
    api.paint(ctx, api.shapes.round(16, 14, 44, 32, 8, 4), { wash: '#e8c3ab', sw: 2.4 });
    for (let i = 0; i < 4; i++) {
      const y = -26 + i * 15;
      api.inkLine(ctx, api.shapes.line(-26, y - 4, -18, y - 4, 0, 3, i + 2), 1.2, 'rgba(150,100,80,0.4)');
    }
    ctx.restore();

    // 刷子（横着来回刷假手的手背）
    ctx.save();
    ctx.translate(-72 + brush, -74);
    api.paint(ctx, api.shapes.poly([[-30, -9], [30, -9], [30, 7], [-30, 7]], 3), { wash: PAL.clay, sw: 2.6 });
    api.paint(ctx, api.shapes.poly([[-28, 7], [28, 7], [24, 18], [-24, 18]], 3), { wash: '#e6dcc4', sw: 2.2 });
    for (let i = 0; i < 9; i++) {
      api.inkLine(ctx, api.shapes.line(-22 + i * 5.5, 18, -23 + i * 5.5, 26, 0, 2, i + 3), 1.2, 'rgba(120,90,60,0.55)');
    }
    ctx.restore();

    // 刷动轨迹
    for (let i = 0; i < 3; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 3.2 + i * 1.6 + phase);
      api.inkLine(ctx, api.shapes.line(-118 + i * 34, -44, -96 + i * 34, -44, 1, 6, i + 4), 1.6, `rgba(79,156,152,${0.4 * k * stroke})`);
    }
  },
};
