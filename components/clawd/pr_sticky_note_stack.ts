import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_sticky_note_stack: ComponentDef<ClawdApi> = {
name: 'pr_sticky_note_stack',
  style: 'clawd',
  kind: 'prop',
  description: 'A small stack of pastel watercolour sticky notes with ruled ink lines, a paperclip at the top left and a pencil resting at the right, anchored at the bottom centre in a 240×190 px footprint. Useful as a desk or tabletop prop in study, office or note-taking scenes.',
  tags: ['catalog', 'sticky-note', 'stationery', 'desk', 'paper', 'decor', 'prop'],
  size: [240, 190],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the gentle wobble of the notes and pencil, so multiple copies do not move in sync.' },
    count: { type: 'number', default: 3, min: 0, max: 12, description: 'Number of sticky notes in the stack; values are clamped between 1 and 4 visible sheets.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, count = 3 } = params as { phase?: number; count?: number };
    const { PAL } = api;
    const cols = ['#f6e27a', '#f7c9a8', '#cfe0b4', PAL.rose];

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 94, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 一叠便签，逐层错位、轻微飘动
    const n = Math.min(4, Math.max(1, count));
    for (let i = 0; i < n; i++) {
      const rot = -0.06 + i * 0.05;
      const wob = Math.sin(t * 1.2 + i * 1.3 + phase) * 0.012;
      ctx.save();
      ctx.translate(-6 + i * 5, -16 - i * 4);
      ctx.rotate(rot + wob);
      api.paint(ctx, api.shapes.poly([[-66, -96], [66, -94], [62, 2], [-64, -2]], 4), { wash: cols[i % cols.length], sw: 2.6 });
      // 便签横线
      for (let k = 0; k < 3; k++) {
        api.inkLine(ctx, api.shapes.line(-48, -74 + k * 20, 36 - k * 10, -73 + k * 20, 1, 5, k + i + 2), 1.3, 'rgba(58,47,42,0.25)');
      }
      ctx.restore();
    }

    // 回形针
    ctx.save();
    ctx.translate(-40, -130);
    ctx.rotate(0.2);
    api.inkLine(ctx, [[0, 0], [0, 34], [10, 34], [10, 8], [4, 4], [-2, 10], [-2, 26]], 2.4, '#9aa6a4');
    ctx.restore();

    // 铅笔
    ctx.save();
    ctx.translate(52, -56);
    ctx.rotate(-0.5 + Math.sin(t * 0.7 + phase) * 0.01);
    api.inkLine(ctx, api.shapes.line(0, -70, 0, 40, 0, 6, 3), 7, PAL.ochre);
    api.inkLine(ctx, api.shapes.line(0, -70, 0, 40, 0, 6, 3), 2.4, PAL.ink);
    api.paint(ctx, [[-4, -70], [4, -70], [0, -84]], { wash: PAL.clay, sw: 1.8 });
    api.paint(ctx, [[-1.6, -78], [1.6, -78], [0, -84]], { wash: PAL.ink, sw: 0 });
    ctx.restore();
  },
};
