import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_parcel_box: ComponentDef<ClawdApi> = {
name: 'pr_parcel_box',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour cardboard parcel box seen from a slight top-down angle, with four flaps folded outward, crumpled packing filler and a small rose-coloured item visible inside, a tape strip down the front, a shipping label with barcode and two fragile marks. Anchor is bottom centre at 360×300 px; it works as a doorstep, porch or delivery-scene prop.',
  tags: ['catalog', 'parcel', 'box', 'cardboard', 'container', 'ground', 'decor'],
  size: [360, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the lid sway between copies of the box.' },
    open: { type: 'number', default: 1, min: 0, max: 1, description: 'How far the box is opened: 0 keeps it shut with no flaps or contents, 1 folds all four flaps out and reveals the filler and item inside.' },
    tape: { type: 'number', default: 1, min: 0, max: 1, description: 'Opacity and strength of the packing-tape strip running down the front of the box; 0 removes it.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, open = 1, tape = 1 } = params as { phase?: number; open?: number; tape?: number };
    const { PAL } = api;
    const lid = Math.sin(t * 1.2 + phase) * 1.1 * open;

    // 箱口是一个向前下倾斜的平面：后沿比前沿高
    const backY = -202;
    const frontY = -172;
    const backX = 126;
    const frontX = 160;
    const mouth: P2[] = [[-backX, backY], [backX, backY], [frontX, frontY], [-frontX, frontY]];

    api.paint(ctx, api.shapes.ring(0, -9, 156, 10, 22, 0, 0, 4), { wash: '#8b8172', sw: 0, washOp: 0.22 });

    // ---- 箱内：后壁 + 两侧内壁 + 底 ----
    api.paint(ctx, api.shapes.poly([[-backX, backY - 6], [backX, backY - 6], [backX - 8, backY + 30], [-backX + 8, backY + 30]], 3),
      { wash: '#7a5c3f', sw: 2, washOp: 1 });
    api.paint(ctx, api.shapes.poly([[-backX + 8, backY + 30], [backX - 8, backY + 30], [frontX - 26, frontY - 4], [-frontX + 26, frontY - 4]], 3),
      { wash: '#8f6f4c', sw: 0 });
    api.paint(ctx, api.shapes.poly([[-backX, backY], [-frontX, frontY], [-frontX + 16, frontY - 2], [-backX + 14, backY]], 3),
      { wash: '#6b4f34', sw: 0, washOp: 0.9 });
    api.paint(ctx, api.shapes.poly([[backX, backY], [frontX, frontY], [frontX - 16, frontY - 2], [backX - 14, backY]], 3),
      { wash: '#6b4f34', sw: 0, washOp: 0.9 });

    // ---- 填充物 + 里面的小物件（被箱口裁住）----
    if (open > 0.3) {
      ctx.save();
      api.shapes.clip(ctx, mouth);
      for (let i = 0; i < 9; i++) {
        const x = -128 + api.shapes.hash(i + 3) * 256;
        const y = backY + 16 + api.shapes.hash(i + 9) * 48;
        api.paint(ctx, api.shapes.ring(x, y, 9 + api.shapes.hash(i) * 7, 6 + api.shapes.hash(i + 1) * 4, 10, api.shapes.hash(i + 5) * 3, 0.16, i + 2),
          { wash: '#f4ead4', sw: 1.1, washOp: 0.95 });
      }
      api.paint(ctx, api.shapes.poly([[-46, backY + 34], [26, backY + 28], [34, backY + 66], [-40, backY + 72]], 3), { wash: PAL.rose, sw: 2, washOp: 0.92 });
      api.paint(ctx, api.shapes.poly([[-40, backY + 40], [22, backY + 34], [24, backY + 48], [-38, backY + 54]], 3), { wash: '#ffffff', sw: 0, washOp: 0.3 });
      ctx.restore();
    }

    // ---- 左右外翻的箱盖：从箱顶两侧折出去 ----
    if (open > 0.2) {
      ctx.save();
      ctx.translate(-backX + 10, backY - 2);
      ctx.rotate(0.58 + lid * 0.012);
      api.paint(ctx, api.shapes.poly([[0, 0], [0, -30], [-72, -30], [-72, 0]], 3), { wash: '#d3b98a', sw: 2.8 });
      api.inkLine(ctx, api.shapes.line(-12, -22, -60, -21, 2, 5, 3), 1.2, 'rgba(150,110,60,0.32)');
      api.paint(ctx, api.shapes.poly([[-2, 0], [-18, -4], [-18, -26], [-4, -30]], 3), { wash: '#b98a5c', sw: 0, washOp: 0.5 });
      ctx.restore();
      ctx.save();
      ctx.translate(backX - 10, backY - 2);
      ctx.rotate(-0.58 - lid * 0.012);
      api.paint(ctx, api.shapes.poly([[0, 0], [0, -30], [72, -30], [72, 0]], 3), { wash: '#d3b98a', sw: 2.8 });
      api.inkLine(ctx, api.shapes.line(12, -22, 60, -21, 2, 5, 4), 1.2, 'rgba(150,110,60,0.32)');
      api.paint(ctx, api.shapes.poly([[2, 0], [18, -4], [18, -26], [4, -30]], 3), { wash: '#b98a5c', sw: 0, washOp: 0.5 });
      ctx.restore();
    }

    // ---- 箱体正面 ----
    api.paint(ctx, api.shapes.poly([[-frontX, frontY], [frontX, frontY], [frontX - 6, -18], [-frontX + 6, -18]], 4), { wash: '#c79a6a', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-frontX + 4, frontY + 2], [frontX - 4, frontY + 2], [frontX - 4, frontY + 14], [-frontX + 4, frontY + 14]], 3),
      { wash: '#a97b4f', sw: 0, washOp: 0.45 });
    api.paint(ctx, api.shapes.poly([[frontX - 34, frontY], [frontX, frontY], [frontX - 6, -18], [frontX - 40, -18]], 3), { wash: PAL.night, sw: 0, washOp: 0.08 });
    ctx.save();
    api.shapes.clip(ctx, [[-frontX, frontY], [frontX, frontY], [frontX - 6, -18], [-frontX + 6, -18]]);
    for (let i = 0; i < 6; i++) {
      api.inkLine(ctx, api.shapes.line(-130 + i * 52, -40, -130 + i * 52, frontY + 8, 0, 5, i + 2), 1.4, 'rgba(150,110,60,0.24)');
    }
    ctx.restore();

    // ---- 前盖：沿前沿折下来，盖在箱体正面上部 ----
    if (open > 0.2) {
      api.paint(ctx, api.shapes.poly([[-frontX, frontY - 2], [frontX, frontY - 2], [frontX - 8, frontY + 26], [-frontX + 8, frontY + 26]], 4),
        { wash: '#d3b98a', sw: 2.8 });
      api.inkLine(ctx, api.shapes.line(-frontX + 22, frontY + 10, frontX - 22, frontY + 9, 3, 6, 5), 1.3, 'rgba(150,110,60,0.32)');
      api.paint(ctx, api.shapes.poly([[-frontX, frontY - 2], [frontX, frontY - 2], [frontX - 2, frontY + 6], [-frontX + 2, frontY + 6]], 3),
        { wash: '#8a6d4e', sw: 0, washOp: 0.25 });
    }

    // ---- 封箱胶带 ----
    if (tape > 0.2) {
      api.paint(ctx, api.shapes.poly([[-22, -18], [22, -18], [22, frontY + 24], [-22, frontY + 24]], 3), { wash: '#e2c98a', sw: 0, washOp: 0.55 * tape });
      api.inkLine(ctx, api.shapes.line(-22, -18, -22, frontY + 24, 0, 5, 5), 1.2, 'rgba(150,110,60,0.3)');
      api.inkLine(ctx, api.shapes.line(22, -18, 22, frontY + 24, 0, 5, 6), 1.2, 'rgba(150,110,60,0.3)');
    }

    // ---- 面单（带条码）----
    api.paint(ctx, api.shapes.round(-124, -146, 16, -58, 4, 3), { wash: '#f6efdf', sw: 2 });
    api.inkLine(ctx, api.shapes.line(-114, -134, -32, -134, 0, 4, 3), 2.6, 'rgba(58,47,42,0.5)');
    for (let i = 0; i < 8; i++) {
      api.inkLine(ctx, api.shapes.line(-114 + i * 12, -120, -114 + i * 12, -112 + (i % 3) * 4, 0, 2, i + 4), 1.4 + (i % 2) * 1.4, 'rgba(58,47,42,0.55)');
    }
    api.inkLine(ctx, api.shapes.line(-114, -98, -50, -98, 0, 4, 7), 1.8, 'rgba(58,47,42,0.3)');
    api.inkLine(ctx, api.shapes.line(-114, -86, -72, -86, 0, 4, 8), 1.8, 'rgba(58,47,42,0.3)');

    // ---- 易碎标记 ----
    for (let i = 0; i < 2; i++) {
      const cx = 68 + i * 30;
      api.inkLine(ctx, api.shapes.line(cx - 12, -70, cx, -96, 0, 4, i + 5), 2, 'rgba(180,90,60,0.7)');
      api.inkLine(ctx, api.shapes.line(cx, -96, cx + 12, -70, 0, 4, i + 9), 2, 'rgba(180,90,60,0.7)');
      api.inkLine(ctx, api.shapes.line(cx - 8, -80, cx + 8, -80, 0, 3, i + 11), 1.6, 'rgba(180,90,60,0.5)');
    }
  },
};
