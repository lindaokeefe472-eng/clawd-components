import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const ch_paper_boat: ComponentDef<ClawdApi> = {
name: 'ch_paper_boat',
  style: 'clawd',
  kind: 'actor',
  description: 'A watercolour folded paper boat with a trapezoid hull, crease lines, two triangular sails around a mast and a small rose flag, bobbing and rolling on soft teal ripples above a faint reflection. Anchor is bottom centre, 276×165 px; good as a floating prop on ponds, puddles or shorelines in gentle idle scenes.',
  tags: ['catalog', 'boat', 'paper', 'water', 'toy', 'floating', 'decor', 'character'],
  size: [276, 165],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the bobbing, rolling, ripple and flag cycles so copies do not move in sync.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Wind strength; scales how far the boat rolls side to side (0 keeps it level, higher values rock it more).' },
    ink: { type: 'number', default: 0, min: 0, max: 1, description: 'Ink amount passed to the hull, sail and outline strokes; higher values darken and strengthen the line work.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wind = 1, ink: inkCol } = params as { phase?: number; wind?: number; ink?: string };
    const { PAL } = api;
    const bob = Math.sin(t * 1.5 + phase) * 4;
    const roll = Math.sin(t * 1.2 + phase * 0.7) * 0.05 * wind;
    const ink = inkCol || PAL.ink;

    // 水面涟漪
    for (let i = 0; i < 3; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 1.1 + i * 1.3 + phase);
      api.inkLine(
        ctx,
        api.shapes.arc(0, -12 - i * 11, 92 + i * 22, 8 + i * 4, Math.PI * 0.06, Math.PI * 0.94, 18),
        1.4 + i * 0.2,
        `rgba(79,156,152,${0.22 - i * 0.05 + k * 0.12})`
      );
    }

    ctx.save();
    ctx.translate(0, bob);
    ctx.translate(0, -22);
    ctx.rotate(roll);
    ctx.translate(0, 22);

    // 船身（纸折梯形 + 中央折线）
    const hull: P2[] = [[-78, -46], [78, -46], [48, -12], [-48, -12]];
    api.paint(ctx, hull, { wash: PAL.paper, sw: 3.2, ink });
    // 折痕
    api.inkLine(ctx, api.shapes.line(-78, -46, -48, -12, 0, 5, 2), 1.5, 'rgba(58,47,42,0.45)');
    api.inkLine(ctx, api.shapes.line(78, -46, 48, -12, 0, 5, 3), 1.5, 'rgba(58,47,42,0.45)');
    api.inkLine(ctx, api.shapes.line(-26, -46, -18, -12, 0, 4, 5), 1.2, 'rgba(58,47,42,0.25)');
    api.inkLine(ctx, api.shapes.line(26, -46, 18, -12, 0, 4, 7), 1.2, 'rgba(58,47,42,0.25)');
    api.inkLine(ctx, api.shapes.line(-48, -12, 48, -12, 0, 6, 4), 2, ink);

    // 纸帆（一大一小两面）
    api.paint(ctx, [[0, -124], [-56, -48], [0, -48]], { wash: '#f4e8d0', sw: 3, ink });
    api.paint(ctx, [[0, -124], [0, -48], [52, -48]], { wash: '#eadfc6', sw: 3, ink });
    api.paint(ctx, [[0, -124], [0, -48], [52, -48]], { wash: PAL.sky, sw: 0, washOp: 0.42 });
    api.inkLine(ctx, api.shapes.line(0, -124, 0, -46, 0, 8, 6), 2.2, ink);
    api.inkLine(ctx, api.shapes.line(-40, -62, -12, -62, 0, 4, 8), 1.3, 'rgba(58,47,42,0.3)');

    // 小旗
    const fl = 0.5 + 0.5 * Math.sin(t * 2.6 + phase);
    api.paint(ctx, [[0, -124], [26, -118 + fl * 4], [0, -110]], { wash: PAL.rose, sw: 2 });
    ctx.restore();

    // 倒影（严格限制在包围盒内）
    ctx.save();
    ctx.globalAlpha = 0.18;
    api.paint(ctx, [[-64, -12], [64, -12], [46, -4], [-46, -4]], { wash: PAL.teal, sw: 0 });
    ctx.restore();
  },
};
