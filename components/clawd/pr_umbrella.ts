import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_umbrella: ComponentDef<ClawdApi> = {
name: 'pr_umbrella',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour umbrella with a scalloped teal canopy split into alternating pale panels, ink ribs, a hooked handle and a small ochre finial, with a few blue raindrops drifting beneath it. It is 280×320 px with the anchor at the bottom centre of the handle, and it suits rainy street or garden scenes as a handheld or leaning prop.',
  tags: ['catalog', 'umbrella', 'weather', 'rain', 'handheld', 'prop', 'outdoor'],
  size: [280, 320],
  anchorNames: ['grip'],
  anchors() { return { grip: [0, -60] }; },
  params: {
    sway: { type: 'number', default: 1, min: 0, max: 3, description: 'Amount the umbrella rocks side to side as it sways; 0 holds it still.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the sway and raindrop cycle in radians so several copies do not move in sync.' },
    open: { type: 'number', default: 1, min: 0, max: 1, description: 'How far the canopy is unfurled; 0 gives a narrow shut umbrella, 1 a fully open one.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { sway = 1, phase = 0, open = 1 } = params as { sway?: number; phase?: number; open?: number };
    const { PAL } = api;
    const tilt = Math.sin(t * 0.9 + phase) * 0.035 * sway;
    ctx.save();
    ctx.translate(0, -18);
    ctx.rotate(tilt);
    ctx.translate(0, 18);

    // 伞杆
    api.inkLine(ctx, api.shapes.line(0, -262, 0, -26, 1.5, 14, 5), 4.2, PAL.ink);
    // 弯把手
    api.inkLine(ctx, api.shapes.arc(-14, -34, 16, 18, -Math.PI / 2, Math.PI * 1.15, 16), 4.4, PAL.ink);

    // 伞面
    const cx = 0;
    const cy = -168;
    const rx = 128 * (0.8 + 0.2 * open);
    const ry = 96;
    const canopy: P2[] = [];
    for (let i = 0; i <= 22; i++) {
      const a = Math.PI + (i / 22) * Math.PI;
      canopy.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    // 下沿波浪（右 -> 左）
    const segs = 4;
    for (let k = 0; k < segs; k++) {
      const x1 = rx - (k * 2 * rx) / segs;
      const x0 = rx - ((k + 1) * 2 * rx) / segs;
      for (let i = 1; i <= 8; i++) {
        const u = i / 8;
        canopy.push([api.shapes.lerp(x1, x0, u), cy + Math.sin(u * Math.PI) * 16]);
      }
    }
    api.paint(ctx, canopy, { wash: PAL.teal, sw: 3.6, washOp: 0.9 });

    // 伞面分区色
    for (let k = 0; k < 4; k++) {
      const a = Math.PI + (k / 4) * Math.PI;
      const b = Math.PI + ((k + 1) / 4) * Math.PI;
      const wedge: P2[] = [[cx, cy + 2]];
      for (let i = 0; i <= 10; i++) {
        const aa = api.shapes.lerp(a, b, i / 10);
        wedge.push([cx + Math.cos(aa) * rx, cy + Math.sin(aa) * ry]);
      }
      if (k % 2 === 0) api.paint(ctx, wedge, { wash: PAL.paper, sw: 0, washOp: 0.45 });
    }

    // 伞骨
    for (let k = 0; k <= 4; k++) {
      const a = Math.PI + (k / 4) * Math.PI;
      const tipX = cx + Math.cos(a) * rx;
      const tipY = cy + Math.sin(a) * ry;
      api.inkLine(ctx, api.shapes.line(cx, cy - ry + 4, tipX, tipY + 10, 6, 12, k + 1), 1.8, 'rgba(58,47,42,0.6)');
    }
    // 伞尖
    api.inkLine(ctx, api.shapes.line(0, cy - ry, 0, cy - ry - 22, 1, 6, 9), 3.6, PAL.ink);
    api.paint(ctx, api.shapes.ring(0, cy - ry - 22, 5, 6, 12), { wash: PAL.ochre, sw: 2 });

    // 雨滴
    for (let i = 0; i < 5; i++) {
      const x = -100 + i * 48;
      const y = cy + 26 + Math.sin(t * 2.6 + i * 1.9 + phase) * 4;
      const drop: P2[] = [[x, y - 14], [x + 5, y], [x, y + 9], [x - 5, y]];
      api.paint(ctx, drop, { wash: PAL.sky, sw: 1.8, washOp: 0.85 });
    }
    ctx.restore();
  },
};
