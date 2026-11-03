import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_suspension_bridge: ComponentDef<ClawdApi> = {
name: 'pr_suspension_bridge',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour suspension bridge with rocky banks, a sagging plank deck, two rope handrails with hangers, end posts, and two small floating hearts above the span; a soft shadow sits at the bottom-centre anchor. It is 380×250 px and is good for scenes of crossing a gap, connection, or a light romantic or psychological motif.',
  tags: ['catalog', 'bridge', 'suspension', 'watercolour', 'prop', 'ground', 'romance'],
  size: [380, 250],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the bridge sway and floating-heart motion between copies.' },
    sway: { type: 'number', default: 1, min: 0, max: 3, description: 'Amount of deck and handrail sway; 0 keeps the bridge still, higher values increase the motion.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, sway = 1 } = params as { phase?: number; sway?: number };
    const { PAL } = api;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -6, 150, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 两岸岩壁
    api.paint(ctx, api.shapes.poly([[-190, 0], [-190, -150], [-158, -158], [-136, -128], [-136, 0]], 4), { wash: '#b9ab90', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[190, 0], [190, -150], [158, -158], [136, -128], [136, 0]], 4), { wash: '#b9ab90', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-190, -96], [-136, -96], [-136, -74], [-190, -74]], 3), { wash: PAL.ink, sw: 0, washOp: 0.12 });
    api.paint(ctx, api.shapes.poly([[136, -96], [190, -96], [190, -74], [136, -74]], 3), { wash: PAL.ink, sw: 0, washOp: 0.12 });

    // 桥面（悬链线）+ 桥板
    const deck = (x: number): number => -128 + 46 * (1 - Math.pow(x / 128, 2)) + Math.sin(t * 1.1 + phase + x * 0.01) * 1.2 * sway;
    const deckPts: P2[] = [];
    for (let i = 0; i <= 28; i++) {
      const x = api.shapes.lerp(-136, 136, i / 28);
      deckPts.push([x, deck(x)]);
    }
    api.paint(ctx, deckPts.concat([[136, deck(136) + 12]]).concat(deckPts.slice().reverse().map((p) => [p[0], p[1] + 12] as P2)), {
      wash: '#c79a5e',
      sw: 3.2,
    });
    for (let i = 0; i <= 20; i++) {
      const x = api.shapes.lerp(-128, 128, i / 20);
      api.inkLine(ctx, api.shapes.line(x, deck(x) + 1, x, deck(x) + 12, 0, 3, i + 2), 1.6, 'rgba(90,55,25,0.55)');
    }

    // 扶手绳（两股）
    for (let k = 0; k < 2; k++) {
      const off = k === 0 ? -40 : -26;
      const rail: P2[] = [];
      for (let i = 0; i <= 24; i++) {
        const x = api.shapes.lerp(-150, 150, i / 24);
        rail.push([x, deck(x) + off + Math.sin(t * 1.4 + phase + i * 0.4) * 1.4 * sway]);
      }
      api.inkLine(ctx, rail, 3.2, '#b08a63');
      // 吊索
      for (let i = 2; i <= 22; i += 2) {
        const x = api.shapes.lerp(-150, 150, i / 24);
        api.inkLine(ctx, api.shapes.line(x, rail[i][1], x, deck(x), 0, 3, i + k), 1.4, 'rgba(140,105,60,0.6)');
      }
    }
    // 两端立柱
    for (let i = 0; i < 2; i++) {
      const x = i ? 152 : -152;
      api.paint(ctx, api.shapes.poly([[x - 5, -110], [x + 5, -110], [x + 5, -172], [x - 5, -172]], 3), { wash: '#b08a63', sw: 2.6 });
      api.paint(ctx, api.shapes.ring(x, -176, 7, 5, 10), { wash: PAL.ochre, sw: 1.8 });
    }

    // 桥上的两颗心（吊桥效应）
    for (let i = 0; i < 2; i++) {
      const bx = i ? 34 : -30;
      const by = -196 + Math.sin(t * 1.6 + i * 2.2 + phase) * 5;
      const s = i ? 15 : 20;
      api.glow(ctx, bx, by, 40, PAL.rose, 0.16);
      api.paint(ctx, api.shapes.heart(bx, by, s, (i ? 1 : -1) * 0.14), { wash: i ? PAL.ochre : PAL.rose, sw: 2.6 });
      api.paint(ctx, api.shapes.ring(bx - s * 0.3, by - s * 0.3, s * 0.16, s * 0.1, 10, -0.5), { wash: PAL.paper, sw: 0, washOp: 0.5 });
    }
  },
};
