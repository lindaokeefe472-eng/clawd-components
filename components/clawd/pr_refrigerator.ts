import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_refrigerator: ComponentDef<ClawdApi> = {
name: 'pr_refrigerator',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour refrigerator with a freezer compartment above and a fridge compartment below, both stocked with food and opening on hinges to reveal shelves and door racks. Notes, magnets, a bowl and a jar sit on its exterior; anchored at the bottom centre at 300×425 px, it suits a kitchen or home interior scene.',
  tags: ['catalog', 'home', 'appliance', 'refrigerator', 'kitchen', 'prop', 'ground'],
  size: [300, 425],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians, used to desynchronise copies of the animation.' },
    note: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of notes and magnets shown on the refrigerator doors.' },
    door: { type: 'number', default: -1, min: -1, max: 1, description: 'Door swing: -1 runs the automatic opening and closing cycle, 0 keeps both doors shut, and 1 holds both doors fully open.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, note = 1, door = -1 } = params as { phase?: number; note?: number; door?: number };
    const { PAL } = api;

    // 关门 → 冷藏门开 → 冷冻门也开 → 依次关上（9 秒一轮）
    const cyc = t / 9 + phase;
    const cu = cyc - Math.floor(cyc);
    const sm = (v: number) => { const q = v < 0 ? 0 : v > 1 ? 1 : v; return q * q * (3 - 2 * q); };
    let aF = 0;   // 冷藏门
    let aZ = 0;   // 冷冻门
    if (cu > 0.16 && cu < 0.30) aF = sm((cu - 0.16) / 0.14);
    else if (cu >= 0.30 && cu < 0.62) aF = 1;
    else if (cu >= 0.62 && cu < 0.76) aF = 1 - sm((cu - 0.62) / 0.14);
    if (cu > 0.24 && cu < 0.38) aZ = sm((cu - 0.24) / 0.14);
    else if (cu >= 0.38 && cu < 0.56) aZ = 1;
    else if (cu >= 0.56 && cu < 0.70) aZ = 1 - sm((cu - 0.56) / 0.14);
    if (door >= 0) { aF = aZ = Math.max(0, Math.min(1, door)); }

    const hinge = -130;
    const bodyL = -136;
    const bodyR = 136;
    const W = 268;
    const projOf = (a: number) => W * Math.cos(a * 1.32);

    // ---- 内腔内容 ----
    const cavity = (t0: number, b0: number, kind: number, light: number) => {
      const l = -126;
      const r = 126;
      const mid = 0;
      api.paint(ctx, api.shapes.poly([[l + 12, t0 + 10], [r - 12, t0 + 10], [r - 12, b0 - 6], [l + 12, b0 - 6]], 3), { wash: kind ? '#cfe0e4' : '#c2d6db', sw: 0, washOp: 1 });
      api.paint(ctx, api.shapes.poly([[l, t0], [l + 12, t0 + 10], [l + 12, b0 - 6], [l, b0]], 2), { wash: kind ? '#a6bcc1' : '#9bb2ba', sw: 0, washOp: 1 });
      api.paint(ctx, api.shapes.poly([[r, t0], [r - 12, t0 + 10], [r - 12, b0 - 6], [r, b0]], 2), { wash: '#8ba3ab', sw: 0, washOp: 1 });
      api.paint(ctx, api.shapes.poly([[l, t0], [r, t0], [r - 12, t0 + 10], [l + 12, t0 + 10]], 2), { wash: '#b3c8ce', sw: 0, washOp: 1 });
      if (light > 0.05) {
        api.glow(ctx, 0, t0 + 26, 130, '#bfe4ef', 0.22 * light);
        api.paint(ctx, api.shapes.ring(0, t0 + 18, 96, 8, 20), { wash: '#eaf6fa', sw: 0, washOp: 0.9 * light });
      }
      const shelf = (y: number) => {
        api.paint(ctx, api.shapes.poly([[l + 8, y], [r - 8, y], [r - 8, y + 7], [l + 8, y + 7]], 2), { wash: '#eef6f7', sw: 1.6 });
        api.inkLine(ctx, api.shapes.line(l + 10, y + 1.5, r - 10, y + 1.5, 0, 4, 3), 1.2, 'rgba(255,255,255,0.7)');
      };
      return { shelf, mid, l, r };
    };

    // ---- 阴影 / 机身 ----
    api.paint(ctx, api.shapes.ring(0, -8, 146, 11, 24, 0, 0, 9), { wash: '#8b8172', sw: 0, washOp: 0.2 });
    api.paint(ctx, api.shapes.round(bodyL + 6, -384, bodyR - 6, -8, 18, 6), { wash: '#e6ecea', sw: 3.8 });
    api.paint(ctx, api.shapes.poly([[bodyL, -384], [bodyR, -384], [bodyR, -368], [bodyL, -368]], 3), { wash: '#ffffff', sw: 0, washOp: 0.28 });

    // 两个门洞
    const cavZ = { t: -372, b: -228 };     // 冷冻
    const cavF = { t: -216, b: -32 };      // 冷藏
    for (const c of [cavZ, cavF]) {
      api.paint(ctx, api.shapes.round(-132, c.t - 6, 132, c.b + 6, 8), { wash: '#c5cfcd', sw: 2 });
    }
    // 冷冻内容
    ctx.save();
    ctx.beginPath(); ctx.rect(-126, cavZ.t, 252, cavZ.b - cavZ.t); ctx.clip();
    const z = cavity(cavZ.t, cavZ.b, 1, 1 - aZ);
    // 冰格
    api.paint(ctx, api.shapes.round(-108, cavZ.b - 34, -24, cavZ.b - 8, 4), { wash: '#cfe0e4', sw: 2 });
    for (let i = 0; i < 3; i++) api.inkLine(ctx, api.shapes.line(-104 + i * 18, cavZ.b - 34, -104 + i * 18, cavZ.b - 8, 0, 2, i + 3), 1.2, 'rgba(120,150,158,0.55)');
    api.inkLine(ctx, api.shapes.line(-108, cavZ.b - 21, -24, cavZ.b - 21, 0, 2, 7), 1.2, 'rgba(120,150,158,0.55)');
    // 冻豌豆袋
    api.paint(ctx, api.shapes.poly([[-6, cavZ.b - 8], [56, cavZ.b - 12], [62, cavZ.b - 52], [-2, cavZ.b - 58]], 5), { wash: '#a8cfa2', sw: 2.2, washOp: 0.92 });
    for (let i = 0; i < 4; i++) api.paint(ctx, api.shapes.ring(4 + (i % 2) * 24, cavZ.b - 20 - Math.floor(i / 2) * 16, 6, 5, 8), { wash: '#7bb072', sw: 0, washOp: 0.9 });
    // 冰淇淋盒
    api.paint(ctx, api.shapes.round(80, cavZ.b - 8, 122, cavZ.b - 46, 5), { wash: PAL.rose, sw: 2.2 });
    api.paint(ctx, api.shapes.round(80, cavZ.b - 40, 122, cavZ.b - 46, 3), { wash: '#fff0ea', sw: 0 });
    // 冷冻网架 + 冻饺子袋 / 冰格
    z.shelf(cavZ.b - 56);
    api.paint(ctx, api.shapes.poly([[-118, cavZ.b - 56], [-64, cavZ.b - 56], [-60, cavZ.b - 92], [-114, cavZ.b - 96]], 4), { wash: '#f2e6c8', sw: 2.2, washOp: 0.95 });
    api.inkLine(ctx, api.shapes.line(-110, cavZ.b - 72, -66, cavZ.b - 74, 0, 3, 5), 1.4, 'rgba(150,120,70,0.5)');
    api.paint(ctx, api.shapes.round(30, cavZ.b - 56, 92, cavZ.b - 84, 4), { wash: '#cfe0e4', sw: 2 });
    for (let i = 0; i < 4; i++) api.paint(ctx, api.shapes.ring(42 + i * 15, cavZ.b - 70, 5, 4, 8), { wash: '#b8d2d8', sw: 0 });
    for (let i = 0; i < 3; i++) api.paint(ctx, api.shapes.ring(-84 + i * 46, cavZ.b - 122 - (i % 2) * 12, 4, 3, 8), { wash: '#eaf6fa', sw: 0, washOp: 0.85 });
    ctx.restore();

    // 冷藏内容
    ctx.save();
    ctx.beginPath(); ctx.rect(-126, cavF.t, 252, cavF.b - cavF.t); ctx.clip();
    const f = cavity(cavF.t, cavF.b, 0, 1 - aF);
    // 顶层：牛奶瓶 / 果酱罐 / 罐头 / 果汁
    f.shelf(-200);
    api.paint(ctx, api.shapes.round(-112, -200, -86, -254, 4, 3), { wash: '#f7faf8', sw: 2.2 });
    api.paint(ctx, api.shapes.round(-108, -232, -90, -242, 2), { wash: '#a9c6e2', sw: 0 });
    api.paint(ctx, api.shapes.round(-110, -254, -88, -262, 3), { wash: PAL.sky, sw: 1.6 });
    api.paint(ctx, api.shapes.round(-72, -200, -42, -232, 4, 3), { wash: PAL.orange, sw: 2.2, washOp: 0.9 });
    api.paint(ctx, api.shapes.round(-74, -232, -40, -238, 2), { wash: '#8f5a3c', sw: 1.4 });
    api.paint(ctx, api.shapes.round(-30, -200, -2, -230, 3), { wash: PAL.rose, sw: 2.2 });
    api.paint(ctx, api.shapes.ring(-16, -230, 14, 3.5, 12), { wash: '#cfd6d4', sw: 1.2 });
    api.paint(ctx, api.shapes.round(10, -200, 34, -252, 4, 3), { wash: '#f2f6f3', sw: 2.2 });
    api.paint(ctx, api.shapes.round(12, -226, 32, -240, 2), { wash: PAL.sap, sw: 0, washOp: 0.8 });
    // 中层：蛋盒 / 绿叶 / 黄油
    f.shelf(-152);
    api.paint(ctx, api.shapes.round(-114, -152, -34, -178, 4, 3), { wash: '#c8cfd2', sw: 2 });
    for (let i = 0; i < 4; i++) api.paint(ctx, api.shapes.ring(-100 + i * 20, -172, 8, 5, 10), { wash: '#f7f2e2', sw: 1.2 });
    api.paint(ctx, api.shapes.poly([[-20, -152], [24, -152], [30, -180], [-10, -190], [-26, -172]], 5), { wash: PAL.sap, sw: 2.2, washOp: 0.9 });
    api.paint(ctx, api.shapes.poly([[-26, -152], [-20, -152], [-14, -182], [-24, -176]], 3), { wash: '#6f9e63', sw: 0, washOp: 0.7 });
    api.paint(ctx, api.shapes.round(44, -152, 100, -172, 4), { wash: '#f6ecc8', sw: 2, washOp: 0.95 });
    // 底层：果蔬抽屉
    api.paint(ctx, api.shapes.round(-116, -96, 116, -40, 6), { wash: '#cfe3e6', sw: 2.4, washOp: 0.9 });
    api.paint(ctx, api.shapes.round(-116, -96, 116, -84, 4), { wash: '#b6d2d7', sw: 0, washOp: 0.9 });
    api.paint(ctx, api.shapes.round(-30, -86, 30, -72, 4, 3), { wash: '#e8f2f3', sw: 1.6 });
    // 抽屉里的果蔬（前沿压住）
    api.paint(ctx, api.shapes.ring(-74, -98, 22, 16, 18), { wash: PAL.orange, sw: 2 });
    api.paint(ctx, api.shapes.ring(-30, -100, 20, 17, 18), { wash: '#8fbf6f', sw: 2 });
    api.paint(ctx, api.shapes.ring(18, -98, 24, 15, 18), { wash: PAL.rose, sw: 2 });
    api.paint(ctx, api.shapes.ring(62, -100, 18, 16, 18), { wash: PAL.sap, sw: 2 });
    api.paint(ctx, api.shapes.round(-116, -96, 116, -78, 5), { wash: '#cfe3e6', sw: 2.2, washOp: 0.55 });
    // 冷气
    for (let i = 0; i < 2; i++) {
      const pts: P2[] = [];
      for (let k = 0; k <= 6; k++) {
        const u = k / 6;
        pts.push([-60 + i * 120 + Math.sin(u * 4 + t * 1.6 + i * 2) * 8, cavF.b - 40 - u * 60]);
      }
      api.inkLine(ctx, pts, 1.6, 'rgba(214,236,242,0.35)');
    }
    ctx.restore();

    // ---- 门（含门内侧的瓶架）：四角按开合插值 ----
    const drawDoor = (t0: number, b0: number, a: number, kind: number) => {
      const pr = projOf(a);
      const sp = 9 * a;
      const sq = Math.cos(a * 1.32);
      if (a < 0.001) {
        api.paint(ctx, api.shapes.round(hinge, t0, bodyR - 6, b0, 12), { wash: kind ? '#eef3f0' : '#e9efec', sw: 3, washOp: 1 });
        api.paint(ctx, api.shapes.poly([[hinge, t0], [bodyR - 6, t0], [bodyR - 6, t0 + 12], [hinge, t0 + 12]], 3), { wash: '#ffffff', sw: 0, washOp: 0.35 });
        api.paint(ctx, api.shapes.round(108, t0 + 26, 122, b0 - 26, 6), { wash: '#c8bdb0', sw: 2.4 });
        api.paint(ctx, api.shapes.round(110, t0 + 30, 120, b0 - 30, 4), { wash: '#e4dcd0', sw: 0, washOp: 0.8 });
      } else {
        const q: P2[] = [[hinge, t0 - sp * 0.2], [hinge + pr, t0 - sp], [hinge + pr, b0 + sp], [hinge, b0 + sp * 0.2]];
        // 门背面
        api.paint(ctx, api.shapes.poly(q, 8), { wash: kind ? '#dfeae9' : '#dae6e8', sw: 3, washOp: 1 });
        api.paint(ctx, api.shapes.poly([[hinge, t0 - sp * 0.2], [hinge + pr, t0 - sp], [hinge + pr, t0 - sp + 10], [hinge, t0 - sp * 0.2 + 10]], 3),
          { wash: '#ffffff', sw: 0, washOp: 0.3 });
        // 门内瓶架：随门转开"长"出来
        const sa = Math.max(0, Math.min(1, (a - 0.30) / 0.36));
        if (sa > 0.04) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(q[0][0], q[0][1]);
          for (const pt of q) ctx.lineTo(pt[0], pt[1]);
          ctx.closePath();
          ctx.clip();
          for (let i = 0; i < 2; i++) {
            const y = b0 - 30 - i * 52;
            const th = 3 + 5 * sa;
            api.paint(ctx, api.shapes.poly([[hinge, y], [hinge + pr, y], [hinge + pr, y + th], [hinge, y + th]], 2), { wash: '#eef6f7', sw: 1.6 });
            for (let k = 0; k < 3; k++) {
              const bx = hinge + pr * (0.3 + k * 0.26);
              const bw = (7 + k * 2) * Math.max(0.4, sq);
              const bh = (16 + k * 5) * sa;
              const bc = [PAL.sky, PAL.ochre, PAL.rose][k];
              api.paint(ctx, api.shapes.round(bx - bw, y - bh, bx + bw, y - 2, 3, 2), { wash: bc, sw: 1.4, washOp: 0.92 });
              api.paint(ctx, api.shapes.round(bx - bw * 0.45, y - bh - 7 * sa, bx + bw * 0.45, y - bh, 2), { wash: '#cfd6d4', sw: 1.2, washOp: 0.95 });
            }
          }
          ctx.restore();
        }
        // 门边厚
        api.paint(ctx, api.shapes.poly([[hinge + pr, t0 - sp], [hinge + pr + 10 * Math.sin(a * 1.3), t0 - sp], [hinge + pr + 10 * Math.sin(a * 1.3), b0 + sp], [hinge + pr, b0 + sp]], 3),
          { wash: '#aab7b9', sw: 2.2 });
        // 把手跟着门走
        const hx = hinge + pr * 0.94;
        const hwd = 5 + 4 * sq;
        api.paint(ctx, api.shapes.round(hx - hwd, t0 + 26, hx + hwd, b0 - 26, 5), { wash: '#c8bdb0', sw: 2.2 });
      }
      // 门贴（磁贴 / 便签）：随门面横向压缩
      if (note > 0.1 && sq > 0.16) {
        const mxu = (x: number) => hinge + (x - hinge) * sq;
        const flut = Math.sin(t * 1.6 + phase) * 2;
        if (kind === 0) {
          // 冷藏门：便签 + 购物单 + 两块磁贴
          api.paint(ctx, api.shapes.round(mxu(-56), t0 + 60, mxu(-8), t0 + 110, 3), { wash: '#fdf6dd', sw: 2, washOp: 0.95 * note });
          for (let i = 0; i < 3; i++) {
            api.inkLine(ctx, api.shapes.line(mxu(-50), t0 + 72 + i * 11, mxu(-16 + api.shapes.jit(i, 4)), t0 + 72 + i * 11, 1, 4, i + 2), 1.2, 'rgba(58,47,42,0.35)');
          }
          api.paint(ctx, api.shapes.ring(mxu(-32), t0 + 58, 6 * sq, 6, 10), { wash: PAL.rose, sw: 1.8 });
          api.paint(ctx, [[mxu(-8), t0 + 110], [mxu(-8 + 12 * (1 - sq)), t0 + 96 + flut], [mxu(-20), t0 + 110]], { wash: '#f1e6c4', sw: 1.6, washOp: 0.9 * note });
          api.paint(ctx, api.shapes.ring(mxu(40), t0 + 66, 9 * sq, 9, 12), { wash: PAL.orange, sw: 2 });
          api.paint(ctx, api.shapes.ring(mxu(62), t0 + 112, 7 * sq, 7, 10, -0.3), { wash: PAL.teal, sw: 1.8 });
          // 儿童画
          api.paint(ctx, api.shapes.round(mxu(-92), t0 + 128, mxu(-52), t0 + 168, 3), { wash: '#f7ecd4', sw: 1.8 });
          api.inkLine(ctx, api.shapes.ring(mxu(-72), t0 + 148, 9 * sq, 9, 12), 1.4, PAL.orange);
          api.inkLine(ctx, api.shapes.line(mxu(-88), t0 + 162, mxu(-56), t0 + 162, 0.6, 4, 3), 1.4, 'rgba(79,156,152,0.8)');
        } else {
          // 冷冻门：一张清单 + 一块磁贴
          api.paint(ctx, api.shapes.round(mxu(-70), t0 + 50, mxu(-24), t0 + 96, 3), { wash: '#eef3f0', sw: 2, washOp: 0.95 * note });
          for (let i = 0; i < 2; i++) {
            api.inkLine(ctx, api.shapes.line(mxu(-64), t0 + 62 + i * 12, mxu(-32 + api.shapes.jit(i, 3)), t0 + 62 + i * 12, 1, 4, i + 2), 1.2, 'rgba(58,47,42,0.3)');
          }
          api.paint(ctx, api.shapes.ring(mxu(-47), t0 + 48, 6 * sq, 6, 10), { wash: PAL.ochre, sw: 1.8 });
          api.paint(ctx, api.shapes.ring(mxu(52), t0 + 58, 8 * sq, 8, 12), { wash: PAL.sap, sw: 2 });
        }
      }
    };

    drawDoor(cavZ.t - 8, cavZ.b + 6, aZ, 1);
    drawDoor(cavF.t - 8, cavF.b + 6, aF, 0);

    // ---- 顶部小物：一只碗 + 一只储物罐 ----
    api.paint(ctx, api.shapes.poly([[-78, -384], [-26, -384], [-32, -404], [-72, -404]], 4), { wash: PAL.sky, sw: 2.2 });
    api.paint(ctx, api.shapes.ring(-52, -404, 23, 5.5, 16), { wash: '#cfe3ec', sw: 1.6 });
    api.paint(ctx, api.shapes.round(22, -384, 60, -412, 5, 3), { wash: '#e8dcc0', sw: 2.2 });
    api.paint(ctx, api.shapes.round(24, -412, 58, -420, 3, 2), { wash: '#8a6d4e', sw: 1.8 });
    api.paint(ctx, api.shapes.round(26, -400, 56, -392, 3), { wash: PAL.sap, sw: 0, washOp: 0.55 });
    // ---- 底部格栅 ----
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-40 + i * 26, -18, -26 + i * 26, -18, 2, 3, i + 1), 1.6, 'rgba(58,47,42,0.2)');
    }
  },
};
