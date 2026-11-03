import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_rice_cooker: ComponentDef<ClawdApi> = {
name: 'pr_rice_cooker',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour rice cooker drawn as a barrel-shaped cream body with a domed lid, ochre knob, steam vent, side clamps, and a front control panel with two buttons and a glowing warm-keep light; two thin steam wisps rise from the vent. Sized 260×215 px with the anchor at bottom centre, it suits a kitchen countertop, shelf, or appliance corner of a domestic scene.',
  tags: ['catalog', 'appliance', 'rice-cooker', 'kitchen', 'ground', 'decor'],
  size: [260, 215],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the warm-keep light pulse and the steam sway between copies.' },
    warm: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the warm-keep indicator: 0 leaves the light almost dark, 1 gives the full pulsing orange glow.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, warm = 1 } = params as { phase?: number; warm?: number };
    const { PAL } = api;
    const pulse = 0.5 + 0.5 * Math.sin(t * 2 + phase);

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 94, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 机身（桶形）
    const body: P2[] = [[-80, -16], [-88, -70], [-72, -108], [72, -108], [88, -70], [80, -16]];
    api.paint(ctx, body, { wash: '#efe7d6', sw: 3.8 });
    api.paint(ctx, api.shapes.ring(-40, -84, 26, 18, 18, -0.3), { wash: '#ffffff', sw: 0, washOp: 0.42 });
    // 桶身腰线
    api.inkLine(ctx, api.shapes.arc(0, -62, 84, 22, Math.PI * 0.06, Math.PI * 0.94, 20), 1.8, 'rgba(58,47,42,0.22)');

    // 壶盖（扁圆顶 + 提钮）
    api.paint(ctx, api.shapes.arc(0, -112, 74, 20, Math.PI, Math.PI * 2, 22), { wash: '#e4dac4', sw: 3.2 });
    api.inkLine(ctx, api.shapes.line(-74, -112, 74, -112, 1, 10, 4), 2.6, 'rgba(58,47,42,0.45)');
    api.paint(ctx, api.shapes.round(-16, -140, 16, -126, 6), { wash: PAL.ochre, sw: 2.4 });

    // 蒸汽口
    api.paint(ctx, api.shapes.ring(44, -128, 9, 6, 12), { wash: PAL.clay, sw: 2 });
    // 侧面卡扣
    api.paint(ctx, api.shapes.round(-96, -96, -80, -78, 4), { wash: PAL.clay, sw: 2.2 });
    api.paint(ctx, api.shapes.round(80, -96, 96, -78, 4), { wash: PAL.clay, sw: 2.2 });

    // 控制面板
    api.paint(ctx, api.shapes.round(-6, -84, 66, -30, 9), { wash: '#f8f2e4', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(14, -56, 7, 7, 12), { wash: PAL.teal, sw: 1.8 });
    api.paint(ctx, api.shapes.ring(40, -56, 7, 7, 12), { wash: PAL.ochre, sw: 1.8 });
    api.inkLine(ctx, api.shapes.line(6, -74, 54, -74, 0, 4, 3), 1.6, 'rgba(58,47,42,0.3)');
    api.inkLine(ctx, api.shapes.line(6, -68, 34, -68, 0, 4, 5), 1.2, 'rgba(58,47,42,0.22)');
    // 保温指示灯
    api.glow(ctx, 14, -42, 14, PAL.orange, 0.22 * warm * pulse);
    api.paint(ctx, api.shapes.ring(14, -42, 3.4, 3.4, 8), { wash: PAL.orange, sw: 0, washOp: 0.4 + 0.5 * pulse * warm });

    // 底部通风口
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-52 + i * 12, -22, -44 + i * 12, -22, 0, 3, i + 2), 2, 'rgba(58,47,42,0.28)');
    }

    // 蒸汽
    for (let i = 0; i < 2; i++) {
      const pts: P2[] = [];
      for (let k = 0; k <= 12; k++) {
        const u = k / 12;
        pts.push([44 + i * 8 + Math.sin(u * 4.4 - t * 2.2 + i * 2 + phase) * (5 + u * 12), -134 - u * 42]);
      }
      api.inkLine(ctx, pts, 2.2, `rgba(58,47,42,${0.22 - i * 0.08})`);
    }
  },
};
