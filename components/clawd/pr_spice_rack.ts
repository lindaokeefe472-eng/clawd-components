import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_spice_rack: ComponentDef<ClawdApi> = {
name: 'pr_spice_rack',
  style: 'clawd',
  kind: 'prop',
  description: 'A small wooden two-post spice rack with three shelf boards holding glass spice jars with metal pierced lids, a pepper mill, two short jars, a mortar and pestle, and a little lidded pot on top; all pieces sit on the shelf surfaces and sway slightly. It is 360×340 px with its anchor at the bottom centre, sized to stand on a kitchen counter or shelf as a background prop.',
  tags: ['catalog', 'kitchen', 'spice', 'shelf', 'container', 'wood', 'decor', 'ground'],
  size: [360, 340],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the gentle swaying animation, so several racks do not move in sync.' },
    jars: { type: 'number', default: 3, min: 0, max: 6, description: 'Number of glass spice jars on the lower shelf; values are clamped to 1–3 jars, spread evenly across the board.' },
    fill: { type: 'number', default: 0.7, min: 0, max: 1, description: 'How full the lower spice jars are, raising the coloured spice level inside each glass body.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, jars = 3, fill = 0.7 } = params as { phase?: number; jars?: number; fill?: number };
    const { PAL } = api;

    // 关键尺寸：所有物件都按"搁板上表面"对齐，避免穿模
    const shelfLow = -18;    // 下层搁板上表面
    const shelfHigh = -158;  // 上层搁板上表面
    const boardH = 14;
    const postX = 152;
    const topRail = -292;

    api.paint(ctx, api.shapes.ring(0, -10, 148, 10, 22, 0, 0, 5), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 后挡板
    api.paint(ctx, api.shapes.poly([[-postX + 8, shelfLow], [postX - 8, shelfLow], [postX - 8, topRail + 8], [-postX + 8, topRail + 8]], 4),
      { wash: '#d3a74f', sw: 0, washOp: 0.22 });

    // 两侧立柱
    for (let i = 0; i < 2; i++) {
      const x = i ? postX : -postX;
      api.paint(ctx, api.shapes.poly([[x - 9, shelfLow + boardH], [x + 9, shelfLow + boardH], [x + 9, topRail], [x - 9, topRail]], 3),
        { wash: '#8a6d4e', sw: 2.4 });
      api.inkLine(ctx, api.shapes.line(x - 4, shelfLow + 20, x - 4, topRail + 8, 0, 6, i + 3), 1.4, 'rgba(255,246,230,0.22)');
    }

    // 三块板（顶板 + 两层搁板）：先画板面，再画前沿，形成"板"的厚度
    const board = (y: number, wash: string) => {
      api.paint(ctx, api.shapes.poly([[-postX - 6, y], [postX + 6, y], [postX + 6, y - boardH], [-postX - 6, y - boardH]], 3),
        { wash, sw: 2.6 });
      // 上表面（受光）
      api.paint(ctx, api.shapes.poly([[-postX - 2, y - 2], [postX + 2, y - 2], [postX + 2, y - 7], [-postX - 2, y - 7]], 3),
        { wash: '#e8dcc0', sw: 0, washOp: 0.55 });
      // 前沿高光
      api.inkLine(ctx, api.shapes.line(-postX, y - 1, postX, y - 1, 0, 8, y), 1.6, 'rgba(255,246,230,0.4)');
    };
    board(topRail, '#a97b4f');
    board(shelfHigh, '#b98a5c');
    board(shelfLow, '#b98a5c');

    // ---------- 下层：三瓶调料（都站在 shelfLow 上）----------
    const spiceCols = [PAL.ochre, '#b8563f', PAL.sap];
    const jarN = Math.min(3, Math.max(1, Math.round(jars)));
    for (let i = 0; i < jarN; i++) {
      const x = -96 + i * 96;
      const h = 96 - i * 6;
      const baseY = shelfLow - 4;            // 瓶底恰好落在板面上
      const sway = Math.sin(t * 1.1 + i * 1.7 + phase) * 0.6;
      ctx.save();
      ctx.translate(x, baseY);
      ctx.rotate(sway * 0.004);
      // 瓶身（玻璃）
      api.paint(ctx, api.shapes.poly([[-24, 0], [24, 0], [26, -h], [-26, -h]], 4), { wash: '#e7eeea', sw: 2.4 });
      // 香料（高度受 fill 控制）
      const fh = h * (0.42 + 0.34 * api.shapes.clamp01(fill));
      api.paint(ctx, api.shapes.poly([[-23, -1], [23, -1], [24, -fh], [-24, -fh]], 4), { wash: spiceCols[i], sw: 0, washOp: 0.88 });
      api.paint(ctx, api.shapes.ring(0, -fh, 23, 5, 14), { wash: spiceCols[i], sw: 0, washOp: 0.6 });
      // 标签
      api.paint(ctx, api.shapes.poly([[-17, -h * 0.34], [17, -h * 0.34], [17, -h * 0.6], [-17, -h * 0.6]], 3), { wash: '#f6efdf', sw: 1.4 });
      api.inkLine(ctx, api.shapes.line(-10, -h * 0.44, 9, -h * 0.44, 0, 3, i + 3), 1.8, 'rgba(58,47,42,0.42)');
      api.inkLine(ctx, api.shapes.line(-10, -h * 0.53, 4, -h * 0.53, 0, 3, i + 6), 1.4, 'rgba(58,47,42,0.28)');
      // 瓶盖（带撒孔）
      api.paint(ctx, api.shapes.round(-27, -h - 18, 27, -h - 1, 4, 3), { wash: '#7f8a8e', sw: 2.2 });
      api.inkLine(ctx, api.shapes.line(-27, -h - 4, 27, -h - 4, 0, 4, i + 8), 1.4, 'rgba(58,47,42,0.35)');
      for (let s = 0; s < 3; s++) {
        api.paint(ctx, api.shapes.ring(-12 + s * 12, -h - 10, 2, 2, 6), { wash: '#3f464b', sw: 0 });
      }
      // 高光
      api.paint(ctx, api.shapes.poly([[-18, -6], [-10, -6], [-13, -h + 8], [-20, -h + 8]], 3), { wash: '#ffffff', sw: 0, washOp: 0.42 });
      ctx.restore();
    }


    // ---------- 上层：胡椒磨 + 两只矮瓶 ----------
    const millBase = shelfHigh - 4;
    api.paint(ctx, api.shapes.poly([[-2, millBase], [42, millBase], [36, millBase - 84], [4, millBase - 84]], 4), { wash: '#8a6d4e', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(20, millBase - 84, 16, 6, 14), { wash: '#6b7376', sw: 1.8 });
    api.paint(ctx, api.shapes.ring(20, millBase - 94, 5, 6, 8), { wash: '#b9b2a2', sw: 1.2 });
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(4, millBase - 22 - i * 20, 40, millBase - 24 - i * 20, 0, 3, i + 4), 1.2, 'rgba(255,246,230,0.3)');
    }
    for (let i = 0; i < 2; i++) {
      const x = -114 + i * 58;
      const h = 58 - i * 8;
      api.paint(ctx, api.shapes.poly([[x - 18, millBase], [x + 18, millBase], [x + 19, millBase - h], [x - 19, millBase - h]], 4),
        { wash: '#e7eeea', sw: 2.2 });
      api.paint(ctx, api.shapes.poly([[x - 17, millBase - 1], [x + 17, millBase - 1], [x + 18, millBase - h * 0.76], [x - 18, millBase - h * 0.76]], 4),
        { wash: i ? '#b8563f' : PAL.ochre, sw: 0, washOp: 0.85 });
      api.paint(ctx, api.shapes.round(x - 20, millBase - h - 12, x + 20, millBase - h, 3, 3), { wash: '#7f8a8e', sw: 2 });
      api.paint(ctx, api.shapes.poly([[x - 13, millBase - 6], [x - 7, millBase - 6], [x - 9, millBase - h + 6], [x - 15, millBase - h + 6]], 3),
        { wash: '#ffffff', sw: 0, washOp: 0.35 });
    }
    // ---------- 中层右侧：研钵 + 杵 ----------
    ctx.save();
    ctx.translate(102, 0);
    api.paint(ctx, api.shapes.poly([[-36, millBase], [36, millBase], [28, millBase - 34], [-28, millBase - 34]], 4), { wash: '#cfd6d4', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(0, millBase - 34, 28, 8.5, 18), { wash: '#b9c2c2', sw: 1.8 });
    api.paint(ctx, api.shapes.ring(0, millBase - 33, 22, 6.5, 16), { wash: PAL.rose, sw: 0, washOp: 0.6 });
    // 杵（斜插在钵里）
    ctx.save();
    ctx.translate(-2, millBase - 30);
    ctx.rotate(-0.34);
    api.paint(ctx, api.shapes.poly([[-4.5, 0], [4.5, 0], [3.6, -46], [-3.6, -46]], 3), { wash: '#e6d8bd', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(0, -49, 7.5, 7.5, 14), { wash: '#e6d8bd', sw: 2.2 });
    ctx.restore();
    ctx.restore();

    // 顶板上的小陶罐
    api.paint(ctx, api.shapes.poly([[-24, topRail - 4], [24, topRail - 4], [18, topRail - 40], [-18, topRail - 40]], 4), { wash: PAL.teal, sw: 2.4, washOp: 0.9 });
    api.paint(ctx, api.shapes.ring(0, topRail - 40, 18, 6, 14), { wash: '#6b7376', sw: 1.6 });
  },
};
