import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const bg_forest_hills_bg: ComponentDef<ClawdApi> = {
name: 'bg_forest_hills_bg',
  style: 'clawd',
  kind: 'background',
  description: 'A soft watercolour landscape background with a warm sky, sun glow, layered blue-green hills, drifting mist bands, a row of small trees and a grassy foreground slope with swaying blades. Sized 1920×1080 with a bottom-centre anchor, it works as a reusable scenic backdrop behind characters or objects. Near ground line is about y 960 (a gently sloping grass bank), with a good standing band around y 960-1040.',
  tags: ['catalog', 'background', 'forest', 'hills', 'landscape', 'watercolour', 'scenery'],
  size: [1920, 1080],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the slow mist and grass sway animation; useful for desynchronising multiple copies.' },
    sun: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls the sun glow and disc, from hidden at 0 to full at 1.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, sun = 1 } = params as { phase?: number; sun?: number };
    const { PAL } = api;

    // 纸底 + 天空暖霞
    ctx.save();
    ctx.fillStyle = '#f5edda';
    ctx.fillRect(0, 0, 1920, 1080);
    ctx.restore();
    api.paint(ctx, api.shapes.ring(900, 260, 900, 300, 44, 0, 0.05, 5), { wash: '#f6e2bb', sw: 0, washOp: 0.45 });
    api.paint(ctx, api.shapes.ring(320, 180, 520, 220, 36, 0, 0.06, 9), { wash: '#f2e6c8', sw: 0, washOp: 0.4 });

    // 太阳与水彩晕
    if (sun > 0) {
      api.glow(ctx, 1380, 250, 420, '#f6d68a', 0.28 * sun);
      api.glow(ctx, 1380, 250, 180, '#ffe9b8', 0.4 * sun);
      api.paint(ctx, api.shapes.ring(1380, 250, 96, 96, 40, 0, 0.03, 3), { wash: '#f7dda0', sw: 3, washOp: 0.9 });
      api.paint(ctx, api.shapes.ring(1358, 232, 42, 40, 20, -0.3), { wash: PAL.paper, sw: 0, washOp: 0.4 });
    }

    // 远山（雾蓝）
    const far: P2[] = [[-40, 700]];
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      far.push([u * 2000 - 40, 700 - Math.sin(u * 3.1 + 0.4) * 120 - Math.sin(u * 7.3) * 46]);
    }
    far.push([1960, 760], [1960, 900], [-40, 900]);
    api.paint(ctx, far, { wash: '#bfc4d2', sw: 3, washOp: 0.9 });

    // 远山暗面
    for (let i = 0; i < 5; i++) {
      const x = 180 + i * 400;
      api.paint(ctx, api.shapes.ring(x, 700 + api.shapes.jit(i, 24), 130, 40, 20, 0.1, 0.1, i + 4), { wash: '#a9aec0', sw: 0, washOp: 0.35 });
    }

    // 中山（远景林线）
    const mid: P2[] = [[-40, 830]];
    for (let i = 0; i <= 30; i++) {
      const u = i / 30;
      mid.push([u * 2000 - 40, 830 - Math.sin(u * 4.4 + 1.1) * 90 - Math.sin(u * 11) * 22]);
    }
    mid.push([1960, 900], [1960, 1000], [-40, 1000]);
    api.paint(ctx, mid, { wash: '#a3b89b', sw: 3, washOp: 0.94 });

    // 雾带（缓慢起伏）
    for (let i = 0; i < 3; i++) {
      const y = 700 + i * 62 + Math.sin(t * 0.35 + i + phase) * 8;
      api.paint(
        ctx,
        api.shapes.ring(960 + Math.sin(t * 0.22 + i) * 40, y, 900 - i * 120, 26, 40, 0, 0.04, i + 4),
        { wash: PAL.paper, sw: 0, washOp: 0.2 - i * 0.05 }
      );
    }

    // 远树（成排的墨线小树）
    for (let i = 0; i < 22; i++) {
      const x = 60 + i * 86 + api.shapes.jit(i, 26);
      const y = 862 + api.shapes.jit(i + 30, 22);
      const h = 44 + api.shapes.hash(i + 7) * 40;
      const w = h * 0.46;
      api.paint(ctx, [[x, y - h], [x + w, y - h * 0.32], [x + w * 0.6, y], [x - w * 0.6, y], [x - w, y - h * 0.32]], {
        wash: '#7e9a7c',
        sw: 1.8,
        washOp: 0.62 + (i % 3) * 0.1,
      });
    }

    // 近景草坡
    const near: P2[] = [];
    near.push([-40, 1180]);
    for (let i = 0; i <= 32; i++) {
      const u = i / 32;
      near.push([u * 2000 - 40, 960 - Math.sin(u * 3.4 + 2.2) * 46 - Math.sin(u * 8.1 + 1) * 14]);
    }
    near.push([1960, 1180]);
    api.paint(ctx, near, { wash: '#bccc9e', sw: 3.2, washOp: 0.97 });
    // 草坡上的深色斑
    for (let i = 0; i < 9; i++) {
      const x = 90 + i * 210 + api.shapes.jit(i + 12, 40);
      api.paint(ctx, api.shapes.ring(x, 1035 + api.shapes.jit(i, 20), 95, 20, 22, 0, 0.08, i + 3), {
        wash: '#93ab7c',
        sw: 0,
        washOp: 0.3,
      });
    }

    // 前排草丛剪影
    for (let i = 0; i < 46; i++) {
      const x = 20 + i * 43 + api.shapes.jit(i + 5, 18);
      const h = 22 + Math.abs(api.shapes.jit(i + 19, 26));
      const s = Math.sin(t * 1.2 + i * 0.7 + phase) * 5;
      api.inkLine(ctx, [[x, 1070], [x + s, 1070 - h]], 2.4, 'rgba(96,122,86,0.8)');
      api.inkLine(ctx, [[x + 8, 1070], [x + 8 - s * 0.8, 1064 - h * 0.7]], 2, 'rgba(96,122,86,0.6)');
    }

    // 纸纹颗粒（伪随机哈希，非 Math.random）
    ctx.save();
    for (let i = 0; i < 220; i++) {
      const x = api.shapes.hash(i * 1.7) * 1920;
      const y = api.shapes.hash(i * 2.9 + 5) * 1080;
      const r = 1 + api.shapes.hash(i * 3.3 + 9) * 2.4;
      ctx.globalAlpha = 0.04 + api.shapes.hash(i + 2) * 0.05;
      ctx.fillStyle = api.shapes.hash(i + 7) > 0.5 ? '#8b7a63' : '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
