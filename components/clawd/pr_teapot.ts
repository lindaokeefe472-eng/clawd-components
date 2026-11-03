import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_teapot: ComponentDef<ClawdApi> = {
name: 'pr_teapot',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour teapot with a rounded body, arc handle, angled spout, lid, base, small floral motifs, and optional rising steam. It is 250×210 px with the anchor at bottom centre, making it suitable as a tabletop prop in kitchen, tea-time, or interior scenes.',
  tags: ['catalog', 'teapot', 'tableware', 'prop', 'container', 'ground', 'watercolour'],
  size: [250, 210],
  anchorNames: ['grip'],
  anchors() { return { grip: [-94, -80] }; },
  params: {
    steam: { type: 'number', default: 1, min: 0, max: 2, description: 'Steam strength; 0 removes the steam lines, higher values increase visibility.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians to desynchronise bobbing and steam animation between copies.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { steam = 1, phase = 0 } = params as { steam?: number; phase?: number };
    const { PAL } = api;
    const bob = Math.sin(t * 1.2 + phase) * 1.6;

    ctx.save();
    ctx.translate(0, bob);

    // 壶把手（先画，被壶身盖住根部）
    const handle = api.shapes.arc(-60, -80, 34, 22, Math.PI * 0.5, Math.PI * 1.5, 18);
    api.inkLine(ctx, handle, 13, PAL.sky);
    api.inkLine(ctx, handle, 3.4, PAL.ink);

    // 壶身
    const body = api.shapes.ring(0, -66, 70, 56, 38, 0, 0.015, 11);
    api.paint(ctx, body, { wash: PAL.sky, sw: 3.8 });
    // 高光
    api.paint(ctx, api.shapes.ring(-24, -84, 24, 18, 20, -0.3), { wash: PAL.paper, sw: 0, washOp: 0.45 });

    // 壶嘴
    const spout: P2[] = [
      [58, -60],
      [96, -96],
      [104, -116],
      [88, -118],
      [74, -102],
      [62, -88],
    ];
    api.paint(ctx, spout, { wash: PAL.sky, sw: 3.2 });
    api.inkLine(ctx, api.shapes.arc(96, -112, 10, 5, -0.2, Math.PI + 0.3, 8), 2, PAL.ink);

    // 壶底座
    api.paint(ctx, api.shapes.round(-40, -18, 40, -6, 6), { wash: PAL.teal, sw: 3 });

    // 壶盖
    api.paint(ctx, api.shapes.arc(0, -116, 42, 16, Math.PI, Math.PI * 2, 20), { wash: PAL.teal, sw: 3 });
    api.paint(ctx, api.shapes.ring(0, -132, 9, 9, 14), { wash: PAL.ochre, sw: 2.4 });
    api.inkLine(ctx, api.shapes.arc(0, -116, 42, 16, 0, Math.PI, 16), 2, 'rgba(58,47,42,0.5)');

    // 纹样
    api.inkLine(ctx, api.shapes.arc(0, -60, 58, 17, Math.PI * 0.12, Math.PI * 0.88, 16), 2, 'rgba(58,47,42,0.35)');
    for (let i = -1; i <= 1; i++) {
      api.inkLine(ctx, api.shapes.ring(i * 22, -46, 6, 6, 10), 1.8, 'rgba(79,156,152,0.95)');
    }

    // 蒸汽
    if (steam > 0) {
      for (let s = 0; s < 2; s++) {
        const pts: P2[] = [];
        for (let i = 0; i <= 12; i++) {
          const u = i / 12;
          pts.push([
            (s ? 16 : -14) + Math.sin(u * 4.2 - t * 2.4 + s * 2 + phase) * (5 + u * 11),
            -140 - u * 46,
          ]);
        }
        api.inkLine(ctx, pts, 2.2, `rgba(58,47,42,${0.22 - s * 0.07})`);
      }
    }
    ctx.restore();
  },
};
