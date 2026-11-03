import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_desk_lamp_arm: ComponentDef<ClawdApi> = {
name: 'pr_desk_lamp_arm',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour clamp-on desk lamp with a two-segment articulated arm, coil spring, joint discs and conical shade, shown with an optional warm glow and light cone. Anchor is bottom centre, 386×340 px; useful for office, study or workbench scenes.',
  tags: ['catalog', 'office', 'desk', 'lamp', 'lighting', 'prop', 'arm'],
  size: [386, 340],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; desynchronises the lamp\'s sway and flicker from other copies.' },
    on: { type: 'number', default: 1, min: 0, max: 1, description: 'Turns the lamp light on or off; values above 0.2 show the glow and light cone, with brightness scaling.' },
    tilt: { type: 'number', default: 0, min: 0, max: 1, description: 'Tilt amount added to the arm and shade, changing the lamp\'s lean and light direction.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, on = 1, tilt = 0 } = params as { phase?: number; on?: number; tilt?: number };
    const { PAL } = api;
    const sway = Math.sin(t * 0.8 + phase) * 0.012 + tilt;
    const flick = 0.9 + 0.1 * Math.sin(t * 3.4 + phase);

    api.paint(ctx, api.shapes.ring(20, -8, 110, 10, 22, 0, 0, 5), { wash: '#8b8172', sw: 0, washOp: 0.22 });

    // 桌面光斑（先画，被灯罩压住一部分）
    if (on > 0.2) {
      api.glow(ctx, -88, -24, 110, '#ffe7b0', 0.16 * on * flick);
      api.paint(ctx, api.shapes.ring(-86, -20, 92, 17, 26, 0, 0.04, 6), { wash: '#ffe7b0', sw: 0, washOp: 0.34 * on * flick });
      api.paint(ctx, api.shapes.ring(-86, -20, 58, 11, 22, 0, 0.06, 7), { wash: '#fff3d0', sw: 0, washOp: 0.3 * on * flick });
    }

    // 夹式底座
    api.paint(ctx, api.shapes.poly([[-6, -10], [116, -10], [116, -48], [-6, -48]], 3), { wash: '#4a5155', sw: 2.8 });
    api.paint(ctx, api.shapes.poly([[-6, -48], [116, -48], [102, -68], [6, -68]], 3), { wash: '#6b7376', sw: 2.4 });
    api.paint(ctx, api.shapes.round(-4, -34, 14, -22, 3), { wash: PAL.ochre, sw: 1.6 });
    api.paint(ctx, api.shapes.ring(94, -30, 8, 8, 12), { wash: '#b9b2a2', sw: 1.6 });

    // 立杆 + 关节
    const base: P2 = [52, -66];
    const j1: P2 = [104, -206];
    const j2: P2 = [-52, -252];

    ctx.save();
    ctx.translate(j1[0], j1[1]);
    ctx.rotate(sway);
    ctx.translate(-j1[0], -j1[1]);

    // 两段折臂（双线表示厚度）
    const arm = (a: P2, b: P2, w = 9) => {
      api.inkLine(ctx, api.shapes.line(a[0], a[1] - 3, b[0], b[1] - 3, 2, 8, 2), w, '#7f8a8e');
      api.inkLine(ctx, api.shapes.line(a[0], a[1] + 4, b[0], b[1] + 4, 2, 8, 3), w * 0.6, '#a8b1af');
    };
    arm(base, j1);
    arm(j1, j2, 8);
    // 拉簧
    const spring: P2[] = [];
    for (let i = 0; i <= 20; i++) {
      const u = i / 20;
      spring.push([api.shapes.lerp(base[0], j1[0], u) + Math.cos(u * 30) * 6, api.shapes.lerp(base[1], j1[1], u) + Math.sin(u * 30) * 6]);
    }
    api.inkLine(ctx, spring, 1.6, 'rgba(90,100,104,0.8)');
    // 关节圆盘
    for (let i = 0; i < 3; i++) {
      const j = i === 0 ? base : i === 1 ? j1 : j2;
      api.paint(ctx, api.shapes.ring(j[0], j[1], i === 0 ? 12 : 11, i === 0 ? 12 : 11, 14), { wash: '#b9b2a2', sw: 2.2 });
      api.paint(ctx, api.shapes.ring(j[0], j[1], 4.4, 4.4, 10), { wash: '#6b7376', sw: 0 });
    }

    // 灯罩：锥形，开口朝左下
    ctx.save();
    ctx.translate(j2[0], j2[1]);
    ctx.rotate(-0.55 + sway);
    api.paint(ctx, api.shapes.poly([[4, -30], [-88, -58], [-116, -12], [8, 16]], 5), { wash: '#7f8a8e', sw: 3 });
    api.paint(ctx, api.shapes.poly([[-88, -58], [-116, -12], [-104, 4], [-80, -36]], 4), { wash: '#5d6669', sw: 2.2 });
    // 灯口内壁
    api.paint(ctx, api.shapes.ring(-110, -22, 22, 30, 18, -0.55), { wash: '#3f464b', sw: 2 });
    if (on > 0.2) {
      api.paint(ctx, api.shapes.ring(-110, -22, 16, 23, 16), { wash: '#ffe7b0', sw: 0, washOp: 0.9 * on });
      api.glow(ctx, -112, -20, 86, '#ffe7b0', 0.2 * on * flick);
      // 光锥
      api.paint(ctx, api.shapes.poly([[-108, -12], [-116, 2], [-62, 92], [-18, 62]], 4), { wash: '#ffe7b0', sw: 0, washOp: 0.14 * on * flick });
    }
    ctx.restore();
    ctx.restore();
  },
};
