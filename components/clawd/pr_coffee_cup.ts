import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_coffee_cup: ComponentDef<ClawdApi> = {
name: 'pr_coffee_cup',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour coffee cup resting on a round saucer, with a slim side handle, dark coffee surface, a small coral ring motif on the body, and three animated steam wisps rising above the rim. Anchored at the bottom centre and 184×212 px, it suits café tables, breakfast still lifes, or a warm foreground prop in an interior scene.',
  tags: ['catalog', 'tableware', 'coffee', 'cup', 'drink', 'ground', 'decor', 'interior'],
  size: [184, 212],
  anchorNames: ['grip'],
  anchors() { return { grip: [88, -78] }; },
  params: {
    steam: { type: 'number', default: 1, min: 0, max: 2, description: 'Strength of the rising steam wisps; 0 removes them entirely, higher values make the curls more visible.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the steam animation, used to desynchronise multiple copies of the cup.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { steam = 1, phase = 0 } = params as { steam?: number; phase?: number };
    const { PAL } = api;

    // 桌面阴影
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = PAL.clay;
    ctx.beginPath();
    ctx.ellipse(0, -4, 74, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 杯碟
    api.paint(ctx, api.shapes.ring(0, -12, 82, 18, 42, 0, 0.01, 7), { wash: '#efe2ca', sw: 3 });
    api.inkLine(ctx, api.shapes.arc(0, -12, 68, 13, 0, Math.PI * 2, 34), 1.4, 'rgba(58,47,42,0.45)');

    // 杯身（上宽下窄）
    const cup: P2[] = [
      [-46, -16],
      [46, -16],
      [56, -122],
      [40, -138],
      [-40, -138],
      [-56, -122],
    ];
    api.paint(ctx, cup, { wash: '#f0dfc4', sw: 3.4 });
    // 杯子里的阴影
    api.paint(ctx, [[-50, -118], [50, -118], [54, -134], [-54, -134]], { wash: PAL.clay, sw: 0, washOp: 0.25 });

    // 咖啡液面
    api.paint(ctx, api.shapes.ring(0, -140, 50, 13, 34), { wash: '#6b4a33', sw: 2.6 });
    api.glow(ctx, -12, -142, 26, PAL.ochre, 0.18);

    // 把手
    const handle = api.shapes.arc(58, -78, 30, 30, -Math.PI * 0.55, Math.PI * 0.5, 18);
    api.inkLine(ctx, handle, 10, '#efe2ca');
    api.inkLine(ctx, handle, 3, PAL.ink);

    // 杯身小图案
    api.inkLine(ctx, api.shapes.ring(0, -74, 15, 15, 22), 2, 'rgba(200,110,80,0.9)');
    api.inkLine(ctx, api.shapes.ring(0, -74, 6, 6, 12), 2, 'rgba(200,110,80,0.9)');

    // 热气
    if (steam > 0) {
      for (let s = 0; s < 3; s++) {
        const pts: P2[] = [];
        const ox = -22 + s * 22;
        for (let i = 0; i <= 14; i++) {
          const u = i / 14;
          const y = -148 - u * 56;
          const x = ox + Math.sin(u * 5.5 - t * 2.2 + s * 1.7 + phase) * (4 + u * 9);
          pts.push([x, y]);
        }
        api.inkLine(ctx, pts, 2.4, `rgba(58,47,42,${0.16 + s * 0.05})`);
      }
    }
  },
};
