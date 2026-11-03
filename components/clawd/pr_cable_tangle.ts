import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_cable_tangle: ComponentDef<ClawdApi> = {
name: 'pr_cable_tangle',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour pile of tangled cables with three overlapping coiled loops in charcoal, rose and teal, plus a USB-C plug, an HDMI plug, a headphone jack and a velcro strap. Anchored at bottom centre and 400×260 px, it suits cluttered desk, drawer or studio-floor props.',
  tags: ['catalog', 'household', 'cable', 'tangle', 'clutter', 'desk', 'prop', 'ground'],
  size: [400, 260],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the wobble animation timing so multiple copies move out of sync.' },
    knot: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls how much the coils sway and shift; 0 keeps the tangle still, 1 gives the full wobble.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, knot = 1 } = params as { phase?: number; knot?: number };
    const { PAL } = api;
    const wob = Math.sin(t * 0.9 + phase) * 2 * knot;

    api.paint(ctx, api.shapes.ring(0, -8, 160, 9, 22, 0, 0, 3), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 三条缠绕的线（用椭圆环模拟线圈）
    const coil = (cx: number, cy: number, rx: number, ry: number, col: string, seed: number, rot: number) => {
      const pts: P2[] = [];
      for (let i = 0; i <= 40; i++) {
        const a = (i / 40) * Math.PI * 2.2;
        const k = 1 + Math.sin(a * 2.4 + seed) * 0.08;
        pts.push([cx + Math.cos(a) * rx * k * Math.cos(rot) - Math.sin(a) * ry * k * Math.sin(rot),
                  cy + Math.cos(a) * rx * k * Math.sin(rot) + Math.sin(a) * ry * k * Math.cos(rot)]);
      }
      api.inkLine(ctx, pts, 7.4, 'rgba(58,47,42,0.22)');
      api.inkLine(ctx, pts, 5.6, col);
      api.inkLine(ctx, pts.map((p) => [p[0], p[1] - 1.6] as P2), 2, 'rgba(255,255,255,0.28)');
    };

    coil(-30, -96, 116, 58, '#3f464b', 1, 0.05 + wob * 0.004);
    coil(10, -74, 96, 48, PAL.rose, 4, -0.18 + wob * 0.003);
    coil(40, -112, 78, 40, PAL.teal, 7, 0.32);

    // 露出的插头：USB-C、HDMI、耳机口
    // USB-C（右下）
    api.paint(ctx, api.shapes.round(120, -44, 170, -22, 6, 4), { wash: '#cfd6d4', sw: 2.2 });
    api.paint(ctx, api.shapes.round(144, -38, 166, -28, 5, 3), { wash: '#3f464b', sw: 1.2 });
    // HDMI（左上）
    api.paint(ctx, api.shapes.poly([[-176, -152], [-134, -160], [-126, -134], [-170, -126]], 4), { wash: '#4a5155', sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[-168, -150], [-138, -155], [-134, -140], [-166, -136]], 3), { wash: '#b9b2a2', sw: 1 });
    // 耳机插头（左下）
    api.inkLine(ctx, api.shapes.line(-158, -40, -186, -22, 0, 4, 4), 4, '#8f9b99');
    api.paint(ctx, api.shapes.ring(-190, -20, 6, 6, 12), { wash: '#cfc8b8', sw: 1.6 });
    api.paint(ctx, api.shapes.round(-168, -46, -140, -30, 3, 3), { wash: '#8f9b99', sw: 1.6 });

    // 魔术贴束带
    api.paint(ctx, api.shapes.round(-8, -120, 40, -104, 6, 3), { wash: PAL.ochre, sw: 1.8, washOp: 0.9 });
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(0 + i * 12, -118, 4 + i * 12, -106, 0, 3, i + 4), 1.2, 'rgba(58,47,42,0.3)');
    }
    // 小线圈（橡皮筋捆着的短线）
    api.inkLine(ctx, api.shapes.ring(-96, -34, 30, 14, 18, 0.2), 4, '#6b7376');
    api.paint(ctx, api.shapes.round(-108, -44, -84, -24, 3, 3), { wash: PAL.rose, sw: 1.4, washOp: 0.85 });
  },
};
