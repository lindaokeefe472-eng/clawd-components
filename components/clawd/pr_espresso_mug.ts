import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_espresso_mug: ComponentDef<ClawdApi> = {
name: 'pr_espresso_mug',
  style: 'clawd',
  kind: 'prop',
  description: 'A small watercolour espresso cup with a tapered body and thick loop handle, sitting on a round saucer with a spoon and a sugar cube beside it, topped by two curling steam wisps. Anchored at the bottom centre and roughly 240×210 px, it suits a café tabletop, an office desk, or a kitchen still-life scene.',
  tags: ['catalog', 'office', 'espresso', 'mug', 'container', 'decor', 'ground', 'drink'],
  size: [240, 210],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the steam animation, used to desynchronise multiple copies.' },
    steam: { type: 'number', default: 1, min: 0, max: 2, description: 'Steam strength; 0 removes the wisps and higher values make them more opaque.' },
    fill: { type: 'number', default: 0.7, min: 0, max: 1, description: 'Fill amount of the cup, controlling how dark and wide the coffee surface appears.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, steam = 1, fill = 0.7 } = params as { phase?: number; steam?: number; fill?: number };

    api.paint(ctx, api.shapes.ring(0, -8, 92, 8, 20, 0, 0, 3), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 底碟
    api.paint(ctx, api.shapes.ring(0, -18, 96, 20, 26), { wash: '#f6efdf', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(0, -18, 62, 12, 20), { wash: '#e2d6ba', sw: 0, washOp: 0.55 });
    api.paint(ctx, api.shapes.ring(-16, -26, 70, 14, 22), { wash: '#ffffff', sw: 0, washOp: 0.3 });

    // 杯身（略收腰）
    const body = api.shapes.poly([[-46, -34], [46, -34], [50, -64], [42, -124], [-42, -124], [-50, -64]], 5);
    api.paint(ctx, body, { wash: '#f6efdf', sw: 2.8 });
    api.paint(ctx, api.shapes.poly([[-46, -34], [46, -34], [49, -58], [-49, -58]], 3), { wash: '#e2d6ba', sw: 0, washOp: 0.4 });
    // 杯口
    api.paint(ctx, api.shapes.ring(0, -124, 42, 11, 22), { wash: '#f2ece0', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(0, -124, 35, 8.4, 20), { wash: '#5a3a22', sw: 0, washOp: 0.55 + 0.35 * api.shapes.clamp01(fill) });
    api.paint(ctx, api.shapes.ring(0, -125, 26, 6, 18), { wash: '#b87a3f', sw: 0, washOp: 0.75 * api.shapes.clamp01(fill) });
    api.paint(ctx, api.shapes.ring(-8, -126, 12, 3.6, 14), { wash: '#f0dcb8', sw: 0, washOp: 0.6 * api.shapes.clamp01(fill) });

    // 杯把（粗环）
    const handle = api.shapes.arc(48, -82, 24, 26, -Math.PI * 0.46, Math.PI * 0.46, 14);
    api.inkLine(ctx, handle, 10, '#efe4cc');
    api.inkLine(ctx, handle, 6, '#f6efdf');
    api.inkLine(ctx, api.shapes.arc(48, -82, 24, 26, -Math.PI * 0.4, Math.PI * 0.4, 12), 1.6, 'rgba(160,145,120,0.5)');

    // 热气
    if (steam > 0.2) {
      for (let i = 0; i < 2; i++) {
        const pts: P2[] = [];
        for (let s = 0; s <= 7; s++) {
          const u = s / 7;
          pts.push([-8 + i * 18 + Math.sin(u * 4 + t * 1.8 + i * 2 + phase) * (5 + u * 7), -132 - u * 54]);
        }
        api.inkLine(ctx, pts, 2.2, `rgba(200,190,175,${0.42 * steam})`);
      }
    }
    // 碟上的小勺
    const spoon: P2[] = [[-58, -24], [-88, -28], [-100, -40]];
    api.inkLine(ctx, spoon, 3.2, '#b9b2a2');
    api.paint(ctx, api.shapes.ring(-106, -46, 11, 8, 14, -0.6), { wash: '#cfc8b8', sw: 1.6 });
    // 方糖
    api.paint(ctx, api.shapes.poly([[62, -22], [88, -24], [88, -40], [62, -38]], 3), { wash: '#ffffff', sw: 1.5 });
    api.paint(ctx, api.shapes.poly([[62, -40], [88, -42], [88, -40], [62, -38]], 3), { wash: '#e2d6ba', sw: 0, washOp: 0.6 });
  },
};
