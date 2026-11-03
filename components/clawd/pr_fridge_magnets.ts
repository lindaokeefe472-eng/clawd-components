import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_fridge_magnets: ComponentDef<ClawdApi> = {
name: 'pr_fridge_magnets',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour fridge-door panel with a brushed-steel finish, handle and edge trim, scattered round, heart, square and clip magnets, a tilted shopping list and a small photo held by a pin, plus a memo strip near the bottom. Anchor is bottom centre at 340×350 px, sized to sit against a kitchen wall or as an upright appliance prop in a room scene.',
  tags: ['catalog', 'kitchen', 'fridge', 'magnets', 'wall', 'decor', 'paper'],
  size: [340, 350],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the gentle paper flutter between copies.' },
    notes: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of pinned paper: at 0 the list and photo are hidden, above 0.1 they fade in fully.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, notes = 1 } = params as { phase?: number; notes?: number };
    const { PAL } = api;
    const flap = Math.sin(t * 1.4 + phase) * 2;

    // 冰箱门板（局部）
    api.paint(ctx, api.shapes.poly([[-170, -348], [170, -348], [170, -6], [-170, -6]], 4), { wash: '#e7eeea', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-170, -348], [170, -348], [170, -330], [-170, -330]], 3), { wash: '#cfd6d4', sw: 0, washOp: 0.7 });
    // 拉丝金属纹理
    for (let i = 0; i < 12; i++) {
      api.inkLine(ctx, api.shapes.line(-166 + i * 28, -340, -166 + i * 28, -14, 0, 5, i + 2), 1, 'rgba(140,160,158,0.14)');
    }
    // 门边与把手
    api.paint(ctx, api.shapes.poly([[150, -300], [170, -300], [170, -40], [150, -40]], 3), { wash: '#cfd6d4', sw: 2 });
    api.paint(ctx, api.shapes.round(136, -268, 148, -96, 6, 4), { wash: '#9aa3a5', sw: 1.8 });

    // 磁贴 1：圆形计时器（带指针）
    api.paint(ctx, api.shapes.ring(-96, -250, 34, 34, 22), { wash: PAL.rose, sw: 2.6 });
    api.paint(ctx, api.shapes.ring(-96, -250, 24, 24, 20), { wash: '#f6efdf', sw: 1.8 });
    api.inkLine(ctx, api.shapes.line(-96, -250, -96, -266, 0, 3, 3), 2.4, PAL.ink);
    api.inkLine(ctx, api.shapes.line(-96, -250, -82, -244, 0, 3, 4), 2.4, PAL.ink);
    // 磁贴 2：心形
    api.paint(ctx, api.shapes.ring(6, -286, 22, 22, 18, 0.3), { wash: PAL.ochre, sw: 2.2 });
    api.paint(ctx, api.shapes.ring(6, -276, 12, 12, 12), { wash: '#fff6ea', sw: 0, washOp: 0.6 });
    // 磁贴 3：方形字母块
    api.paint(ctx, api.shapes.round(64, -256, 120, -204, 6, 4), { wash: PAL.teal, sw: 2.4 });
    api.inkLine(ctx, api.shapes.line(74, -228, 110, -228, 0, 4, 4), 3.4, 'rgba(246,239,223,0.85)');
    // 磁贴 4：小夹子
    api.paint(ctx, api.shapes.round(-142, -140, -108, -104, 5, 4), { wash: PAL.sap, sw: 2.2 });

    // 便签 / 照片 / 购物清单
    if (notes > 0.1) {
      ctx.save();
      ctx.translate(28, -150);
      ctx.rotate(0.05 + flap * 0.002);
      api.paint(ctx, api.shapes.poly([[-72, 0], [72, 0], [72, 96], [-72, 96]], 3), { wash: '#f4e08a', sw: 2 });
      for (let i = 0; i < 4; i++) {
        api.inkLine(ctx, api.shapes.line(-58, 20 + i * 18, 58 - api.shapes.hash(i + 5) * 24, 20 + i * 18, 0, 5, i + 3), 2, 'rgba(58,47,42,0.35)');
      }
      // 磁钉
      api.paint(ctx, api.shapes.ring(0, 6, 9, 9, 12), { wash: PAL.rose, sw: 1.6 });
      ctx.restore();

      // 照片
      ctx.save();
      ctx.translate(-104, -132);
      ctx.rotate(-0.09);
      api.paint(ctx, api.shapes.poly([[-50, 0], [50, 0], [50, 66], [-50, 66]], 3), { wash: '#ffffff', sw: 2 });
      api.paint(ctx, api.shapes.poly([[-42, 8], [42, 8], [42, 52], [-42, 52]], 3), { wash: PAL.sky, sw: 0, washOp: 0.8 });
      api.paint(ctx, api.shapes.poly([[-42, 52], [-12, 26], [12, 44], [42, 20], [42, 52]], 3), { wash: PAL.sap, sw: 0, washOp: 0.7 });
      api.paint(ctx, api.shapes.ring(20, 26, 8, 8, 12), { wash: PAL.ochre, sw: 0, washOp: 0.9 });
      ctx.restore();
    }
    // 底部磁贴与备忘条
    api.paint(ctx, api.shapes.poly([[-140, -22], [96, -26], [96, -64], [-140, -60]], 3), { wash: '#ffffff', sw: 1.8, washOp: 0.9 });
    for (let i = 0; i < 2; i++) {
      api.inkLine(ctx, api.shapes.line(-124, -38 - i * 12, 20, -40 - i * 12, 0, 5, i + 6), 2, 'rgba(58,47,42,0.3)');
    }
    api.paint(ctx, api.shapes.ring(-152, -42, 8, 8, 12), { wash: PAL.teal, sw: 1.4 });
  },
};
