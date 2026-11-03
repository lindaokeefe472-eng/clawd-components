import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_certificate: ComponentDef<ClawdApi> = {
name: 'pr_certificate',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour paper certificate with a cream sheet, double gold inner border, title and body lines, a red circular stamp, and a rose ribbon seal, anchored at bottom centre and sized 280×230 px. It is suited for desk or wall displays in award, office, or ceremony scenes.',
  tags: ['catalog', 'certificate', 'paper', 'document', 'watercolour', 'desk', 'decor', 'award'],
  size: [280, 230],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the gentle flutter and stamp pulse between copies.' },
    stamp: { type: 'number', default: 1, min: 0, max: 1, description: 'Stamp amount; 0 hides the red circular stamp, while higher values show it with a subtle pulse.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, stamp = 1 } = params as { phase?: number; stamp?: number };
    const { PAL } = api;
    const flutter = Math.sin(t * 1.4 + phase) * 2;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 118, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 底层纸
    api.paint(ctx, api.shapes.poly([[-118, -96], [122, -104], [116, -6], [-124, -2]], 4), { wash: '#efe5cc', sw: 2.8 });
    // 主证书
    ctx.save();
    ctx.translate(0, -4 + flutter * 0.3);
    ctx.rotate(-0.01 + flutter * 0.004);
    api.paint(ctx, api.shapes.poly([[-112, -204], [116, -196], [112, -14], [-116, -20]], 4), { wash: '#fbf6e7', sw: 3.2 });
    // 内边框
    api.inkLine(ctx, api.shapes.poly([[-96, -188], [100, -181], [97, -30], [-100, -36]], 4), 2.2, 'rgba(200,150,80,0.85)');
    api.inkLine(ctx, api.shapes.poly([[-90, -182], [94, -175], [91, -36], [-94, -42]], 4), 1, 'rgba(200,150,80,0.55)');

    // 标题与正文
    api.inkLine(ctx, api.shapes.line(-56, -164, 56, -160, 1, 8, 2), 4.4, 'rgba(58,47,42,0.7)');
    api.inkLine(ctx, api.shapes.line(-34, -150, 40, -147, 1, 8, 4), 2.2, 'rgba(58,47,42,0.35)');
    for (let i = 0; i < 4; i++) {
      const y = -126 + i * 16;
      api.inkLine(ctx, api.shapes.line(-74, y, 62 - (i % 2) * 26, y + 2, 1, 8, i + 5), 1.6, 'rgba(58,47,42,0.28)');
    }
    // 花饰
    api.paint(ctx, api.shapes.ring(-76, -60, 14, 10, 14, 0.2, 0.08, 3), { wash: PAL.ochre, sw: 1.6, washOp: 0.75 });
    api.inkLine(ctx, api.shapes.line(-56, -56, -20, -54, 0, 4, 4), 1.4, 'rgba(58,47,42,0.25)');

    // 印章
    if (stamp > 0) {
      const sc = 0.94 + 0.06 * Math.sin(t * 1.8 + phase);
      ctx.save();
      ctx.translate(58, -72);
      ctx.rotate(-0.18);
      ctx.scale(sc, sc);
      api.inkLine(ctx, api.shapes.ring(0, 0, 26, 26, 24), 2.6, 'rgba(196,92,80,0.85)');
      api.inkLine(ctx, api.shapes.ring(0, 0, 19, 19, 20), 1.4, 'rgba(196,92,80,0.7)');
      api.paint(ctx, [[-9, 6], [0, -12], [9, 6]], { wash: 'rgba(196,92,80,0.7)', sw: 0 });
      ctx.restore();
    }
    // 丝带封印
    api.paint(ctx, api.shapes.poly([[-22, -8], [-10, -8], [-14, -34], [4, -22], [-18, -22]], 2), { wash: PAL.rose, sw: 1.8 });
    api.paint(ctx, api.shapes.ring(-12, -12, 7, 6, 10), { wash: PAL.ochre, sw: 1.6 });

    // 高光
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-60, -170, 40, 10, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.restore();
  },
};
