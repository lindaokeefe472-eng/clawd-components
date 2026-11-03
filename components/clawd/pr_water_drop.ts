import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_water_drop: ComponentDef<ClawdApi> = {
name: 'pr_water_drop',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour teardrop-shaped water drop with a pale teal wash, white highlights, inner reflections, and a small puddle at its base. It is anchored at the bottom centre, measures 140×220 px, and suits rain, dew, puddle, or nature-scene accents.',
  tags: ['catalog', 'water', 'drop', 'prop', 'ground', 'decor', 'nature'],
  size: [140, 220],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises copies of the drop.' },
    wobble: { type: 'number', default: 1, min: 0, max: 2, description: 'Amount of side-to-side wobble in the drop outline.' },
    shine: { type: 'number', default: 1, min: 0, max: 1, description: 'Opacity strength of the white highlights and reflections.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wobble = 1, shine = 1 } = params as { phase?: number; wobble?: number; shine?: number };
    const w = Math.sin(t * 1.8 + phase) * 0.06 * wobble;

    // 水珠：上尖下圆的泪滴形
    // 轮廓：上尖下圆
    const cy = -64;
    const R = 52;
    const shape: P2[] = [];
    shape.push([0, -198]);
    for (let i = 1; i <= 14; i++) {
      const u = i / 14;
      const k = Math.pow(u, 0.65);
      shape.push([Math.sin(k * Math.PI * 0.5) * (R + w * 40), -198 + k * (198 - 64) * 0.86 + Math.sin(k * Math.PI) * 6]);
    }
    for (let i = 1; i <= 14; i++) {
      const u = i / 14;
      const ang = u * Math.PI;
      shape.push([Math.cos(ang) * (R + w * 40), cy + Math.sin(ang) * R]);
    }
    for (let i = 13; i >= 0; i--) {
      const u = i / 14;
      const k = Math.pow(u, 0.65);
      shape.push([-Math.sin(k * Math.PI * 0.5) * (R + w * 40), -198 + k * (198 - 64) * 0.86 + Math.sin(k * Math.PI) * 6]);
    }
    api.paint(ctx, shape, { wash: '#a9d3cf', sw: 3, washOp: 0.92 });
    // 内部折射：暗边 + 亮心
    api.paint(ctx, api.shapes.ring(-6, -60, R * 0.6, R * 0.56, 20, 0, 0.1, 5), { wash: '#cfe9e6', sw: 0, washOp: 0.55 });
    api.paint(ctx, api.shapes.ring(14, -48, R * 0.34, R * 0.3, 16, 0, 0.12, 9), { wash: '#ffffff', sw: 0, washOp: 0.5 * shine });
    // 高光
    api.paint(ctx, api.shapes.ring(-18, -104, 12, 16, 12, -0.4), { wash: '#ffffff', sw: 0, washOp: 0.85 * shine });
    api.paint(ctx, api.shapes.ring(-12, -84, 6, 8, 10, -0.3), { wash: '#ffffff', sw: 0, washOp: 0.6 * shine });
    // 底部反光
    api.inkLine(ctx, api.shapes.arc(0, -60, 34, 30, Math.PI * 0.15, Math.PI * 0.75, 8), 2, 'rgba(255,255,255,0.6)');
    // 尖顶一点水光
    api.paint(ctx, api.shapes.ring(0, -192, 4, 6, 8), { wash: '#ffffff', sw: 0, washOp: 0.7 * shine });
    // 水珠下的一小摊
    api.paint(ctx, api.shapes.ring(0, -8, 40, 7, 18, 0, 0.08, 11), { wash: '#a9d3cf', sw: 0, washOp: 0.45 });
    api.paint(ctx, api.shapes.ring(-8, -10, 16, 3.4, 12), { wash: '#ffffff', sw: 0, washOp: 0.4 });
  },
};
