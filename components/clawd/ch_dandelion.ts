import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const ch_dandelion: ComponentDef<ClawdApi> = {
name: 'ch_dandelion',
  style: 'clawd',
  kind: 'actor',
  description: 'A watercolour dandelion with a rosette of sap-green leaves at the base, a thin two-segment stem, and a pale seed head built from layered rings of radiating pappus florets; loose seeds drift off to the right. It is 406×370 px with the anchor at the bottom centre, suited as a meadow or garden plant that sways in the wind.',
  tags: ['catalog', 'outdoor', 'dandelion', 'plant', 'flower', 'ground', 'meadow', 'swaying'],
  size: [406, 370],
  params: {
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Strength of the stem\'s swaying motion; 0 holds the flower still, higher values bend it further.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the sway and seed drift, used to desynchronise several copies.' },
    seeds: { type: 'number', default: 0.7, min: 0, max: 1, description: 'How many loose seeds float away from the head and how far they drift; 0 removes them.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { wind = 1, phase = 0, seeds = 0.7 } = params as { wind?: number; phase?: number; seeds?: number };
    const { PAL } = api;
    const sway = Math.sin(t * 1.05 + phase) * 0.05 * wind;
    const headX = 34;
    const headY = -252;

    // 底部叶丛
    for (let i = 0; i < 5; i++) {
      const a = -0.9 + i * 0.42;
      const len = 42 + api.shapes.hash(i + 3) * 26;
      api.paint(
        ctx,
        api.shapes.ring(Math.cos(a) * 26, -18 + Math.sin(a) * 6, len * 0.5, 11, 16, a * 0.5, 0.08, i + 2),
        { wash: PAL.sap, sw: 2.2, washOp: 0.85 }
      );
    }
    api.inkLine(ctx, api.shapes.line(-24, -22, 26, -24, 1, 6, 4), 1.4, 'rgba(90,110,70,0.4)');

    // 花茎
    ctx.save();
    ctx.translate(0, -16);
    ctx.rotate(sway);
    api.inkLine(ctx, api.shapes.line(0, 0, headX * 0.35, -120, 3, 10, 3), 3, '#93a874');
    api.inkLine(ctx, api.shapes.line(headX * 0.35, -120, headX, -230, -4, 10, 6), 3.2, '#93a874');
    ctx.restore();

    // 花托
    const cx = headX + sway * 44;
    const cy = headY + 8;
    api.paint(ctx, api.shapes.ring(cx, cy, 12, 9, 14), { wash: '#b7c294', sw: 2.4 });

    // 蒲公英绒球：多层放射的种子
    const rings = 5;
    for (let r = 0; r < rings; r++) {
      const n = 7 + r * 4;
      const rad = 16 + r * 11;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + r * 0.6 + Math.sin(t * 0.9 + r) * 0.03;
        const k = 0.86 + 0.14 * Math.sin(t * 2 + i + phase);
        const x0 = cx + Math.cos(a) * rad * 0.35;
        const y0 = cy + Math.sin(a) * rad * 0.35 - rad * 0.2;
        const x1 = cx + Math.cos(a) * rad * k;
        const y1 = cy + Math.sin(a) * rad * k - rad * 0.25;
        api.inkLine(ctx, [[x0, y0], [x1, y1]], 1.1, `rgba(170,160,140,${0.5 - r * 0.05})`);
        api.glow(ctx, x1, y1, 5, '#fff8e6', 0.16);
        api.paint(ctx, api.shapes.ring(x1, y1, 2.2, 2.2, 6), { wash: '#fffaf0', sw: 0, washOp: 0.9 });
      }
    }
    api.paint(ctx, api.shapes.ring(cx, cy, 9, 8, 12), { wash: PAL.paper, sw: 0, washOp: 0.55 });

    // 随风飘走的种子（位置用正弦偏移，不做取模循环）
    if (seeds > 0) {
      for (let i = 0; i < 8; i++) {
        const ph = i * 1.83 + phase;
        const drift = (Math.sin(t * 0.7 + ph) * 0.5 + 0.5) * 150 * seeds;
        const x = cx + 26 + drift + i * 6;
        const y = cy - 20 - i * 13 + Math.sin(t * 1.6 + ph) * 12;
        const rot = Math.sin(t * 1.2 + ph) * 0.5;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        api.inkLine(ctx, [[0, 0], [0, 9]], 1.2, 'rgba(160,150,132,0.8)');
        for (let k = 0; k < 5; k++) {
          const a = -2.4 + k * 0.6;
          api.inkLine(ctx, [[0, 0], [Math.cos(a) * 8, Math.sin(a) * 8 - 3]], 0.9, 'rgba(170,160,142,0.6)');
        }
        api.paint(ctx, api.shapes.ring(0, 10, 2, 2, 6), { wash: '#cdbb95', sw: 0, washOp: 0.9 });
        ctx.restore();
      }
    }
  },
};
