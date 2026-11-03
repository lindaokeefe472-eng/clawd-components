import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_tree_trunk: ComponentDef<ClawdApi> = {
name: 'pr_tree_trunk',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour tree trunk with a slightly tapered, curved body, flared roots at the base, bark streaks, a knot and patches of moss, topped by three short forks where a canopy can attach. It is 240×500 px with the anchor at the bottom centre and stands on the ground, useful as the stable base beneath a separate swaying crown.',
  tags: ['catalog', 'tree', 'trunk', 'plant', 'ground', 'watercolour', 'prop'],
  size: [240, 500],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the timing of the gentle top sway, so copies do not move in sync.' },
    wind: { type: 'number', default: 1, min: 0, max: 3, description: 'Strength of the small side-to-side sway at the top of the trunk; 0 keeps it still.' },
    moss: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of green moss patches on the trunk; values below 0.2 hide them.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, wind = 1, moss = 1 } = params as { phase?: number; wind?: number; moss?: number };
    const { PAL } = api;
    // 只让顶端极轻微摆动，树干主体保持稳定（树冠组件单独摆动）
    const topSway = Math.sin(t * 0.9 + phase) * 2.4 * wind;

    // 地面阴影与根部土
    api.paint(ctx, api.shapes.ring(0, -12, 108, 13, 22, 0, 0, 6), { wash: PAL.night, sw: 0, washOp: 0.12 });
    api.paint(ctx, api.shapes.ring(0, -14, 84, 10, 20, 0, 0.08, 9), { wash: '#b9a67d', sw: 0, washOp: 0.4 });

    // 树干主体（上细下粗，带一点弯曲）
    const L: P2[] = [];
    const R: P2[] = [];
    for (let i = 0; i <= 10; i++) {
      const u = i / 10;
      const cx = Math.sin(u * 1.7 + 0.2) * 8 + topSway * u * u;
      const halfW = api.shapes.lerp(38, 17, u);
      L.push([cx - halfW, -16 - u * 424]);
      R.push([cx + halfW, -16 - u * 424]);
    }
    const trunk = L.concat(R.reverse());
    api.paint(ctx, trunk, { wash: '#a97b4f', sw: 3.4 });
    // 明暗：左侧受光
    api.paint(ctx, L.concat(R.slice(0, 6).reverse()).concat([[-6, -16], [L[0][0], -16]]), { wash: '#c79a6a', sw: 0, washOp: 0.5 });

    // 树皮纹理：竖向长条 + 横向裂纹
    for (let i = 0; i < 7; i++) {
      const u0 = api.shapes.hash(i + 2) * 0.7;
      const x = -22 + api.shapes.hash(i + 7) * 44;
      const pts: P2[] = [];
      for (let s = 0; s <= 6; s++) {
        const u = u0 + (s / 6) * 0.26;
        pts.push([x + Math.sin(u * 14 + i) * 3, -20 - u * 410]);
      }
      api.inkLine(ctx, pts, 1.6, i % 2 ? 'rgba(110,74,42,0.5)' : 'rgba(255,246,230,0.22)');
    }
    for (let i = 0; i < 5; i++) {
      const y = -60 - i * 76;
      api.inkLine(ctx, api.shapes.line(-26 + api.shapes.hash(i) * 8, y, 14 + api.shapes.hash(i + 3) * 10, y - 6, 1, 4, i + 9), 1.2, 'rgba(110,74,42,0.35)');
    }
    // 树结
    api.paint(ctx, api.shapes.ring(-4, -188, 13, 18, 14, 0.2), { wash: '#8a6d4e', sw: 1.8 });
    api.inkLine(ctx, api.shapes.arc(-4, -188, 6, 9, 0, Math.PI * 2, 10), 1.4, 'rgba(90,60,34,0.6)');

    // 根：地面处向外张开
    api.paint(ctx, api.shapes.poly([[-92, -14], [-38, -14], [-30, -58], [-58, -64], [-86, -44]], 4), { wash: '#a97b4f', sw: 2.6 });
    api.paint(ctx, api.shapes.poly([[92, -14], [38, -14], [30, -58], [58, -64], [86, -44]], 4), { wash: '#a97b4f', sw: 2.6 });
    api.inkLine(ctx, api.shapes.poly([[-80, -22], [-46, -28], [-34, -52]], 3), 1.4, 'rgba(110,74,42,0.45)');
    api.inkLine(ctx, api.shapes.poly([[80, -22], [46, -28], [34, -52]], 3), 1.4, 'rgba(110,74,42,0.45)');

    // 顶部三股分杈（树冠接在这里）
    const forkY = -404;
    api.paint(ctx, api.shapes.poly([[-17, forkY], [17, forkY], [15, -462], [-15, -462]], 4), { wash: '#a97b4f', sw: 2.6 });
    // 左右两支用多边形画出锥形收细的感觉
    api.paint(ctx, api.shapes.poly([[-14, -440], [-2, -452], [-42, -500], [-56, -494]], 4), { wash: '#a97b4f', sw: 2.6 });
    api.paint(ctx, api.shapes.poly([[14, -442], [2, -454], [40, -498], [54, -490]], 4), { wash: '#a97b4f', sw: 2.6 });
    api.paint(ctx, api.shapes.poly([[-6, -452], [8, -454], [8, -502], [-6, -500]], 4), { wash: '#8a6d4e', sw: 2.2 });
    // 分杈的亮面
    api.inkLine(ctx, api.shapes.line(-10, -448, -50, -496, 3, 5, 6), 2, 'rgba(255,246,230,0.3)');
    api.inkLine(ctx, api.shapes.line(10, -450, 48, -494, 3, 5, 7), 2, 'rgba(255,246,230,0.3)');

    // 树干上的苔藓与藤
    if (moss > 0.2) {
      for (let i = 0; i < 4; i++) {
        const y = -40 - i * 34;
        api.paint(ctx, api.shapes.ring(-24 + api.shapes.hash(i) * 8, y, 12 + api.shapes.hash(i + 4) * 8, 7, 12, 0, 0.2, i + 2), { wash: '#6d8f55', sw: 0, washOp: 0.55 * moss });
      }
    }
  },
};
