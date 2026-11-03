import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_mushroom_row: ComponentDef<ClawdApi> = {
name: 'pr_mushroom_row',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour cluster of three mushrooms with rose, orange and clay caps, pale spots, inked gills and cream stems, standing on a soft moss patch with small drifting spore lights. It is 260×200 px with its anchor at the bottom centre, and works as a woodland-floor accent or foreground detail in an outdoor scene.',
  tags: ['catalog', 'mushroom', 'plant', 'forest', 'ground', 'decor', 'watercolour'],
  size: [260, 200],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the swaying motion and spore bobbing, used to desynchronise copies.' },
    spores: { type: 'number', default: 1, min: 0, max: 1, description: 'Density and brightness of the floating spore lights around the caps; 0 removes them entirely.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, spores = 1 } = params as { phase?: number; spores?: number };
    const { PAL } = api;

    // 苔藓地
    api.paint(ctx, api.shapes.ring(0, -8, 110, 14, 34, 0, 0.04, 4), { wash: PAL.sap, sw: 2.4, washOp: 0.55 });

    const items: Array<[number, number, number, string]> = [
      [-70, 0.72, 0.8, PAL.rose],
      [58, 0.6, 2.4, PAL.orange],
      [4, 1, 1.2, PAL.clay],
    ];
    for (let i = 0; i < items.length; i++) {
      const [x, s, ph, capCol] = items[i];
      const wob = Math.sin(t * 1.3 + ph + phase) * 0.03;
      ctx.save();
      ctx.translate(x, -10);
      ctx.rotate(wob);
      ctx.scale(s, s);

      // 菌柄
      const stem: P2[] = [[-15, 0], [-11, -62], [11, -62], [15, 0]];
      api.paint(ctx, stem, { wash: '#f2e8d3', sw: 2.8 });
      api.inkLine(ctx, api.shapes.line(-4, 0, -2, -56, 1, 6, i + 2), 1.2, 'rgba(58,47,42,0.25)');

      // 菌盖
      const cap: P2[] = [];
      for (let k = 0; k <= 20; k++) {
        const a = Math.PI + (k / 20) * Math.PI;
        cap.push([Math.cos(a) * 46, -60 + Math.sin(a) * 38]);
      }
      cap.push([-46, -60 + 6], [0, -60 + 10], [46, -60 + 6]);
      api.paint(ctx, cap, { wash: capCol, sw: 3.2 });
      // 菌盖斑点
      for (let k = 0; k < 5; k++) {
        const a = 0.35 + k * 0.55;
        api.paint(ctx, api.shapes.ring(Math.cos(Math.PI + a) * 30, -60 + Math.sin(Math.PI + a) * 24, 5, 4, 10, 0, 0.1, k + i), {
          wash: PAL.paper,
          sw: 0,
          washOp: 0.85,
        });
      }
      // 菌褶
      api.inkLine(ctx, api.shapes.line(-38, -56, 38, -56, 2, 8, i + 4), 1.4, 'rgba(58,47,42,0.35)');
      ctx.restore();
    }

    // 孢子光点
    if (spores > 0) {
      for (let i = 0; i < 7; i++) {
        const a = i * 2.3;
        const x = Math.cos(a) * 84;
        const y = -70 - (i % 4) * 26 + Math.sin(t * 1.6 + i * 1.1 + phase) * 7;
        const s = 1.6 + 1.1 * (0.5 + 0.5 * Math.sin(t * 2.3 + i));
        api.glow(ctx, x, y, s * 3.4, '#f3d78b', 0.3 * spores);
        api.paint(ctx, api.shapes.ring(x, y, s, s, 8), { wash: '#fff8dd', sw: 0, washOp: 0.9 * spores });
      }
    }
  },
};
