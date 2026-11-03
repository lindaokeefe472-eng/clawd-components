import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_folder: ComponentDef<ClawdApi> = {
name: 'pr_folder',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour manila folder with a tab label, three sheets of paper rising out of the top, a pink elastic band across the front, a small yellow sticky note and a folded corner; anchored at the bottom centre at 340×270 px. Useful as a desk or shelf prop in office, study or paperwork scenes.',
  tags: ['catalog', 'office', 'folder', 'paper', 'stationery', 'desk', 'ground', 'prop'],
  size: [340, 270],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises copies; it shifts the gentle bobbing of the top sheet so repeated folders do not move in unison.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0 } = params as { phase?: number };
    const lift = Math.sin(t * 1.1 + phase) * 1.6;

    api.paint(ctx, api.shapes.ring(0, -8, 146, 10, 22, 0, 0, 6), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 夹在里面的纸（露出上半截）
    for (let i = 0; i < 3; i++) {
      const dx = (i - 1) * 5;
      const top = -244 + i * 5 + (i === 2 ? lift : 0);
      api.paint(ctx, api.shapes.poly([[-128 + dx, top], [116 - dx, top - 4], [118 - dx, -40], [-126 + dx, -36]], 3), {
        wash: i === 2 ? '#ffffff' : '#f2ece0',
        sw: 1.8,
      });
    }
    // 纸张文字
    for (let i = 0; i < 5; i++) {
      api.inkLine(ctx, api.shapes.line(-108, -206 + i * 18, 26 + api.shapes.hash(i + 4) * 60, -208 + i * 18, 0, 6, i + 2), 1.8, 'rgba(58,47,42,0.26)');
    }

    // 文件夹后片（带顶部标签）
    api.paint(ctx, api.shapes.poly([[-152, -44], [152, -40], [152, -226], [34, -232], [20, -246], [-150, -242]], 4), { wash: '#c99f66', sw: 3 });
    // 标签牌
    api.paint(ctx, api.shapes.poly([[-42, -246], [16, -242], [14, -258], [-40, -262]], 3), { wash: '#f2e8d2', sw: 1.8 });
    api.inkLine(ctx, api.shapes.line(-32, -252, 4, -250, 0, 4, 3), 2, 'rgba(58,47,42,0.4)');

    // 前片（略低、略窄，留出层次）
    api.paint(ctx, api.shapes.poly([[-158, -34], [158, -30], [158, -160], [-158, -166]], 4), { wash: '#d9b070', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-158, -160], [158, -152], [158, -160], [-158, -168]], 3), { wash: '#a8802f', sw: 0, washOp: 0.32 });
    // 前片右下角折起
    api.paint(ctx, api.shapes.poly([[158, -30], [158, -66], [120, -32]], 3), { wash: '#f2e8d2', sw: 1.6, washOp: 0.9 });
    // 布纹 / 边缘
    api.inkLine(ctx, api.shapes.line(-150, -46, 150, -42, 0, 8, 4), 1.2, 'rgba(255,246,230,0.35)');

    // 橡皮筋
    ctx.save();
    ctx.rotate(0.015);
    api.inkLine(ctx, api.shapes.line(-140, -112, 146, -108, 2, 6, 4), 3.6, 'rgba(224,163,160,0.9)');
    api.inkLine(ctx, api.shapes.line(-140, -104, 146, -100, 1, 6, 5), 1.6, 'rgba(255,246,230,0.45)');
    ctx.restore();

    // 别在前片上的便签
    api.paint(ctx, api.shapes.poly([[-84, -188], [4, -198], [12, -148], [-76, -140]], 3), { wash: '#f4e08a', sw: 1.8 });
    for (let i = 0; i < 2; i++) {
      api.inkLine(ctx, api.shapes.line(-72, -180 + i * 13, -12, -186 + i * 13, 0, 4, i + 4), 1.4, 'rgba(58,47,42,0.35)');
    }
    api.inkLine(ctx, api.shapes.line(96, -212, 112, -218, 0, 2, 6), 2.4, '#8f9b99');
  },
};
