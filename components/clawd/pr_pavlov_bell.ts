import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_pavlov_bell: ComponentDef<ClawdApi> = {
name: 'pr_pavlov_bell',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour brass handbell with an arched handle and a swinging clapper, drawn beside a small metal food bowl holding two treats, with faint teal sound arcs and a dotted arrow linking bell to bowl. It sits on its shadow at the bottom-centre anchor in a 260×230 px box and is suited to classroom, psychology or laboratory scenes as a small ground prop.',
  tags: ['catalog', 'psychology', 'bell', 'brass', 'prop', 'ground', 'decor'],
  size: [260, 230],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the animation timing in radians, desynchronising swing, sound waves and arrow dots between copies.' },
    ring: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of ringing: scales the bell\'s rocking tilt, the clapper swing and the opacity of the sound arcs; 0 leaves it silent and still.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, ring = 1 } = params as { phase?: number; ring?: number };
    const { PAL } = api;
    const tick = Math.sin(t * 11 + phase) * 0.03 * ring;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(-26, -5, 74, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 铃铛
    ctx.save();
    ctx.translate(-26, -10);
    ctx.rotate(tick);
    // 提手（贴住钟顶，不悬浮）
    api.inkLine(ctx, api.shapes.line(0, -112, 0, -122, 0, 3, 2), 6, '#c98f2f');
    api.inkLine(ctx, api.shapes.arc(0, -132, 13, 12, Math.PI, Math.PI * 2, 12), 6, '#c98f2f');
    api.inkLine(ctx, api.shapes.arc(0, -132, 13, 12, Math.PI, Math.PI * 2, 12), 2, PAL.ink);
    // 钟体轮廓
    const body: P2[] = api.shapes.poly(
      [[-58, -14], [-52, -44], [-38, -92], [-20, -112], [20, -112], [38, -92], [52, -44], [58, -14]],
      4,
    );
    api.paint(ctx, body, { wash: PAL.ochre, sw: 3.6 });
    // 高光与暗部
    api.paint(ctx, api.shapes.poly([[-44, -32], [-36, -92], [-16, -106], [-22, -40]], 3), { wash: '#f4d79a', sw: 0, washOp: 0.75 });
    api.paint(ctx, api.shapes.poly([[26, -30], [34, -86], [18, -104], [14, -34]], 3), { wash: '#b8802a', sw: 0, washOp: 0.35 });
    // 钟口与铃舌
    api.paint(ctx, api.shapes.ring(0, -14, 58, 11, 28), { wash: '#d9a441', sw: 3 });
    api.paint(ctx, api.shapes.ring(0, -10, 44, 7, 22), { wash: 'rgba(90,55,20,0.35)', sw: 0 });
    ctx.restore();

    // 铃舌（露在钟口外，随敲击摆动）
    const clap = Math.sin(t * 11 + phase) * 5 * ring;
    api.paint(ctx, api.shapes.ring(-26 + clap, -2, 9, 9, 14), { wash: '#8a6a3a', sw: 2.4 });

    // 声波
    if (ring > 0) {
      for (let i = 0; i < 3; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 4 - i * 0.8 + phase);
        api.inkLine(ctx, api.shapes.arc(-26, -70, 70 + i * 15, 48 + i * 11, -0.75, 0.75, 12), 2.2, `rgba(79,156,152,${0.42 * k * ring})`);
        api.inkLine(ctx, api.shapes.arc(-26, -70, 70 + i * 15, 48 + i * 11, Math.PI - 0.75, Math.PI + 0.75, 12), 2.2, `rgba(79,156,152,${0.34 * k * ring})`);
      }
    }

    // 食盆与奖励
    api.paint(ctx, api.shapes.poly([[60, -14], [114, -14], [106, -40], [68, -40]], 3), { wash: '#cfd8d6', sw: 2.8 });
    api.paint(ctx, api.shapes.ring(87, -40, 19, 7, 16), { wash: '#e9efed', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(80, -44, 7, 4, 10), { wash: PAL.clay, sw: 1.6 });
    api.paint(ctx, api.shapes.ring(94, -42, 6, 4, 10), { wash: PAL.ochre, sw: 1.6 });

    // 条件反射的虚线箭头：铃 -> 盆
    for (let i = 0; i < 5; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.1 + phase);
      api.paint(ctx, api.shapes.ring(28 + i * 8, -96 - i * 4, 2.2, 2.2, 8), { wash: PAL.ink, sw: 0, washOp: 0.18 + 0.4 * k });
    }
  },
};
