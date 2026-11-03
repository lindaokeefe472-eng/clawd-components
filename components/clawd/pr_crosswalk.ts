import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_crosswalk: ComponentDef<ClawdApi> = {
name: 'pr_crosswalk',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour zebra crossing seen in perspective: a grey asphalt trapezoid framed by pale curbs, seven white stripes narrowing toward the far end, a stop line and small ochre lane dashes, with optional shimmering wet reflections. Anchored at the bottom centre at 420×200 px, it works as a flat ground prop for street, town or rainy-night scenes.',
  tags: ['catalog', 'street', 'crosswalk', 'road', 'ground', 'urban', 'prop'],
  size: [420, 200],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the wet-reflection shimmer, used to desynchronise copies of the crosswalk.' },
    wet: { type: 'number', default: 0, min: 0, max: 1, description: 'Amount of wetness; above 0 adds soft sky-coloured water glints on the asphalt that grow stronger with the value.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wet = 0 } = params as { phase?: number; wet?: number };
    const { PAL } = api;

    // 路面（近大远小的透视梯形）
    api.paint(ctx, api.shapes.poly([[-210, 0], [210, 0], [166, -192], [-166, -192]], 4), { wash: '#82807a', sw: 3.2 });
    // 沥青颗粒
    for (let i = 0; i < 26; i++) {
      const x = api.shapes.jit(i * 2.7, 195) * (1 - Math.abs(api.shapes.jit(i * 1.3, 0.2)));
      const y = -10 - Math.abs(api.shapes.jit(i * 1.9, 178));
      api.paint(ctx, api.shapes.ring(x, y, 1.8, 1.3, 6), { wash: i % 3 ? '#6f6d67' : '#9a978f', sw: 0, washOp: 0.5 });
    }

    // 左右路缘
    api.paint(ctx, api.shapes.poly([[-210, 0], [-186, 0], [-152, -192], [-166, -192]], 3), { wash: '#cfc7b4', sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[210, 0], [186, 0], [152, -192], [166, -192]], 3), { wash: '#cfc7b4', sw: 2.4 });

    // 斑马线：一组横跨车道的白色条纹
    for (let i = 0; i < 7; i++) {
      const u = i / 6;
      const yb = -20 - u * 156;
      const yt = yb - 17;
      const wb = 150 - u * 58;
      const wt = 146 - u * 58;
      api.paint(ctx, api.shapes.poly([[-wb, yb], [wb, yb], [wt, yt], [-wt, yt]], 3), {
        wash: '#fdf9ec',
        sw: 2,
        washOp: 0.88,
      });
    }

    // 停止线（远端）
    api.paint(ctx, api.shapes.poly([[-140, -176], [140, -176], [136, -186], [-136, -186]], 3), { wash: PAL.paper, sw: 0, washOp: 0.6 });

    // 车道虚线（近端）
    for (let i = 0; i < 3; i++) {
      api.paint(ctx, api.shapes.poly([[-8, -6 - i * 4], [8, -6 - i * 4], [7, -14 - i * 4], [-7, -14 - i * 4]], 2), {
        wash: PAL.ochre,
        sw: 0,
        washOp: 0.5,
      });
    }

    // 雨后水光
    if (wet > 0) {
      for (let i = 0; i < 3; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 1.4 + i * 2 + phase);
        api.paint(ctx, api.shapes.ring(-76 + i * 76, -48 - i * 26, 44, 9, 16, 0, 0.1, i + 3), {
          wash: PAL.sky,
          sw: 0,
          washOp: 0.2 * k * wet,
        });
      }
    }
  },
};
