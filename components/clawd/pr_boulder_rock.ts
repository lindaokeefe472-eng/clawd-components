import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_boulder_rock: ComponentDef<ClawdApi> = {
name: 'pr_boulder_rock',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour boulder with a faceted grey-brown stone body, light and dark rock planes, ink crack lines, a moss cap along the top ridge, and small pebbles and grass at its base. It is 340×260 px with the anchor at the bottom centre, useful as a ground-level terrain prop in landscape scenes.',
  tags: ['catalog', 'terrain', 'boulder', 'rock', 'moss', 'ground', 'prop', 'watercolour'],
  size: [340, 260],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the breathing and moss-sway animation timing, useful for desynchronising multiple copies.' },
    moss: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls how much moss grows along the top ridge, from none at 0 to full moss cover at 1.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, moss = 1 } = params as { phase?: number; moss?: number };
    const { PAL } = api;
    const breathe = Math.sin(t * 0.7 + phase) * 0.4;

    // 地面阴影
    api.paint(ctx, api.shapes.ring(6, -16, 156, 14, 24, 0, 0.05, 5), { wash: PAL.night, sw: 0, washOp: 0.12 });

    // 巨石：多边形 + 两个转折面
    const rockPts: P2[] = [
      [-156, -12],
      [-148, -92],
      [-96, -166],
      [-10, -206 - breathe],
      [74, -188],
      [136, -124],
      [154, -40],
      [148, -12],
    ];
    api.paint(ctx, api.shapes.poly(rockPts, 5), { wash: '#a79c88', sw: 3.6 });
    // 受光面（左上）
    api.paint(ctx, api.shapes.poly([[-148, -92], [-96, -166], [-10, -206], [-24, -150], [-120, -104]], 4), { wash: '#bdb2a0', sw: 0, washOp: 0.9 });
    // 暗面（右下）
    api.paint(ctx, api.shapes.poly([[74, -188], [136, -124], [154, -40], [148, -12], [90, -16], [86, -96], [46, -150]], 4), {
      wash: '#8a8071',
      sw: 0,
      washOp: 0.85,
    });
    // 棱线
    api.inkLine(ctx, api.shapes.poly([[-148, -92], [-24, -150], [-10, -206]], 4), 1.8, 'rgba(90,84,72,0.4)');
    api.inkLine(ctx, api.shapes.poly([[-24, -150], [46, -150], [74, -188]], 4), 1.6, 'rgba(90,84,72,0.35)');
    api.inkLine(ctx, api.shapes.poly([[46, -150], [86, -96], [90, -16]], 3), 1.6, 'rgba(90,84,72,0.3)');
    api.inkLine(ctx, api.shapes.poly([[-120, -104], [-24, -150], [-14, -52], [-108, -44]], 4), 1.2, 'rgba(90,84,72,0.22)');
    // 裂纹
    for (let i = 0; i < 2; i++) {
      const x0 = -70 + i * 98;
      api.inkLine(ctx, api.shapes.poly([[x0, -160], [x0 + 14, -130], [x0 - 4, -104], [x0 + 12, -70]], 3), 1.4, 'rgba(90,84,72,0.35)');
    }
    // 石面颗粒
    for (let i = 0; i < 12; i++) {
      const x = -120 + api.shapes.hash(i + 3) * 240;
      const y = -40 - api.shapes.hash(i + 11) * 130;
      api.paint(ctx, api.shapes.ring(x, y, 2.4 + api.shapes.hash(i) * 2.6, 2, 7), { wash: '#8a8071', sw: 0, washOp: 0.35 });
    }

    // 顶部苔藓：沿石顶轮廓长一层
    if (moss > 0.2) {
      const ridge: P2[] = [[-148, -92], [-96, -166], [-10, -206], [74, -188]];
      const at = (u: number): P2 => {
        const seg = Math.min(2, Math.floor(u * 3));
        const local = u * 3 - seg;
        return [api.shapes.lerp(ridge[seg][0], ridge[seg + 1][0], local), api.shapes.lerp(ridge[seg][1], ridge[seg + 1][1], local)];
      };
      const cap: P2[] = [];
      for (let i = 0; i <= 12; i++) {
        const u = i / 12;
        const p = at(u);
        cap.push([p[0], p[1] - 4 - Math.sin(u * Math.PI) * 6 + Math.sin(u * 9 + phase) * 2 + breathe]);
      }
      for (let i = 12; i >= 0; i--) {
        const u = i / 12;
        const p = at(u);
        cap.push([p[0], p[1] + 16 + Math.sin(u * 7 + i) * 5 + breathe]);
      }
      api.paint(ctx, cap, { wash: '#7fa356', sw: 2.2, washOp: 0.95 * moss });
      for (let i = 0; i < 10; i++) {
        const u = (i + 0.5) / 10;
        const p = at(u);
        const x = p[0];
        const y = p[1] - 12;
        api.paint(ctx, api.shapes.ring(x, y + breathe, 16 + api.shapes.hash(i) * 8, 9, 12, 0, 0.2, i + 3), { wash: i % 2 ? '#8fb463' : '#6d8f55', sw: 0, washOp: 0.9 * moss });
        api.inkLine(ctx, api.shapes.line(x, y + 8 + breathe, x + api.shapes.jit(i, 3), y - 4 + breathe, 0, 2, i + 5), 1.4, 'rgba(74,104,54,0.55)');
      }
    }
    // 底部碎石与草
    for (let i = 0; i < 5; i++) {
      const x = -150 + i * 74 + api.shapes.jit(i, 10);
      api.paint(ctx, api.shapes.ring(x, -14, 8 + api.shapes.hash(i) * 5, 5, 10), { wash: '#bdb2a0', sw: 1.2 });
    }
    for (let i = 0; i < 4; i++) {
      const x = -120 + i * 82;
      api.inkLine(ctx, api.shapes.line(x, -12, x + 5 + Math.sin(t * 1.2 + i) * 2, -36, 1, 3, i + 6), 2, 'rgba(109,143,85,0.7)');
    }
  },
};
