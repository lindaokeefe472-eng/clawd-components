import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_microwave: ComponentDef<ClawdApi> = {
name: 'pr_microwave',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour microwave with a rounded pale-grey shell, a left-hinged door holding a large dark window, and a side control panel with display, button grid and dial. Its lit cavity shows a turntable, bowl and steam, and it is 420×300 px anchored at bottom centre, suited to kitchen counters and appliance props.',
  tags: ['catalog', 'kitchen', 'appliance', 'microwave', 'prop', 'countertop', 'ground', 'container'],
  size: [420, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the door cycle, blinking display and dial wiggle between copies.' },
    on: { type: 'number', default: 1, min: 0, max: 1, description: 'Switches the interior light and warm glow on (1) or off (0), also softening the cavity illumination.' },
    door: { type: 'number', default: -1, min: -1, max: 1, description: 'Door swing: -1 runs the automatic open/close cycle, values 0 to 1 hold the door at a fixed angle from shut to fully open.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, on = 1, door = -1 } = params as { phase?: number; on?: number; door?: number };
    const { PAL } = api;

    // 开关门节拍：7 秒一轮（关 → 开 → 停 → 关），可用 door 参数（0..1）直接覆盖
    const cyc = t / 7 + phase;
    const cu = cyc - Math.floor(cyc);
    const sm = (v: number) => { const q = v < 0 ? 0 : v > 1 ? 1 : v; return q * q * (3 - 2 * q); };
    let auto = 0;
    if (cu > 0.28 && cu < 0.40) auto = sm((cu - 0.28) / 0.12);
    else if (cu >= 0.40 && cu < 0.70) auto = 1;
    else if (cu >= 0.70 && cu < 0.82) auto = 1 - sm((cu - 0.70) / 0.12);
    const a = door >= 0 ? Math.max(0, Math.min(1, door)) : auto;

    // ---- 几何：门铰在左侧，绕左侧竖轴向外摆 ----
    const hinge = -186;
    const proj = 266 * Math.cos(a * 1.30);            // 门面投影宽度
    const s = 8 * a;                                  // 近端略放大
    const px = (u: number) => hinge + u * proj;
    const dTop = -250;
    const dBot = -34;
    const winU0 = 0.13;
    const winU1 = 0.87;

    // ---- 内腔内容（先整体画一遍，再在窗户里重画一遍）----
    const caveL = -180;
    const caveR = 78;
    const caveT = -250;
    const caveB = -34;
    const content = () => {
      const mid = (caveL + caveR) / 2;
      // 后壁与内壁
      api.paint(ctx, api.shapes.poly([[caveL + 12, caveT + 12], [caveR - 12, caveT + 12], [caveR - 12, caveB - 8], [caveL + 12, caveB - 8]], 3),
        { wash: '#5d686e', sw: 0 });
      api.paint(ctx, api.shapes.poly([[caveL, caveT], [caveL + 12, caveT + 12], [caveL + 12, caveB - 8], [caveL, caveB]], 2), { wash: '#3d464c', sw: 0 });
      api.paint(ctx, api.shapes.poly([[caveR, caveT], [caveR - 12, caveT + 12], [caveR - 12, caveB - 8], [caveR, caveB]], 2), { wash: '#394247', sw: 0 });
      api.paint(ctx, api.shapes.poly([[caveL, caveT], [caveR, caveT], [caveR - 12, caveT + 12], [caveL + 12, caveT + 12]], 2), { wash: '#39434a', sw: 0 });
      // 内腔灯
      if (on > 0.15) {
        api.paint(ctx, api.shapes.ring(mid, caveT + 14, 54, 6, 18), { wash: '#ffe9b8', sw: 0, washOp: 0.85 * on });
        api.glow(ctx, mid, caveT + 20, 104, '#ffdf9e', 0.2 * on);
      }
      // 转盘
      api.paint(ctx, api.shapes.ring(mid, caveB - 44, 74, 12, 22), { wash: '#c9d1ce', sw: 1.6 });
      api.paint(ctx, api.shapes.ring(mid, caveB - 48, 66, 10, 20), { wash: '#e6ebe8', sw: 0, washOp: 0.9 });
      // 碗
      api.paint(ctx, api.shapes.poly([[mid - 40, caveB - 50], [mid + 40, caveB - 50], [mid + 30, caveB - 94], [mid - 30, caveB - 94]], 5),
        { wash: '#eef2ef', sw: 2.4 });
      api.paint(ctx, api.shapes.ring(mid, caveB - 94, 30, 8, 18), { wash: '#dfe6e2', sw: 1.6 });
      api.paint(ctx, api.shapes.ring(mid, caveB - 93, 25, 6, 16), { wash: PAL.ochre, sw: 0, washOp: 0.7 });
      // 蒸汽（转盘旋转带来的轻微摆动）
      for (let i = 0; i < 2; i++) {
        const pts: P2[] = [];
        for (let k = 0; k <= 6; k++) {
          const u = k / 6;
          pts.push([mid + Math.sin(u * 5 + t * 2.1 + i * 2.2) * (5 + u * 14), caveB - 102 - u * 40]);
        }
        api.inkLine(ctx, pts, 1.8, 'rgba(235,235,225,0.34)');
      }
      // 后壁格栅
      for (let i = 0; i < 4; i++) {
        api.inkLine(ctx, api.shapes.line(caveL + 24, caveT + 34 + i * 9, caveR - 24, caveT + 34 + i * 9, 0, 4, i + 3), 1, 'rgba(210,220,215,0.12)');
      }
    };

    // ---- 阴影 / 外壳 ----
    api.paint(ctx, api.shapes.ring(0, -10, 196, 11, 24, 0, 0, 7), { wash: '#8b8172', sw: 0, washOp: 0.2 });
    api.paint(ctx, api.shapes.round(-200, -268, 200, -16, 12), { wash: '#cfd6d4', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-200, -268], [200, -268], [200, -254], [-200, -254]], 3), { wash: '#ffffff', sw: 0, washOp: 0.3 });

    // ---- 门洞：门框 + 内腔 ----
    api.paint(ctx, api.shapes.round(caveL - 8, caveT - 8, caveR + 8, caveB + 8, 9), { wash: '#9aa3a5', sw: 2.2 });
    api.paint(ctx, api.shapes.round(caveL, caveT, caveR, caveB, 6), { wash: '#333a3f', sw: 0 });
    ctx.save();
    ctx.beginPath();
    ctx.rect(caveL, caveT, caveR - caveL, caveB - caveT);
    ctx.clip();
    content();
    ctx.restore();

    // ---- 门（四角随开合插值；中间是真正的窗口，透出内腔）----
    const dA: P2 = [hinge, dTop - s * 0.25];
    const dB: P2 = [px(1), dTop - s];
    const dC: P2 = [px(1), dBot + s];
    const dD: P2 = [hinge, dBot + s * 0.25];
    const wL = px(winU0);
    const wR = px(winU1);
    const wT = dTop + 24 - s * 0.55;
    const wB = dBot - 24 + s * 0.55;
    const wA: P2 = [wL, wT];
    const wBp: P2 = [wR, wT];
    const wC: P2 = [wR, wB];
    const wD: P2 = [wL, wB];
    const dw = '#cbd3d1';
    api.paint(ctx, api.shapes.poly([dA, dB, wBp, wA], 3), { wash: dw, sw: 2.6, washOp: 1 });   // 上框
    api.paint(ctx, api.shapes.poly([wD, wC, dC, dD], 3), { wash: dw, sw: 2.6, washOp: 1 });   // 下框
    api.paint(ctx, api.shapes.poly([dA, wA, wD, dD], 3), { wash: dw, sw: 2.6, washOp: 1 });   // 左框
    api.paint(ctx, api.shapes.poly([wBp, dB, dC, wC], 3), { wash: dw, sw: 2.6, washOp: 1 });  // 右框
    api.paint(ctx, api.shapes.poly([dA, dB, [dB[0], dB[1] + 12], [dA[0], dA[1] + 12]], 3), { wash: '#ffffff', sw: 0, washOp: 0.24 });
    // 玻璃（半透明，内腔从孔里透出来）
    api.paint(ctx, api.shapes.poly([wA, wBp, wC, wD], 2), { wash: '#3c4b4e', sw: 1.8, washOp: 0.2 + 0.16 * a });
    // 玻璃反光
    if (wR - wL > 30) {
      api.paint(ctx, api.shapes.poly([[wL + 8, wB - 6], [wL + 26, wB - 6], [wL + 58, wT + 6], [wL + 40, wT + 6]], 2),
        { wash: '#ffffff', sw: 0, washOp: 0.09 });
    }
    // 门的边厚（近侧立面）
    api.paint(ctx, api.shapes.poly([[px(1), dTop - s], [px(1) + 9 * Math.sin(a * 1.3), dTop - s], [px(1) + 9 * Math.sin(a * 1.3), dBot + s], [px(1), dBot + s]], 3),
      { wash: '#98a2a0', sw: 2.2 });

    // 门把手（跟着门的投影位置走）
    const hx = px(0.945);
    const hw = 4 + 5 * (proj / 266);
    api.paint(ctx, api.shapes.round(hx - hw, -216, hx + hw, -50, 6, 4), { wash: '#9aa3a5', sw: 2 });
    api.paint(ctx, api.shapes.round(hx - hw * 0.55, -204, hx + hw * 0.55, -66, 4, 4), { wash: '#cfd6d4', sw: 1.2 });

    // ---- 控制面板 ----
    api.paint(ctx, api.shapes.round(96, -254, 192, -30, 6), { wash: '#e2e7e5', sw: 2.4 });
    api.paint(ctx, api.shapes.round(106, -244, 182, -214, 4, 3), { wash: '#3f464b', sw: 1.6 });
    for (let i = 0; i < 3; i++) {
      const lit = Math.sin(t * 2.4 + phase + i) > 0.2;
      api.inkLine(ctx, api.shapes.line(114 + i * 24, -229, 130 + i * 24, -229, 0, 3, i + 4), 3, lit ? '#a9d3cf' : 'rgba(160,180,175,0.4)');
    }
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        api.paint(ctx, api.shapes.round(106 + c * 26, -204 + r * 26, 128 + c * 26, -186 + r * 26, 3, 3), { wash: '#cfd6d4', sw: 1.2 });
      }
    }
    api.paint(ctx, api.shapes.round(106, -118, 184, -90, 4, 3), { wash: PAL.ochre, sw: 1.6, washOp: 0.9 });
    api.paint(ctx, api.shapes.ring(160, -56, 14, 14, 14), { wash: '#9aa3a5', sw: 1.8 });
    api.paint(ctx, api.shapes.ring(160, -56, 6, 6, 10), { wash: '#6b7376', sw: 0 });
    const dial = Math.sin(t * 0.7 + phase) * 0.5;
    api.inkLine(ctx, api.shapes.line(160, -56, 160 + Math.cos(dial - 1.2) * 11, -56 + Math.sin(dial - 1.2) * 11, 0, 3, 5), 1.8, 'rgba(58,47,42,0.55)');

    // ---- 开门时溢出的暖光 + 冷气 ----
    if (a > 0.35) {
      api.glow(ctx, px(1) + 30, -140, 90, '#ffdf9e', 0.16 * a);
      api.paint(ctx, api.shapes.poly([[px(1), -230], [px(1) + 46, -226], [px(1) + 46, -50], [px(1), -54]], 3),
        { wash: '#ffe7b6', sw: 0, washOp: 0.1 * a });
    }
  },
};
