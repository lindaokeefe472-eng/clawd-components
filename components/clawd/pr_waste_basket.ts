import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_waste_basket: ComponentDef<ClawdApi> = {
name: 'pr_waste_basket',
  style: 'clawd',
  kind: 'prop',
  description: 'A woven watercolour waste basket seen slightly from above, with an oval rim, two small side grips, crumpled paper balls peeking out of the opening, and one loose paper ball resting beside the base. Anchor is bottom centre, 300×330 px; suited as a floor prop in a study, office or bedroom corner.',
  tags: ['catalog', 'waste-basket', 'household', 'office', 'woven', 'container', 'ground', 'decor'],
  size: [300, 330],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the idle sway and paper-ball bobbing in radians so multiple baskets don\'t move in sync.' },
    full: { type: 'number', default: 0.6, min: 0, max: 1, description: 'Fill level; controls how many crumpled paper balls are drawn inside the rim, from empty at 0 to all four at 1.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, full = 0.6 } = params as { phase?: number; full?: number };
    const sway = Math.sin(t * 1.1 + phase) * 1.2;

    // 桶口椭圆（略俯视）：前沿以下才是桶身
    const rimY = -240;
    const rimRx = 124;
    const rimRy = 25;
    const botY = -20;
    const botRx = 106;
    const nearArc = api.shapes.arc(0, rimY, rimRx, rimRy, Math.PI, 0, 28);

    api.paint(ctx, api.shapes.ring(0, -8, 118, 10, 22, 0, 0, 4), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 两侧握把（在桶身之后，之后用固定耳压住根部）
    const grips = (side: number) => {
      const x = side * rimRx * 0.99;
      const path: P2[] = [[x, rimY - 6], [x + side * 16, rimY - 30], [x + side * 26, rimY - 8], [x, rimY + 8]];
      api.inkLine(ctx, path, 7, '#8a6039');
      api.inkLine(ctx, path, 4.4, '#b98a5c');
      api.inkLine(ctx, path.map((q) => [q[0], q[1] - 1.6] as P2), 1.6, 'rgba(255,246,230,0.45)');
    };
    grips(-1);
    grips(1);

    // 桶身（纸编竖纹）
    api.paint(ctx, nearArc.concat([[botRx, botY], [-botRx, botY]] as P2[]), { wash: '#d3b98a', sw: 3.2 });
    ctx.save();
    api.shapes.clip(ctx, nearArc.concat([[botRx, botY], [-botRx, botY]] as P2[]));
    for (let i = 1; i < 10; i++) {
      const a = Math.PI - (i / 10) * Math.PI;
      const tx = Math.cos(a) * rimRx * 0.99;
      const ty = rimY + Math.sin(a) * rimRy * 0.99;
      api.inkLine(ctx, api.shapes.line(tx, ty, tx * (botRx / rimRx), botY + 2, 0, 5, i + 2), 1.5, 'rgba(150,110,60,0.34)');
    }
    for (let r = 0; r < 3; r++) {
      const f = (r + 1) / 4;
      const yy = api.shapes.lerp(rimY + rimRy, botY, f);
      const half = api.shapes.lerp(rimRx * 1.04, botRx * 1.1, f);
      api.inkLine(ctx, api.shapes.line(-half, yy, half, yy, 6 * f, 10, r + 7), 1.5, 'rgba(150,110,60,0.28)');
    }
    ctx.restore();
    api.paint(ctx, api.shapes.poly([[-botRx + 10, botY], [botRx - 10, botY], [botRx - 18, botY - 10], [-botRx + 18, botY - 10]], 3),
      { wash: '#a97b4f', sw: 2.2 });

    // 桶内
    api.paint(ctx, api.shapes.ring(0, rimY, rimRx, rimRy, 30), { wash: '#8f7449', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(0, rimY + 5, rimRx - 16, rimRy - 11, 26), { wash: '#6b543c', sw: 0, washOp: 0.8 });

    // 里面的纸团（被桶口裁住，不会漏出桶身）
    const papers = [
      { x: -56, y: rimY - 22, r: 27, seed: 1 },
      { x: 4, y: rimY - 40, r: 24, seed: 5 },
      { x: 56, y: rimY - 20, r: 26, seed: 9 },
      { x: -14, y: rimY - 6, r: 21, seed: 13 },
    ];
    ctx.save();
    api.shapes.clip(ctx, api.shapes.lipClip(0, rimY, rimRx - 14, rimRy - 16));
    for (let i = 0; i < Math.min(4, Math.ceil(full * 4)); i++) {
      const p = papers[i];
      const k = Math.sin(t * 1.4 + i * 1.7 + phase) * 1.6 * (i === 1 ? 1.4 : 1);
      api.paint(ctx, api.shapes.ring(p.x + sway * 0.4, p.y + k, p.r, p.r * 0.86, 12, 0, 0.18, p.seed),
        { wash: i % 2 ? '#f6efdf' : '#efe6d2', sw: 2 });
      api.inkLine(ctx, api.shapes.poly([[p.x - p.r * 0.55, p.y - 4], [p.x, p.y + p.r * 0.35], [p.x + p.r * 0.45, p.y - p.r * 0.3]], 3), 1.2,
        'rgba(140,130,110,0.45)');
    }
    ctx.restore();

    // 桶口前唇
    api.paint(ctx, api.shapes.lipBand(0, rimY, rimRx, rimRy, 15, 26), { wash: '#c8a877', sw: 2.8 });
    api.paint(ctx, api.shapes.lipBand(0, rimY - 4, rimRx - 10, rimRy - 6, 8, 24), { wash: '#ddc094', sw: 0, washOp: 0.55 });
    api.inkLine(ctx, api.shapes.arc(0, rimY, rimRx - 13, rimRy - 14, 0, Math.PI, 24), 1.5, 'rgba(58,47,42,0.3)');

    // 握把的固定耳（压住两端）
    for (let i = 0; i < 2; i++) {
      const ex = (i ? 1 : -1) * rimRx * 0.99;
      for (let s = 0; s < 2; s++) {
        const ey = rimY - 6 + s * 14;
        api.paint(ctx, api.shapes.round(ex - 8, ey - 7, ex + 8, ey + 7, 4, 3), { wash: '#8a6039', sw: 2.1 });
        api.paint(ctx, api.shapes.ring(ex, ey, 2, 2, 8), { wash: '#6b4f34', sw: 0 });
      }
    }

    // 掉在外面的一团纸
    api.paint(ctx, api.shapes.ring(104, -16, 17, 14, 12, 0.4, 0.2, 7), { wash: '#f6efdf', sw: 2 });
    api.inkLine(ctx, api.shapes.poly([[94, -20], [104, -10], [114, -20]], 3), 1.2, 'rgba(140,130,110,0.5)');
  },
};
