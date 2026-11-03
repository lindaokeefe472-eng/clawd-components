import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_neon_sign: ComponentDef<ClawdApi> = {
name: 'pr_neon_sign',
  style: 'clawd',
  kind: 'prop',
  description: 'A dark rectangular backplate with glowing neon tube lettering spelling "OPEN", plus a small inward arrow and three dot ornaments, all drawn in loose watercolour with a soft halo and a flickering pulse. It measures 280×230 px with the anchor at the bottom centre, and works hung on a shopfront, wall or interior scene as a lit sign.',
  tags: ['catalog', 'sign', 'neon', 'wall', 'hanging', 'decor', 'light', 'shop'],
  size: [280, 230],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the flicker cycle, so multiple copies do not pulse in sync.' },
    on: { type: 'number', default: 1, min: 0, max: 1, description: 'Lit or dark: 1 draws the full glow and bright tubes, 0 dims the tubes to a faint unlit outline with no halo.' },
    hue: { type: 'enum', default: 'rose', options: ['rose', 'teal', 'ochre'], description: 'Palette colour of the neon tubes and glow: rose pink, teal green-blue, or ochre amber.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, on = 1, hue = 'rose' } = params as { phase?: number; on?: number; hue?: string };
    const { PAL } = api;
    const flick = 0.72 + 0.24 * Math.abs(Math.sin(t * 1.7 + phase)) + 0.06 * Math.sin(t * 23 + phase);
    const glowCol = hue === 'teal' ? PAL.teal : hue === 'ochre' ? PAL.ochre : PAL.rose;
    const tubeRGB = hue === 'teal' ? '79,156,152' : hue === 'ochre' ? '217,164,65' : '224,163,160';

    // 深色背板 + 固定件
    api.paint(ctx, api.shapes.poly([[-140, -230], [140, -230], [140, 0], [-140, 0]], 6), { wash: '#3a4046', sw: 3 });
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-140, -46 - i * 46, 140, -46 - i * 46, 0.4, 10, i + 2), 1.2, 'rgba(246,239,223,0.06)');
    }
    for (let i = 0; i < 2; i++) {
      api.paint(ctx, api.shapes.ring(-110 + i * 220, -214, 7, 5, 10), { wash: '#6b7376', sw: 1.6 });
    }

    const tube = (pts: P2[], w = 6) => {
      api.inkLine(ctx, pts, w + 5, `rgba(${tubeRGB},${0.16 * flick})`);
      api.inkLine(ctx, pts, w, glowCol);
      api.inkLine(ctx, pts, w * 0.38, '#fff6ea');
    };

    ctx.save();
    ctx.globalAlpha = on > 0 ? 1 : 0.22;
    if (on > 0) {
      api.glow(ctx, 0, -130, 150, glowCol, 0.3 * flick * on);
      api.glow(ctx, 0, -130, 72, '#fff2e2', 0.18 * flick * on);
    }

    // O
    tube(api.shapes.ring(-98, -150, 24, 34, 28));
    // P
    tube([[-52, -184], [-52, -116]]);
    tube([[-52, -184], [-26, -184], [-14, -172], [-26, -156], [-52, -156]]);
    // E
    tube([[-2, -184], [-2, -116]]);
    tube([[-2, -184], [32, -184]]);
    tube([[-2, -150], [24, -150]]);
    tube([[-2, -116], [32, -116]]);
    // N
    tube([[46, -116], [46, -184]]);
    tube([[46, -184], [80, -116]]);
    tube([[80, -116], [80, -184]]);

    // 下方箭头（指向里）
    tube([[-64, -76], [22, -76]], 5);
    tube([[8, -88], [28, -76], [8, -64]], 5);
    // 右侧小圆点装饰
    for (let i = 0; i < 3; i++) {
      tube(api.shapes.ring(96, -180 + i * 18, 4, 4, 10), 4);
    }
    ctx.restore();

    // 灯管支架与变压器线
    for (let i = 0; i < 3; i++) {
      api.paint(ctx, api.shapes.ring(-98 + i * 90, -190, 3.2, 3.2, 8), { wash: '#8f9b99', sw: 1 });
    }
    api.inkLine(ctx, [[-124, -60], [-136, -34], [-130, -6]], 2, 'rgba(58,47,42,0.35)');
  },
};
