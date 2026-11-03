import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_abacus: ComponentDef<ClawdApi> = {
name: 'pr_abacus',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wooden abacus with a rectangular frame, three horizontal rails and seven painted beads per rail, with beads drifting slightly as if being counted; anchor is bottom centre at 280×220 px. It suits a classroom, playroom or study desk as a small counting prop.',
  tags: ['catalog', 'abacus', 'counting', 'toy', 'wood', 'classroom', 'tabletop'],
  size: [280, 220],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians (default 0); desynchronises the bead-sliding animation between copies.' },
    calc: { type: 'number', default: 1, min: 0, max: 1, description: 'Calc amount (default 1); reserved in this component and currently has no visible effect.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, calc = 1 } = params as { phase?: number; calc?: number };
    const { PAL } = api;
    const cols = [PAL.clay, PAL.teal, PAL.ochre, PAL.rose, PAL.sap];

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 116, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 外框
    api.paint(ctx, api.shapes.poly([[-126, -190], [126, -190], [126, -18], [-126, -18]], 4), { wash: '#c9a978', sw: 3.6 });
    // 内凹
    api.paint(ctx, api.shapes.poly([[-110, -176], [110, -176], [110, -32], [-110, -32]], 4), { wash: '#e9dcc0', sw: 2.4 });

    // 横档
    for (let i = 0; i < 3; i++) {
      const y = -152 + i * 44;
      api.inkLine(ctx, api.shapes.line(-110, y, 110, y, 0.6, 10, i + 2), 2.4, 'rgba(120,85,45,0.55)');
    }

    // 算珠
    for (let r = 0; r < 3; r++) {
      const y = -152 + r * 44;
      for (let c = 0; c < 7; c++) {
        const slide = (Math.sin(t * 0.9 + r * 2.1 + c * 1.3 + phase) * 0.5 + 0.5) * 9;
        const x = -96 + c * 32 + slide;
        api.paint(ctx, api.shapes.ring(x, y - 12, 11, 8, 16, 0, 0.04, c + r * 3), { wash: cols[(c + r) % cols.length], sw: 2.2 });
        api.paint(ctx, api.shapes.ring(x - 3, y - 14, 4, 3, 8), { wash: PAL.paper, sw: 0, washOp: 0.4 });
      }
    }
    // 立杆
    for (let c = 0; c < 7; c++) {
      api.inkLine(ctx, api.shapes.line(-96 + c * 32, -176, -96 + c * 32, -32, 0, 4, c + 3), 1.2, 'rgba(120,85,45,0.3)');
    }
    // 支架脚
    api.inkLine(ctx, api.shapes.line(-96, -18, -108, -2, -1, 4, 4), 5, '#b08a63');
    api.inkLine(ctx, api.shapes.line(96, -18, 108, -2, 1, 4, 5), 5, '#b08a63');
    void calc;
  },
};
