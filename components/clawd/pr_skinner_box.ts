import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_skinner_box: ComponentDef<ClawdApi> = {
name: 'pr_skinner_box',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour acrylic Skinner box with a lever, food-dispenser opening and pellets, an abstract mouse silhouette inside, and a paper strip recording a behaviour curve. Anchored at the bottom centre at 270×250 px, it suits psychology or laboratory scenes as a floor-standing prop.',
  tags: ['catalog', 'psychology', 'lab', 'prop', 'container', 'ground', 'animal'],
  size: [270, 250],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the lever, mouse, pellet and tail animations between copies.' },
    press: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls how far the lever is pressed and animated.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, press = 1 } = params as { phase?: number; press?: number };
    const { PAL } = api;
    const lever = Math.max(0, Math.sin(t * 1.6 + phase)) * 0.12 * press;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 104, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 箱体（半透明亚克力）
    api.paint(ctx, api.shapes.poly([[-112, -10], [112, -10], [112, -216], [-112, -216]], 4), { wash: '#e7eef0', sw: 3.6 });
    api.paint(ctx, api.shapes.poly([[-104, -18], [104, -18], [104, -208], [-104, -208]], 3), { wash: '#f7fbfc', sw: 2.4 });
    // 顶面透视
    api.paint(ctx, api.shapes.poly([[-112, -216], [112, -216], [92, -232], [-92, -232]], 3), { wash: '#dbe6e8', sw: 2.6 });
    // 反射高光
    api.inkLine(ctx, api.shapes.line(-92, -190, -74, -40, 2, 6, 3), 2, 'rgba(255,255,255,0.7)');
    api.inkLine(ctx, api.shapes.line(-68, -190, -50, -40, 2, 6, 5), 1.6, 'rgba(255,255,255,0.5)');

    // 杠杆
    ctx.save();
    ctx.translate(-52, -64);
    ctx.rotate(lever);
    api.paint(ctx, api.shapes.poly([[-6, 0], [6, 0], [6, -34], [-6, -34]], 3), { wash: '#b9c1c0', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(0, -38, 9, 6, 12), { wash: PAL.rose, sw: 2.2 });
    ctx.restore();
    api.paint(ctx, api.shapes.ring(-52, -58, 10, 4, 12), { wash: 'rgba(58,47,42,0.3)', sw: 0 });

    // 食物出口与粮丸
    api.paint(ctx, api.shapes.poly([[36, -120], [96, -120], [96, -96], [36, -96]], 3), { wash: '#cfd8d6', sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[42, -116], [90, -116], [90, -100], [42, -100]], 3), { wash: '#8f9b99', sw: 0, washOp: 0.6 });
    for (let i = 0; i < 3; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 2 + i * 2.2 + phase);
      api.paint(ctx, api.shapes.ring(52 + i * 14, -84 - k * 4, 5, 4.4, 10), { wash: PAL.ochre, sw: 1.4, washOp: 0.9 });
    }
    // 箱内的小鼠（抽象剪影，鼻子朝着杠杆）
    ctx.save();
    ctx.translate(-6, -26);
    const sniff = Math.sin(t * 2.4 + phase) * 2.4;
    api.paint(ctx, api.shapes.ring(-26, 0, 40, 20, 20, 0, 0.05, 7), { wash: 'rgba(58,47,42,0.34)', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(-58 + sniff, -4, 15, 13, 16, 0.1, 0.05, 4), { wash: 'rgba(58,47,42,0.34)', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(-62 + sniff, -16, 8, 7, 12, -0.3), { wash: 'rgba(58,47,42,0.34)', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(-70 + sniff, -3, 4, 3.4, 8), { wash: 'rgba(58,47,42,0.5)', sw: 0 });
    const tail: P2[] = [];
    for (let i = 0; i <= 8; i++) {
      const u = i / 8;
      tail.push([10 + u * 30, 6 - Math.sin(u * 5 + t * 2 + phase) * 10]);
    }
    api.inkLine(ctx, tail, 2.4, 'rgba(58,47,42,0.4)');
    ctx.restore();

    // 地上的粮丸
    for (let i = 0; i < 3; i++) {
      api.paint(ctx, api.shapes.ring(6 + i * 16, -18, 5, 4, 10), { wash: PAL.ochre, sw: 1.4, washOp: 0.9 });
    }

    // 记录纸带（行为曲线）
    api.paint(ctx, api.shapes.poly([[-96, -232], [-40, -232], [-40, -196], [-96, -196]], 3), { wash: PAL.paper, sw: 2.2 });
    const curve: P2[] = [];
    for (let i = 0; i <= 10; i++) {
      const x = -92 + i * 4.8;
      const y = -202 - Math.pow(i / 10, 1.6) * 28;
      curve.push([x, y]);
    }
    api.inkLine(ctx, curve, 1.8, PAL.teal);
  },
};
