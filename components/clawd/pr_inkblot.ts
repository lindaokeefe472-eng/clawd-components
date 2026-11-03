import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_inkblot: ComponentDef<ClawdApi> = {
name: 'pr_inkblot',
  style: 'clawd',
  kind: 'prop',
  description: 'A cream card holds a symmetric dark inkblot with subtle watercolour shading, faint wet rings, and a soft shadow at its base. It is 250×250 px with a bottom-centre anchor and works as a small prop for a desk, shelf, or psychological scene.',
  tags: ['catalog', 'inkblot', 'psychology', 'card', 'paper', 'decor', 'ground'],
  size: [250, 250],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; desynchronises the breathing and wet-ring animation between copies.' },
    wet: { type: 'number', default: 1, min: 0, max: 1, description: 'Wetness amount; controls the visibility of the faint animated water rings over the inkblot.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wet = 1 } = params as { phase?: number; wet?: number };
    const { PAL } = api;
    const breathe = 1 + Math.sin(t * 1.1 + phase) * 0.012;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 96, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 卡纸
    api.paint(ctx, api.shapes.poly([[-112, -10], [112, -10], [112, -226], [-112, -226]], 4), { wash: '#f7f2e4', sw: 3.2 });
    api.inkLine(ctx, api.shapes.poly([[-102, -20], [102, -20], [102, -216], [-102, -216]], 4), 1.2, 'rgba(58,47,42,0.18)');

    // 墨迹（左右对称，用确定性抖动）
    ctx.save();
    ctx.translate(0, -118);
    ctx.scale(breathe, breathe);
    // 只算右半边半径，左半边镜像 —— 严格左右对称
    const rad = (a: number, i: number): number =>
      46 +
      Math.abs(Math.sin(a * 3 + 0.7)) * 18 +
      Math.cos(a * 5) * 8 +
      (api.shapes.hash(i * 3.3) * 2 - 1) * 6 +
      (a > 0.55 && a < 1.35 ? 20 : 0) +
      (a > 1.9 && a < 2.5 ? 12 : 0);
    const half: P2[] = [];
    for (let i = 0; i <= 20; i++) {
      const a = Math.PI * 0.5 - (i / 20) * Math.PI;
      const r = rad(a, i);
      half.push([Math.cos(a) * r, Math.sin(a) * r * 0.92]);
    }
    const blobPts: P2[] = half.concat(half.slice(1, -1).reverse().map((pt) => [-pt[0], pt[1]] as P2));
    api.paint(ctx, blobPts, { wash: '#39404a', sw: 2.8 });
    // 中间的对称缝（细，不切断整体）
    api.inkLine(ctx, api.shapes.line(0, -46, 0, 44, 0, 8, 4), 1.4, 'rgba(247,242,228,0.5)');
    // 墨的浓淡
    api.paint(ctx, api.shapes.ring(-24, -10, 22, 30, 18, 0.3, 0.2, 5), { wash: PAL.ink, sw: 0, washOp: 0.25 });
    api.paint(ctx, api.shapes.ring(26, 12, 18, 24, 16, -0.2, 0.2, 9), { wash: PAL.ink, sw: 0, washOp: 0.2 });
    ctx.restore();

    // 水痕与未干的反光
    if (wet > 0) {
      for (let i = 0; i < 3; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 1.6 + i * 2.1 + phase);
        api.inkLine(ctx, api.shapes.arc(0, -118, 62 + i * 8, 54 + i * 7, Math.PI * 1.1, Math.PI * 1.6, 10), 1.4, `rgba(58,47,42,${0.16 * k * wet})`);
      }
    }
    // 卡片角标
    api.inkLine(ctx, api.shapes.line(-96, -206, -70, -206, 0, 4, 4), 1.4, 'rgba(58,47,42,0.28)');
    api.inkLine(ctx, api.shapes.line(-96, -198, -80, -198, 0, 3, 6), 1.2, 'rgba(58,47,42,0.2)');
  },
};
