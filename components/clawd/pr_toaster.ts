import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_toaster: ComponentDef<ClawdApi> = {
name: 'pr_toaster',
  style: 'clawd',
  kind: 'prop',
  description: 'A rounded retro two-slot toaster with a chrome-grey body, a slanted lid with two dark slots, an orange side lever, an ochre dial, and two slices of toast rising from the slots with steam wisps and crumbs. Anchor is bottom centre at 250×210 px, sized to sit on a counter or table in a kitchen scene.',
  tags: ['catalog', 'toaster', 'appliance', 'kitchen', 'metal', 'decor', 'ground'],
  size: [250, 210],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the pop-up and steam animation cycle, used to desynchronise several toasters in one scene.' },
    pop: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the popping motion: 0 keeps the toast still and the lever fixed, 1 gives the full up-and-down bounce of toast and lever.' },
    toast: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of toast present: below 0.2 the slices are hidden, above 0.4 the steam wisps fade in.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, pop = 1, toast = 1 } = params as { phase?: number; pop?: number; toast?: number };
    const { PAL } = api;
    const up = 0.5 + 0.5 * Math.sin(t * 1.5 + phase);

    // 机身关键线：顶面与投料口
    const bodyTop = -140;

    // 阴影
    api.paint(ctx, api.shapes.ring(0, -8, 98, 9, 22, 0, 0, 7), { wash: PAL.night, sw: 0, washOp: 0.12 });

    // ---------- 图层 1：机身 ----------
    api.paint(ctx, api.shapes.round(-94, bodyTop, 94, -14, 30, 7), { wash: '#dfe4e2', sw: 3.6 });
    // 机身明暗
    api.paint(ctx, api.shapes.round(-88, bodyTop + 8, 78, -66, 26, 6), { wash: '#f4f7f5', sw: 0, washOp: 0.6 });
    api.inkLine(ctx, api.shapes.line(-86, -34, 86, -34, 0.8, 10, 3), 1.6, 'rgba(58,47,42,0.22)');

    // ---------- 图层 2：顶盖（略作透视的台面）+ 两个投料椭圆口 ----------
    const lid = -134;
    const slotY = lid - 9;            // 投料口中心
    api.paint(ctx, api.shapes.poly([[-88, lid], [88, lid], [74, lid - 18], [-74, lid - 18]], 4), { wash: '#e2e8e5', sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[-84, lid - 1], [84, lid - 1], [72, lid - 9], [-72, lid - 9]], 3), { wash: '#f1f5f3', sw: 0, washOp: 0.7 });
    api.inkLine(ctx, api.shapes.line(-80, lid - 4, 80, lid - 4, 0.6, 6, 3), 1.4, 'rgba(58,47,42,0.16)');
    for (let i = 0; i < 2; i++) {
      const cx = -35 + i * 70;
      // 口的内腔（整椭圆，后半在面包后面）
      ctx.beginPath();
      ctx.ellipse(cx, slotY, 23, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#3a4045';
      ctx.fill();
    }

    // ---------- 图层 3：吐司独立图层（从椭圆口里冒出来）----------
    if (toast > 0.2) {
      const upB = 0.5 + 0.5 * Math.sin(t * 1.15 + phase + 2.1);   // 第二片独立节拍
      for (let i = 0; i < 2; i++) {
        const cx = -35 + i * 70;
        const u = i ? upB : up;
        const lift = u * 34 * pop;
        const hTop = slotY - 24 - lift;
        ctx.save();
        ctx.beginPath();
        ctx.rect(cx - 30, slotY - 220, 60, 220);
        ctx.clip();
        ctx.translate(cx, 0);
        ctx.rotate((i ? 1 : -1) * (0.02 + 0.015 * u));
        api.paint(ctx, api.shapes.round(-20, hTop, 20, slotY + 8, 8, 5), { wash: '#d7a962', sw: 2.8 });
        api.paint(ctx, api.shapes.round(-14.5, hTop + 6, 14.5, slotY + 4, 7, 4), { wash: '#f7e6bc', sw: 0, washOp: 0.95 });
        api.paint(ctx, api.shapes.poly([[-17, hTop + 3], [17, hTop + 3], [15.5, hTop + 9], [-15.5, hTop + 9]], 3), { wash: '#c08f4e', sw: 0, washOp: 0.8 });
        for (let k = 0; k < 3; k++) {
          api.paint(ctx, api.shapes.ring(-7 + k * 7, hTop + 20 + (k % 2) * 9, 2.2, 1.9, 6), { wash: '#e3c894', sw: 0, washOp: 0.9 });
        }
        ctx.restore();
      }

      // ---------- 图层 4：投料口前唇（盖住面包根部，强化插入关系）----------
      for (let i = 0; i < 2; i++) {
        const cx = -35 + i * 70;
        ctx.beginPath();
        ctx.ellipse(cx, slotY, 23, 6, 0, 0, Math.PI);
        ctx.fillStyle = '#2b3034';
        ctx.fill();
        ctx.strokeStyle = 'rgba(58,47,42,0.75)';
        ctx.lineWidth = 2;
        ctx.stroke();
        // 唇口高光
        ctx.beginPath();
        ctx.ellipse(cx, slotY + 1.5, 20, 4.2, 0, 0.15, Math.PI - 0.15);
        ctx.strokeStyle = 'rgba(255,246,230,0.22)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    }

    // ---------- 图层 5：机身细节 ----------
    // 品牌铭牌
    api.paint(ctx, api.shapes.round(-24, -104, 24, -88, 5), { wash: '#cbd3d1', sw: 1.8, washOp: 0.9 });
    api.inkLine(ctx, api.shapes.line(-14, -96, 14, -96, 0, 4, 6), 2.2, 'rgba(58,47,42,0.32)');
    // 侧边推杆槽 + 推杆（随 pop 上下滑动）
    api.inkLine(ctx, api.shapes.line(78, -116, 78, -46, 0, 4, 5), 2.4, 'rgba(58,47,42,0.32)');
    const leverY = -92 + (1 - up) * 22 * pop;
    api.paint(ctx, api.shapes.round(70, leverY, 92, leverY + 16, 5), { wash: PAL.orange, sw: 2.4 });
    api.inkLine(ctx, api.shapes.line(74, leverY + 5, 88, leverY + 5, 0, 3, 7), 1.4, 'rgba(255,246,230,0.5)');
    // 旋钮
    api.paint(ctx, api.shapes.ring(-56, -48, 11, 11, 14), { wash: PAL.ochre, sw: 2.2 });
    api.paint(ctx, api.shapes.ring(-56, -48, 4, 4, 10), { wash: '#fff3dd', sw: 0, washOp: 0.8 });
    api.inkLine(ctx, [[-56, -48], [-56, -57]], 2.2, 'rgba(58,47,42,0.8)');
    for (let i = 0; i < 3; i++) {
      const a = -2.2 + i * 1.0;
      api.paint(ctx, api.shapes.ring(-56 + Math.cos(a) * 16, -48 + Math.sin(a) * 16, 1.5, 1.5, 6), { wash: PAL.ink, sw: 0, washOp: 0.45 });
    }
    // 支脚
    api.paint(ctx, api.shapes.round(-70, -14, -50, -4, 3), { wash: PAL.night, sw: 0, washOp: 0.7 });
    api.paint(ctx, api.shapes.round(50, -14, 70, -4, 3), { wash: PAL.night, sw: 0, washOp: 0.7 });

    // ---------- 图层 6：面包屑与热气 ----------
    for (let i = 0; i < 4; i++) {
      const x = -80 + i * 52 + api.shapes.jit(i, 10);
      api.paint(ctx, api.shapes.ring(x, -3 + Math.abs(api.shapes.jit(i + 3, 3)), 2.4, 1.6, 6), { wash: '#c9a878', sw: 0, washOp: 0.7 });
    }
    if (toast > 0.4) {
      for (let i = 0; i < 3; i++) {
        const x = -46 + i * 46;
        const pts: P2[] = [];
        for (let k = 0; k <= 8; k++) {
          const u = k / 8;
          pts.push([x + Math.sin(u * 4 - t * 2 + i) * (3 + u * 6), slotY - 26 - u * 32]);
        }
        api.inkLine(ctx, pts, 1.8, 'rgba(58,47,42,0.14)');
      }
    }
  },
};
