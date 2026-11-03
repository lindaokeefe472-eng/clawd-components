import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_desk_calendar: ComponentDef<ClawdApi> = {
name: 'pr_desk_calendar',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour desk calendar standing on a small triangular easel, with a spiral-bound page showing a teal month header, a 7×5 date grid, a rose ring marking the current day, and a small pencil leaning beside it. Anchor is bottom centre at 320×320 px, good for cluttering office desks, shop counters or study scenes.',
  tags: ['catalog', 'office', 'desk', 'calendar', 'stationery', 'paper', 'decor', 'prop'],
  size: [320, 320],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the gentle page sway and the day-marker pulse between copies.' },
    day: { type: 'number', default: 12, min: 0, max: 24, description: 'Which date cell is highlighted with the rose ring; values are rounded to the nearest day.' },
    flip: { type: 'number', default: 0, min: -1, max: 1, description: 'Amount of loose page showing at the right edge, animating as a small fluttering flip; 0 hides it.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, day = 12, flip = 0 } = params as { phase?: number; day?: number; flip?: number };
    const { PAL } = api;
    const page = Math.sin(t * 1.5 + phase) * 1.4;

    api.paint(ctx, api.shapes.ring(0, -8, 130, 10, 22, 0, 0, 5), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 三角支架
    api.paint(ctx, api.shapes.poly([[-140, -8], [140, -8], [126, -42], [-126, -42]], 3), { wash: '#8a6d4e', sw: 2.6 });
    api.paint(ctx, api.shapes.poly([[-118, -44], [118, -44], [104, -70], [-104, -70]], 3), { wash: '#a97b4f', sw: 2.2 });

    // 日历纸（微微翘起）
    ctx.save();
    ctx.translate(0, -70);
    ctx.rotate(page * 0.002);
    api.paint(ctx, api.shapes.poly([[-124, 0], [124, 0], [128, -226], [-128, -226]], 4), { wash: '#f6efdf', sw: 2.8 });
    // 月份头（深色条）
    api.paint(ctx, api.shapes.poly([[-128, -226], [128, -226], [124, -178], [-124, -178]], 3), { wash: PAL.teal, sw: 2.4 });
    // 月份文字条
    api.inkLine(ctx, api.shapes.line(-84, -208, -20, -208, 0, 5, 3), 5, 'rgba(246,239,223,0.85)');
    api.inkLine(ctx, api.shapes.line(14, -208, 78, -208, 0, 5, 4), 3, 'rgba(246,239,223,0.6)');

    // 网格线
    for (let i = 0; i <= 7; i++) {
      api.inkLine(ctx, api.shapes.line(-120 + i * 34, -172, -120 + i * 34, -20, 0, 6, i + 2), 1.2, 'rgba(58,47,42,0.18)');
    }
    for (let i = 0; i <= 5; i++) {
      api.inkLine(ctx, api.shapes.line(-120, -172 + i * 32, 118, -172 + i * 32, 0, 6, i + 12), 1.2, 'rgba(58,47,42,0.18)');
    }
    // 星期行
    for (let i = 0; i < 7; i++) {
      api.inkLine(ctx, api.shapes.line(-112 + i * 34, -166, -96 + i * 34, -166, 0, 3, i + 2), 2.4, 'rgba(58,47,42,0.5)');
    }
    // 日期格（5 行 × 7 列）
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 7; c++) {
        const n = r * 7 + c + 1;
        const x = -112 + c * 34;
        const y = -146 + r * 32;
        const hit = n === Math.round(day);
        if (hit) {
          api.paint(ctx, api.shapes.ring(x + 4, y + 6, 13, 12, 14), { wash: PAL.rose, sw: 0, washOp: 0.55 + 0.15 * Math.sin(t * 2 + phase) });
        }
        api.inkLine(ctx, api.shapes.line(x - 4, y + 2, x + 8, y + 2, 0, 3, n + 3), hit ? 2.6 : 2, hit ? 'rgba(58,47,42,0.65)' : 'rgba(58,47,42,0.28)');
        // 周末列加小点
        if (c === 0 || c === 6) {
          api.paint(ctx, api.shapes.ring(x + 4, y + 12, 1.8, 1.8, 6), { wash: PAL.clay, sw: 0, washOp: 0.6 });
        }
      }
    }
    // 螺旋装订
    for (let i = 0; i < 9; i++) {
      const x = -112 + i * 28;
      api.paint(ctx, api.shapes.ring(x, -228, 6, 5, 10), { wash: '#b9b2a2', sw: 1.4 });
      api.paint(ctx, api.shapes.ring(x, -228, 2.4, 2.4, 6), { wash: '#6b7376', sw: 0 });
    }
    // 翻页动画
    if (flip > 0.2) {
      const f = Math.sin(t * 2 + phase) * 8 * flip;
      api.paint(ctx, api.shapes.poly([[128, -226], [150, -222 + f], [146, -6 + f], [124, -2]], 3), { wash: '#ffffff', sw: 1.6, washOp: 0.8 });
    }
    ctx.restore();

    // 立着的小铅笔
    api.paint(ctx, api.shapes.poly([[136, -6], [150, -6], [146, -54], [138, -54]], 3), { wash: PAL.ochre, sw: 1.8 });
    api.paint(ctx, api.shapes.poly([[138, -54], [146, -54], [144, -66], [140, -66]], 3), { wash: '#e8dcc0', sw: 1.2 });
  },
};
