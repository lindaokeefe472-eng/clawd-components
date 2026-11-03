import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const ch_willow_tree: ComponentDef<ClawdApi> = {
name: 'ch_willow_tree',
  style: 'clawd',
  kind: 'actor',
  description: 'A watercolour willow tree with a curved clay trunk, a broad rounded canopy, and long drooping branches, anchored at its bottom centre and measuring 430×480 px. It is suited to outdoor park, riverside, or garden scenes as a ground-standing tree.',
  tags: ['catalog', 'outdoor', 'willow', 'tree', 'plant', 'ground', 'watercolour'],
  size: [430, 480],
  params: {
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Controls how far the canopy and hanging branches sway; 0 is still, higher values increase motion.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the animation cycle in radians so multiple copies do not sway in sync.' },
    hue: { type: 'string', default: 'sap', description: 'Selects the canopy wash colour from the palette; the default \'sap\' gives a green canopy.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { wind = 1, phase = 0, hue = 'sap' } = params as { wind?: number; phase?: number; hue?: string };
    const { PAL } = api;
    const sway = Math.sin(t * 0.72 + phase);
    const canopy = (PAL as Record<string, string>)[hue] || PAL.sap;
    const cy = -330;

    // 地面阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -7, 108, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 树根
    api.paint(ctx, [[-28, -8], [-64, 0], [-26, -34]], { wash: PAL.clay, sw: 2.8 });
    api.paint(ctx, [[28, -8], [62, 0], [26, -34]], { wash: PAL.clay, sw: 2.8 });

    // 树干（微微弯曲）
    const trunk: P2[] = [[-28, 0], [-20, -100], [-14, -200], [-26, -268], [-4, -300], [16, -272], [10, -196], [18, -96], [28, 0]];
    api.paint(ctx, trunk, { wash: PAL.clay, sw: 3.6 });
    api.inkLine(ctx, api.shapes.line(-8, -30, -12, -240, 4, 14, 3), 1.5, 'rgba(90,60,45,0.4)');
    api.inkLine(ctx, api.shapes.line(10, -40, 8, -190, -2, 12, 6), 1.2, 'rgba(90,60,45,0.28)');
    api.inkLine(ctx, api.shapes.line(-6, -160, 6, -168, 1, 4, 9), 1.2, 'rgba(90,60,45,0.3)');

    // 分枝
    const branches: Array<[number, number, number, number]> = [
      [-6, -292, -88, -352],
      [10, -288, 84, -344],
      [-10, -258, -118, -300],
      [12, -250, 112, -292],
    ];
    for (let i = 0; i < branches.length; i++) {
      const [x0, y0, x1, y1] = branches[i];
      api.inkLine(ctx, api.shapes.line(x0, y0, x1, y1, (i % 2 ? 1 : -1) * 12, 10, i + 2), 4, PAL.clay);
    }

    // 树冠轮廓：以若干圆求包络，只描一条外轮廓
    const blobs: Array<[number, number, number, number]> = [
      [-124, cy + 26, 74, 62],
      [-58, cy - 22, 92, 74],
      [24, cy - 34, 96, 78],
      [104, cy + 18, 78, 62],
      [-16, cy + 30, 100, 60],
      [62, cy + 34, 82, 56],
    ];
    // 射线与各椭圆求交，取最远交点 -> 并集外轮廓
    const rayT = (dx: number, dy: number, bx: number, by: number, a: number, b: number): number => {
      const A = (dx * dx) / (a * a) + (dy * dy) / (b * b);
      const B = -2 * ((dx * bx) / (a * a) + (dy * by) / (b * b));
      const C = (bx * bx) / (a * a) + (by * by) / (b * b) - 1;
      const disc = B * B - 4 * A * C;
      if (disc <= 0) return 0;
      return (-B + Math.sqrt(disc)) / (2 * A);
    };
    const sil: P2[] = [];
    const N = 76;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      let best = 0;
      for (let b = 0; b < blobs.length; b++) {
        const [bx, by, brx, bry] = blobs[b];
        const tHit = rayT(dx, dy, bx + sway * 8 * wind, by - cy, brx, bry);
        if (tHit > best) best = tHit;
      }
      sil.push([dx * best, cy + dy * best + Math.sin(t * 1.05 + a * 1.5 + phase) * 2.5]);
    }
    api.glow(ctx, -40, cy - 40, 150, '#fff3cf', 0.08);
    api.paint(ctx, sil, { wash: canopy, sw: 3.4, washOp: 0.9 });

    // 内部深色水彩块
    for (let i = 0; i < 4; i++) {
      const a = i * 1.5 + phase;
      api.paint(ctx, api.shapes.ring(Math.cos(a) * 70 + sway * 4, cy + 24 + Math.sin(a) * 22, 54, 24, 20, 0, 0.07, i + 4), {
        wash: canopy,
        sw: 0,
        washOp: 0.28,
      });
    }
    api.paint(ctx, api.shapes.ring(-64 + sway * 6, cy - 56, 52, 24, 22, 0, 0.05, 11), { wash: PAL.paper, sw: 0, washOp: 0.2 });

    // 垂柳枝条
    for (let i = 0; i < 13; i++) {
      const spread = (i - 6) / 6;
      const bx = spread * 138;
      const len = 168 + api.shapes.hash(i + 7) * 104;
      const pts: P2[] = [];
      for (let k = 0; k <= 16; k++) {
        const u = k / 16;
        const wave = Math.sin(u * 3.2 + t * 1.5 + i * 0.85 + phase) * 7 * u;
        pts.push([
          bx + spread * 26 * Math.sin(u * 1.7) + sway * (5 + u * 24) * wind + wave,
          cy + 40 + u * len * (1 - 0.16 * Math.abs(spread)),
        ]);
      }
      api.inkLine(ctx, pts, 2.1, 'rgba(84,116,76,0.8)');
      for (let k = 2; k <= 15; k += 2) {
        const p = pts[k];
        const side = k % 4 === 0 ? 1 : -1;
        api.paint(ctx, api.shapes.ring(p[0] + side * 6, p[1], 6, 3.2, 8, side * 0.5), {
          wash: canopy,
          sw: 0,
          washOp: 0.75,
        });
      }
    }
  },
};
