import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_bread_basket: ComponentDef<ClawdApi> = {
name: 'pr_bread_basket',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour bread basket with a woven oval body, arched handle, baguettes, round rolls, a lining cloth and a draped napkin. It is 400×320 px with its anchor at the bottom centre, and is suited to kitchen, market or tabletop scenes.',
  tags: ['catalog', 'kitchen', 'bread', 'basket', 'food', 'woven', 'container', 'tabletop'],
  size: [400, 320],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; desynchronises the handle sway and steam animation between copies.' },
    full: { type: 'number', default: 1, min: 0, max: 1, description: 'Fill level; above 0.4 shows the handle and steam, at or below 0.4 hides them while the bread remains visible.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, full = 1 } = params as { phase?: number; full?: number };

    // 篮口椭圆：口沿前倾（ry 大一点 = 更"俯"的视角），前沿以下才是篮身
    const rimY = -156;
    const rimRx = 186;
    const rimRy = 36;
    const botY = -14;
    const botRx = 150;
    const nearArc = api.shapes.arc(0, rimY, rimRx, rimRy, Math.PI, 0, 30);

    api.paint(ctx, api.shapes.ring(0, -9, 172, 10, 24, 0, 0, 4), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 提手：半椭圆弧，两端精确落在口沿左右两端（根部之后被前唇压住）
    if (full > 0.4) {
      const h = Math.sin(t * 1.5 + phase) * 2;
      const handle = api.shapes.arc(0, rimY, rimRx * 0.99, 112 + h, Math.PI, Math.PI * 2, 24);
      api.inkLine(ctx, handle, 8, '#8a6039');
      api.inkLine(ctx, handle, 5.5, '#a97b4f');
      api.inkLine(ctx, handle.map((q) => [q[0], q[1] - 2.4] as P2), 2.2, 'rgba(255,246,230,0.45)');
    }

    // 篮身
    api.paint(ctx, nearArc.concat([[botRx, botY], [-botRx, botY]] as P2[]), { wash: '#bd8f5e', sw: 3.4 });
    for (let i = 1; i < 9; i++) {
      const a = Math.PI - (i / 9) * Math.PI;
      const tx = Math.cos(a) * rimRx * 0.99;
      const ty = rimY + Math.sin(a) * rimRy * 0.99;
      api.inkLine(ctx, api.shapes.line(tx, ty, tx * (botRx / rimRx), botY + 2, 0, 5, i + 2), 1.5, 'rgba(120,80,44,0.28)');
    }
    ctx.save();
    api.shapes.clip(ctx, nearArc.concat([[botRx, botY], [-botRx, botY]] as P2[]));
    for (let r = 0; r < 4; r++) {
      const f = (r + 1) / 5;
      const yy = api.shapes.lerp(rimY + rimRy, botY, f);
      const half = api.shapes.lerp(rimRx * 1.04, botRx * 1.1, f);
      api.inkLine(ctx, api.shapes.line(-half, yy, half, yy, 7 * f, 12, r + 7), 1.5, 'rgba(120,80,44,0.24)');
    }
    ctx.restore();
    api.paint(ctx, api.shapes.poly([[-botRx + 14, botY], [botRx - 14, botY], [botRx - 22, botY - 11], [-botRx + 22, botY - 11]], 3),
      { wash: '#a97b4f', sw: 2.4 });

    // 篮内（内腔 + 阴影）
    api.paint(ctx, api.shapes.ring(0, rimY, rimRx, rimRy, 32), { wash: '#7c5c3c', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(0, rimY + 6, rimRx - 20, rimRy - 14, 28), { wash: '#936d46', sw: 0, washOp: 0.85 });

    // ---- 内容物：全部画在"口沿平面"上（baked top，没有竖立面）----
    ctx.save();
    api.shapes.clip(ctx, api.shapes.ring(0, rimY - 26, rimRx - 26, rimRy + 30, 44));

    // 衬布：跟着口沿平面走的一片椭圆
    api.paint(ctx, api.shapes.ring(0, rimY - 18, rimRx - 40, rimRy - 6, 30, 0, 0.05, 5), { wash: '#f7f0e2', sw: 0, washOp: 0.95 });
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-120 + i * 34, rimY - 4 + i * 3, -74 + i * 34, rimY - 12 + i * 3, 3, 4, i + 4), 1.1, 'rgba(176,166,146,0.4)');
      api.inkLine(ctx, api.shapes.line(64 + i * 30, rimY - 2 + i * 2, 96 + i * 30, rimY - 10 + i * 2, 3, 4, i + 9), 1.1, 'rgba(176,166,146,0.34)');
    }

    // 法棍：斜躺的胶囊，顶端有一道"圆润的高光带"（不是平盖子）
    const baguette = (cx: number, cy: number, len: number, hw: number, ang: number, wash: string, seed: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      api.paint(ctx, api.shapes.round(-len / 2, -hw, len / 2, hw, hw * 0.85, 7), { wash, sw: 2.6 });
      // 顶部圆滚的高光（贴着一侧，占宽约 40%）
      api.paint(ctx, api.shapes.round(-len / 2 + 10, -hw + 3, len / 2 - 10, -hw + hw * 0.8, hw * 0.4, 6),
        { wash: '#ffffff', sw: 0, washOp: 0.26 });
      // 底侧暗边
      api.paint(ctx, api.shapes.round(-len / 2 + 12, hw - hw * 0.42, len / 2 - 12, hw - 2, hw * 0.3, 5),
        { wash: '#8f6535', sw: 0, washOp: 0.2 });
      // 两端的切面（椭圆）
      api.paint(ctx, api.shapes.ring(-len / 2 + 5, 0, 7, hw - 4, 12), { wash: '#e7c79a', sw: 1.6, washOp: 0.9 });
      api.paint(ctx, api.shapes.ring(len / 2 - 5, 0, 7, hw - 4, 12), { wash: '#e7c79a', sw: 1.6, washOp: 0.9 });
      // 斜切纹
      for (let s = 0; s < 4; s++) {
        const x = -len / 2 + 26 + s * ((len - 52) / 3);
        api.inkLine(ctx, api.shapes.line(x, -hw + 6, x + 12, hw - 6, 2, 4, s + seed), 1.7, 'rgba(120,80,44,0.4)');
      }
      ctx.restore();
    };
    baguette(-52, rimY - 40, 168, 23, 0.26, '#c79a6a', 3);
    baguette(34, rimY - 22, 156, 21, -0.16, '#d8ab55', 7);
    // 前面两只小圆面包，把口沿填满
    api.paint(ctx, api.shapes.ring(-2, rimY - 18, 32, 16, 18, 0.1), { wash: '#d9a75e', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(-12, rimY - 24, 18, 6, 14), { wash: '#ffffff', sw: 0, washOp: 0.22 });

    // 圆面包：俯视看到的是一枚椭圆，只在上缘留一条高光
    api.paint(ctx, api.shapes.ring(122, rimY - 24, 46, 22, 22, -0.12), { wash: '#d9a75e', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(112, rimY - 32, 30, 9, 16, -0.12), { wash: '#ffffff', sw: 0, washOp: 0.22 });
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.arc(122 + (i - 1) * 14, rimY - 24, 12, 5, Math.PI * 0.15, Math.PI * 0.85, 6), 1.2, 'rgba(120,80,44,0.35)');
    }
    // 碎屑
    for (let i = 0; i < 5; i++) {
      api.paint(ctx, api.shapes.ring(-96 + i * 44, rimY + 4 + (i % 2) * 6, 3, 2, 6), { wash: '#c9a878', sw: 0, washOp: 0.6 });
    }
    ctx.restore();

    // 口沿前唇
    api.paint(ctx, api.shapes.lipBand(0, rimY, rimRx, rimRy, 20, 28), { wash: '#b2835a', sw: 2.8 });
    api.paint(ctx, api.shapes.lipBand(0, rimY - 6, rimRx - 12, rimRy - 8, 10, 26), { wash: '#d2a976', sw: 0, washOp: 0.55 });
    api.inkLine(ctx, api.shapes.arc(0, rimY, rimRx - 17, rimRy - 19, 0, Math.PI, 26), 1.6, 'rgba(58,47,42,0.32)');

    // 提手根部的固定耳（压在口沿上，遮住提手末端，形成真实衔接）
    if (full > 0.4) {
      for (let i = 0; i < 2; i++) {
        const ex = (i ? 1 : -1) * rimRx * 0.99;
        api.paint(ctx, api.shapes.round(ex - 10, rimY - 16, ex + 10, rimY + 6, 5, 3), { wash: '#8a6039', sw: 2.4 });
        api.paint(ctx, api.shapes.round(ex - 7, rimY - 13, ex + 7, rimY + 1, 4, 2), { wash: '#b98a5c', sw: 0, washOp: 0.9 });
        api.paint(ctx, api.shapes.ring(ex, rimY - 6, 2.6, 2.6, 8), { wash: '#6b4f34', sw: 0 });
      }
    }

    // 左前方垂到篮身外的餐布
    const drape: P2[] = [[-150, rimY + 6], [-96, rimY + 2], [-88, rimY + 46], [-102, rimY + 66],
      [-124, rimY + 62], [-142, rimY + 40]];
    api.paint(ctx, drape, { wash: '#fbf5e8', sw: 2.4 });
    api.inkLine(ctx, api.shapes.line(-140, rimY + 18, -100, rimY + 14, 3, 4, 4), 1.2, 'rgba(176,166,146,0.5)');
    api.inkLine(ctx, api.shapes.line(-138, rimY + 38, -98, rimY + 46, 3, 4, 6), 1.1, 'rgba(176,166,146,0.35)');
    api.inkLine(ctx, api.shapes.line(-124, rimY + 8, -118, rimY + 58, 2, 4, 8), 1.1, 'rgba(176,166,146,0.3)');

    // 热气
    if (full > 0.4) {
      for (let i = 0; i < 2; i++) {
        const pts: P2[] = [];
        for (let s = 0; s <= 6; s++) {
          const v = s / 6;
          pts.push([-40 + i * 76 + Math.sin(v * 4.4 + t * 1.5 + i * 2 + phase) * (5 + v * 9), rimY - 74 - v * 42]);
        }
        api.inkLine(ctx, pts, 2, 'rgba(200,196,186,0.3)');
      }
    }
  },
};
