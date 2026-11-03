import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const ch_kite: ComponentDef<ClawdApi> = {
name: 'ch_kite',
  style: 'clawd',
  kind: 'actor',
  description: 'A small watercolour diamond kite with bowed edges, ink spars crossing the face and a wavy tail hung with triangular bows; a thin line runs from the kite down to an off-canvas point below. It is 300×340 px with its anchor at the bottom centre, and it suits open-sky or outdoor scenes where it can hang and drift above the ground.',
  tags: ['catalog', 'kite', 'toy', 'sky', 'hanging', 'play', 'wind'],
  size: [300, 340],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the sway, bobbing and tail wave so several kites do not move in unison.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Wind strength; increases the tilt angle, the vertical bob, the tail sway and the sag of the string.' },
    hue: { type: 'string', default: 'rose', description: 'Palette colour name used for the main kite wash (falls back to rose if unknown); the paper and ochre accent panels stay fixed.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wind = 1, hue = 'rose' } = params as { phase?: number; wind?: number; hue?: string };
    const { PAL } = api;
    const wash = (PAL as Record<string, string>)[hue] || PAL.rose;
    const tilt = Math.sin(t * 0.9 + phase) * 0.13 * wind + 0.12;
    const lift = Math.sin(t * 1.4 + phase) * 6;

    // 牵引线（从风筝尾部向下延伸出画外）
    const anchor: P2 = [-146, -14];
    ctx.save();
    ctx.translate(0, -180 + lift);
    ctx.rotate(tilt);

    // 风筝面（菱形，带弓形边）
    const kite: P2[] = [];
    const corners: P2[] = [[0, -132], [66, -40], [0, 62], [-66, -40]];
    for (let c = 0; c < 4; c++) {
      const a = corners[c];
      const b = corners[(c + 1) % 4];
      for (let i = 0; i < 8; i++) {
        const u = i / 8;
        const bow = Math.sin(u * Math.PI) * 6;
        const mx = (a[0] + b[0]) / 2;
        const my = (a[1] + b[1]) / 2;
        kite.push([
          api.shapes.lerp(a[0], b[0], u) + (mx === 0 ? Math.sign(mx + 0.001) : Math.sign(mx)) * bow * 0.2,
          api.shapes.lerp(a[1], b[1], u) + (my < 0 ? 1 : -1) * bow * 0.15,
        ]);
      }
    }
    api.paint(ctx, kite, { wash, sw: 3.6, washOp: 0.92 });
    // 上下两片不同色
    api.paint(ctx, [[0, -132], [66, -40], [0, -40]], { wash: PAL.paper, sw: 0, washOp: 0.4 });
    api.paint(ctx, [[0, 62], [-66, -40], [0, -40]], { wash: PAL.ochre, sw: 0, washOp: 0.3 });
    // 骨架
    api.inkLine(ctx, api.shapes.line(0, -134, 0, 64, 1, 8, 2), 2.2, PAL.ink);
    api.inkLine(ctx, api.shapes.line(-68, -40, 68, -40, 1, 8, 5), 2.2, PAL.ink);
    // 描边
    api.paint(ctx, kite, { wash: 'none', sw: 3.6 });

    // 尾巴
    const tail: P2[] = [];
    for (let i = 0; i <= 18; i++) {
      const u = i / 18;
      tail.push([
        Math.sin(u * 5.2 + t * 1.8 + phase) * 20 * u * wind,
        64 + u * 120,
      ]);
    }
    api.inkLine(ctx, tail, 2.2, PAL.ink);
    for (let i = 3; i <= 16; i += 3) {
      const p = tail[i];
      const a = Math.sin(t * 2 + i * 0.8) * 0.4;
      ctx.save();
      ctx.translate(p[0], p[1]);
      ctx.rotate(a);
      api.paint(ctx, [[-9, -5], [9, -5], [0, 5]], { wash: i % 2 ? PAL.ochre : PAL.teal, sw: 1.8 });
      ctx.restore();
    }
    ctx.restore();

    // 线（从风筝中心到画面外的锚点）
    const kx = 0;
    const ky = -180 + lift;
    const pts: P2[] = [];
    for (let i = 0; i <= 20; i++) {
      const u = i / 20;
      pts.push([api.shapes.lerp(kx, anchor[0], u), api.shapes.lerp(ky, anchor[1], u) + Math.sin(u * Math.PI) * 26 * wind]);
    }
    api.inkLine(ctx, pts, 1.6, 'rgba(58,47,42,0.55)');
  },
};
