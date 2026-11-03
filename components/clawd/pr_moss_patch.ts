import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_moss_patch: ComponentDef<ClawdApi> = {
name: 'pr_moss_patch',
  style: 'clawd',
  kind: 'prop',
  description: 'A rounded grey pebble capped by a lobed layer of green watercolour moss, with fine fuzz strokes, thin spore stalks, a few dew drops and a damp shadow at its base. It measures 320×200 px with the anchor at the bottom centre, and works as a small ground detail on a forest floor, garden bed or stone path.',
  tags: ['catalog', 'plants', 'moss', 'stone', 'ground', 'decor'],
  size: [320, 200],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the wobble of the moss edge and spore stalks, used to desynchronise multiple copies.' },
    damp: { type: 'number', default: 1, min: 0, max: 1, description: 'Wetness level: controls the opacity of the dew drops and the damp stain around the base of the stone.' },
    spores: { type: 'number', default: 1, min: 0, max: 1, description: 'Density and opacity of the slender spore stalks rising from the moss; below 0.2 they are hidden entirely.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, damp = 1, spores = 1 } = params as { phase?: number; damp?: number; spores?: number };

    // 地面
    api.paint(ctx, api.shapes.ring(0, -10, 142, 12, 24, 0, 0.06, 3), { wash: '#b9a67d', sw: 0, washOp: 0.4 });

    // 石头（圆润的卵石，被苔藓盖住上半）
    const stone = api.shapes.poly([[-132, -12], [-124, -52], [-84, -78], [0, -86], [76, -78], [118, -52], [128, -12]], 6);
    api.paint(ctx, stone, { wash: '#a79c88', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-124, -30], [-112, -60], [-70, -80], [4, -86], [70, -78], [110, -56], [118, -34], [0, -46]], 5), {
      wash: '#bdb2a0',
      sw: 0,
      washOp: 0.85,
    });
    // 石面上的裂纹与暗部
    api.paint(ctx, api.shapes.poly([[40, -12], [128, -12], [120, -46], [58, -52]], 4), { wash: '#8a8071', sw: 0, washOp: 0.4 });
    api.inkLine(ctx, api.shapes.poly([[8, -70], [-6, -50], [14, -34], [-2, -16]], 3), 1.4, 'rgba(90,84,72,0.4)');

    // 苔藓：覆盖石顶的一层，边缘呈齿状
    const capPts: P2[] = [];
    for (let i = 0; i <= 16; i++) {
      const u = i / 16;
      const x = api.shapes.lerp(-118, 112, u);
      const lift = Math.sin(u * Math.PI) * 26 + Math.sin(u * Math.PI * 5 + phase) * 3;
      capPts.push([x, -58 - lift + Math.sin(t * 1.2 + u * 4 + phase) * 1.4]);
    }
    // 下缘贴合石顶弧线
    for (let i = 16; i >= 0; i--) {
      const u = i / 16;
      const x = api.shapes.lerp(-118, 112, u);
      const base = -30 - Math.sin(u * Math.PI) * 40;
      // 齿状下缘
      capPts.push([x, base + (i % 2 === 0 ? 8 : -4)]);
    }
    api.paint(ctx, capPts, { wash: '#7fa356', sw: 2.6 });
    // 苔藓上的亮块与暗块
    for (let i = 0; i < 9; i++) {
      const u = (i + 0.5) / 9;
      const x = api.shapes.lerp(-108, 104, u);
      const y = -62 - Math.sin(u * Math.PI) * 22 + api.shapes.jit(i, 8);
      const r = 12 + api.shapes.hash(i + 2) * 10;
      api.paint(ctx, api.shapes.ring(x, y, r, r * 0.66, 12, 0, 0.2, i + 3), { wash: i % 3 === 0 ? '#a3c07a' : i % 3 === 1 ? '#8fb463' : '#6d8f55', sw: 0, washOp: 0.95 });
    }
    // 绒面短线
    for (let i = 0; i < 24; i++) {
      const u = api.shapes.hash(i + 31);
      const x = api.shapes.lerp(-110, 106, u);
      const y = -56 - Math.sin(u * Math.PI) * 24 - api.shapes.hash(i + 41) * 12;
      api.inkLine(ctx, api.shapes.line(x, y, x + api.shapes.jit(i, 3), y - 6 - api.shapes.hash(i) * 4, 0, 2, i + 4), 1.4, 'rgba(74,104,54,0.55)');
    }

    // 孢子囊
    if (spores > 0.2) {
      for (let i = 0; i < 5; i++) {
        const u = (i + 0.5) / 5;
        const x = api.shapes.lerp(-90, 86, u) + api.shapes.jit(i, 8);
        const baseY = -74 - Math.sin(u * Math.PI) * 12;
        const hh = 34 + api.shapes.hash(i + 9) * 22;
        const k = Math.sin(t * 1.5 + i + phase) * 2.4 * (params && typeof params.wind === 'number' ? params.wind : 1);
        api.inkLine(ctx, api.shapes.line(x, baseY, x + k, baseY - hh, 0, 4, i + 6), 1.6, 'rgba(120,96,60,0.85)');
        api.paint(ctx, api.shapes.ring(x + k, baseY - hh - 6, 6.4, 8, 10, 0.1), { wash: '#c79a6a', sw: 1.2, washOp: 0.92 * spores });
        api.paint(ctx, api.shapes.ring(x + k, baseY - hh - 8, 3, 3, 8), { wash: '#8a6d4e', sw: 0, washOp: 0.8 * spores });
      }
    }
    // 露珠
    for (let i = 0; i < 3; i++) {
      api.paint(ctx, api.shapes.ring(-64 + i * 62, -46 - i * 6, 5, 4.4, 10), { wash: '#ffffff', sw: 1, washOp: 0.65 * damp });
    }
    // 石头根部的湿痕
    api.paint(ctx, api.shapes.ring(0, -14, 128, 10, 20, 0, 0.08, 9), { wash: '#6b6656', sw: 0, washOp: 0.2 * damp });
  },
};
