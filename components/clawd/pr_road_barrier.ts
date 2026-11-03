import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_road_barrier: ComponentDef<ClawdApi> = {
name: 'pr_road_barrier',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour road barrier with an A-frame stand, a red-and-white diagonally striped horizontal board, small ochre reflectors, and a blinking orange warning lamp on top. It is 280×190 px with the anchor at the bottom centre, suitable for street works, construction sites, or blocking a path in a scene.',
  tags: ['catalog', 'street', 'road', 'barrier', 'construction', 'warning', 'ground', 'prop'],
  size: [280, 190],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the board wobble and warning-light blink cycle to desynchronise copies.' },
    blink: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls how strongly the board wobbles and the warning lamp glows/blinks; 0 disables both, 1 is full effect.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, blink = 1 } = params as { phase?: number; blink?: number };
    const { PAL } = api;
    const wob = Math.sin(t * 1.4 + phase) * 0.006 * blink;

    // 地面阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 108, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(0, -4);
    ctx.rotate(wob);

    // A 字腿
    for (let i = 0; i < 2; i++) {
      const dir = i ? 1 : -1;
      api.inkLine(ctx, api.shapes.line(dir * 92, 0, dir * 40, -118, 2, 8, i + 3), 7, '#b0aca0');
      api.inkLine(ctx, api.shapes.line(dir * 92, 0, dir * 40, -118, 2, 8, i + 3), 2.4, PAL.ink);
      api.paint(ctx, api.shapes.ring(dir * 94, -6, 8, 5, 10), { wash: PAL.ink, sw: 0, washOp: 0.5 });
    }
    // 横撑
    api.inkLine(ctx, api.shapes.line(-64, -56, 64, -56, 0, 8, 5), 5, '#b0aca0');
    api.inkLine(ctx, api.shapes.line(-64, -56, 64, -56, 0, 8, 5), 2, PAL.ink);

    // 横板（红白斜纹）
    api.paint(ctx, api.shapes.poly([[-116, -126], [116, -126], [116, -92], [-116, -92]], 4), { wash: PAL.paper, sw: 3.4 });
    for (let i = 0; i < 8; i++) {
      const x0 = -116 + i * 29;
      api.paint(ctx, api.shapes.poly([[x0, -92], [x0 + 15, -92], [x0 + 29, -126], [x0 + 14, -126]], 2), {
        wash: '#c4553f',
        sw: 0,
        washOp: 0.92,
      });
    }
    api.inkLine(ctx, api.shapes.poly([[-116, -126], [116, -126], [116, -92], [-116, -92]], 3), 2.6, PAL.ink);

    // 警示灯
    const k = 0.5 + 0.5 * Math.sin(t * 5 + phase);
    api.glow(ctx, 0, -142, 54, PAL.orange, 0.35 * k * blink);
    api.paint(ctx, api.shapes.round(-9, -152, 9, -128, 5), { wash: '#c4553f', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(0, -144, 6, 6, 12), { wash: PAL.orange, sw: 0, washOp: 0.5 + 0.5 * k });
    // 反光条
    for (let i = 0; i < 2; i++) {
      api.paint(ctx, api.shapes.ring(-88 + i * 176, -108, 12, 5, 10), { wash: PAL.ochre, sw: 0, washOp: 0.55 });
    }
    ctx.restore();
  },
};
