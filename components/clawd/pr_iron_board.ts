import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_iron_board: ComponentDef<ClawdApi> = {
name: 'pr_iron_board',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour ironing board with crossed X-shaped legs, a cloth-covered top, a laid-out shirt and a small iron that glides back and forth, with optional steam wisps. Anchor is bottom centre, 320×220 px, and it works as a domestic laundry prop in a room or utility scene.',
  tags: ['catalog', 'home', 'laundry', 'ironing-board', 'furniture', 'prop', 'ground', 'steam'],
  size: [320, 220],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the iron\'s glide and steam animation cycle; use different values to desynchronise copies.' },
    steam: { type: 'number', default: 1, min: 0, max: 2, description: 'Controls steam visibility; 0 hides the wisps, values above 0 show the animated steam.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, steam = 1 } = params as { phase?: number; steam?: number };
    const { PAL } = api;
    const glide = Math.sin(t * 1.1 + phase) * 16;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 138, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // X 型支架
    api.inkLine(ctx, api.shapes.line(-74, -92, 96, -8, 2, 10, 2), 6, '#b3ada0');
    api.inkLine(ctx, api.shapes.line(74, -92, -96, -8, -2, 10, 3), 6, '#b3ada0');
    api.inkLine(ctx, api.shapes.line(-74, -92, 96, -8, 2, 10, 2), 2, PAL.ink);
    api.inkLine(ctx, api.shapes.line(74, -92, -96, -8, -2, 10, 3), 2, PAL.ink);
    api.inkLine(ctx, api.shapes.line(-42, -52, 42, -52, 2, 8, 4), 3.4, '#b3ada0');
    api.paint(ctx, api.shapes.ring(0, -52, 5, 5, 10), { wash: PAL.ink, sw: 0, washOp: 0.4 });

    // 案板
    const board: P2[] = [[-142, -112], [142, -112], [128, -90], [-128, -90]];
    api.paint(ctx, api.shapes.poly(board, 4), { wash: '#e3ddd0', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-142, -116], [142, -116], [142, -110], [-142, -110]], 3), { wash: '#cfd8d4', sw: 2.6 });
    // 布套花纹
    for (let i = 0; i < 6; i++) {
      api.inkLine(ctx, api.shapes.line(-118 + i * 44, -104, -112 + i * 44, -94, 1, 4, i + 3), 1.4, 'rgba(79,156,152,0.4)');
    }

    // 待熨的衬衫
    api.paint(ctx, [[-96, -118], [-10, -122], [-6, -92], [-90, -90]], { wash: PAL.paper, sw: 2.4, washOp: 0.95 });
    api.inkLine(ctx, api.shapes.line(-56, -118, -50, -92, 1, 5, 4), 1.4, 'rgba(58,47,42,0.28)');

    // 熨斗
    ctx.save();
    ctx.translate(46 + glide * 0.4, -124);
    ctx.rotate(-0.04);
    api.paint(ctx, [[-52, 8], [52, 8], [40, -14], [-42, -14]], { wash: '#b8c6c8', sw: 3 });
    api.paint(ctx, api.shapes.round(-28, -40, 28, -12, 8), { wash: PAL.teal, sw: 2.8 });
    api.inkLine(ctx, api.shapes.arc(0, -40, 20, 12, Math.PI, Math.PI * 2, 12), 3.4, PAL.ink);
    api.paint(ctx, api.shapes.ring(-28, 6, 6, 4, 10), { wash: PAL.orange, sw: 0, washOp: 0.7 });
    ctx.restore();

    // 蒸汽
    if (steam > 0) {
      for (let i = 0; i < 3; i++) {
        const pts: P2[] = [];
        for (let k = 0; k <= 8; k++) {
          const u = k / 8;
          pts.push([20 + i * 26 + Math.sin(u * 4 - t * 2.6 + i * 1.5 + phase) * (4 + u * 9), -150 - u * 34]);
        }
        api.inkLine(ctx, pts, 2, `rgba(58,47,42,${0.2 - i * 0.04})`);
      }
    }
  },
};
