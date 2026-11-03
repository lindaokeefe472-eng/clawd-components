import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_halo_ring: ComponentDef<ClawdApi> = {
name: 'pr_halo_ring',
  style: 'clawd',
  kind: 'prop',
  description: 'A small watercolour figure with a rounded head, closed eyes and a faint smile stands beneath a tilted golden halo ring that shimmers with short radiating light strokes. Anchor is bottom centre, 250×260 px; it suits scenes of blessing, virtue or an honoured character.',
  tags: ['catalog', 'halo', 'ring', 'character', 'glow', 'blessing', 'ground'],
  size: [250, 260],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the halo tilt and shimmer cycle in radians; use it to desynchronise several copies.' },
    glow: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the warm glow behind and below the halo; 0 removes it entirely.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, glow = 1 } = params as { phase?: number; glow?: number };
    const { PAL } = api;
    const tilt = Math.sin(t * 0.8 + phase) * 0.05;
    const k = 0.5 + 0.5 * Math.sin(t * 1.6 + phase);

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 76, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 被加冕的小人（抽象）
    api.paint(ctx, api.shapes.poly([[-34, -10], [34, -10], [26, -108], [-26, -108]], 4), { wash: '#cfd8d6', sw: 3 });
    api.paint(ctx, api.shapes.ring(0, -132, 30, 32, 24, 0, 0.02, 4), { wash: '#ecdfc6', sw: 3 });
    // 微笑与闭眼（被评价为“好人”）
    api.inkLine(ctx, api.shapes.arc(0, -126, 14, 8, Math.PI * 0.1, Math.PI * 0.9, 10), 2.2, PAL.ink);
    api.inkLine(ctx, api.shapes.line(-12, -142, -4, -142, 0, 3, 2), 2, PAL.ink);
    api.inkLine(ctx, api.shapes.line(4, -142, 12, -142, 0, 3, 3), 2, PAL.ink);

    // 光环（椭圆的透视环，转起来）
    ctx.save();
    ctx.translate(0, -186);
    ctx.rotate(tilt);
    if (glow > 0) api.glow(ctx, 0, 0, 110, '#ffe7a8', 0.26 * glow * (0.8 + 0.2 * k));
    api.paint(ctx, api.shapes.ring(0, 0, 58, 20, 30, 0, 0.03, 6), { wash: '#f6d68f', sw: 3 });
    api.paint(ctx, api.shapes.ring(0, 0, 40, 13, 26, 0, 0.03, 9), { wash: 'rgba(255,255,255,0.55)', sw: 0 });
    // 光芒短线
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + t * 0.4;
      const r0 = 66 + Math.sin(t * 2 + i) * 3;
      api.inkLine(ctx, [
        [Math.cos(a) * r0, Math.sin(a) * 20 + (Math.sin(a) * 4)],
        [Math.cos(a) * (r0 + 12), Math.sin(a) * 26],
      ], 1.8, `rgba(217,164,65,${0.35 + 0.3 * k})`);
    }
    ctx.restore();

    // 光环投下的暖光
    if (glow > 0) api.glow(ctx, 0, -120, 90, '#ffe7a8', 0.12 * glow);
  },
};
