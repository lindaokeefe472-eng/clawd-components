import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_open_book: ComponentDef<ClawdApi> = {
name: 'pr_open_book',
  style: 'clawd',
  kind: 'prop',
  description: 'An open watercolour book seen from a slight front angle, with two curved cream pages of wobbly ink text lines, a small green illustration panel, a brown spine and a rose bookmark ribbon, flanked by two upright books leaning behind it. It measures 420×230 px and anchors at the bottom centre, making it a good tabletop or desk prop for study, library and reading scenes.',
  tags: ['catalog', 'book', 'open', 'office', 'paper', 'decor', 'ground', 'handheld'],
  size: [420, 230],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the ribbon sway and page flutter between copies.' },
    page: { type: 'number', default: 0, min: 0, max: 1, description: 'Amount of page flutter; above 0.2 the right page corner lifts and waves, growing with the value.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, page = 0 } = params as { phase?: number; page?: number };
    const { PAL } = api;
    const lift = Math.sin(t * 1.2 + phase) * 2;

    api.paint(ctx, api.shapes.ring(0, -8, 196, 10, 22, 0, 0, 4), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 书页底部厚度（几层）
    for (let i = 0; i < 3; i++) {
      api.paint(ctx, api.shapes.poly([[-186, -24 + i * 4], [186, -24 + i * 4], [186, -14 + i * 4], [-186, -14 + i * 4]], 3), {
        wash: i === 0 ? '#d8cfba' : '#e8dcc0',
        sw: 1.2,
      });
    }

    // 左右两页（略带弧度）
    const pagePts = (dir: number) => {
      const pts: P2[] = [];
      for (let i = 0; i <= 6; i++) {
        const u = i / 6;
        pts.push([dir * u * 190, -196 + Math.sin(u * Math.PI) * 10]);
      }
      for (let i = 6; i >= 0; i--) {
        const u = i / 6;
        pts.push([dir * u * 188, -18 - u * 4]);
      }
      return pts;
    };
    api.paint(ctx, pagePts(-1), { wash: '#f6efdf', sw: 2.6 });
    api.paint(ctx, pagePts(1), { wash: '#f6efdf', sw: 2.6 });
    // 页面阴影（靠近书脊更深）
    api.paint(ctx, api.shapes.poly([[-40, -192], [0, -196], [0, -18], [-34, -22]], 4), { wash: PAL.clay, sw: 0, washOp: 0.16 });
    api.paint(ctx, api.shapes.poly([[40, -192], [0, -196], [0, -18], [34, -22]], 4), { wash: PAL.clay, sw: 0, washOp: 0.16 });

    // 文字行（左右各 6 行）
    for (let i = 0; i < 6; i++) {
      const y = -168 + i * 22;
      const wob = Math.sin(i + phase) * 1.2;
      api.inkLine(ctx, api.shapes.line(-166, y + wob, -28, y - 2 + wob, 0.8, 8, i + 2), 2.2, 'rgba(58,47,42,0.32)');
      api.inkLine(ctx, api.shapes.line(28, y - 2 + wob, 166, y + wob, 0.8, 8, i + 9), 2.2, 'rgba(58,47,42,0.32)');
    }
    // 右侧小插图框
    api.paint(ctx, api.shapes.poly([[110, -172], [172, -168], [170, -122], [108, -126]], 3), { wash: '#dfe8e4', sw: 1.8 });
    api.paint(ctx, api.shapes.poly([[114, -168], [168, -164], [166, -142], [112, -146]], 3), { wash: PAL.sap, sw: 0, washOp: 0.45 });

    // 书脊
    api.paint(ctx, api.shapes.poly([[-14, -196], [14, -196], [12, -18], [-12, -18]], 4), { wash: '#a97b4f', sw: 2.2 });
    api.inkLine(ctx, api.shapes.line(0, -194, 0, -20, 0, 6, 5), 1.4, 'rgba(58,47,42,0.35)');

    // 书签带
    const ribbon: P2[] = [[-56, -190], [-38, -190], [-40, -60 + lift], [-48, -72 + lift], [-56, -58 + lift]];
    api.paint(ctx, api.shapes.poly(ribbon, 3), { wash: PAL.rose, sw: 1.8 });

    // 后方立着的书
    api.paint(ctx, api.shapes.poly([[150, -22], [206, -26], [214, -150], [158, -146]], 3), { wash: PAL.teal, sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[158, -146], [214, -150], [214, -158], [158, -154]], 3), { wash: '#e8dcc0', sw: 1.4 });
    api.paint(ctx, api.shapes.poly([[-212, -22], [-158, -26], [-152, -134], [-206, -130]], 3), { wash: PAL.ochre, sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[-206, -130], [-152, -134], [-152, -142], [-206, -138]], 3), { wash: '#e8dcc0', sw: 1.4 });
    api.inkLine(ctx, api.shapes.line(162, -56, 208, -58, 0, 4, 4), 2.2, 'rgba(246,239,223,0.7)');
    api.inkLine(ctx, api.shapes.line(163, -44, 200, -46, 0, 4, 6), 1.6, 'rgba(246,239,223,0.45)');
    api.inkLine(ctx, api.shapes.line(-202, -52, -156, -54, 0, 4, 5), 2.2, 'rgba(255,246,230,0.75)');
    api.inkLine(ctx, api.shapes.line(-200, -40, -160, -42, 0, 4, 7), 1.6, 'rgba(255,246,230,0.5)');

    // 翻页微动（右页角轻轻掀起）
    if (page > 0.2) {
      const f = Math.sin(t * 1.6 + phase) * 6 * page;
      api.paint(ctx, api.shapes.poly([[168, -20], [186, -26], [176 - f * 0.4, -58 + f], [166, -44]], 3), { wash: '#ffffff', sw: 1.6, washOp: 0.85 });
    }
  },
};
