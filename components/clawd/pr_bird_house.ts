import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_bird_house: ComponentDef<ClawdApi> = {
name: 'pr_bird_house',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour birdhouse on a short clay post: ochre plank box with a rose pitched roof, dark round entrance hole, a perch, and small flowers at the base, with a teal bird hopping beside it. It sways gently around its bottom-centre anchor and measures 200×330 px, making it a good garden or yard focal prop behind lower foreground elements.',
  tags: ['catalog', 'garden', 'birdhouse', 'wood', 'ground', 'prop', 'bird'],
  size: [200, 330],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offset in radians that shifts the sway, bird hop and flower wiggle cycle, so several copies do not move in sync.' },
    bird: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of bird shown; 0 hides the small teal bird, 1 draws it fully with its bobbing hop and wing flap.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, bird = 1 } = params as { phase?: number; bird?: number };
    const { PAL } = api;
    const sway = Math.sin(t * 0.8 + phase) * 0.012;

    ctx.save();
    ctx.translate(0, -326);
    ctx.rotate(sway);
    ctx.translate(0, 326);

    // 支柱
    api.paint(ctx, api.shapes.round(-9, -96, 9, -4, 4), { wash: PAL.clay, sw: 3 });
    api.inkLine(ctx, api.shapes.line(-3, -90, -3, -10, 1, 8, 3), 1.1, 'rgba(90,60,45,0.3)');

    // 小屋主体
    api.paint(ctx, api.shapes.round(-62, -226, 62, -92, 8), { wash: PAL.ochre, sw: 3.6 });
    // 屋身木板纹
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-54, -208 + i * 42, 54, -208 + i * 42, 1, 10, i + 2), 1.1, 'rgba(90,60,45,0.28)');
    }
    // 屋顶
    api.paint(ctx, [[-80, -220], [-56, -238], [-24, -266], [0, -292], [24, -266], [56, -238], [80, -220]], { wash: PAL.rose, sw: 3.6 });
    // 屋顶瓦纹
    for (let i = 0; i < 3; i++) {
      const k = 14 + i * 16;
      api.inkLine(ctx, api.shapes.line(-76 + k * 0.55, -220 - k, 76 - k * 0.55, -220 - k, 1.5, 8, i + 4), 1.1, 'rgba(120,70,65,0.28)');
    }
    api.paint(ctx, [[-76, -222], [76, -222], [56, -212], [-56, -212]], { wash: PAL.clay, sw: 2.4, washOp: 0.5 });

    // 洞口
    api.paint(ctx, api.shapes.ring(0, -178, 20, 20, 24), { wash: PAL.ink, sw: 2.8, washOp: 0.92 });
    api.inkLine(ctx, api.shapes.arc(0, -178, 14, 14, -0.4, Math.PI * 1.1, 12), 1.6, 'rgba(246,239,223,0.3)');
    // 栖木
    api.inkLine(ctx, api.shapes.line(0, -154, 0, -140, 0, 4, 5), 3.4, PAL.clay);
    api.paint(ctx, api.shapes.ring(0, -130, 6, 5, 10), { wash: PAL.clay, sw: 2 });

    // 小鸟
    if (bird > 0) {
      const hop = Math.abs(Math.sin(t * 1.6 + phase)) * 3;
      ctx.save();
      ctx.translate(-72, -170 - hop);
      api.paint(ctx, api.shapes.ring(0, 0, 19, 14, 18, -0.1), { wash: PAL.teal, sw: 2.8 });
      api.paint(ctx, api.shapes.ring(-16, -2, 9, 4.6, 10, 0.5), { wash: PAL.teal, sw: 2, washOp: 0.95 });
      api.paint(ctx, api.shapes.ring(10, -11, 9, 9, 12), { wash: PAL.teal, sw: 2.4 });
      api.paint(ctx, [[18, -12], [29, -8], [18, -4]], { wash: PAL.ochre, sw: 1.8 });
      api.paint(ctx, api.shapes.ring(13, -13, 1.9, 1.9, 6), { wash: PAL.ink, sw: 0 });
      const flap = Math.sin(t * 4 + phase) * 5;
      api.paint(ctx, api.shapes.ring(-2, -6, 12, 5 + flap * 0.3, 10, 0.35), { wash: PAL.sky, sw: 1.8 });
      api.inkLine(ctx, [[-2, 12], [-2, 20], [3, 20]], 1.6, PAL.ochre);
      ctx.restore();
    }

    // 屋檐小花
    for (let i = 0; i < 3; i++) {
      const x = -46 + i * 46;
      const b = Math.sin(t * 1.2 + i + phase) * 1.6;
      api.inkLine(ctx, api.shapes.line(x, -92, x + b, -78, 2, 5, i + 1), 1.6, PAL.sap);
      api.paint(ctx, api.shapes.ring(x + b, -76, 5, 5, 8), { wash: i === 1 ? PAL.rose : PAL.ochre, sw: 1.2 });
    }
    ctx.restore();
  },
};
