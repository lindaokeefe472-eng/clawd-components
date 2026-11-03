import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_bowl_chopsticks: ComponentDef<ClawdApi> = {
name: 'pr_bowl_chopsticks',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour bowl of rice with blue floral banding, two chopsticks resting across the rim, and soft animated steam; anchor is bottom centre and size is 250×190 px. It works as tableware on a tabletop or ground-level meal scene.',
  tags: ['catalog', 'tableware', 'bowl', 'chopsticks', 'rice', 'steam', 'ground'],
  size: [250, 190],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the chopstick wobble and steam animation, useful for desynchronising multiple bowls.' },
    steam: { type: 'number', default: 1, min: 0, max: 2, description: 'Controls steam strength; 0 hides steam, 1 is the default, and 2 gives stronger steam.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, steam = 1 } = params as { phase?: number; steam?: number };
    const { PAL } = api;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 78, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 饭碗
    const bowl: P2[] = [[-84, -96], [84, -96], [58, -18], [-58, -18]];
    api.paint(ctx, bowl, { wash: '#f3ead7', sw: 3.6 });
    // 碗口
    api.paint(ctx, api.shapes.ring(0, -96, 84, 22, 34), { wash: '#fbf5e6', sw: 3.2 });
    // 碗身青花纹
    for (let i = 0; i < 4; i++) {
      const x = -48 + i * 32;
      api.paint(ctx, api.shapes.ring(x, -62, 11, 7, 12, 0.2, 0.1, i + 3), { wash: PAL.sky, sw: 1.4, washOp: 0.85 });
      api.inkLine(ctx, [[x, -56], [x, -46]], 1.4, 'rgba(79,156,152,0.7)');
    }
    api.inkLine(ctx, api.shapes.arc(0, -86, 76, 14, Math.PI * 0.12, Math.PI * 0.88, 16), 1.6, 'rgba(79,156,152,0.55)');

    // 米饭
    api.paint(ctx, api.shapes.ring(0, -100, 74, 20, 30, 0, 0.05, 5), { wash: '#fffdf5', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(-12, -108, 46, 16, 22, 0, 0.07, 9), { wash: '#ffffff', sw: 0, washOp: 0.8 });
    for (let i = 0; i < 9; i++) {
      const x = -50 + i * 12 + api.shapes.jit(i, 5);
      const y = -112 - Math.abs(api.shapes.jit(i + 4, 8));
      api.inkLine(ctx, [[x, y], [x + 3, y - 5]], 1.2, 'rgba(200,190,170,0.6)');
    }

    // 筷子：横搭在碗沿上
    for (let i = 0; i < 2; i++) {
      const wig = Math.sin(t * 1.2 + i * 1.4 + phase) * 1.2;
      const pts = api.shapes.line(-56, -96 + i * 11 + wig, 98, -138 + i * 11 + wig, -1, 8, i + 3);
      api.inkLine(ctx, pts, 5.6, '#c9a978');
      api.inkLine(ctx, pts, 2.2, PAL.ink);
      // 握端加粗
      api.inkLine(ctx, api.shapes.line(72, -126 + i * 11 + wig, 98, -138 + i * 11 + wig, -1, 4, i + 6), 3.4, PAL.ink);
    }

    // 蒸汽
    if (steam > 0) {
      for (let i = 0; i < 3; i++) {
        const pts: P2[] = [];
        for (let k = 0; k <= 10; k++) {
          const u = k / 10;
          pts.push([-28 + i * 28 + Math.sin(u * 4.2 - t * 2.4 + i * 1.6 + phase) * (4 + u * 10), -126 - u * 40]);
        }
        api.inkLine(ctx, pts, 2, `rgba(58,47,42,${0.2 - i * 0.04})`);
      }
    }
  },
};
