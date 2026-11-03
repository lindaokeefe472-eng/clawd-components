import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_watering_can: ComponentDef<ClawdApi> = {
name: 'pr_watering_can',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour watering can with a rounded teal body, arched handle, tapered spout with an ochre rose, and animated water streams falling from the spout; a small mound of earth with a sprouting seedling sits at its base. It is 346×210 px with the anchor at the bottom centre, and works well as a garden prop beside beds, pots, or a gardener character.',
  tags: ['catalog', 'garden', 'watering-can', 'container', 'prop', 'ground', 'watercolour'],
  size: [346, 210],
  anchorNames: ['grip'],
  anchors() { return { grip: [-52, -144] }; },
  params: {
    pour: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of water flowing from the spout; 0 hides the streams, higher values make fuller, more visible pours.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the stream wobble and seedling sway between copies.' },
    hue: { type: 'enum', default: 'teal', options: ['teal', 'sky', 'sap', 'ochre', 'clay', 'night'], description: 'Palette colour used for the can body and lid.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { pour = 1, phase = 0, hue = 'teal' } = params as { pour?: number; phase?: number; hue?: string };
    const { PAL } = api;
    const wash = (PAL as Record<string, string>)[hue] || PAL.teal;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(10, -5, 86, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 壶身
    const body: P2[] = [[-70, -8], [-84, -74], [-58, -120], [42, -120], [66, -74], [52, -8]];
    api.paint(ctx, body, { wash, sw: 3.6 });
    api.paint(ctx, api.shapes.ring(-30, -92, 26, 18, 18, -0.4), { wash: PAL.paper, sw: 0, washOp: 0.35 });
    api.inkLine(ctx, api.shapes.line(-74, -40, 58, -40, 1, 10, 6), 1.6, 'rgba(58,47,42,0.28)');

    // 壶嘴（锥形管）
    const spout: P2[] = [
      [48, -104],
      [58, -96],
      [116, -142],
      [128, -150],
      [134, -136],
      [122, -132],
      [66, -86],
      [56, -80],
    ];
    api.paint(ctx, spout, { wash, sw: 3.2 });
    // 花洒头
    api.paint(ctx, api.shapes.ring(128, -142, 15, 14, 16, 0.6), { wash: PAL.ochre, sw: 2.8 });
    for (let i = 0; i < 5; i++) {
      const a = -1.1 + i * 0.4;
      api.inkLine(ctx, [[128 + Math.cos(a) * 11, -142 + Math.sin(a) * 11], [128 + Math.cos(a) * 17, -142 + Math.sin(a) * 17]], 1.4, PAL.ink);
    }

    // 把手
    api.inkLine(ctx, api.shapes.arc(-52, -124, 26, 20, Math.PI * 0.95, Math.PI * 2.1, 14), 6, wash);
    api.inkLine(ctx, api.shapes.arc(-52, -124, 26, 20, Math.PI * 0.95, Math.PI * 2.1, 14), 2.4, PAL.ink);

    // 顶盖与提手
    api.paint(ctx, api.shapes.ring(0, -122, 46, 8, 24), { wash: wash, sw: 2.8, washOp: 0.95 });
    api.inkLine(ctx, api.shapes.arc(0, -128, 16, 14, Math.PI, Math.PI * 2, 12), 3, PAL.ink);

    // 壶身装饰线
    api.inkLine(ctx, api.shapes.line(-64, -46, 50, -46, 1, 8, 4), 1.8, 'rgba(58,47,42,0.35)');

    // 水流
    if (pour > 0) {
      for (let i = 0; i < 6; i++) {
        const pts: P2[] = [];
        const t0 = i * 0.9;
        const x0 = 126 + (i - 2.5) * 3.4;
        for (let k = 0; k <= 8; k++) {
          const u = k / 8;
          pts.push([
            x0 + u * (16 + i * 3),
            -132 + u * (70 + i * 8) + Math.sin(u * 4 + t * 2.2 + phase + t0) * 2.5,
          ]);
        }
        api.inkLine(ctx, pts, 2.4, `rgba(79,156,152,${0.45 - i * 0.05})`);
        const tip = pts[pts.length - 1];
        api.paint(ctx, api.shapes.ring(tip[0], tip[1] + 5, 3, 4.4, 8), { wash: PAL.sky, sw: 0, washOp: 0.7 });
      }
    }

    // 脚下的小土堆与嫩芽
    api.paint(ctx, api.shapes.ring(30, -6, 54, 8, 20, 0, 0.06, 8), { wash: PAL.clay, sw: 1.6, washOp: 0.5 });
    const grow = 0.6 + 0.4 * Math.sin(t * 1.1 + phase);
    api.inkLine(ctx, api.shapes.line(44, -8, 44 - 2, -22 - 12 * grow, 1, 5, 3), 2, PAL.sap);
    api.paint(ctx, api.shapes.ring(38, -34 - 10 * grow, 8, 4.4, 10, -0.4), { wash: PAL.sap, sw: 1.3 });
    api.paint(ctx, api.shapes.ring(50, -30 - 8 * grow, 7, 4, 10, 0.5), { wash: PAL.sap, sw: 1.3 });
  },
};
