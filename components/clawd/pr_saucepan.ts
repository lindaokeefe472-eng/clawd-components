import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_saucepan: ComponentDef<ClawdApi> = {
name: 'pr_saucepan',
  style: 'clawd',
  kind: 'prop',
  description: 'A small watercolour saucepan with a stubby wooden handle, a pouring lip on the left, a hanging loop at the handle end, and a wooden spoon resting across the rim; wisps of steam rise when it is hot. It measures 380×220 px with its anchor at the bottom centre, and suits a stove top, a kitchen shelf, or hanging on a wall.',
  tags: ['catalog', 'kitchen', 'saucepan', 'cookware', 'container', 'steam', 'hanging', 'prop'],
  size: [380, 220],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the steam animation, used to desynchronise several copies of the pan.' },
    heat: { type: 'number', default: 0.6, min: 0, max: 1, description: 'Heat level: scales the amount of soup visible in the pan and the opacity and presence of the rising steam (steam only appears above 0.3).' },
    tilt: { type: 'number', default: 0, min: 0, max: 1, description: 'Rotates the pan body, handle and spoon slightly clockwise (up to about 5 degrees) as if tipped; the steam stays upright.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, heat = 0.6, tilt = 0 } = params as { phase?: number; heat?: number; tilt?: number };
    const { PAL } = api;

    api.paint(ctx, api.shapes.ring(-20, -8, 118, 10, 22, 0, 0, 3), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    ctx.save();
    ctx.rotate(tilt * 0.08);

    // 长柄（木柄）
    api.paint(ctx, api.shapes.poly([[56, -132], [166, -120], [168, -104], [56, -116]], 4), { wash: '#8a6d4e', sw: 2.6 });
    api.inkLine(ctx, api.shapes.line(62, -126, 160, -114, 0, 6, 4), 1.4, 'rgba(255,246,230,0.3)');
    api.paint(ctx, api.shapes.ring(172, -112, 8, 9, 12), { wash: '#6b7376', sw: 1.6 });
    // 挂环
    api.paint(ctx, api.shapes.ring(182, -96, 8, 8, 12), { wash: '#cfc8b8', sw: 1.4 });

    // 锅体：低矮 + 向右倾的口沿
    api.paint(ctx, api.shapes.poly([[-118, -96], [48, -104], [56, -36], [-104, -26]], 5), { wash: '#b9c2c2', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-118, -96], [48, -104], [50, -112], [-120, -104]], 3), { wash: '#cfd6d4', sw: 2.4 });
    // 倒汁口（左侧尖角）
    api.paint(ctx, api.shapes.poly([[-118, -104], [-140, -112], [-122, -92]], 3), { wash: '#b9c2c2', sw: 2.2 });
    // 高光与暗部
    api.paint(ctx, api.shapes.poly([[-100, -92], [-70, -94], [-64, -34], [-94, -30]], 4), { wash: '#ffffff', sw: 0, washOp: 0.3 });
    api.paint(ctx, api.shapes.poly([[-4, -98], [46, -101], [52, -36], [0, -30]], 4), { wash: PAL.night, sw: 0, washOp: 0.1 });

    // 锅里的一点汤
    api.paint(ctx, api.shapes.ring(-46, -98, 62, 8, 18, -0.05), { wash: PAL.ochre, sw: 0, washOp: 0.4 * heat });
    ctx.restore();

    // 蒸汽
    if (heat > 0.3) {
      for (let i = 0; i < 3; i++) {
        const pts: P2[] = [];
        for (let s = 0; s <= 7; s++) {
          const u = s / 7;
          pts.push([-56 + i * 40 + Math.sin(u * 4.6 + t * 1.9 + i * 1.7 + phase) * (5 + u * 9), -116 - u * 66]);
        }
        api.inkLine(ctx, pts, 2.2, `rgba(200,196,186,${0.3 * heat})`);
      }
    }
    // 木勺搭在锅沿
    api.inkLine(ctx, api.shapes.line(-4, -104, 54, -168, 2, 6, 5), 5, '#c79a6a');
    api.paint(ctx, api.shapes.ring(-8, -100, 14, 8, 14, 0.3), { wash: '#c79a6a', sw: 1.6 });
  },
};
