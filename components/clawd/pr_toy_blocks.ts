import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_toy_blocks: ComponentDef<ClawdApi> = {
name: 'pr_toy_blocks',
  style: 'clawd',
  kind: 'prop',
  description: 'Three stacked watercolour toy cubes lettered A, B and C, with a fourth block lying tipped on the ground, each cube drawn with a shaded top and side face. Anchor is bottom centre at 284×220 px, suited to nursery, playroom or child\'s-floor scenes.',
  tags: ['catalog', 'toy', 'blocks', 'play', 'nursery', 'ground', 'decor'],
  size: [284, 220],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the wobble timing so multiple copies do not rock in unison.' },
    wobble: { type: 'number', default: 1, min: 0, max: 2, description: 'Amount of gentle rocking applied to each block; 0 keeps them still, higher values increase the sway.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wobble = 1 } = params as { phase?: number; wobble?: number };
    const { PAL } = api;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 100, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const block = (cx: number, cy: number, s: number, wash: string, rot: number, ph: number, letter: string) => {
      const wob = Math.sin(t * 1.1 + ph + phase) * 0.03 * wobble;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot + wob);
      // 立方体：正面 + 顶面 + 侧面
      const kx = s * 0.34;
      const ky = s * 0.4;
      api.paint(ctx, api.shapes.poly([[-s, -s], [s, -s], [s, s], [-s, s]], 3), { wash, sw: 3 });
      api.paint(ctx, api.shapes.poly([[-s, -s], [s, -s], [s - kx, -s - ky], [-s - kx, -s - ky]], 3), { wash, sw: 2.4, washOp: 0.72 });
      api.paint(ctx, api.shapes.poly([[s, -s], [s - kx, -s - ky], [s - kx, s - ky], [s, s]], 3), { wash: PAL.ink, sw: 0, washOp: 0.14 });
      // 字母
      api.inkLine(ctx, api.shapes.line(-s * 0.56, -s * 0.7, s * 0.56, -s * 0.7, 1, 6, ph + 2), 2.2, 'rgba(246,239,223,0.6)');
      if (letter === 'A') {
        api.inkLine(ctx, api.shapes.line(-s * 0.4, s * 0.44, 0, -s * 0.34, 0, 5, 3), 3.4, 'rgba(246,239,223,0.85)');
        api.inkLine(ctx, api.shapes.line(s * 0.4, s * 0.44, 0, -s * 0.34, 0, 5, 4), 3.4, 'rgba(246,239,223,0.85)');
        api.inkLine(ctx, api.shapes.line(-s * 0.2, s * 0.1, s * 0.2, s * 0.1, 0, 3, 5), 2.6, 'rgba(246,239,223,0.85)');
      } else if (letter === 'B') {
        api.inkLine(ctx, api.shapes.line(-s * 0.3, s * 0.44, -s * 0.3, -s * 0.34, 0, 4, 3), 3, 'rgba(246,239,223,0.85)');
        api.inkLine(ctx, api.shapes.arc(-s * 0.28, -s * 0.06, s * 0.3, s * 0.2, -Math.PI * 0.5, Math.PI * 0.5, 8), 2.6, 'rgba(246,239,223,0.85)');
        api.inkLine(ctx, api.shapes.arc(-s * 0.28, s * 0.26, s * 0.34, s * 0.22, -Math.PI * 0.5, Math.PI * 0.5, 8), 2.6, 'rgba(246,239,223,0.85)');
      } else {
        api.inkLine(ctx, api.shapes.arc(0, s * 0.06, s * 0.36, s * 0.34, Math.PI * 0.3, Math.PI * 1.75, 12), 3, 'rgba(246,239,223,0.85)');
      }
      ctx.restore();
    };

    block(-52, -44, 44, PAL.teal, -0.04, 0, 'A');
    block(52, -44, 42, PAL.ochre, 0.06, 2.2, 'C');
    block(0, -128, 40, PAL.rose, -0.02, 4.1, 'B');
    // 地上一块
    ctx.save();
    ctx.translate(-108, -22);
    ctx.rotate(0.16);
    api.paint(ctx, api.shapes.poly([[-26, -26], [26, -26], [26, 26], [-26, 26]], 3), { wash: PAL.sky, sw: 2.6 });
    ctx.restore();
  },
};
