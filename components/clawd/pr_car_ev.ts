import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_car_ev: ComponentDef<ClawdApi> = {
name: 'pr_car_ev',
  style: 'clawd',
  kind: 'prop',
  description: 'A side-view watercolour electric car with a long teardrop body, a single dark glass canopy, two spinning spoked wheels, thin LED light strips front and rear, and a charging port with four glowing charge-level bars. It measures 470×200 px with the anchor at the bottom centre, and works as a ground-level vehicle in street or traffic scenes.',
  tags: ['catalog', 'vehicle', 'car', 'electric', 'ground', 'transport', 'decor'],
  size: [470, 200],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the wheel spin, body bob and light flicker so several copies do not animate in sync.' },
    speed: { type: 'number', default: 0.7, min: 0, max: 4, description: 'Animation rate for wheel rotation and body bob; above 0.2 the lamps glow and above 0.4 trailing slipstream lines appear behind the car.' },
    charge: { type: 'number', default: 0.6, min: 0, max: 1, description: 'Battery level that lights up the four charge indicator bars beside the charging port, from none to all four.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, speed = 0.7, charge = 0.6 } = params as { phase?: number; speed?: number; charge?: number };
    const { PAL } = api;
    const bob = Math.sin(t * 8 * speed + phase) * 0.9;
    const spin = t * 3 * speed + phase;

    api.paint(ctx, api.shapes.ring(0, -11, 210, 11, 24, 0, 0, 11), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    ctx.save();
    ctx.translate(0, bob);

    const wheel = (x: number, r: number) => {
      api.paint(ctx, api.shapes.ring(x, -r, r, r, 24), { wash: '#33393f', sw: 2.2 });
      api.paint(ctx, api.shapes.ring(x, -r, r * 0.55, r * 0.55, 20), { wash: '#d8d2c4', sw: 1.6 });
      api.paint(ctx, api.shapes.ring(x, -r, r * 0.26, r * 0.26, 14), { wash: '#8f9b99', sw: 0 });
      for (let i = 0; i < 3; i++) {
        const a = spin + (i / 3) * Math.PI * 2;
        api.inkLine(ctx, api.shapes.line(x + Math.cos(a) * 6, -r + Math.sin(a) * 6, x + Math.cos(a) * r * 0.48, -r + Math.sin(a) * r * 0.48, 3, 4, i + 4), 2.6,
          'rgba(58,47,42,0.28)');
      }
    };
    wheel(-146, 42);
    wheel(150, 42);

    // 一体化车身：一条长长的水滴形轮廓
    const bodyPts: P2[] = [];
    // 上缘：从前保险杠 → 引擎盖 → 风挡 → 车顶 → 后窗 → 尾部
    const top: P2[] = [
      [206, -46],
      [212, -62],
      [198, -74],
      [140, -80],
      [96, -92],
      [56, -142],
      [-6, -156],
      [-74, -150],
      [-104, -120],
      [-150, -100],
      [-196, -92],
      [-214, -74],
      [-214, -46],
    ];
    for (const p of top) bodyPts.push(p);
    // 下缘回到起点
    bodyPts.push([-206, -34], [204, -34]);
    api.paint(ctx, api.shapes.poly(bodyPts, 5), { wash: '#dfe6e1', sw: 3.2 });
    // 下半暗部
    api.paint(ctx, api.shapes.poly([[-210, -46], [206, -46], [204, -34], [-206, -34]], 3), { wash: '#9faeab', sw: 0, washOp: 0.4 });

    // 玻璃舱（一条连贯的深色玻璃带）
    api.paint(
      ctx,
      api.shapes.poly([[60, -140], [-2, -150], [-68, -145], [-96, -118], [-98, -98], [64, -98]], 4),
      { wash: '#7d99a2', sw: 2.2 }
    );
    api.paint(ctx, api.shapes.poly([[56, -136], [-2, -145], [-46, -138], [-52, -104], [50, -104]], 4), { wash: '#ffffff', sw: 0, washOp: 0.24 });
    // A / B 柱暗线
    api.inkLine(ctx, api.shapes.line(-84, -112, -72, -142, 1, 5, 3), 2.2, 'rgba(58,47,42,0.45)');
    api.inkLine(ctx, api.shapes.line(0, -150, 0, -98, 0, 5, 4), 2, 'rgba(58,47,42,0.35)');

    // 隐藏式门把手 + 车门缝
    api.inkLine(ctx, api.shapes.poly([[26, -96], [24, -44]], 3), 1.6, 'rgba(58,47,42,0.28)');
    api.paint(ctx, api.shapes.round(32, -90, 56, -86, 2), { wash: '#b9c2bf', sw: 1.2 });

    // LED 灯带（前一条细光条 + 后尾灯）
    api.inkLine(ctx, api.shapes.line(120, -76, 204, -66, 1, 6, 5), 3.4, '#fff3d0');
    api.inkLine(ctx, api.shapes.line(-208, -70, -160, -82, 1, 6, 6), 3.2, PAL.rose);
    if (speed > 0.2) {
      api.glow(ctx, 208, -70, 46, '#fff3d0', 0.2 * speed);
      api.glow(ctx, -200, -76, 34, PAL.rose, 0.16 * speed);
    }

    // 充电口 + 电量指示灯
    api.paint(ctx, api.shapes.poly([[148, -92], [166, -92], [166, -80], [148, -80]], 3), { wash: '#9faeab', sw: 1.6 });
    for (let i = 0; i < 4; i++) {
      const on = charge > i * 0.25;
      api.paint(ctx, api.shapes.round(178 + i * 10, -92, 185 + i * 10, -84, 2), {
        wash: on ? PAL.sap : '#c9d2cc',
        sw: 1,
        washOp: on ? 0.85 + 0.15 * Math.sin(t * 2 + i + phase) : 0.5,
      });
    }

    // 轮眉
    api.inkLine(ctx, api.shapes.arc(-146, -42, 50, 50, Math.PI * 1.06, Math.PI * 1.94, 12), 2.4, '#a8b5b1');
    api.inkLine(ctx, api.shapes.arc(150, -42, 50, 50, Math.PI * 1.06, Math.PI * 1.94, 12), 2.4, '#a8b5b1');

    // 后视镜 + 侧裙
    api.paint(ctx, api.shapes.poly([[62, -128], [78, -122], [74, -112], [58, -116]], 3), { wash: '#c3cdc8', sw: 1.6 });
    api.paint(ctx, api.shapes.poly([[-150, -38], [140, -38], [140, -30], [-150, -30]], 3), { wash: '#9faeab', sw: 1.4, washOp: 0.8 });

    ctx.restore();

    // 尾流牵引线
    if (speed > 0.4) {
      for (let i = 0; i < 3; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.7);
        api.inkLine(ctx, api.shapes.line(-212 - i * 6, -40 - i * 16, -222 - k * 10, -40 - i * 16, 2, 5, i + 3), 1.8,
          'rgba(120,150,150,0.28)');
      }
    }
  },
};
