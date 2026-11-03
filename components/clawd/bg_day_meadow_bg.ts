import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const bg_day_meadow_bg: ComponentDef<ClawdApi> = {
name: 'bg_day_meadow_bg',
  style: 'clawd',
  kind: 'background',
  description: 'A wide watercolour daytime meadow landscape: pale blue sky washes with a soft sun and drifting clouds, a blue-grey mountain ridge fading into a haze band, a tree line on rolling green hills, and a flowered foreground meadow with swaying grass blades, birds and pollen. It is 1920×1080 px, anchored at the bottom centre, and works as a full-bleed backdrop for outdoor daytime scenes. The near meadow ground line is about y 1000, with a good standing band around y 980-1040.',
  tags: ['catalog', 'background', 'day', 'meadow', 'landscape', 'sky', 'watercolour', 'ground'],
  size: [1920, 1080],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts cloud drift, bird bobbing and grass sway, so multiple copies of the scene do not move in sync.' },
    clouds: { type: 'number', default: 1, min: 0, max: 1, description: 'Cloud amount; 0 removes the clouds entirely and any value above 0 draws the three drifting cloud clusters.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, clouds = 1 } = params as { phase?: number; clouds?: number };
    const { PAL } = api;

    // 纸底
    ctx.save();
    ctx.fillStyle = '#f2f2e6';
    ctx.fillRect(0, 0, 1920, 1080);
    ctx.restore();

    // 天空水彩（三团淡彩 + 边缘不规则）
    api.paint(ctx, api.shapes.ring(520, 170, 780, 300, 46, 0, 0.05, 2), { wash: '#bcd9ea', sw: 0, washOp: 0.62 });
    api.paint(ctx, api.shapes.ring(1520, 130, 720, 280, 44, 0, 0.05, 7), { wash: '#cfe6ee', sw: 0, washOp: 0.55 });
    api.paint(ctx, api.shapes.ring(1080, 430, 820, 210, 40, 0, 0.06, 12), { wash: '#fbf0d4', sw: 0, washOp: 0.22 });

    // 太阳
    api.glow(ctx, 330, 220, 330, '#ffe9b0', 0.32);
    api.paint(ctx, api.shapes.ring(330, 220, 78, 78, 36, 0, 0.03, 5), { wash: '#f8d98d', sw: 2.8, washOp: 0.92 });
    api.paint(ctx, api.shapes.ring(310, 204, 30, 26, 18, -0.3), { wash: PAL.paper, sw: 0, washOp: 0.3 });

    // 云
    const cloud = (cx: number, cy: number, s: number, ph: number) => {
      const x = cx + Math.sin(t * 0.35 + ph + phase) * 18;
      const puffs: Array<[number, number, number]> = [
        [-70, 0, 40],
        [-24, -26, 52],
        [38, -18, 46],
        [86, 4, 32],
      ];
      const sil: P2[] = [[x - 104 * s, cy]];
      for (let i = 0; i <= 26; i++) {
        const px = api.shapes.lerp(x - 104 * s, x + 114 * s, i / 26);
        let py = cy;
        for (let k = 0; k < puffs.length; k++) {
          const [ox, oy, r] = puffs[k];
          const rr = r * s;
          const d = px - (x + ox * s);
          if (Math.abs(d) < rr) py = Math.min(py, cy + oy * s - Math.sqrt(rr * rr - d * d));
        }
        sil.push([px, py]);
      }
      sil.push([x + 114 * s, cy]);
      for (let i = 0; i <= 12; i++) sil.push([api.shapes.lerp(x + 100 * s, x - 92 * s, i / 12), cy + Math.sin(i * 0.9 + t * 0.8) * 3 * s]);
      api.paint(ctx, sil, { wash: '#fdfbf3', sw: 2.6, washOp: 0.94 });
      api.paint(ctx, api.shapes.ring(x - 8 * s, cy - 4 * s, 60 * s, 10 * s, 20, 0, 0.05, 8), { wash: PAL.sky, sw: 0, washOp: 0.16 });
    };
    if (clouds > 0) {
      cloud(980, 236, 1.15, 0);
      cloud(1520, 168, 0.78, 2.1);
      cloud(660, 130, 0.58, 4.3);
    }

    // 远山（淡青）
    const peakY = (u: number): number => {
      const p1 = Math.pow(Math.abs(Math.sin(u * 6.2 + 0.55)), 1.9) * 104;
      const p2 = Math.pow(Math.abs(Math.sin(u * 13.4 + 2.3)), 2.4) * 34;
      const p3 = Math.sin(u * 27.3) * 4;
      return 706 - p1 - p2 - p3;
    };
    const farM: P2[] = [[-40, 1120]];
    for (let i = 0; i <= 88; i++) {
      const u = i / 88;
      farM.push([u * 2000 - 40, peakY(u)]);
    }
    farM.push([1960, 1120]);
    api.paint(ctx, farM, { wash: '#c6d9e0', sw: 2.8, washOp: 0.9 });
    // 山体暗面（贴着山脊的水彩块）
    for (let i = 0; i < 6; i++) {
      const u = 0.07 + i * 0.175;
      const x = u * 1920;
      api.paint(ctx, api.shapes.ring(x, peakY(u) + 96, 74, 26, 18, 0.12, 0.1, i + 3), { wash: '#a9c3ce', sw: 0, washOp: 0.34 });
    }
    // 山顶亮面
    for (let i = 0; i < 5; i++) {
      const u = 0.12 + i * 0.19;
      api.paint(ctx, api.shapes.ring(u * 1920, peakY(u) + 20, 42, 14, 14, 0.1, 0.08, i + 7), { wash: '#edf4f5', sw: 0, washOp: 0.6 });
    }

    // 山脚雾带
    api.paint(ctx, api.shapes.ring(860, 806, 900, 40, 42, 0, 0.05, 9), { wash: PAL.paper, sw: 0, washOp: 0.55 });
    api.paint(ctx, api.shapes.ring(1560, 824, 460, 30, 30, 0, 0.05, 14), { wash: PAL.paper, sw: 0, washOp: 0.45 });

    // 中景缓丘
    const midHill: P2[] = [[-40, 1120]];
    for (let i = 0; i <= 36; i++) {
      const u = i / 36;
      midHill.push([u * 2000 - 40, 888 - Math.sin(u * 3.9 + 2.4) * 26 - Math.sin(u * 11 + 0.6) * 8]);
    }
    midHill.push([1960, 1120]);
    api.paint(ctx, midHill, { wash: '#b8c99b', sw: 2.6, washOp: 0.95 });

    // 林线小树（立在中景丘脊上）
    for (let i = 0; i < 28; i++) {
      const x = 20 + i * 72 + api.shapes.jit(i + 3, 24);
      const gy = 884 - Math.sin(((x + 40) / 2000) * 3.9 + 2.4) * 26;
      const h = 50 + api.shapes.hash(i + 6) * 42;
      const w = h * 0.42;
      api.paint(ctx, [[x, gy - h], [x + w, gy - h * 0.3], [x + w * 0.5, gy], [x - w * 0.5, gy], [x - w, gy - h * 0.3]], {
        wash: '#93ae8b',
        sw: 1.5,
        washOp: 0.55 + (i % 3) * 0.08,
      });
    }

    // 前景草甸
    const meadow: P2[] = [[-40, 1120]];
    for (let i = 0; i <= 36; i++) {
      const u = i / 36;
      meadow.push([u * 2000 - 40, 972 - Math.sin(u * 3.2 + 3.2) * 22 - Math.sin(u * 8.7 + 1.4) * 8]);
    }
    meadow.push([1960, 1120]);
    api.paint(ctx, meadow, { wash: '#c6d3a4', sw: 3.2, washOp: 0.97 });

    // 草甸阴影与花点
    for (let i = 0; i < 14; i++) {
      const x = 70 + i * 138 + api.shapes.jit(i + 5, 46);
      const gy = 1006 + api.shapes.jit(i + 9, 24);
      api.paint(ctx, api.shapes.ring(x, gy, 72, 14, 20, 0, 0.08, i + 2), { wash: '#aec08c', sw: 0, washOp: 0.3 });
    }
    for (let i = 0; i < 34; i++) {
      const x = 30 + i * 57 + api.shapes.jit(i + 8, 20);
      const y = 996 + api.shapes.jit(i + 13, 40);
      const s = 1.4 + api.shapes.hash(i + 4) * 1.5;
      api.paint(ctx, api.shapes.ring(x, y, s * 3, s, 8), {
        wash: i % 3 === 0 ? PAL.rose : i % 3 === 1 ? '#f4e7bb' : '#fdfaf0',
        sw: 0,
        washOp: 0.8,
      });
    }

    // 远处飞鸟
    for (let i = 0; i < 4; i++) {
      const x = 1080 + i * 76 + Math.sin(t * 0.5 + i) * 18;
      const y = 330 + i * 26 + Math.sin(t * 1.1 + i * 1.7 + phase) * 6;
      const f = Math.sin(t * 3.4 + i * 2) * 5;
      api.inkLine(ctx, [[x - 15, y], [x - 4, y - 7 - f * 0.4], [x + 2, y]], 1.8, 'rgba(58,47,42,0.45)');
      api.inkLine(ctx, [[x + 2, y], [x + 10, y - 6 - f * 0.3], [x + 20, y]], 1.8, 'rgba(58,47,42,0.4)');
    }

    // 空中花粉
    for (let i = 0; i < 22; i++) {
      const x = api.shapes.hash(i * 1.9) * 1920 + Math.sin(t * 0.5 + i) * 28;
      const y = 500 + api.shapes.hash(i * 3.1 + 4) * 540 + Math.sin(t * 0.8 + i * 1.3) * 18;
      const a = 0.16 + 0.18 * (0.5 + 0.5 * Math.sin(t * 2 + i));
      api.paint(ctx, api.shapes.ring(x, y, 2.4, 2.4, 6), { wash: '#fffbe8', sw: 0, washOp: a });
    }

    // 前景草叶
    for (let i = 0; i < 44; i++) {
      const x = 6 + i * 45 + api.shapes.jit(i + 6, 18);
      const h = 26 + Math.abs(api.shapes.jit(i + 21, 30));
      const sw = Math.sin(t * 1.1 + i * 0.6 + phase) * 6;
      api.inkLine(ctx, [[x, 1080], [x + sw, 1080 - h]], 2.6, 'rgba(110,132,88,0.72)');
    }
  },
};
