import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_knife_block: ComponentDef<ClawdApi> = {
name: 'pr_knife_block',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wooden knife block with up to three knives slotted into its angled top, a chef\'s knife lying on the counter in front, and a honing steel leaning at the right; anchor is bottom centre, 300×380 px. It works as a kitchen counter prop beside or behind food-prep scenes.',
  tags: ['catalog', 'kitchen', 'knife-block', 'wood', 'counter', 'decor', 'container'],
  size: [300, 380],
  params: {
    count: { type: 'number', default: 3, min: 0, max: 12, description: 'Number of knives slotted into the block; the drawing clamps the visible slots to 1–3.' },
  },
  draw(api, params) {
    const ctx = api.ctx;
    const { count = 3 } = params as { count?: number };

    api.paint(ctx, api.shapes.ring(0, -10, 128, 11, 22, 0, 0, 6), { wash: '#8b8172', sw: 0, washOp: 0.22 });

    // 刀座（前倾的木块，顶面是一条斜边）
    const topA: P2 = [-74, -240];
    const topB: P2 = [86, -228];
    api.paint(ctx, api.shapes.poly([[-104, -16], [104, -16], topB, topA], 4), { wash: '#a97b4f', sw: 3.4 });
    // 顶面（斜面上的一条亮面）
    api.paint(ctx, api.shapes.poly([topA, topB, [topB[0] - 8, topB[1] + 16], [topA[0] + 6, topA[1] + 16]], 3), { wash: '#c9a26f', sw: 2.2 });
    api.paint(ctx, api.shapes.poly([[-104, -16], [104, -16], [102, -34], [-102, -34]], 3), { wash: '#8a6d4e', sw: 2.4 });
    // 木纹
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-88 + i * 52, -40 - i * 6, -64 + i * 52, -210 - i * 4, 1, 6, i + 3), 1.2, 'rgba(120,80,44,0.28)');
    }
    api.paint(ctx, api.shapes.poly([[-94, -30], [-66, -30], [-56, -214], [-80, -216]], 4), { wash: '#ffffff', sw: 0, washOp: 0.14 });

    // ---- 三把刀：刀身插进刀座，露在外面的是「铜箍 + 刀柄」 ----
    const at = (u: number): P2 => [api.shapes.lerp(topA[0], topB[0], u), api.shapes.lerp(topA[1], topB[1], u)];
    const knives = [
      { u: 0.24, tilt: -0.10, len: 96, show: 34, wash: '#cfd6d4' },
      { u: 0.50, tilt: 0.02, len: 108, show: 0, wash: '#e2e7e5' },
      { u: 0.76, tilt: 0.11, len: 88, show: 16, wash: '#b9c2c2' },
    ];
    const n = Math.min(3, Math.max(1, Math.round(count)));
    for (let i = 0; i < n; i++) {
      const k = knives[i];
      const [sx, sy] = at(k.u);
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(k.tilt);
      // 插槽：刀座上的黑缝（把刀"吃"进去）
      api.paint(ctx, api.shapes.round(-11, -5, 11, 5, 4), { wash: '#3f3126', sw: 0, washOp: 0.9 });
      api.inkLine(ctx, api.shapes.line(-10, -2, 10, -2, 0, 4, i + 3), 1.6, 'rgba(58,47,42,0.5)');
      // 拔出来一截的刀身（show > 0 才露）
      if (k.show > 0) {
        api.paint(ctx, api.shapes.poly([[-7, -k.show], [7, -k.show], [7, 4], [-7, 4]], 3), { wash: k.wash, sw: 2.2, washOp: 1 });
        api.paint(ctx, api.shapes.poly([[-6, -k.show + 3], [-2, -k.show + 3], [-2, 3], [-6, 3]], 3), { wash: '#ffffff', sw: 0, washOp: 0.45 });
        // 刃口
        api.inkLine(ctx, api.shapes.line(7, -k.show + 2, 7, 2, 0, 4, i + 5), 1.6, '#5c6664');
      }
      // 铜箍（bolster）：骑在槽口上，遮住刀身与刀柄的接缝
      api.paint(ctx, api.shapes.round(-8.5, -k.show - 16, 8.5, -k.show + 3, 3, 3), { wash: '#c9a35e', sw: 2.3 });
      api.paint(ctx, api.shapes.round(-5.5, -k.show - 12, 5.5, -k.show - 1, 2, 2), { wash: '#e2c68a', sw: 0, washOp: 0.8 });
      // 刀柄：从铜箍里长出去，柄尾收口 + 铆钉
      api.paint(ctx, api.shapes.round(-9, -k.show - k.len, 9, -k.show - 10, 6, 5), { wash: '#3f464b', sw: 2.3 });
      api.paint(ctx, api.shapes.round(-6, -k.show - k.len + 8, 4, -k.show - 16, 5, 3), { wash: '#6b7376', sw: 0, washOp: 0.55 });
      api.paint(ctx, api.shapes.round(-10, -k.show - k.len - 4, 10, -k.show - k.len + 6, 4, 3), { wash: '#2f363a', sw: 2.1 });
      for (let s = 0; s < 3; s++) {
        api.paint(ctx, api.shapes.ring(0, -k.show - 26 - s * 18, 2.4, 2.4, 8), { wash: '#9aa3a5', sw: 0, washOp: 0.75 });
      }
      ctx.restore();
    }

    // ---- 台面上的主厨刀：平放在刀座前方（刀尖朝左）----
    ctx.save();
    ctx.translate(-10, -2);
    ctx.rotate(-0.03);
    // 刀身（刀背直、刃口收窄）
    api.paint(ctx, api.shapes.poly([[-124, -14], [-124, -3], [-24, -5], [14, -9], [14, -20], [-34, -22]], 4), { wash: '#dfe4e0', sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[-120, -6], [-30, -8], [-30, -11], [-120, -10]], 3), { wash: '#ffffff', sw: 0, washOp: 0.5 });
    api.inkLine(ctx, api.shapes.line(-122, -3.5, 12, -9, 1, 8, 4), 1.8, '#5c6664');
    // 铜箍
    api.paint(ctx, api.shapes.round(12, -22, 26, -6, 4, 3), { wash: '#c9a35e', sw: 2.2 });
    api.paint(ctx, api.shapes.round(15, -18, 23, -10, 2), { wash: '#e2c68a', sw: 0, washOp: 0.8 });
    // 刀柄
    api.paint(ctx, api.shapes.round(24, -22, 92, -6, 8, 4), { wash: '#4a5155', sw: 2.3 });
    api.paint(ctx, api.shapes.round(28, -19, 86, -15, 6, 2), { wash: '#6b7376', sw: 0, washOp: 0.5 });
    api.paint(ctx, api.shapes.round(86, -24, 94, -4, 5, 3), { wash: '#3b4145', sw: 2 });
    for (let s2 = 0; s2 < 2; s2++) api.paint(ctx, api.shapes.ring(44 + s2 * 28, -14, 3, 3, 8), { wash: '#9aa3a5', sw: 0, washOp: 0.8 });
    ctx.restore();

    // ---- 磨刀棒：棒尖立在台面上，斜靠在刀座右外侧 ----
    ctx.save();
    ctx.translate(122, -6);
    ctx.rotate(-0.13);
    // 棒身（下细上粗）
    api.paint(ctx, api.shapes.poly([[-3, 0], [3, 0], [5, -96], [-5, -96]], 3), { wash: '#b9b2a2', sw: 2.2 });
    api.paint(ctx, api.shapes.poly([[-2, -4], [0.5, -4], [2, -92], [-1, -92]], 3), { wash: '#ffffff', sw: 0, washOp: 0.55 });
    // 棒尖（立在台面上）
    api.paint(ctx, api.shapes.ring(0, -1.5, 3.4, 2.6, 10), { wash: '#8f8a7e', sw: 1.6 });
    // 铜箍
    api.paint(ctx, api.shapes.round(-6.5, -114, 6.5, -94, 3, 2), { wash: '#c9a35e', sw: 2 });
    // 柄
    api.paint(ctx, api.shapes.round(-7.5, -160, 7.5, -112, 6, 4), { wash: '#5a4b3c', sw: 2.2 });
    api.paint(ctx, api.shapes.round(-4.5, -156, 1, -118, 4, 2), { wash: '#7d6a54', sw: 0, washOp: 0.6 });
    api.paint(ctx, api.shapes.ring(0, -164, 6, 5.5, 10), { wash: '#4a3d31', sw: 1.8 });
    ctx.restore();
  },
};
