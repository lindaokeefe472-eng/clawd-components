import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];
type P3 = [number, number, number];
type Proj = (p: P3) => P2;

export const pr_cleaver_board: ComponentDef<ClawdApi> = {
name: 'pr_cleaver_board',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour chopping board with a carrot lying on it and a cleaver that rises and falls through a looping chopping cycle, leaving a cut slice and scattered crumbs. The anchor is bottom centre and the size is 420×366 px, making it a ready-made kitchen counter prop for cooking scenes.',
  tags: ['catalog', 'kitchen', 'cleaver', 'chopping-board', 'carrot', 'prop', 'ground'],
  size: [420, 366],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the chopping cycle so multiple copies animate out of sync.' },
    rhythm: { type: 'number', default: 1, min: 0, max: 1, description: 'Speed of the chopping cycle; 0 freezes the knife, 1 gives the full chopping tempo.' },
    force: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the impact effects: board shake, blade bounce and crumb scatter.' },
    view: { type: 'enum', default: 'side', options: ['side', 'angle', 'top'], description: 'Camera view: side profile, 45-degree oblique with board depth, or top-down plan view.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, rhythm = 1, force = 1, view = 'side' } = params as { phase?: number; rhythm?: number; force?: number; view?: string };
    const { PAL } = api;
    const V = typeof view === 'number' ? view : view === 'top' ? 2 : view === 'angle' ? 1 : 0;

    // ---- 一个切菜周期 ----
    const cps = 0.6 * rhythm;
    const clock = t * cps + phase * 1.3;
    const u = clock - Math.floor(clock);
    const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const smooth = (v: number) => cl(v) * cl(v) * (3 - 2 * cl(v));
    const easeOut = (v: number) => 1 - Math.pow(1 - cl(v), 3);
    const easeIn = (v: number) => Math.pow(cl(v), 2.7);

    // 板面高度（刀刃停在这里）
    const boardTop = -58;
    const rest = boardTop - 9;      // 静止时刃口咬进食材
    const top = boardTop - 98;
    let edge = rest;
    if (u < 0.24) edge = rest + (top - rest) * easeOut(u / 0.24);
    else if (u < 0.34) edge = top + Math.sin((u - 0.24) / 0.10 * Math.PI) * 2.5;
    else if (u < 0.45) edge = top + (boardTop - top) * easeIn((u - 0.34) / 0.11);
    else if (u < 0.53) edge = boardTop + Math.sin((u - 0.45) / 0.08 * Math.PI) * 2.2 * force;
    else if (u < 0.74) edge = boardTop + (rest - boardTop) * easeOut((u - 0.53) / 0.21);
    else edge = rest;

    const par = cl((edge - boardTop) / (top - boardTop));   // 抬刀=1、落刀=0
    const impact = u > 0.44 && u < 0.58 ? Math.sin((u - 0.44) / 0.14 * Math.PI) : 0;
    const gCut = u < 0.40 ? 0 : u < 0.47 ? smooth((u - 0.40) / 0.07) : u < 0.62 ? 1 : u < 0.95 ? 1 - smooth((u - 0.62) / 0.33) : 0;
    const slideCut = smooth(cl((u - 0.50) / 0.34));

    const cutX = 24;
    const R = 19;
    const cy = boardTop - R;          // 胡萝卜轴线

    // 锐角轮廓：在拐点前后各补一个贴点，抵消 paint 的中点平滑
    const sp = (pts: P2[], k = 1.6): P2[] => {
      const out: P2[] = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        out.push([a[0], a[1]]);
        const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const f = Math.min(0.42, k / d);
        out.push([api.shapes.lerp(a[0], b[0], f), api.shapes.lerp(a[1], b[1], f)]);
      }
      return out;
    };

    // ================= 菜刀（真·三维，三个视角共用一套几何）=================
    // 刀身是一块板：厚 2T 沿 x、高 BH 沿 y（向上为 -y）、刃口长 BL 沿 z（+z 往板子里侧）
    // 刃口在 y=0、刀背在 y=-BH；刀柄从刀跟(z=+BL/2)往上、往里侧倒
    const T = 6;            // 刀身半厚
    const BH = 74;          // 刀身高度
    const BL = 96;          // 刃口长度
    const HB = 52;          // 柄长
    const HR = 10;          // 柄半径
    const TILT = 0.44;      // 柄往后倒的角度（弧度）

    // 投影：侧视=正交侧投影；斜视=方位角 + 俯角；俯视=正上方
    const PR_SIDE: Proj = (p) => [p[0], p[1]];
    const PR_ANGLE: Proj = (p) => [p[0] + 0.55 * p[2], p[1] - 0.30 * p[2]];
    const PR_TOP: Proj = (p) => [p[0], -p[2]];

    // 凸包：刀身这类凸块的轮廓 = 8 个角点投影后的凸包（只画外轮廓，不画内部棱线）
    const hull = (pts: P2[]): P2[] => {
      const p = pts.slice().sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
      const cross = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const lower: P2[] = [];
      for (const q of p) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
        lower.push(q);
      }
      const upper: P2[] = [];
      for (let i = p.length - 1; i >= 0; i--) {
        const q = p[i];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
        upper.push(q);
      }
      lower.pop();
      upper.pop();
      return lower.concat(upper);
    };

    // 立方块 → 一层干净的外轮廓（可带描边）
    const slab = (P: Proj, o: P2, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number,
      wash: string, sw: number, alpha = 0.95) => {
      const at = (p: P3): P2 => { const q = P(p); return [q[0] + o[0], q[1] + o[1]]; };
      const ps: P2[] = [];
      for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) ps.push(at([x, y, z]));
      const h = hull(ps);
      if (h.length >= 3) api.paint(ctx, h, { wash, sw, washOp: alpha });
    };

    // 圆柱（柄、铜箍）：两端圆投影后的凸包 = 一个干净的胶囊轮廓
    const cyl = (P: Proj, o: P2, c0: P3, c1: P3, r: number, wash: string, sw: number, alpha = 0.95) => {
      const ax: P3 = [c1[0] - c0[0], c1[1] - c0[1], c1[2] - c0[2]];
      const L = Math.hypot(ax[0], ax[1], ax[2]) || 1;
      const d: P3 = [ax[0] / L, ax[1] / L, ax[2] / L];
      // 两个垂直于轴的向量
      const t: P3 = Math.abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      const u: P3 = [d[1] * t[2] - d[2] * t[1], d[2] * t[0] - d[0] * t[2], d[0] * t[1] - d[1] * t[0]];
      const ul = Math.hypot(u[0], u[1], u[2]) || 1;
      const uu: P3 = [u[0] / ul, u[1] / ul, u[2] / ul];
      const v: P3 = [d[1] * uu[2] - d[2] * uu[1], d[2] * uu[0] - d[0] * uu[2], d[0] * uu[1] - d[1] * uu[0]];
      const ps: P2[] = [];
      for (const c of [c0, c1]) {
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const q = P([c[0] + (uu[0] * Math.cos(a) + v[0] * Math.sin(a)) * r,
            c[1] + (uu[1] * Math.cos(a) + v[1] * Math.sin(a)) * r,
            c[2] + (uu[2] * Math.cos(a) + v[2] * Math.sin(a)) * r]);
          ps.push([q[0] + o[0], q[1] + o[1]]);
        }
      }
      const h = hull(ps);
      if (h.length >= 3) api.paint(ctx, h, { wash, sw, washOp: alpha });
    };

    const drawKnife = (P: Proj, ox: number, oy: number) => {
      const o: P2 = [ox, oy];
      const at = (p: P3): P2 => { const q = P(p); return [q[0] + ox, q[1] + oy]; };
      const hz = BL / 2 - 10;                       // 柄接在刀跟这一头
      const hb: P3 = [0, -BH + 4, hz];
      const d: P3 = [0, -Math.cos(TILT), Math.sin(TILT)];
      const tip: P3 = [hb[0] + d[0] * HB, hb[1] + d[1] * HB, hb[2] + d[2] * HB];

      // 刀身
      slab(P, o, -T, T, -BH, 0, -BL / 2, BL / 2, '#bcc7c5', 2.6);
      // 刀背加厚
      slab(P, o, -T - 2, T + 2, -BH, -BH + 9, -BL / 2, BL / 2, '#8f9b99', 0, 0.95);
      // 刃口斜面：从全厚收到一条刃
      const bev: P2[] = [];
      for (const s2 of [-1, 1]) for (const z of [-BL / 2, BL / 2]) {
        bev.push(at([s2 * T, -9, z]));
        bev.push(at([s2 * 1.4, 0, z]));
      }
      const bh = hull(bev);
      if (bh.length >= 3) api.paint(ctx, bh, { wash: '#d7e0de', sw: 0, washOp: 0.95 });
      // 刃线
      const e0 = at([-1.4, 0, -BL / 2]);
      const e1 = at([1.4, 0, -BL / 2]);
      const e2 = at([1.4, 0, BL / 2]);
      const e3 = at([-1.4, 0, BL / 2]);
      api.inkLine(ctx, [e0, e1, e2, e3, e0], 1.6, 'rgba(70,84,82,0.55)');
      // 刀面上的磨纹（只在看得到刀面的视角出现）
      if (V !== 2) {
        api.inkLine(ctx, [at([T, -BH + 22, -BL / 2 + 6]), at([T, -BH + 22, BL / 2 - 6])], 1.1, 'rgba(96,110,108,0.2)');
        api.inkLine(ctx, [at([T, -BH + 34, -BL / 2 + 6]), at([T, -BH + 34, BL / 2 - 6])], 1.1, 'rgba(96,110,108,0.16)');
      }

      // 柄 + 铜箍（先柄后箍，箍压住接头）
      cyl(P, o, hb, tip, HR, '#8f5a3c', 2.4);
      cyl(P, o, [tip[0] - d[0] * 12, tip[1] - d[1] * 12, tip[2] - d[2] * 12], tip, HR + 1.5, '#7a4c31', 2.2);
      cyl(P, o, [hb[0] - d[0] * 3, hb[1] - d[1] * 3, hb[2] - d[2] * 3],
        [hb[0] + d[0] * 9, hb[1] + d[1] * 9, hb[2] + d[2] * 9], HR + 3, '#c9a35e', 2.4);
      // 柄身上的高光
      api.inkLine(ctx, [at([T - 5, -BH - 10, hz + 4]), at([T - 5, -BH - 10, hz + 34])], 2, 'rgba(255,255,255,0.22)');
    };

    // ================= 正侧视（板面是一条直线）=================
    const drawSide = () => {
      api.paint(ctx, api.shapes.ring(0, -6, 176, 9, 24, 0, 0, 9), { wash: '#8b8172', sw: 0, washOp: 0.2 });
      const shake = impact * 1.2 * force;
      ctx.save();
      ctx.translate(0, shake);
      // 砧板：很薄的一层，顶面就是一条水平直线
      api.paint(ctx, api.shapes.poly([[-192, boardTop], [192, boardTop], [196, -10], [-196, -10]], 3), { wash: '#c79a6a', sw: 3.2 });
      api.paint(ctx, api.shapes.poly([[-192, boardTop], [192, boardTop], [192, boardTop + 9], [-192, boardTop + 9]], 2), { wash: '#e0bb8c', sw: 0, washOp: 0.85 });
      api.inkLine(ctx, api.shapes.line(-190, boardTop, 190, boardTop, 0, 14, 3), 2.6, PAL.ink);
      for (let i = 0; i < 3; i++) {
        api.inkLine(ctx, api.shapes.line(-180, boardTop + 20 + i * 12, 180, boardTop + 19 + i * 12, 1.4, 10, i + 4), 1.1, 'rgba(140,94,50,0.24)');
      }
      for (let i = 0; i < 5; i++) {
        const x = -120 + i * 60;
        api.inkLine(ctx, api.shapes.line(x, boardTop + 3, x + 16, boardTop + 4, 0, 2, i + 6), 1.2, 'rgba(140,94,50,0.3)');
      }
      ctx.restore();

      // 胡萝卜：横躺在板面上，切口在 cutX（正侧视只看到切口的一条缝）
      const bodyEnd = cutX + 2 - 12 * gCut;
      ctx.save();
      api.shapes.clip(ctx, [[-240, -260], [240, -260], [240, boardTop], [-240, boardTop]]);
      api.paint(ctx, sp([[-184, cy - 1], [-177, cy - 11], [-158, cy - 18], [-138, cy - R],
        [bodyEnd - 12, cy - R], [bodyEnd, cy - R + 3], [bodyEnd, cy + R - 3], [bodyEnd - 12, cy + R],
        [-138, cy + R], [-158, cy + 18], [-177, cy + 11], [-184, cy + 1]], 1.6), { wash: PAL.orange, sw: 2.8 });
      api.paint(ctx, api.shapes.poly([[-160, cy - R + 6], [bodyEnd - 16, cy - R + 5], [bodyEnd - 12, cy - R + 12], [-154, cy - R + 13]], 4),
        { wash: '#ffffff', sw: 0, washOp: 0.24 });
      for (let i = 0; i < 3; i++) {
        api.inkLine(ctx, api.shapes.line(-150, cy - 6 + i * 7, bodyEnd - 14, cy - 7 + i * 7, 1.2, 6, i + 4), 1, 'rgba(142,63,47,0.22)');
      }
      ctx.restore();

      // 切下来的那片（侧看是一段圆柱）
      if (gCut > 0.02) {
        const lx = cutX + 2 + 96 * slideCut;
        ctx.save();
        api.shapes.clip(ctx, [[-240, -260], [188, -260], [188, boardTop], [-240, boardTop]]);
        api.paint(ctx, sp([[lx, cy - R + 2], [lx + 4, cy - R], [lx + 24, cy - R], [lx + 28, cy - R + 2],
          [lx + 28, cy + R - 2], [lx + 24, cy + R], [lx + 4, cy + R], [lx, cy + R - 2]], 1.4),
          { wash: PAL.orange, sw: 2.8 });
        api.paint(ctx, api.shapes.poly([[lx + 5, cy - R + 5], [lx + 24, cy - R + 5], [lx + 24, cy - R + 12], [lx + 5, cy - R + 12]], 3),
          { wash: '#ffffff', sw: 0, washOp: 0.22 });
        ctx.restore();
      }

      // 刀：刀刃垂直于胡萝卜（切口方向），所以正侧视只看到刀背/刃口的厚度
      drawKnife(PR_SIDE, cutX, edge + shake);
      // 切口：胡萝卜上的一条竖缝
      if (gCut > 0.05) {
        api.inkLine(ctx, api.shapes.line(cutX, cy - R + 3, cutX - 1, cy + R - 3, 0.5, 8, 4), 1.6, 'rgba(150,66,44,0.45)');
      }

      // 速度线
      if (u > 0.34 && u < 0.46) {
        for (let i = 0; i < 3; i++) {
          const x = cutX - 16 - i * 11;
          api.inkLine(ctx, api.shapes.line(x, edge - 92 - i * 12, x, edge - 40 - i * 12, 1, 3, 7 + i), 1.3, 'rgba(58,47,42,0.16)');
        }
      }
      // 触板碎屑
      if (impact > 0.05) {
        api.glow(ctx, cutX, boardTop - 6, 30, PAL.ochre, 0.22 * impact);
        for (let i = 0; i < 5; i++) {
          const a = -0.4 - i * 0.42;
          const d = (12 + i * 6) * impact * force;
          api.paint(ctx, api.shapes.ring(cutX + Math.cos(a) * d, boardTop - 6 + Math.sin(a) * d * 0.8, 2.2, 1.8, 6),
            { wash: i % 2 ? PAL.orange : '#f0a15f', sw: 0, washOp: 0.85 });
        }
      }
    };

    // ================= 45° 斜视（板子、食材、刀共用同一套纵深投影）=================
    const drawAngle = () => {
      const D = 64;                                   // 板面纵深
      const KX = 0.55;                                // 纵深 → 屏幕 x
      const KY = 0.30;                                // 纵深 → 屏幕 y（往上）
      const dep = (d: number): P2 => [KX * d, -KY * d];
      const back = dep(D);
      const front: P2 = [-204, boardTop];
      const backL: P2 = [front[0] + back[0], front[1] + back[1]];
      const frontR: P2 = [152, boardTop];
      const backR: P2 = [frontR[0] + back[0], frontR[1] + back[1]];
      const lift = D * 0.45;                          // 食材放在板面纵深中段
      const carY = boardTop - KY * lift - R;

      api.paint(ctx, api.shapes.ring(0, -20, 186, 12, 26, 0, 0, 9), { wash: '#8b8172', sw: 0, washOp: 0.18 });
      // 板正面 + 板面 + 右端面
      api.paint(ctx, sp([[front[0], boardTop], [frontR[0], boardTop], [frontR[0], -12], [front[0], -12]]), { wash: '#c79a6a', sw: 3 });
      api.paint(ctx, sp([front, frontR, backR, backL]), { wash: '#e0bb8c', sw: 2.6 });
      api.paint(ctx, sp([[frontR[0], boardTop], [backR[0], backR[1]], [backR[0], backR[1] + 46], [frontR[0], -12]]),
        { wash: '#b0844f', sw: 2.4 });
      for (let i = 1; i < 4; i++) {
        const f = i / 4;
        api.inkLine(ctx, api.shapes.line(front[0] + back[0] * f, boardTop - KY * D * f, frontR[0] + back[0] * f, boardTop - KY * D * f, 1, 6, i + 2),
          1.1, 'rgba(150,102,58,0.2)');
      }
      // 胡萝卜
      const bodyEnd = cutX + 2 - 12 * gCut;
      ctx.save();
      api.shapes.clip(ctx, [[-240, -300], [240, -300], [240, boardTop - 4], [-240, boardTop - 4]]);
      api.paint(ctx, sp([[-188, carY - 1], [-181, carY - 11], [-162, carY - 18], [-142, carY - R],
        [bodyEnd - 14, carY - R], [bodyEnd - 3, carY - R + 3], [bodyEnd, carY - R + 8], [bodyEnd, carY + R - 8],
        [bodyEnd - 3, carY + R - 3], [bodyEnd - 14, carY + R], [-142, carY + R], [-162, carY + 18], [-181, carY + 11],
        [-188, carY + 1]], 1.6), { wash: PAL.orange, sw: 2.8 });
      api.paint(ctx, api.shapes.poly([[-166, carY - R + 6], [bodyEnd - 16, carY - R + 5], [bodyEnd - 12, carY - R + 12], [-160, carY - R + 13]], 4),
        { wash: '#ffffff', sw: 0, washOp: 0.24 });
      ctx.restore();
      if (gCut > 0.02) {
        const lx = cutX + 2 + 96 * slideCut;
        ctx.save();
        api.shapes.clip(ctx, [[-240, -300], [188, -300], [188, boardTop - 4], [-240, boardTop - 4]]);
        api.paint(ctx, sp([[lx, carY - R + 2], [lx + 4, carY - R], [lx + 24, carY - R], [lx + 28, carY - R + 2],
          [lx + 28, carY + R - 2], [lx + 24, carY + R], [lx + 4, carY + R], [lx, carY + R - 2]], 1.4),
          { wash: PAL.orange, sw: 2.8 });
        ctx.restore();
      }
      // 刀：同一套三维几何，绕着竖直轴转过来，刀面自然被压扁
      const o = dep(lift);
      drawKnife(PR_ANGLE, cutX + o[0], carY + R + o[1]);
      if (impact > 0.05) {
        api.glow(ctx, cutX, carY + R, 30, PAL.ochre, 0.2 * impact);
        for (let i = 0; i < 5; i++) {
          const a = -0.4 - i * 0.42;
          const d = (12 + i * 6) * impact * force;
          api.paint(ctx, api.shapes.ring(cutX + Math.cos(a) * d, carY + R + Math.sin(a) * d * 0.8, 2.2, 1.8, 6),
            { wash: i % 2 ? PAL.orange : '#f0a15f', sw: 0, washOp: 0.85 });
        }
      }
    };

    // ================= 俯视（刀身是一条很薄的直线）=================
    const drawTop = () => {
      const cty = -206;
      const lift = par * 26;
      api.paint(ctx, api.shapes.ring(0, -44, 198, 12, 26, 0, 0, 9), { wash: '#8b8172', sw: 0, washOp: 0.16 });
      api.paint(ctx, api.shapes.round(-206, -312, 206, -46, 16), { wash: '#cf9f6d', sw: 3 });
      api.paint(ctx, api.shapes.round(-196, -302, 196, -56, 12), { wash: '#dfb98c', sw: 2.4 });
      for (let i = 0; i < 7; i++) {
        api.inkLine(ctx, api.shapes.line(-192, -66 - i * 34, 192, -67 - i * 34, 1, 7, i + 2), 1.1, 'rgba(150,102,58,0.18)');
      }
      const bodyEnd = cutX + 2 - 10 * gCut;
      ctx.save();
      api.shapes.clip(ctx, [[-200, -300], [200, -300], [200, -100], [-200, -100]]);
      api.paint(ctx, sp([[-174, cty - 1], [-167, cty - 11], [-148, cty - 18], [-128, cty - R],
        [bodyEnd - 10, cty - R], [bodyEnd, cty - R + 4], [bodyEnd, cty + R - 4], [bodyEnd - 10, cty + R],
        [-128, cty + R], [-148, cty + 18], [-167, cty + 11], [-174, cty + 1]], 1.6), { wash: PAL.orange, sw: 2.8 });
      api.paint(ctx, api.shapes.poly([[-160, cty - R + 5], [bodyEnd - 12, cty - R + 5], [bodyEnd - 12, cty - R + 13], [-154, cty - R + 13]], 4),
        { wash: '#ffffff', sw: 0, washOp: 0.24 });
      ctx.restore();
      if (gCut > 0.02) {
        const sx = cutX + 2 + 96 * slideCut;
        ctx.save();
        api.shapes.clip(ctx, [[-200, -300], [186, -300], [186, -100], [-200, -100]]);
        api.paint(ctx, api.shapes.round(sx, cty - R, sx + 24, cty + R, 6, 4), { wash: PAL.orange, sw: 2.8 });
        ctx.restore();
      }
      // 刀：从上往下看只有刀背那一条薄线（沿纵深方向穿过胡萝卜）
      const oy = -lift;
      api.paint(ctx, api.shapes.round(cutX - 4, cty - BL / 2 + 6, cutX + 16, cty + BL / 2 + 10, 8),
        { wash: '#6d5433', sw: 0, washOp: 0.08 + 0.1 * (1 - par) });
      drawKnife(PR_TOP, cutX, cty + oy);
      if (impact > 0.05) {
        api.glow(ctx, cutX, cty, 36, PAL.ochre, 0.2 * impact);
        for (let i = 0; i < 6; i++) {
          const a = i / 6 * Math.PI * 2;
          const d = (16 + i * 5) * impact * force;
          api.paint(ctx, api.shapes.ring(cutX + Math.cos(a) * d, cty + Math.sin(a) * d, 2.4, 2, 6),
            { wash: i % 2 ? PAL.orange : '#f0a15f', sw: 0, washOp: 0.85 });
        }
      }
    };

    if (V === 1) drawAngle();
    else if (V === 2) drawTop();
    else drawSide();
  },
};
