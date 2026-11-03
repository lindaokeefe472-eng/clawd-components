import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_awning: ComponentDef<ClawdApi> = {
name: 'pr_awning',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour shop awning with a wide striped canopy, scalloped valance, two side support poles, and a small hanging string of lights. It is anchored at the bottom centre and sized 340×190 px, making it suitable for storefronts, café facades, or market scenes.',
  tags: ['catalog', 'awning', 'storefront', 'facade', 'wall', 'decor', 'watercolour'],
  size: [340, 190],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the swaying and light twinkle between copies.' },
    billow: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls the amount of canopy and valance movement, from still at 0 to full billow at 1.' },
    hue: { type: 'string', default: 'rose', description: 'Palette colour used for the awning canopy and valance wash; default is rose.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, billow = 1, hue = 'rose' } = params as { phase?: number; billow?: number; hue?: string };
    const { PAL } = api;
    const flap = Math.sin(t * 1.4 + phase) * 3 * billow;
    const main = (PAL as Record<string, string>)[hue] || PAL.rose;

    // 墙面
    api.paint(ctx, api.shapes.poly([[-170, -190], [170, -190], [170, -8], [-170, -8]], 3), { wash: '#d9d0bc', sw: 0, washOp: 0.45 });

    // 遮阳棚主体（斜向外下方）
    const canopy: P2[] = [
      [-168, -172], [168, -172], [140, -96 + flap * 0.4], [-140, -96 + flap * 0.4],
    ];
    api.paint(ctx, api.shapes.poly(canopy, 4), { wash: main, sw: 3.4 });
    // 条纹（沿斜向）
    for (let i = 0; i < 7; i++) {
      const u0 = i / 7;
      const u1 = (i + 0.5) / 7;
      const x0 = api.shapes.lerp(-168, 168, u0);
      const x1 = api.shapes.lerp(-168, 168, u1);
      api.paint(
        ctx,
        api.shapes.poly([[x0, -172], [x1, -172], [api.shapes.lerp(-140, 140, u1), -96 + flap * 0.4], [api.shapes.lerp(-140, 140, u0), -96 + flap * 0.4]], 2),
        { wash: '#fbf6ea', sw: 0, washOp: 0.85 }
      );
    }
    api.inkLine(ctx, api.shapes.poly(canopy, 4), 2.6, PAL.ink);

    // 前方垂幔（波浪边）
    const valance: P2[] = [[-140, -94 + flap * 0.4], [140, -94 + flap * 0.4]];
    for (let i = 6; i >= 0; i--) {
      const x = api.shapes.lerp(-140, 140, i / 6);
      valance.push([x, -70 + flap + (i % 2 === 0 ? 6 : 0)]);
    }
    api.paint(ctx, api.shapes.poly(valance, 3), { wash: main, sw: 2.6 });
    for (let i = 0; i < 7; i++) {
      const x = api.shapes.lerp(-140, 140, (i + 0.5) / 7);
      api.inkLine(ctx, api.shapes.line(x, -92, x, -70 + flap + ((i + 0.5) % 2 < 0.5 ? -2 : 4), 0.6, 4, i + 3), 1.2, 'rgba(255,255,255,0.5)');
    }

    // 支撑杆
    ctx.save();
    ctx.translate(-150, -150);
    api.inkLine(ctx, api.shapes.line(0, 0, -6, 60, 0, 4, 3), 4, '#8f9b99');
    ctx.restore();
    ctx.save();
    ctx.translate(150, -150);
    api.inkLine(ctx, api.shapes.line(0, 0, 6, 60, 0, 4, 4), 4, '#8f9b99');
    ctx.restore();

    // 棚下阴影
    api.paint(ctx, api.shapes.poly([[-146, -86], [146, -86], [130, -6], [-130, -6]], 3), { wash: PAL.night, sw: 0, washOp: 0.1 });

    // 吊挂的小灯串
    for (let i = 0; i < 6; i++) {
      const x = -110 + i * 44;
      const k = 0.5 + 0.5 * Math.sin(t * 2 + i * 1.3 + phase);
      api.inkLine(ctx, api.shapes.line(x, -70 + flap, x, -54 + flap, 0, 3, i + 6), 1.2, 'rgba(58,47,42,0.4)');
      api.glow(ctx, x, -48 + flap, 18, '#ffe7b0', 0.18 * k);
      api.paint(ctx, api.shapes.ring(x, -48 + flap, 4, 5, 8), { wash: '#ffe7b0', sw: 1, washOp: 0.85 });
    }
  },
};
