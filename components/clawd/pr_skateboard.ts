import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_skateboard: ComponentDef<ClawdApi> = {
name: 'pr_skateboard',
  style: 'clawd',
  kind: 'prop',
  description: 'A side-view watercolour skateboard with a warm wooden deck, dark grip-tape top, two grey trucks and four yellow wheels that spin as the board leans and rocks in place. It sits 420×150 px with the anchor at the bottom centre and includes faint speed lines, making it useful as a ground prop for street scenes or a character\'s ride.',
  tags: ['catalog', 'skateboard', 'vehicle', 'prop', 'ground', 'watercolour', 'wheels'],
  size: [420, 150],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the wheel-spin and lean animation cycle in radians, so duplicate boards do not move in sync.' },
    roll: { type: 'number', default: 1, min: 0, max: 1, description: 'Speed of wheel rotation; above 0.2 it also fades in trailing speed lines behind the deck.' },
    tilt: { type: 'number', default: 0, min: 0, max: 1, description: 'Adds a constant lean to the board on top of the gentle rocking motion.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, roll = 1, tilt = 0 } = params as { phase?: number; roll?: number; tilt?: number };
    const spin = t * 4 * roll + phase;
    const lean = Math.sin(t * 2 + phase) * 0.02 + tilt;

    api.paint(ctx, api.shapes.ring(0, -4, 152, 7, 22, 0, 0, 8), { wash: '#8b8172', sw: 0, washOp: 0.22 });

    ctx.save();
    ctx.translate(0, -52);
    ctx.rotate(lean);

    // 板面：两端上翘，中间平
    const topEdge: P2[] = [[-190, -30], [-168, -14], [-140, -8], [-92, -4], [92, -4], [140, -8], [168, -14], [190, -30]];
    const deck = topEdge.concat([[-190, -18], [-168, -2], [-140, 4], [-92, 7], [92, 7], [140, 4], [168, -2], [190, -18]]);
    api.paint(ctx, api.shapes.poly(deck, 4), { wash: '#c79a6a', sw: 2.8 });
    // 砂纸面
    const gripPts: P2[] = [];
    for (const p of topEdge) gripPts.push([p[0] * 0.97, p[1] + 2]);
    for (let i = topEdge.length - 1; i >= 0; i--) gripPts.push([topEdge[i][0] * 0.97, topEdge[i][1] + 11]);
    api.paint(ctx, api.shapes.poly(gripPts, 3), { wash: '#3f464b', sw: 1.4 });
    // 木层与砂纸颗粒
    api.inkLine(ctx, api.shapes.line(-160, 1, 160, 1, 0, 8, 3), 1.2, 'rgba(120,80,44,0.4)');
    for (let i = 0; i < 9; i++) {
      const x = -140 + i * 35;
      api.paint(ctx, api.shapes.ring(x, -4, 1.8, 1.4, 6), { wash: '#5b6165', sw: 0, washOp: 0.45 });
    }

    // 桥 + 四轮
    for (let side = 0; side < 2; side++) {
      const bx = side ? 116 : -116;
      api.paint(ctx, api.shapes.poly([[bx - 20, 6], [bx + 20, 6], [bx + 12, 26], [bx - 12, 26]], 3), { wash: '#b9b2a2', sw: 2 });
      api.inkLine(ctx, api.shapes.line(bx - 12, 24, bx + 12, 24, 0, 4, side + 3), 2.4, '#6b7376');
      for (let k = 0; k < 2; k++) {
        const wx = bx + (k ? 34 : -34);
        api.paint(ctx, api.shapes.ring(wx, 34, 14, 14, 16), { wash: '#e0b45a', sw: 2.2 });
        api.paint(ctx, api.shapes.ring(wx, 34, 6, 6, 12), { wash: '#8f9b99', sw: 1.2 });
        const a = spin + k * Math.PI;
        api.inkLine(ctx, api.shapes.line(wx + Math.cos(a) * 2, 34 + Math.sin(a) * 2, wx + Math.cos(a) * 10, 34 + Math.sin(a) * 10, 0, 2, k + 4), 1.6,
          'rgba(58,47,42,0.35)');
      }
    }
    ctx.restore();

    // 速度线
    if (roll > 0.2) {
      for (let i = 0; i < 3; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 5 + i * 2);
        api.inkLine(ctx, api.shapes.line(-152 - i * 10, -64 - i * 14, -178 - k * 16 - i * 10, -64 - i * 14, 2, 5, i + 5), 1.8, 'rgba(120,150,150,0.32)');
      }
    }
  },
};
