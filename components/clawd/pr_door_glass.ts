import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_door_glass: ComponentDef<ClawdApi> = {
name: 'pr_door_glass',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour shop door with a dark metal frame, a glass leaf that swings inward to reveal warm interior light, a hanging OPEN sign and two ochre push handles, with a small floor mat at the threshold. Anchor is bottom centre, 268×410 px, sized for storefront facades and street-level entrances in a scene.',
  tags: ['catalog', 'facade', 'door', 'glass', 'storefront', 'entrance', 'ground', 'decor'],
  size: [268, 410],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offset in radians that shifts the idle sway and the swinging of the OPEN sign, so several copies do not move in sync.' },
    open: { type: 'number', default: 0, min: 0, max: 1, description: 'How far the glass leaf is pushed inward, from fully shut (0) to swung open at roughly 0.3 rad (1); also enables the swaying motion.' },
    neon: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the warm interior glow and the teal neon on the OPEN sign; at 0 the sign lines turn plain dark ink.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, open = 0, neon = 1 } = params as { phase?: number; open?: number; neon?: number };
    const { PAL } = api;
    const sway = Math.sin(t * 1.1 + phase) * 0.05;

    // 门框
    api.paint(ctx, api.shapes.poly([[-125, -410], [125, -410], [125, 0], [-125, 0]], 6), { wash: '#4a5157', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-112, -396], [112, -396], [112, -16], [-112, -16]], 6), { wash: '#3a4046', sw: 2.4 });

    // 玻璃门扇（向内推开一点）
    ctx.save();
    ctx.translate(-112, -206);
    ctx.rotate(0.3 * api.shapes.clamp01(open) + sway * api.shapes.clamp01(open));
    ctx.translate(112, 206);
    api.paint(ctx, api.shapes.poly([[-108, -394], [108, -394], [108, -18], [-108, -18]], 3), { wash: '#cfe4e6', sw: 3, washOp: 0.72 });
    // 门内暖光与街道倒影
    api.glow(ctx, 0, -220, 140, '#ffe7b0', 0.18 * neon);
    api.paint(ctx, api.shapes.poly([[-108, -394], [108, -394], [108, -240], [-108, -240]], 3), { wash: '#ffe9bd', sw: 0, washOp: 0.2 * neon });
    api.paint(ctx, api.shapes.poly([[-96, -60], [-30, -60], [-30, -230], [-96, -210]], 3), { wash: '#ffffff', sw: 0, washOp: 0.22 });
    // 铝合金立框
    api.paint(ctx, api.shapes.poly([[-8, -394], [8, -394], [8, -18], [-8, -18]], 3), { wash: '#8f9b99', sw: 2 });
    api.paint(ctx, api.shapes.poly([[-108, -230], [108, -230], [108, -214], [-108, -214]], 3), { wash: '#8f9b99', sw: 2 });
    // 横推把手
    api.paint(ctx, api.shapes.round(-96, -150, -76, -136, 6), { wash: PAL.ochre, sw: 1.8 });
    api.paint(ctx, api.shapes.round(76, -150, 96, -136, 6), { wash: PAL.ochre, sw: 1.8 });
    ctx.restore();

    // 悬挂的 OPEN 牌（在门内侧）
    ctx.save();
    ctx.translate(0, -330);
    ctx.rotate(Math.sin(t * 1.6 + phase) * 0.06);
    api.inkLine(ctx, api.shapes.line(0, -30, 0, 0, 0, 3, 2), 1.8, 'rgba(58,47,42,0.5)');
    api.paint(ctx, api.shapes.round(-40, 0, 40, 44, 4, 3), { wash: '#fbf6ea', sw: 2.4 });
    if (neon > 0) api.glow(ctx, 0, 22, 44, PAL.teal, 0.22 * neon);
    api.inkLine(ctx, api.shapes.line(-26, 14, 26, 14, 0, 4, 3), 3, neon > 0 ? PAL.teal : 'rgba(58,47,42,0.4)');
    api.inkLine(ctx, api.shapes.line(-20, 28, 20, 28, 0, 4, 5), 2.2, neon > 0 ? PAL.teal : 'rgba(58,47,42,0.3)');
    ctx.restore();

    // 地面与门垫
    api.paint(ctx, api.shapes.poly([[-125, -8], [125, -8], [134, 0], [-134, 0]], 3), { wash: '#a6a094', sw: 2.2 });
    api.paint(ctx, api.shapes.poly([[-54, 0], [54, 0], [46, -8], [-46, -8]], 3), { wash: PAL.night, sw: 0, washOp: 0.3 });
  },
};
