import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_bread_loaf: ComponentDef<ClawdApi> = {
name: 'pr_bread_loaf',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour rustic bread loaf with a browned scored top, pale air holes on its side, a rose cloth draped at its base, a leaning cut slice on the right and a few scattered crumbs. Anchor is bottom centre, 314×160 px, sized for a bakery counter, breakfast table or picnic still life.',
  tags: ['catalog', 'bread', 'loaf', 'food', 'tabletop', 'prop', 'still-life'],
  size: [314, 160],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the gentle breathing sway of the cut slice, so copies desynchronise.' },
    slices: { type: 'number', default: 1, min: 0, max: 12, description: 'Number of cut slices; 0 hides the leaning slice and leaves only the whole loaf.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, slices = 1 } = params as { phase?: number; slices?: number };
    const { PAL } = api;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 112, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 切片（右侧露出一片，带轻微呼吸）
    if (slices > 0) {
      const lean = Math.sin(t * 1.1 + phase) * 2;
      ctx.save();
      ctx.translate(96 + lean, -8);
      ctx.rotate(0.06);
      api.paint(ctx, [[-14, 0], [-14, -86], [10, -96], [16, -60], [16, 0]], { wash: '#f0dcb4', sw: 2.6 });
      api.paint(ctx, [[-8, -8], [-8, -78], [8, -86], [10, -20]], { wash: '#fbf1da', sw: 0, washOp: 0.8 });
      ctx.restore();
    }

    // 面包主体
    const loaf: P2[] = [
      [-92, -6],
      [-88, -62],
      [-56, -94],
      [0, -102],
      [56, -94],
      [86, -60],
      [92, -6],
    ];
    api.paint(ctx, loaf, { wash: '#c9905a', sw: 3.6 });
    // 顶部焦色
    api.paint(ctx, [[-84, -66], [-52, -95], [0, -102], [54, -94], [82, -66], [58, -58], [0, -66], [-58, -58]], {
      wash: '#a9703f',
      sw: 0,
      washOp: 0.6,
    });
    // 划痕
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-52 + i * 34, -84, -38 + i * 34, -68, 2, 6, i + 3), 2, 'rgba(90,50,25,0.45)');
    }
    // 侧面气孔
    for (let i = 0; i < 5; i++) {
      const x = -66 + i * 30 + api.shapes.jit(i, 8);
      const y = -34 - Math.abs(api.shapes.jit(i + 2, 16));
      api.paint(ctx, api.shapes.ring(x, y, 5, 3.4, 8, 0.4, 0.1, i + 4), { wash: '#f7e6c4', sw: 0, washOp: 0.6 });
    }
    // 布巾
    api.paint(ctx, [[-92, -14], [-40, -18], [-34, -4], [-88, -2]], { wash: PAL.rose, sw: 2.4, washOp: 0.9 });
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-84 + i * 16, -16, -80 + i * 16, -4, 0, 3, i + 2), 1.2, 'rgba(255,255,255,0.5)');
    }

    // 面包屑
    for (let i = 0; i < 5; i++) {
      const x = 74 + i * 20 + api.shapes.jit(i, 8);
      api.paint(ctx, api.shapes.ring(x, -3, 2.6, 1.8, 6), { wash: '#c9a878', sw: 0, washOp: 0.7 });
    }
  },
};
