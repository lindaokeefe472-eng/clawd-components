import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_speed_bump: ComponentDef<ClawdApi> = {
name: 'pr_speed_bump',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour speed bump shown as a black-and-yellow striped hump on a grey road patch with faded lane edges and two white road arrows. It is anchored at the bottom centre and measures 340×160 px, suitable for street scenes or traffic-calming props.',
  tags: ['catalog', 'street', 'speed-bump', 'road', 'ground', 'prop', 'watercolour'],
  size: [340, 160],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the wet-reflection shimmer cycle to desynchronise multiple copies.' },
    wet: { type: 'number', default: 0, min: 0, max: 1, description: 'Increases the wet road reflection and sheen beneath the bump.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wet = 0 } = params as { phase?: number; wet?: number };
    const { PAL } = api;

    // 路面
    api.paint(ctx, api.shapes.poly([[-170, 0], [170, 0], [152, -146], [-152, -146]], 4), { wash: '#82807a', sw: 3 });
    for (let i = 0; i < 14; i++) {
      api.paint(ctx, api.shapes.ring(api.shapes.jit(i * 3.3, 140), -8 - Math.abs(api.shapes.jit(i * 1.7, 120)), 2, 1.4, 6), {
        wash: i % 3 ? '#6f6d67' : '#9a978f',
        sw: 0,
        washOp: 0.45,
      });
    }
    // 车道边线
    api.inkLine(ctx, api.shapes.line(-152, -8, -138, -140, 1, 12, 3), 2.4, 'rgba(246,239,223,0.5)');
    api.inkLine(ctx, api.shapes.line(152, -8, 138, -140, -1, 12, 5), 2.4, 'rgba(246,239,223,0.5)');

    // 减速带：用一条鼓包曲线切分黑黄段，避免斜纹错位
    const top = (x: number): number => -34 - 40 * (1 - Math.pow(x / 150, 2));
    const base = (x: number): number => -22 - 4 * (1 - Math.pow(x / 150, 2));
    const SEG = 9;
    for (let i = 0; i < SEG; i++) {
      const x0 = -150 + (i * 300) / SEG;
      const x1 = -150 + ((i + 1) * 300) / SEG;
      const pts: P2[] = [];
      for (let k = 0; k <= 5; k++) {
        const x = api.shapes.lerp(x0, x1, k / 5);
        pts.push([x, top(x)]);
      }
      for (let k = 5; k >= 0; k--) {
        const x = api.shapes.lerp(x0, x1, k / 5);
        pts.push([x, base(x)]);
      }
      api.paint(ctx, api.shapes.poly(pts, 2), { wash: i % 2 ? '#d9a441' : '#4a4440', sw: 0, washOp: i % 2 ? 0.95 : 0.88 });
    }
    // 轮廓
    const outline: P2[] = [];
    for (let i = 0; i <= 16; i++) outline.push([api.shapes.lerp(-150, 150, i / 16), top(api.shapes.lerp(-150, 150, i / 16))]);
    for (let i = 16; i >= 0; i--) outline.push([api.shapes.lerp(-150, 150, i / 16), base(api.shapes.lerp(-150, 150, i / 16))]);
    api.inkLine(ctx, api.shapes.poly(outline, 2), 2.8, PAL.ink);
    // 上沿高光
    const hi: P2[] = [];
    for (let i = 2; i <= 9; i++) hi.push([api.shapes.lerp(-150, 150, i / 16), top(api.shapes.lerp(-150, 150, i / 16)) + 3]);
    api.inkLine(ctx, hi, 2, 'rgba(246,239,223,0.4)');

    // 路面上的减速提示箭头
    for (let i = 0; i < 2; i++) {
      const cx = -34 + i * 68;
      api.paint(ctx, api.shapes.poly([[cx - 16, -108], [cx, -122], [cx + 16, -108], [cx + 10, -108], [cx + 10, -94], [cx - 10, -94], [cx - 10, -108]], 2), {
        wash: PAL.paper,
        sw: 1.4,
        washOp: 0.55,
      });
    }

    // 水痕
    if (wet > 0) {
      const k = 0.5 + 0.5 * Math.sin(t * 1.3 + phase);
      api.paint(ctx, api.shapes.poly([[-136, -16], [136, -16], [130, -26], [-130, -26]], 2), { wash: PAL.sky, sw: 0, washOp: 0.16 * k * wet });
    }
  },
};
