import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_trash_can: ComponentDef<ClawdApi> = {
name: 'pr_trash_can',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour rubbish bin with a tapered, ribbed body, two hoops, and a slightly ajar lid with handle and hinge; a recycling mark sits on the front, scraps of paper lie at its base, and overflowing rubbish can poke over the rim. Drawn at 190×250 px with its anchor at the bottom centre, it is a street or yard prop for cluttering ground-level scenes.',
  tags: ['catalog', 'street', 'trash', 'container', 'ground', 'decor', 'prop'],
  size: [190, 250],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the lid wobble and paper scrap motion between copies.' },
    full: { type: 'number', default: 0.5, min: 0, max: 1, description: 'Fill level; above 0.2 rubbish bulges over the rim, at 0 the can reads as empty.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Strength of the wind-driven rocking of the loose lid.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, full = 0.5, wind = 1 } = params as { phase?: number; full?: number; wind?: number };
    const { PAL } = api;

    // 地面阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 62, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 桶身（上宽下窄，带鼓腹）
    const body: P2[] = [[-62, -16], [-58, -96], [-50, -178], [50, -178], [58, -96], [62, -16]];
    api.paint(ctx, body, { wash: '#7f9591', sw: 3.6 });
    api.paint(ctx, api.shapes.poly([[-50, -26], [-46, -96], [-40, -168], [-14, -168], [-16, -96], [-24, -26]], 3), {
      wash: '#95aaa4',
      sw: 0,
      washOp: 0.5,
    });
    // 竖棱
    for (let i = 0; i < 4; i++) {
      const x = -34 + i * 23;
      api.inkLine(ctx, api.shapes.line(x * 1.05, -24, x * 0.9, -172, 0, 6, i + 3), 1.3, 'rgba(58,47,42,0.2)');
    }
    // 两道箍
    for (let i = 0; i < 2; i++) {
      const y = -52 - i * 96;
      api.inkLine(ctx, api.shapes.line(-58 + i * 2, y, 58 - i * 2, y, 1, 10, i + 5), 2.4, 'rgba(58,47,42,0.26)');
    }
    // 底部裙边
    api.paint(ctx, api.shapes.ring(0, -16, 62, 9, 26), { wash: '#6e837f', sw: 2.6 });

    // 回收标志
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI / 2 + (i / 3) * Math.PI * 2;
      api.inkLine(
        ctx,
        [
          [Math.cos(a) * 13, -100 + Math.sin(a) * 13],
          [Math.cos(a + 0.9) * 13, -100 + Math.sin(a + 0.9) * 13],
        ],
        1.8,
        'rgba(246,239,223,0.6)'
      );
    }

    // 满出来的垃圾（桶口内侧，盖住前要能被遮住）
    if (full > 0.2) {
      api.paint(ctx, api.shapes.ring(-12, -178, 22, 13, 14, 0.3, 0.14, 5), { wash: PAL.paper, sw: 2.2 });
      api.paint(ctx, api.shapes.ring(18, -180, 16, 11, 14, -0.2, 0.14, 9), { wash: PAL.ochre, sw: 2 });
    }

    // 桶口
    api.paint(ctx, api.shapes.ring(0, -178, 50, 12, 26), { wash: '#6e837f', sw: 2.8 });

    // 桶盖：搭在桶口、右侧翘起一条缝
    const tilt = 0.09 + Math.sin(t * 1.1 + phase) * 0.012 * wind;
    ctx.save();
    ctx.translate(-4, -190);
    ctx.rotate(-tilt);
    // 盖沿厚度
    api.paint(ctx, api.shapes.ring(0, 6, 56, 13, 26), { wash: '#5f736f', sw: 3 });
    // 盖面
    api.paint(ctx, api.shapes.ring(0, 0, 56, 13, 26), { wash: '#8298a2', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(-6, -2, 44, 9, 22), { wash: '#95aaa4', sw: 0, washOp: 0.6 });
    // 提手
    api.inkLine(ctx, api.shapes.arc(0, -4, 15, 8, Math.PI, Math.PI * 2, 10), 3, '#5f736f');
    ctx.restore();
    // 翘起处露出的缝
    api.inkLine(ctx, api.shapes.line(36, -184, 50, -176, 1, 4, 3), 2.2, 'rgba(58,47,42,0.45)');
    // 铰链
    api.paint(ctx, api.shapes.ring(48, -172, 5, 4, 8), { wash: '#5f736f', sw: 1.6 });

    // 掉出来的纸屑
    for (let i = 0; i < 3; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 1.5 + i * 2.1 + phase);
      api.paint(ctx, api.shapes.ring(52 + i * 10, -8 - k * 4, 4, 2.6, 6, 0.4), { wash: PAL.paper, sw: 0, washOp: 0.7 });
    }
  },
};
