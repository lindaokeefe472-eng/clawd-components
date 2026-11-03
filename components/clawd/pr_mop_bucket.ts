import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_mop_bucket: ComponentDef<ClawdApi> = {
name: 'pr_mop_bucket',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour mop bucket with a wire carry handle, a front rim lip, and a mop resting in it: wooden handle with a brass ferrule, a metal clamp gripping nine cloth strips that hang down into the water. Bubbles, a damp rim ring, and a small puddle on the floor sit around it; anchor is bottom centre, 320×486 px, good for household, cleaning, or chore scenes.',
  tags: ['catalog', 'household', 'cleaning', 'mop', 'bucket', 'container', 'ground'],
  size: [320, 486],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the sway, strip wiggle, and bubble animation so repeated copies do not move in sync.' },
    soak: { type: 'number', default: 1, min: 0, max: 1, description: 'Wetness of the mop: increases the sway of the handle and cloth strips, the damp ring on the rim, and the bubble count/opacity.' },
    water: { type: 'number', default: 0.7, min: 0, max: 1, description: 'Water level in the bucket; brightens and strengthens the water surface sheen and the size/opacity of the puddle on the floor.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, soak = 1, water = 0.7 } = params as { phase?: number; soak?: number; water?: number };
    const sway = Math.sin(t * 1.3 + phase) * 2.2 * soak;

    const rimY = -196;
    const rimRx = 136;
    const rimRy = 26;
    const botY = -18;
    const botRx = 120;
    const nearArc = api.shapes.arc(0, rimY, rimRx, rimRy, Math.PI, 0, 28);
    const inner = api.shapes.ring(0, rimY, rimRx - 10, rimRy - 12, 26);

    api.paint(ctx, api.shapes.ring(0, -9, 132, 10, 22, 0, 0, 6), { wash: '#8b8172', sw: 0, washOp: 0.22 });

    // 提手：整弧落在桶口两端，根部之后用固定耳压住
    const hArc = api.shapes.arc(0, rimY, rimRx * 0.99, 104, Math.PI, Math.PI * 2, 24);
    api.inkLine(ctx, hArc, 7, '#6b7376');
    api.inkLine(ctx, hArc, 4.4, '#9aa3a5');
    api.inkLine(ctx, hArc.map((q) => [q[0], q[1] - 2] as P2), 1.8, 'rgba(255,255,255,0.5)');

    // 桶身
    api.paint(ctx, nearArc.concat([[botRx, botY], [-botRx, botY]] as P2[]), { wash: '#9db9c4', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-118, botY + 2], [118, botY + 2], [114, botY + 16], [-114, botY + 16]], 3), { wash: '#7f9aa8', sw: 0, washOp: 0.7 });
    // 桶内 + 水面
    api.paint(ctx, api.shapes.ring(0, rimY, rimRx, rimRy, 30), { wash: '#4f6d7a', sw: 2.6 });
    api.paint(ctx, inner, { wash: '#6d8fa0', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(0, rimY + 2, rimRx - 22, rimRy - 8, 24), { wash: '#8fb6c6', sw: 0, washOp: 0.5 + 0.25 * api.shapes.clamp01(water) });
    for (let i = 0; i < 2; i++) {
      const r = 34 + i * 30 + Math.sin(t * 2 + i + phase) * 4;
      api.inkLine(ctx, api.shapes.arc(0, rimY + 2, r, r * 0.13, 0, Math.PI * 2, 18), 1.3, 'rgba(255,255,255,0.45)');
    }


    // 桶身高光 + 刻度
    api.paint(ctx, api.shapes.poly([[-116, botY + 20], [-94, botY + 20], [-102, rimY + 22], [-122, rimY + 22]], 4), { wash: '#ffffff', sw: 0, washOp: 0.26 });
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(86, botY - 44 - i * 42, 116, botY - 46 - i * 42, 0, 4, i + 3), 1.6, 'rgba(58,47,42,0.2)');
    }

    // 桶口前唇（压住布条根部）
    api.paint(ctx, api.shapes.lipBand(0, rimY, rimRx, rimRy, 16, 26), { wash: '#8aa7b4', sw: 2.8 });
    api.paint(ctx, api.shapes.lipBand(0, rimY - 4, rimRx - 10, rimRy - 6, 8, 24), { wash: '#b6cfd8', sw: 0, washOp: 0.6 });
    api.inkLine(ctx, api.shapes.arc(0, rimY, rimRx - 14, rimRy - 14, 0, Math.PI, 24), 1.5, 'rgba(58,47,42,0.3)');

    // 提手固定耳
    for (let i = 0; i < 2; i++) {
      const ex = (i ? 1 : -1) * rimRx * 0.99;
      api.paint(ctx, api.shapes.round(ex - 10, rimY - 16, ex + 10, rimY + 8, 5, 3), { wash: '#5f6a6e', sw: 2.3 });
      api.paint(ctx, api.shapes.round(ex - 6, rimY - 12, ex + 6, rimY + 2, 3, 2), { wash: '#9aa3a5', sw: 0, washOp: 0.9 });
      api.paint(ctx, api.shapes.ring(ex, rimY - 4, 2.4, 2.4, 8), { wash: '#3f464b', sw: 0 });
    }

    // 拖把：夹头坐前唇上、杆向上、布条由夹头垂进水里
    ctx.save();
    ctx.translate(-34, rimY - 4);
    ctx.rotate(0.12 + sway * 0.004);
    // 杆
    api.inkLine(ctx, api.shapes.line(0, 0, -12, -196, 2, 8, 3), 7, '#c79a6a');
    api.inkLine(ctx, api.shapes.line(2, -2, -10, -192, 2, 8, 4), 2.2, 'rgba(255,255,255,0.35)');
    // 铜箍 + 握把（杆的接头上）
    api.paint(ctx, api.shapes.round(-18, -216, 0, -194, 4, 3), { wash: '#b99a5e', sw: 2 });
    api.paint(ctx, api.shapes.round(-20, -268, 2, -214, 7, 4), { wash: '#6b7376', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(-9, -272, 8, 9, 12), { wash: '#4a5155', sw: 1.6 });
    // 夹头：两片金属夹住布条
    api.paint(ctx, api.shapes.round(-26, -18, 20, 6, 6, 4), { wash: '#8f9b99', sw: 2.4 });
    api.paint(ctx, api.shapes.round(-20, -14, 14, 0, 4, 2), { wash: '#c2ccca', sw: 0, washOp: 0.8 });
    api.paint(ctx, api.shapes.ring(-3, -6, 3.4, 3.4, 8), { wash: '#5f6a6e', sw: 1.4 });
    // 布条：从夹头垂到桶身前（在最前面，不被桶口裁）
    for (let i = 0; i < 9; i++) {
      const u = (i - 4) / 4;
      const k = Math.sin(t * 1.6 + i * 1.4 + phase) * 5 * soak;
      const pts: P2[] = [];
      for (let s = 0; s <= 5; s++) {
        const v = s / 5;
        pts.push([-6 + u * 26 * v + k * v * v, -4 + v * (86 + Math.abs(u) * -14)]);
      }
      api.inkLine(ctx, pts, 5.2, i % 2 ? '#e8dcc0' : '#f2e8d2');
      api.inkLine(ctx, pts.map((q) => [q[0] - 1, q[1]] as P2), 1.6, 'rgba(160,150,130,0.45)');
    }
    ctx.restore();

    // 桶沿上的水痕
    api.paint(ctx, api.shapes.ring(-30, rimY + 6, 44, 8, 16), { wash: '#8fb6c6', sw: 0, washOp: 0.35 * soak });

    // 泡泡
    if (soak > 0.3) {
      for (let i = 0; i < 4; i++) {
        const a = Math.sin(t * 1.5 + i * 1.8 + phase);
        api.paint(ctx, api.shapes.ring(30 + i * 16, rimY - 14 - i * 10 + a * 3, 7 + (i % 2) * 4, 7 + (i % 2) * 4, 12),
          { wash: '#ffffff', sw: 1.2, washOp: 0.55 * soak });
      }
    }
    // 地上一小滩水
    api.paint(ctx, api.shapes.ring(70, -12, 54, 9, 18, 0, 0.1, 5), { wash: '#8fb6c6', sw: 0, washOp: 0.32 * api.shapes.clamp01(water) });
  },
};
