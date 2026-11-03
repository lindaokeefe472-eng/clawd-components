import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_electric_kettle: ComponentDef<ClawdApi> = {
name: 'pr_electric_kettle',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour electric kettle with a rounded body, water-level window, teal lid, side handle, angled spout, base, orange indicator light and two steam wisps. Anchor is bottom centre at 230×215 px; suited to a kitchen counter or tabletop scene.',
  tags: ['catalog', 'kitchenware', 'appliance', 'kettle', 'electric', 'tabletop', 'steam', 'prop'],
  size: [230, 215],
  anchorNames: ['grip'],
  anchors() { return { grip: [96, -100] }; },
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the bobbing, steam and indicator flicker to desynchronise copies.' },
    boil: { type: 'number', default: 1, min: 0, max: 1, description: 'Boil amount; scales the body bob, steam wisps and indicator glow.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, boil = 1 } = params as { phase?: number; boil?: number };
    const { PAL } = api;
    const bob = Math.sin(t * 2.2 + phase) * 1.2 * boil;

    // 底座
    api.paint(ctx, api.shapes.ring(0, -12, 74, 13, 32), { wash: PAL.night, sw: 3 });
    api.paint(ctx, api.shapes.ring(0, -20, 62, 9, 28), { wash: PAL.teal, sw: 2.2, washOp: 0.8 });
    api.inkLine(ctx, api.shapes.round(-10, -24, 10, -16, 3), 1.8, PAL.ochre);

    ctx.save();
    ctx.translate(0, bob);

    // 壶身
    const body: P2[] = [[-58, -26], [-68, -96], [-52, -146], [50, -146], [68, -96], [58, -26]];
    api.paint(ctx, body, { wash: '#dfe9e6', sw: 3.6 });
    api.paint(ctx, api.shapes.ring(-26, -118, 20, 22, 16, -0.3), { wash: '#ffffff', sw: 0, washOp: 0.5 });

    // 水面视窗
    api.paint(ctx, api.shapes.round(-16, -96, 16, -34, 8), { wash: PAL.sky, sw: 2.2, washOp: 0.55 });
    for (let i = 0; i < 3; i++) {
      const y = -42 - i * 16 + Math.sin(t * 3 + i + phase) * 2;
      api.inkLine(ctx, api.shapes.line(-12, y, 12, y, 1, 5, i + 2), 1.4, 'rgba(79,156,152,0.6)');
    }

    // 壶盖与提钮
    api.paint(ctx, api.shapes.arc(0, -148, 54, 16, Math.PI, Math.PI * 2, 20), { wash: PAL.teal, sw: 3 });
    api.paint(ctx, api.shapes.ring(0, -166, 11, 8, 12), { wash: PAL.ochre, sw: 2.4 });
    api.inkLine(ctx, api.shapes.line(-54, -148, 54, -148, 0, 10, 4), 2.4, 'rgba(58,47,42,0.5)');

    // 把手
    api.inkLine(ctx, api.shapes.arc(62, -100, 34, 26, -Math.PI * 0.55, Math.PI * 0.55, 16), 11, '#dfe9e6');
    api.inkLine(ctx, api.shapes.arc(62, -100, 34, 26, -Math.PI * 0.55, Math.PI * 0.55, 16), 3.2, PAL.ink);

    // 壶嘴（从壶身左上斜伸出去，逐渐收细）
    api.paint(ctx, [[-48, -118], [-96, -152], [-110, -144], [-70, -72], [-52, -80]], { wash: '#dfe9e6', sw: 3 });
    api.paint(ctx, api.shapes.ring(-104, -146, 9, 7, 12, 0.5), { wash: '#cfdedb', sw: 2.2 });

    // 指示灯
    const on = 0.5 + 0.5 * Math.sin(t * 4 + phase);
    api.glow(ctx, 40, -60, 20, PAL.orange, 0.3 * boil);
    api.paint(ctx, api.shapes.ring(40, -60, 4, 4, 10), { wash: PAL.orange, sw: 0, washOp: 0.6 + 0.4 * on });

    // 蒸汽
    if (boil > 0) {
      for (let s = 0; s < 2; s++) {
        const pts: P2[] = [];
        for (let i = 0; i <= 12; i++) {
          const u = i / 12;
          pts.push([
            -96 + s * 14 + Math.sin(u * 4.6 - t * 2.6 + s * 2 + phase) * (4 + u * 12),
            -140 - u * 46,
          ]);
        }
        api.inkLine(ctx, pts, 2.2, `rgba(58,47,42,${0.22 - s * 0.08})`);
      }
    }
    ctx.restore();
  },
};
