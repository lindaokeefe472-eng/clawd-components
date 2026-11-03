import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_fallen_leaves: ComponentDef<ClawdApi> = {
name: 'pr_fallen_leaves',
  style: 'clawd',
  kind: 'prop',
  description: 'A scattered cluster of watercolour autumn leaves — five-lobed maple shapes and oval leaves in ochre, rust and sap green — resting on a soft ground wash with small stones, plus a few leaves drifting above with faint wind lines. Anchor is bottom centre, 400×200 px; good for a forest floor, garden bed or autumn path detail.',
  tags: ['catalog', 'plants', 'leaves', 'autumn', 'fallen', 'ground', 'decor', 'prop'],
  size: [400, 200],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the animation cycle so multiple copies drift out of sync.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Increases the drift distance and sway of the falling leaves and wind lines.' },
    count: { type: 'number', default: 1, min: 0, max: 12, description: 'Sets visibility and opacity of the airborne leaves and wind lines; 0 hides them, values above 1 remain fully opaque.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wind = 1, count = 1 } = params as { phase?: number; wind?: number; count?: number };
    const { PAL } = api;

    // 地面
    api.paint(ctx, api.shapes.poly([[-200, -18], [200, -18], [200, 0], [-200, 0]], 3), { wash: '#c8bfae', sw: 0, washOp: 0.4 });
    api.paint(ctx, api.shapes.ring(0, -14, 178, 12, 24, 0, 0.05, 7), { wash: '#b9a67d', sw: 0, washOp: 0.3 });

    // 地上的落叶（多种形状）
    const leafMaple = (x: number, y: number, s: number, rot: number, col: string, a: number) => {
      // 5 个裂片：极坐标半径随角度起伏，裂片之间凹陷
      const pts: P2[] = [];
      const lobes = 5;
      for (let i = 0; i < 40; i++) {
        const ang = (i / 40) * Math.PI * 2;
        const lobe = Math.abs(Math.cos((ang * lobes) / 2));
        const rr = (0.52 + Math.pow(lobe, 1.4) * 0.48) * s;
        const vx = Math.cos(ang) * rr;
        const vy = Math.sin(ang) * rr * 0.94;
        pts.push([x + vx * Math.cos(rot) - vy * Math.sin(rot), y + vx * Math.sin(rot) + vy * Math.cos(rot)]);
      }
      api.paint(ctx, pts, { wash: col, sw: 1.6, washOp: a });
      // 叶柄
      api.inkLine(ctx, api.shapes.line(x, y, x + Math.cos(rot + 1.57) * s * 0.9, y + Math.sin(rot + 1.57) * s * 0.9, 0, 3, 9), 2, 'rgba(120,70,40,0.55)');
      // 叶脉：5 条从叶心到裂尖
      for (let k = 0; k < lobes; k++) {
        const ang = (k / lobes) * Math.PI * 2 - Math.PI / 2;
        api.inkLine(ctx, api.shapes.line(x, y, x + Math.cos(ang + rot) * s * 0.82, y + Math.sin(ang + rot) * s * 0.82, 0, 3, k + 3), 1, 'rgba(120,70,40,0.4)');
      }
    };
    const leafOval = (x: number, y: number, s: number, rot: number, col: string, a: number) => {
      api.paint(ctx, api.shapes.ring(x, y, s, s * 0.48, 14, rot), { wash: col, sw: 1.6, washOp: a });
      api.inkLine(ctx, api.shapes.line(x - Math.cos(rot) * s * 0.9, y - Math.sin(rot) * s * 0.9, x + Math.cos(rot) * s * 1.5, y + Math.sin(rot) * s * 1.5, 0, 4, 5), 1.2,
        'rgba(120,70,40,0.45)');
    };

    leafMaple(-138, -34, 26, 0.4, PAL.ochre, 0.95);
    leafOval(-64, -22, 24, -0.3, '#c47f72', 0.92);
    leafMaple(2, -40, 20, 1.1, '#b8563f', 0.9);
    leafOval(58, -24, 26, 0.2, PAL.ochre, 0.95);
    leafMaple(120, -36, 22, -0.7, PAL.sap, 0.85);
    leafOval(-6, -66, 18, 0.8, '#c47f72', 0.8);

    // 正在飘落的叶子（受 wind 影响上下微动）
    if (count > 0.2) {
      const fly = [
        { x: -96, y: -134, s: 15, rot: 0.6, col: PAL.ochre },
        { x: 46, y: -152, s: 13, rot: -0.4, col: '#c47f72' },
        { x: 132, y: -112, s: 12, rot: 1.2, col: PAL.sap },
      ];
      for (let i = 0; i < 3; i++) {
        const f = fly[i];
        const dx = Math.sin(t * 1.3 + i * 2.1 + phase) * 8 * wind;
        const dy = Math.cos(t * 1.7 + i * 1.4 + phase) * 6 * wind;
        leafOval(f.x + dx, f.y + dy, f.s, f.rot + Math.sin(t * 1.1 + i) * 0.3, f.col, 0.9 * count);
      }
      // 风线
      for (let i = 0; i < 2; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 2 + i * 2 + phase);
        api.inkLine(ctx, api.shapes.line(-160, -104 - i * 28, -104 - k * 16, -108 - i * 28, 2, 5, i + 3), 1.6, 'rgba(150,140,120,0.35)');
      }
    }
    // 小石子
    for (let i = 0; i < 4; i++) {
      const x = -170 + i * 96 + api.shapes.jit(i, 12);
      api.paint(ctx, api.shapes.ring(x, -12, 7 + api.shapes.hash(i) * 3, 5, 10), { wash: '#a79c88', sw: 1.2, washOp: 0.7 });
    }
  },
};
