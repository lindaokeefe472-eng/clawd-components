import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_iceberg_mind: ComponentDef<ClawdApi> = {
name: 'pr_iceberg_mind',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour cross-section of a floating iceberg: a small flagged tip above the waterline, a much larger submerged body with ink cracks and glowing dots, wavy water lines and a sandy seabed at the bottom. Anchored at the bottom centre at 300×320 px, it works as a diagram-like prop for psychology, metaphor or explanatory scenes.',
  tags: ['catalog', 'iceberg', 'psychology', 'metaphor', 'water', 'diagram', 'floating'],
  size: [300, 320],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the bobbing and ripple animation; use it to desynchronise several copies.' },
    bob: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of horizontal drift/sway of the iceberg; 0 keeps it still, 1 gives the full motion.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, bob = 1 } = params as { phase?: number; bob?: number };
    const { PAL } = api;
    const drift = Math.sin(t * 0.7 + phase) * 2.4 * bob;

    // 水面以上的空气（留白）
    api.paint(ctx, api.shapes.poly([[-130, -190], [130, -190], [130, -122], [-130, -122]], 3), { wash: PAL.sky, sw: 0, washOp: 0.22 });
    // 水体
    api.paint(ctx, api.shapes.poly([[-130, -122], [130, -122], [130, -14], [-130, -14]], 3), { wash: PAL.teal, sw: 0, washOp: 0.4 });
    // 海床
    api.paint(ctx, api.shapes.poly([[-130, -14], [130, -14], [130, 0], [-130, 0]], 3), { wash: '#c9b79a', sw: 2.2 });
    for (let i = 0; i < 5; i++) {
      api.paint(ctx, api.shapes.ring(-96 + i * 48, -8, 9, 4, 10), { wash: 'rgba(140,110,70,0.35)', sw: 0 });
    }

    // 水面波纹
    for (let i = 0; i < 4; i++) {
      const y = -116 + i * 30;
      const pts: P2[] = [];
      for (let k = 0; k <= 12; k++) {
        const u = k / 12;
        pts.push([api.shapes.lerp(-128, 128, u), y + Math.sin(u * 8 + t * 1.2 + i * 0.8 + phase) * 3]);
      }
      api.inkLine(ctx, pts, i === 0 ? 3 : 1.6, i === 0 ? 'rgba(58,47,42,0.45)' : 'rgba(58,47,42,0.18)');
    }

    // 冰山尖（水面以上）
    ctx.save();
    ctx.translate(drift, 0);
    api.paint(ctx, api.shapes.poly([[-52, -120], [-8, -234], [22, -196], [52, -120]], 4), { wash: '#e6f0f0', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-30, -120], [-8, -206], [10, -178], [24, -120]], 3), { wash: '#fbfdfa', sw: 0, washOp: 0.8 });
    // 水下的巨大体积
    api.paint(ctx, api.shapes.poly([[-52, -120], [52, -120], [96, -20], [40, 0], [-40, 0], [-96, -20]], 4), { wash: '#cfe4e6', sw: 3.2, washOp: 0.9 });
    api.paint(ctx, api.shapes.poly([[-40, -118], [40, -118], [66, -34], [12, -6], [-56, -30]], 3), { wash: '#b6d6da', sw: 0, washOp: 0.55 });
    // 内部裂纹
    api.inkLine(ctx, api.shapes.line(-8, -120, -22, -60, 1, 6, 3), 1.4, 'rgba(58,47,42,0.28)');
    api.inkLine(ctx, api.shapes.line(18, -120, 34, -56, -1, 6, 5), 1.4, 'rgba(58,47,42,0.28)');
    api.inkLine(ctx, api.shapes.line(-22, -60, 6, -30, 1, 5, 7), 1.2, 'rgba(58,47,42,0.22)');

    // 意识层：水面小旗
    api.inkLine(ctx, api.shapes.line(-44, -126, -44, -168, 0, 4, 4), 2.4, PAL.ink);
    api.paint(ctx, api.shapes.poly([[-44, -168], [-14, -160], [-44, -150]], 3), { wash: PAL.ochre, sw: 2 });
    // 潜意识层：光点
    for (let i = 0; i < 5; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 1.4 + i * 2 + phase);
      api.paint(ctx, api.shapes.ring(-58 + i * 28, -44 - (i % 2) * 18, 3 + k * 1.6, 3 + k * 1.6, 8), { wash: PAL.ochre, sw: 0, washOp: 0.35 + 0.35 * k });
    }
    ctx.restore();

    // 海面高光线（盖住冰山水下部分以区分水线）
    api.inkLine(ctx, api.shapes.line(-130, -122, 130, -122, 1, 18, 9), 2.6, 'rgba(58,47,42,0.45)');
  },
};
