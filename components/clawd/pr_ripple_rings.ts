import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_ripple_rings: ComponentDef<ClawdApi> = {
name: 'pr_ripple_rings',
  style: 'clawd',
  kind: 'prop',
  description: 'A shallow water puddle with three concentric ripple rings, a small splash and floating droplets at the centre, and broken highlight strokes along the surface. The 420×190 px prop is anchored at its bottom centre and works as ground-level water detail in a scene.',
  tags: ['catalog', 'water', 'puddle', 'ripple', 'ground', 'prop', 'decor'],
  size: [420, 190],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the ripple animation and puddle outline so multiple copies do not pulse in sync.' },
    strength: { type: 'number', default: 1, min: 0, max: 1, description: 'How far the rings expand and contract with the animation; 0 keeps them nearly still, 1 gives the widest breathing motion.' },
    drops: { type: 'number', default: 1, min: 0, max: 1, description: 'Opacity and visibility of the central splash and flying droplets; below 0.2 the splash is omitted entirely.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, strength = 1, drops = 1 } = params as { phase?: number; strength?: number; drops?: number };

    // 水面：一块浅蓝水洼
    const pool: P2[] = [];
    for (let i = 0; i <= 26; i++) {
      const u = i / 26;
      const a = u * Math.PI * 2;
      const k = 1 + Math.sin(a * 3 + phase) * 0.03;
      pool.push([Math.cos(a) * 204 * k, -58 + Math.sin(a) * 44 * k]);
    }
    api.paint(ctx, pool, { wash: '#a9cfd8', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(-30, -76, 150, 26, 24, 0, 0.06, 7), { wash: '#cfe9ee', sw: 0, washOp: 0.6 });

    // 三圈涟漪：白线 + 内侧深色
    for (let i = 0; i < 3; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 1.1 + i * 2.1 + phase);
      const rx = 96 + i * 52 + k * 12 * strength;
      const ry = 21 + i * 11 + k * 3 * strength;
      const a = 0.85 - i * 0.2;
      api.inkLine(ctx, api.shapes.ring(0, -58, rx, ry, 34, 0, 0.03, i + 3), 3.4 - i * 0.6, `rgba(255,255,255,${a})`);
      api.inkLine(ctx, api.shapes.ring(0, -56, rx * 0.97, ry * 0.96, 34, 0, 0.04, i + 9), 1.6 - i * 0.3, `rgba(90,140,155,${a * 0.5})`);
    }
    // 落点与溅起的水滴
    if (drops > 0.2) {
      api.paint(ctx, api.shapes.ring(0, -66, 20, 8, 16, 0, 0.1, 5), { wash: '#ffffff', sw: 0, washOp: 0.8 * drops });
      api.paint(ctx, api.shapes.ring(-4, -70, 9, 4, 12), { wash: '#e6f4f6', sw: 0, washOp: 0.9 * drops });
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI * 0.5 + (i - 1) * 0.7;
        const d = 34 + i * 6;
        api.paint(ctx, api.shapes.ring(Math.cos(a) * d, -76 + Math.sin(a) * d * 0.6, 5, 6, 10, a), { wash: '#ffffff', sw: 1.2, washOp: 0.85 * drops });
      }
    }
    // 水面碎波纹
    for (let i = 0; i < 5; i++) {
      const x = -150 + i * 78;
      const k = Math.sin(t * 1.9 + i + phase);
      api.inkLine(ctx, api.shapes.arc(x + k * 5, -34 - (i % 2) * 8, 26, 5, Math.PI * 1.12, Math.PI * 1.88, 8), 1.8, 'rgba(255,255,255,0.55)');
    }
    // 边缘反光
    api.inkLine(ctx, api.shapes.arc(0, -58, 204, 44, Math.PI * 1.12, Math.PI * 1.55, 10), 2.4, 'rgba(255,255,255,0.5)');
  },
};
