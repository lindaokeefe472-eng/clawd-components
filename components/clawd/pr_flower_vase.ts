import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_flower_vase: ComponentDef<ClawdApi> = {
name: 'pr_flower_vase',
  style: 'clawd',
  kind: 'prop',
  description: 'A clear glass vase with a narrowed neck, holding stems with leaves and up to three multi-petal blooms, with a translucent blue water wash and white highlight strokes; anchor is bottom centre, 300×360 px. It works as a tabletop or windowsill decor prop in interior and still-life scenes.',
  tags: ['catalog', 'flower', 'vase', 'glass', 'plant', 'decor', 'tabletop'],
  size: [300, 360],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the sway and bloom bobbing animation in radians so several copies do not move in sync.' },
    flowers: { type: 'number', default: 3, min: 0, max: 14, description: 'Number of blooms drawn; the drawing clamps it to 1-3, so values above 3 look the same.' },
    water: { type: 'number', default: 0.6, min: 0, max: 1, description: 'Opacity of the blue water wash inside the vase, from nearly empty to full.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, flowers = 3, water = 0.6 } = params as { phase?: number; flowers?: number; water?: number };
    const { PAL } = api;
    const sway = Math.sin(t * 1.2 + phase) * 4;

    api.paint(ctx, api.shapes.ring(0, -9, 118, 10, 22, 0, 0, 5), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 花茎
    for (let i = 0; i < 3; i++) {
      const pts: P2[] = [];
      for (let s = 0; s <= 8; s++) {
        const u = s / 8;
        pts.push([-34 + i * 34 + Math.sin(u * 2.4 + i) * (10 + sway * 0.6), -196 - u * (94 + i * 16)]);
      }
      api.inkLine(ctx, pts, 3, '#5f7a4f');
      // 叶子
      for (let k = 0; k < 2; k++) {
        const u = 0.35 + k * 0.3;
        const x = -34 + i * 34 + Math.sin(u * 2.4 + i) * 10;
        const y = -196 - u * (94 + i * 16);
        api.paint(ctx, api.shapes.ring(x + (k ? 16 : -14), y, 16, 7, 10, k ? -0.5 : 0.5), { wash: PAL.sap, sw: 1.4, washOp: 0.9 });
      }
    }

    // 花朵
    const bloomCols = [PAL.rose, '#d9a441', '#c47f72'];
    for (let i = 0; i < Math.min(3, Math.max(1, Math.round(flowers))); i++) {
      const bx = -34 + i * 34 + Math.sin(1 * 2.4 + i) * 10;
      const by = -196 - (94 + i * 16);
      const bob = Math.sin(t * 1.5 + i * 1.6 + phase) * 2;
      for (let p = 0; p < 6; p++) {
        const a = (p / 6) * Math.PI * 2 + i;
        api.paint(ctx, api.shapes.ring(bx + Math.cos(a) * 14, by + bob + Math.sin(a) * 12, 12, 9, 12, a), { wash: bloomCols[i], sw: 1.4 });
      }
      api.paint(ctx, api.shapes.ring(bx, by + bob, 8, 8, 12), { wash: PAL.ochre, sw: 1.4 });
      api.paint(ctx, api.shapes.ring(bx - 3, by - 3 + bob, 3, 3, 8), { wash: '#fff6ea', sw: 0, washOp: 0.7 });
    }
    // 小花苞
    api.paint(ctx, api.shapes.ring(52, -300, 7, 10, 10, 0.3), { wash: PAL.rose, sw: 1.2, washOp: 0.9 });

    // 花瓶（玻璃，收颈）
    const vase = api.shapes.poly([[-58, -24], [58, -24], [46, -96], [26, -140], [30, -176], [-30, -176], [-26, -140], [-46, -96]], 5);
    api.paint(ctx, vase, { wash: '#cfe0e2', sw: 3, washOp: 0.92 });
    // 水
    api.paint(ctx, api.shapes.poly([[-52, -30], [52, -30], [44, -92], [26, -132], [-26, -132], [-44, -92]], 4), {
      wash: '#8fb6c6',
      sw: 0,
      washOp: 0.45 + 0.3 * api.shapes.clamp01(water),
    });
    api.inkLine(ctx, api.shapes.line(-48, -88, 46, -88, 0, 6, 4), 1.6, 'rgba(255,255,255,0.6)');
    // 瓶口
    api.paint(ctx, api.shapes.ring(0, -176, 30, 8, 18), { wash: '#b9d0d4', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(0, -176, 22, 5.4, 14), { wash: '#6d8fa0', sw: 0, washOp: 0.55 });
    // 高光与折射
    api.paint(ctx, api.shapes.poly([[-48, -40], [-34, -40], [-28, -128], [-40, -120]], 4), { wash: '#ffffff', sw: 0, washOp: 0.45 });
    api.inkLine(ctx, api.shapes.poly([[34, -40], [48, -40], [36, -96], [30, -76]], 4), 1.6, 'rgba(255,255,255,0.4)');
  },
};
