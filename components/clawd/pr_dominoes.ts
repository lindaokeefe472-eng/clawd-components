import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_dominoes: ComponentDef<ClawdApi> = {
name: 'pr_dominoes',
  style: 'clawd',
  kind: 'prop',
  description: 'Watercolour dominoes: two cream tiles stand upright with inked pips and a third lies fallen beside them, with soft shadow and faint pip ghosts. The anchor is bottom centre at 240×170 px, making it suitable for tabletop, game, or play scenes.',
  tags: ['catalog', 'play', 'dominoes', 'game', 'toy', 'tabletop', 'ground'],
  size: [240, 170],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; changes the timing of the wobble and ghost-pip animation to desynchronise copies.' },
    fall: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls the amount of falling/wobble motion and the visibility of the floating ghost pips.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, fall = 1 } = params as { phase?: number; fall?: number };
    const { PAL } = api;
    const tilt = Math.sin(t * 1.2 + phase) * 0.02 * fall;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 100, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 一块立着的骨牌
    const domino = (cx: number, cy: number, rot: number, a: number, b: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      api.paint(ctx, api.shapes.poly([[-24, -80], [24, -80], [24, 0], [-24, 0]], 4), { wash: '#fbf6e8', sw: 3 });
      api.inkLine(ctx, api.shapes.line(-24, -40, 24, -40, 0, 6, 3), 2, PAL.ink);
      // 点数
      const pips = (n: number, cy0: number) => {
        const layout: Record<number, Array<[number, number]>> = {
          0: [],
          1: [[0, 0]],
          2: [[-11, -11], [11, 11]],
          3: [[-11, -11], [0, 0], [11, 11]],
          4: [[-11, -11], [11, -11], [-11, 11], [11, 11]],
          5: [[-11, -11], [11, -11], [0, 0], [-11, 11], [11, 11]],
          6: [[-11, -14], [-11, 0], [-11, 14], [11, -14], [11, 0], [11, 14]],
        };
        const arr = layout[n] || [];
        for (let i = 0; i < arr.length; i++) {
          api.paint(ctx, api.shapes.ring(arr[i][0], cy0 + arr[i][1], 4.6, 4.6, 10), { wash: PAL.ink, sw: 0, washOp: 0.85 });
        }
      };
      pips(a, -60);
      pips(b, -20);
      ctx.restore();
    };
    domino(-70, -12, tilt, 3, 5);

    // 后面一块（稍倾斜）
    domino(-14, -12, -0.1, 1, 6);

    // 倒下的骨牌
    ctx.save();
    ctx.translate(34, -26);
    ctx.rotate(Math.PI / 2 + 0.03);
    api.paint(ctx, api.shapes.poly([[-24, -80], [24, -80], [24, 0], [-24, 0]], 4), { wash: '#f6efdd', sw: 2.8 });
    api.inkLine(ctx, api.shapes.line(-24, -40, 24, -40, 0, 6, 3), 2, PAL.ink);
    api.paint(ctx, api.shapes.ring(-8, -56, 4.6, 4.6, 10), { wash: PAL.ink, sw: 0, washOp: 0.85 });
    api.paint(ctx, api.shapes.ring(8, -56, 4.6, 4.6, 10), { wash: PAL.ink, sw: 0, washOp: 0.85 });
    api.paint(ctx, api.shapes.ring(-8, -20, 4.6, 4.6, 10), { wash: PAL.ink, sw: 0, washOp: 0.85 });
    api.paint(ctx, api.shapes.ring(8, -20, 4.6, 4.6, 10), { wash: PAL.ink, sw: 0, washOp: 0.85 });
    ctx.restore();

    // 点数的重影
    for (let i = 0; i < 2; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 2 + i * 2.4 + phase);
      api.paint(ctx, api.shapes.ring(-70 + i * 56, -96 - k * 6, 4, 4, 8), { wash: PAL.ochre, sw: 0, washOp: 0.35 * k * fall });
    }
  },
};
