import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_mech_keyboard: ComponentDef<ClawdApi> = {
name: 'pr_mech_keyboard',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour mechanical keyboard drawn in near-top view: a dark rounded case with a recessed key bed, four staggered rows of pale keycaps plus a bottom row with a wide spacebar, a rose accent key, three indicator lights, a small knob and a braided cable trailing down from the left. Keys depress and rebound in a single-key typing rhythm, with a soft teal glow at bottom-out; anchor is bottom centre, 400×150 px, sized for a desk or office scene.',
  tags: ['catalog', 'office', 'keyboard', 'mech', 'desk', 'prop', 'decor'],
  size: [400, 150],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the typing clock and knob wobble, so several copies do not press keys in sync.' },
    typing: { type: 'number', default: 1, min: 0, max: 1, description: 'Typing speed/amount: scales the keystroke rate from still (0) up to about five presses per second (1); 0 also stops the indicator flicker.' },
    travel: { type: 'number', default: 1, min: 0, max: 1, description: 'Key travel depth: how far a pressed keycap sinks into its well, from no visible movement (0) to full 4 px throw (1).' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, typing = 1, travel = 1 } = params as { phase?: number; typing?: number; travel?: number };
    const { PAL } = api;

    // ---- 击键时钟：一次一击，下压→触底→回弹 三段 ----
    const cps = 5.2 * typing;
    const clock = t * cps + phase * 1.7;
    const n0 = Math.floor(clock);
    const frac = clock - n0;
    const curve = (u: number): number => {
      if (u <= 0 || u >= 1) return 0;
      if (u < 0.14) return u / 0.14;                 // 快速下压
      if (u < 0.40) return 1;                        // 触底
      if (u < 0.62) return 1 - (u - 0.40) / 0.22;    // 回弹
      return 0;
    };

    // ---- 键位：5 排，排宽递减自动居中形成错位 ----
    const rowY = (i: number) => -120 + i * 20.5;
    const cols = [14, 13, 12, 11];
    const keyW = 21.5;
    const keyH = 12;
    const gapX = 3;
    const bedL = -170;
    const bedR = 170;

    const pick = (n: number): [number, number] => {
      const r = Math.min(3, Math.floor(api.shapes.hash(n * 3.11 + 0.7) * 4));
      const c = Math.min(cols[r] - 1, Math.floor(api.shapes.hash(n * 7.53 + 2.1) * cols[r]));
      return [r, c];
    };
    const cur = pick(n0);
    const prev = pick(n0 - 1);
    if (cur[0] === prev[0] && cur[1] === prev[1]) cur[1] = (cur[1] + 3) % cols[cur[0]];
    const press = curve(frac);
    const spacePress = api.shapes.hash(n0 * 11.7 + 5.3) > 0.8 ? curve(frac) : 0;

    // ---- 落地阴影 / 外壳 ----
    api.paint(ctx, api.shapes.ring(0, -9, 176, 9, 22, 0, 0, 9), { wash: '#8b8172', sw: 0, washOp: 0.18 });
    api.paint(ctx, api.shapes.round(-188, -136, 188, -5, 16, 9), { wash: '#333a3f', sw: 3.6 });
    // 前沿（厚度面）
    api.paint(ctx, api.shapes.round(-184, -22, 184, -6, 12, 8), { wash: '#454c51', sw: 0 });
    api.paint(ctx, api.shapes.poly([[-186, -22], [186, -22], [186, -12], [-186, -12]], 2), { wash: '#2b3136', sw: 0, washOp: 0.5 });
    // 顶条高光
    api.inkLine(ctx, api.shapes.line(-176, -130, 176, -130, 0.5, 8, 3), 1.6, 'rgba(255,246,230,0.2)');
    // 指示灯
    for (let i = 0; i < 3; i++) {
      const on = i === 0 || (spacePress > 0.5 && i === 1) || (press > 0.5 && i === 2);
      api.paint(ctx, api.shapes.ring(-162 + i * 12, -127, 2.6, 2.6, 8), { wash: on ? PAL.sap : '#6b7376', sw: 0, washOp: on ? 1 : 0.75 });
      if (on) api.glow(ctx, -162 + i * 12, -127, 11, PAL.sap, 0.18);
    }
    // 品牌小标
    api.inkLine(ctx, api.shapes.line(-104, -128, -74, -128, 0, 3, 6), 2.2, 'rgba(255,246,230,0.22)');
    api.inkLine(ctx, api.shapes.line(-98, -124, -80, -124, 0, 3, 9), 1.4, 'rgba(255,246,230,0.14)');

    // ---- 键床（凹槽）----
    api.paint(ctx, api.shapes.round(-176, -126, 176, -22, 10, 8), { wash: '#272d31', sw: 2 });
    api.inkLine(ctx, api.shapes.line(-170, -122, 170, -122, 0.4, 8, 4), 1.2, 'rgba(255,246,230,0.1)');

    // ---- 单键绘制：键井 → 侧壁 → 键帽（下沉量 p）----
    const drawKey = (x: number, y: number, w: number, h: number, p: number, accent: string | null, seed: number) => {
      const ty = p * 4.2 * travel;                  // 键程（向下=y 增大）
      // 键井
      api.paint(ctx, api.shapes.round(x - 1, y - 1.2, x + w + 1, y + h + 2.6, 3, 2), { wash: '#171b1e', sw: 0, washOp: 0.85 });
      // 侧壁（常驻，按下时露出更多）
      const wall = p > 0.05 ? '#8d9794' : '#aab4b1';
      api.paint(ctx, api.shapes.poly([[x, y + ty - 1.3], [x + w, y + ty - 1.3], [x + w, y + h + 2.2], [x, y + h + 2.2]], 2), { wash: wall, sw: 0 });
      // 键帽
      // 键帽压在井里的接触阴影（按下时才出现）
      if (p > 0.05) {
        api.paint(ctx, api.shapes.round(x - 1, y + ty - 3.2, x + w + 1, y + ty + 1, 2, 2), { wash: '#0f1316', sw: 0, washOp: 0.45 * p });
      }
      const face = accent ? (p > 0.05 ? '#c58a8a' : accent) : p > 0.55 ? '#b6c0bc' : p > 0.05 ? '#cdd6d1' : '#e9eeea';
      api.paint(ctx, api.shapes.round(x, y + ty, x + w, y + ty + h, 3, 2), { wash: face, sw: accent ? 1.4 : p > 0.05 ? 1.6 : 1.1 });
      // 顶面受光
      api.inkLine(ctx, api.shapes.line(x + 2.6, y + ty + 1.8, x + w * 0.64, y + ty + 1.4, 0, 3, seed + 2), 1.1, 'rgba(255,255,255,0.55)');
      // 键帽图例
      if (legendFor(seed)) {
        api.inkLine(ctx, api.shapes.line(x + w * 0.3, y + ty + h * 0.62, x + w * 0.7, y + ty + h * 0.58, 0, 2, seed), 1.2, 'rgba(58,47,42,0.2)');
      }
      // 触底微光
      if (p > 0.5) api.glow(ctx, x + w / 2, y + h / 2 + ty, 20, PAL.teal, 0.26 * p);
    };
    const legendFor = (s: number) => s % 3 !== 0;

    for (let r = 0; r < 4; r++) {
      const n = cols[r];
      const total = n * keyW + (n - 1) * gapX;
      const x0 = (bedL + bedR) / 2 - total / 2;
      for (let c = 0; c < n; c++) {
        const x = x0 + c * (keyW + gapX);
        const isCur = cur[0] === r && cur[1] === c;
        const accent = r === 0 && c === 0 ? PAL.rose : null;
        drawKey(x, rowY(r), keyW, keyH, isCur ? press : 0, accent, 1 + r * 5 + c);
      }
    }

    // ---- 底排：修饰键 + 空格 ----
    const units = [1.4, 1, 1, 5, 1, 1, 1.4];
    const unit = keyW + gapX;
    let bx = -((units.reduce((a, b) => a + b, 0) * unit) - gapX) / 2;
    const by = rowY(4);
    for (let i = 0; i < units.length; i++) {
      const w = units[i] * unit - gapX;
      const isSpace = i === 3;
      drawKey(bx, by, w, keyH, isSpace ? spacePress : 0, null, isSpace ? 0 : 60 + i);
      bx += w + gapX;
    }

    // ---- 右上角旋钮 ----
    api.paint(ctx, api.shapes.ring(168, -127, 9, 9, 14), { wash: '#b9b2a2', sw: 2 });
    api.paint(ctx, api.shapes.ring(168, -127, 4, 4, 10), { wash: '#6b7376', sw: 0 });
    const knob = Math.sin(t * 0.55 + phase) * 0.5;
    api.inkLine(ctx, api.shapes.line(168, -127, 168 + Math.cos(knob - 1.2) * 7, -127 + Math.sin(knob - 1.2) * 7, 0, 3, 5), 2, 'rgba(58,47,42,0.5)');

    // ---- 编织线（从左侧引出，向下垂）----
    const cable: P2[] = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12;
      cable.push([-190 - u * 6, -70 + u * 62 + Math.sin(u * 4.4 + t * 1.1 + phase) * 4.5]);
    }
    api.inkLine(ctx, cable, 4.4, '#6b7376');
    api.inkLine(ctx, cable.map((p) => [p[0] + 1, p[1] - 0.9] as P2), 1.2, 'rgba(255,246,230,0.3)');
  },
};
