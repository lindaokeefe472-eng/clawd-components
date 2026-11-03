import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_steak_board: ComponentDef<ClawdApi> = {
name: 'pr_steak_board',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wooden steak board with a handle and hanging hole, topped by a seared steak with a pale fat edge, rosemary sprig, pepper specks, meat juices and a small knife at the right. It is 420×230 px with its anchor at the bottom centre, suitable as a tabletop kitchen or dining prop.',
  tags: ['catalog', 'kitchen', 'food', 'steak', 'board', 'wood', 'tabletop', 'prop'],
  size: [420, 230],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the animated meat-juice wobble to desynchronise copies.' },
    pepper: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of black pepper specks scattered over the steak; 0 hides them and 1 shows the full amount.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, pepper = 1 } = params as { phase?: number; pepper?: number };
    const { PAL } = api;
    const juice = Math.sin(t * 1.1 + phase) * 0.6;

    api.paint(ctx, api.shapes.ring(0, -9, 190, 10, 24, 0, 0, 5), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 砧板（带手柄孔）
    api.paint(ctx, api.shapes.round(-200, -66, 168, -12, 8, 5), { wash: '#c79a6a', sw: 3.2 });
    api.paint(ctx, api.shapes.round(-200, -66, 168, -52, 6, 4), { wash: '#ffffff', sw: 0, washOp: 0.18 });
    // 木纹
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-190, -56 + i * 11, 160, -58 + i * 11, 1, 8, i + 2), 1.2, 'rgba(120,80,44,0.25)');
    }
    // 手柄
    api.paint(ctx, api.shapes.poly([[168, -58], [202, -54], [202, -22], [168, -20]], 4), { wash: '#b98a5c', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(186, -38, 7, 7, 12), { wash: '#e8dcc0', sw: 1.4 });

    // 牛排（带脂肪边，侧面有厚度）
    api.paint(ctx, api.shapes.poly([[-150, -46], [-112, -50], [-44, -54], [18, -50], [52, -44], [46, -22], [-14, -18], [-96, -22]], 4), {
      wash: '#8e3f2f',
      sw: 2.6,
    });
    const steakPts = api.shapes.poly([[-152, -66], [-118, -92], [-50, -98], [24, -94], [64, -72], [58, -44], [-14, -38], [-104, -40]], 5);
    api.paint(ctx, steakPts, { wash: '#b8563f', sw: 2.8 });
    api.paint(ctx, api.shapes.poly([[-152, -66], [-118, -92], [-50, -98], [24, -94], [64, -72], [60, -62], [-100, -58]], 4), {
      wash: '#c96b52',
      sw: 0,
      washOp: 0.7,
    });
    // 脂肪白边
    api.inkLine(ctx, api.shapes.poly([[-152, -66], [-118, -92], [-50, -98], [24, -94], [64, -72]], 5), 5, '#f2e8d2');
    // 大理石纹
    for (let i = 0; i < 4; i++) {
      const x = -120 + i * 44;
      api.inkLine(ctx, api.shapes.line(x, -84 + (i % 2) * 8, x + 22, -54 - (i % 2) * 6, 3, 5, i + 3), 1.6, 'rgba(246,239,223,0.65)');
    }
    // 肉汁
    api.paint(ctx, api.shapes.ring(-40, -22, 58, 6 + juice, 18), { wash: '#8e3f2f', sw: 0, washOp: 0.35 });

    // 迷迭香
    const herb: P2[] = [];
    for (let i = 0; i <= 8; i++) {
      const u = i / 8;
      herb.push([api.shapes.lerp(-14, 46, u), api.shapes.lerp(-30, -58, u) + Math.sin(u * 5) * 3]);
    }
    api.inkLine(ctx, herb, 2.4, '#5f7a4f');
    for (let i = 0; i < 5; i++) {
      const u = (i + 0.5) / 5;
      const x = api.shapes.lerp(-14, 46, u);
      const y = api.shapes.lerp(-30, -58, u);
      api.paint(ctx, api.shapes.ring(x + 6, y - 6, 10, 3.4, 10, -0.6), { wash: PAL.sap, sw: 1 });
      api.paint(ctx, api.shapes.ring(x - 4, y + 2, 9, 3.2, 10, 0.5), { wash: PAL.sap, sw: 1 });
    }

    // 黑胡椒粒 + 盐
    if (pepper > 0.2) {
      for (let i = 0; i < 12; i++) {
        const x = -150 + api.shapes.hash(i + 3) * 240;
        const y = -74 + api.shapes.hash(i + 11) * 44;
        api.paint(ctx, api.shapes.ring(x, y, 2.4 + api.shapes.hash(i) * 1.6, 2.4, 7), { wash: '#3a2f2a', sw: 0, washOp: 0.55 * pepper });
      }
    }
    // 小刀（放在板右侧）
    api.paint(ctx, api.shapes.poly([[116, -22], [118, -40], [156, -36], [158, -18]], 3), { wash: '#dfe4e0', sw: 1.8 });
    api.inkLine(ctx, api.shapes.line(120, -24, 154, -20, 0, 4, 5), 1.6, 'rgba(255,255,255,0.7)');
    api.paint(ctx, api.shapes.round(156, -42, 200, -20, 5, 4), { wash: '#4a5155', sw: 1.8 });
    api.paint(ctx, api.shapes.ring(168, -31, 3.4, 3.4, 8), { wash: '#b9b2a2', sw: 0 });
  },
};
