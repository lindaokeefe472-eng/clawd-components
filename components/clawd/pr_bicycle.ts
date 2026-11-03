import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_bicycle: ComponentDef<ClawdApi> = {
name: 'pr_bicycle',
  style: 'clawd',
  kind: 'prop',
  description: 'A side-view watercolour bicycle with two spoked wheels, a diamond frame in teal/rose/ochre, saddle, swept handlebar with bell and headlamp, plus a rear rack and mudguard. It is 430×290 px with the anchor at the bottom centre, sized to sit on a road, lane or path as a parked or ridden street prop.',
  tags: ['catalog', 'vehicle', 'bicycle', 'transport', 'street', 'ground', 'watercolour'],
  size: [430, 290],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the pedal and wheel rotation, used to desynchronise multiple copies.' },
    ride: { type: 'number', default: 0, min: 0, max: 1, description: 'Ride amount: raises wheel and crank spin speed and, above 0.3, adds wind streaks behind the bike.' },
    frame: { type: 'enum', default: 'teal', options: ['teal', 'rose', 'ochre'], description: 'Colour of the bicycle frame wash.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, ride = 0, frame = 'teal' } = params as { phase?: number; ride?: number; frame?: string };
    const { PAL } = api;
    const frameWash = frame === 'rose' ? '#c47f72' : frame === 'ochre' ? '#d3a74f' : '#4e8a86';
    const crank = t * (1.6 + ride * 3) + phase;
    const spin = t * (0.9 + ride * 3.4) + phase;

    api.paint(ctx, api.shapes.ring(0, -5, 186, 9, 22, 0, 0, 3), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 轮组：细胎 + 辐条
    const wheel = (x: number) => {
      const r = 66;
      api.paint(ctx, api.shapes.ring(x, -r, r, r, 30), { wash: '#3f464b', sw: 4.4 });
      api.paint(ctx, api.shapes.ring(x, -r, r - 5, r - 5, 28), { wash: PAL.paper, sw: 0, washOp: 0.9 });
      for (let i = 0; i < 10; i++) {
        const a = spin + (i / 10) * Math.PI * 2;
        api.inkLine(ctx, api.shapes.line(x, -r, x + Math.cos(a) * (r - 6), -r + Math.sin(a) * (r - 6), 0, 2, i + 2), 1, 'rgba(58,47,42,0.3)');
      }
      api.paint(ctx, api.shapes.ring(x, -r, 6, 6, 12), { wash: '#8f9b99', sw: 1.6 });
    };
    wheel(-126);
    wheel(128);

    // 车架：钻石形（后下叉、立管、上管、下管、后上叉）
    const rearHub: P2 = [-126, -66];
    const frontHub: P2 = [128, -66];
    const bb: P2 = [-6, -56];
    const seatTop: P2 = [-52, -196];
    const headTop: P2 = [96, -178];
    const headLow: P2 = [78, -118];
    const stroke = (a: P2, b: P2, w = 6, col = frameWash) => api.inkLine(ctx, api.shapes.line(a[0], a[1], b[0], b[1], 1.5, 6, 2), w, col);
    stroke(rearHub, bb);
    stroke(rearHub, seatTop);
    stroke(bb, seatTop);
    stroke(bb, headLow);
    stroke(seatTop, headTop);
    stroke(headTop, headLow);
    // 前叉
    api.inkLine(ctx, api.shapes.line(headTop[0], headTop[1], frontHub[0], frontHub[1], 3, 7, 4), 5, '#8f9b99');

    // 车座 + 座管
    api.inkLine(ctx, api.shapes.line(seatTop[0], seatTop[1], -58, -206, 1, 4, 5), 5, '#8f9b99');
    api.paint(ctx, api.shapes.poly([[-92, -210], [-30, -212], [-24, -202], [-96, -200]], 4), { wash: '#5a4b3c', sw: 2.2 });
    // 车把 + 车铃
    api.inkLine(ctx, api.shapes.line(headTop[0], headTop[1], 112, -206, 2, 6, 6), 5, '#8f9b99');
    api.paint(ctx, api.shapes.round(104, -216, 152, -206, 4), { wash: '#4a4f52', sw: 1.8 });
    api.paint(ctx, api.shapes.ring(116, -216, 7, 6, 12), { wash: PAL.ochre, sw: 1.4 });
    // 车灯
    api.paint(ctx, api.shapes.ring(112, -182, 10, 9, 14), { wash: '#f4e6b8', sw: 1.8 });
    api.glow(ctx, 118, -182, 30, PAL.ochre, 0.12);

    // 曲柄 + 踏板 + 链条
    api.paint(ctx, api.shapes.ring(bb[0], bb[1], 15, 15, 16), { wash: '#8f9b99', sw: 2 });
    api.inkLine(ctx, api.shapes.line(bb[0] + Math.cos(crank) * 20, bb[1] + Math.sin(crank) * 20, bb[0] - Math.cos(crank) * 20, bb[1] - Math.sin(crank) * 20, 0, 5, 3), 4, '#6b7376');
    api.paint(ctx, api.shapes.round(bb[0] + Math.cos(crank) * 22 - 9, bb[1] + Math.sin(crank) * 22 - 3, bb[0] + Math.cos(crank) * 22 + 9, bb[1] + Math.sin(crank) * 22 + 3, 2), {
      wash: '#4a4f52',
      sw: 1.4,
    });
    const chain: P2[] = [];
    for (let i = 0; i <= 10; i++) {
      const u = i / 10;
      chain.push([api.shapes.lerp(bb[0], rearHub[0], u), api.shapes.lerp(bb[1] - 14, rearHub[1] - 6, u) + Math.sin(u * Math.PI) * 7]);
    }
    api.inkLine(ctx, chain, 2, 'rgba(58,47,42,0.45)');
    api.paint(ctx, api.shapes.ring(rearHub[0], rearHub[1], 8, 8, 12), { wash: '#6b7376', sw: 1.4 });

    // 后货架 + 挡泥板
    api.paint(ctx, api.shapes.poly([[-176, -104], [-64, -104], [-66, -96], [-174, -96]], 3), { wash: '#b9b2a2', sw: 1.6 });
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-168 + i * 32, -104, -168 + i * 32, -128, 0, 3, i + 2), 1.4, 'rgba(58,47,42,0.3)');
    }
    api.paint(ctx, api.shapes.arc(-126, -66, 72, 72, Math.PI * 1.16, Math.PI * 1.84, 10).concat(api.shapes.arc(-126, -66, 66, 66, Math.PI * 1.84, Math.PI * 1.16, 10)), {
      wash: PAL.paper,
      sw: 1.8,
      washOp: 0.85,
    });

    // 骑行动作：风线与前轮小尘
    if (ride > 0.3) {
      for (let i = 0; i < 3; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 4 + i * 1.8);
        api.inkLine(ctx, api.shapes.line(-190 - i * 8, -120 - i * 34, -214 - k * 14, -120 - i * 34, 2, 5, i + 4), 1.6, 'rgba(120,150,150,0.3)');
      }
    }
  },
};
