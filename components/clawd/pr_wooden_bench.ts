import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_wooden_bench: ComponentDef<ClawdApi> = {
name: 'pr_wooden_bench',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wooden garden bench with two backrest posts, two horizontal back slats, a slatted seat and four short legs, plus wood-grain strokes, dark nail dots and a few drifting autumn leaves above the seat. It measures 320×190 px with the anchor at the bottom centre and works well as ground-level park or garden seating in a scene.',
  tags: ['catalog', 'bench', 'wooden', 'furniture', 'autumn', 'ground', 'decor'],
  size: [320, 190],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the leaf bobbing animation, used to desynchronise multiple copies.' },
    leaves: { type: 'number', default: 1, min: 0, max: 12, description: 'Number of drifting leaves and their opacity; 0 removes the leaves entirely, higher values make the falling leaves denser and more visible.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, leaves = 1 } = params as { phase?: number; leaves?: number };
    const { PAL } = api;
    const wood = PAL.clay;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 148, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 靠背立柱
    api.paint(ctx, api.shapes.round(-124, -176, -110, -30, 4), { wash: wood, sw: 2.8 });
    api.paint(ctx, api.shapes.round(110, -176, 124, -30, 4), { wash: wood, sw: 2.8 });

    // 靠背横板（两根）
    api.paint(ctx, api.shapes.round(-136, -160, 136, -134, 6), { wash: wood, sw: 3.2 });
    api.paint(ctx, api.shapes.round(-136, -124, 136, -100, 6), { wash: wood, sw: 3.2 });
    for (let i = 0; i < 2; i++) {
      const y = -147 + i * 36;
      api.inkLine(ctx, api.shapes.line(-124, y, 124, y + 1, 1.5, 14, i + 3), 1.2, 'rgba(90,60,45,0.3)');
    }

    // 坐面板
    api.paint(ctx, api.shapes.round(-146, -82, 146, -56, 7), { wash: wood, sw: 3.4 });
    api.paint(ctx, api.shapes.round(-140, -52, 140, -34, 5), { wash: wood, sw: 2.8, washOp: 0.9 });

    // 凳腿
    api.paint(ctx, api.shapes.round(-130, -34, -116, -4, 4), { wash: '#a9714f', sw: 2.8 });
    api.paint(ctx, api.shapes.round(116, -34, 130, -4, 4), { wash: '#a9714f', sw: 2.8 });

    // 木纹与钉
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-118 + i * 90, -76, -96 + i * 90, -62, 1.2, 6, i + 1), 1.1, 'rgba(90,60,45,0.28)');
    }
    for (let i = 0; i < 4; i++) {
      api.paint(ctx, api.shapes.ring(-118 + i * 78, -142, 2.6, 2.6, 8), { wash: PAL.ink, sw: 0, washOp: 0.6 });
    }

    // 落叶
    if (leaves > 0) {
      for (let i = 0; i < 3; i++) {
        const bob = Math.sin(t * 1.3 + i * 2.1 + phase) * 2;
        const x = -80 + i * 66;
        api.paint(ctx, api.shapes.ring(x, -62 + bob - i * 3, 9, 4.6, 10, 0.5 + i * 0.5, 0.1, i + 4), {
          wash: i === 1 ? PAL.ochre : PAL.orange,
          sw: 1.4,
          washOp: 0.9 * leaves,
        });
      }
    }
  },
};
