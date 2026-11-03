import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_desk_organizer: ComponentDef<ClawdApi> = {
name: 'pr_desk_organizer',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour desk organizer: a tapered clay-coloured box with three compartments, holding pens and scissors that poke up from the back and a ruler, sticky notes and a small clip in the front slot, all sitting on a soft shadow. Anchored at the bottom centre at 260×220 px, it is a compact prop for a study, office or classroom tabletop scene.',
  tags: ['catalog', 'stationery', 'organizer', 'container', 'desk', 'ground', 'watercolour'],
  size: [260, 220],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the gentle pen and scissor sway, so several copies do not wobble in sync.' },
    hue: { type: 'enum', default: 'clay', options: ['clay', 'rose', 'teal', 'sap', 'ochre', 'orange', 'night', 'paper'], description: 'Palette colour used for the wash of the organizer body.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, hue = 'clay' } = params as { phase?: number; hue?: string };
    const { PAL } = api;
    const wash = (PAL as Record<string, string>)[hue] || PAL.clay;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 108, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 笔（先画，插在格里）
    const pens: Array<[number, number, string]> = [
      [-70, -0.1, PAL.orange],
      [-52, 0.06, PAL.night],
      [-34, -0.16, PAL.ochre],
      [40, 0.1, PAL.rose],
      [58, -0.05, PAL.sap],
    ];
    for (let i = 0; i < pens.length; i++) {
      const [x, rot, col] = pens[i];
      const wig = Math.sin(t * 1.3 + i * 1.7 + phase) * 0.008;
      ctx.save();
      ctx.translate(x, -92);
      ctx.rotate(rot + wig);
      // 笔杆
      api.paint(ctx, api.shapes.poly([[-5, 0], [5, 0], [5, -74], [-5, -74]], 3), { wash: col, sw: 2.2 });
      // 笔帽 / 笔尖
      if (i % 2 === 0) {
        api.paint(ctx, api.shapes.poly([[-5, -74], [5, -74], [5, -86], [-5, -86]], 2), { wash: '#e8dcc4', sw: 1.8 });
        api.paint(ctx, api.shapes.poly([[-2, -86], [2, -86], [0, -94]], 2), { wash: PAL.ink, sw: 1 });
      } else {
        api.inkLine(ctx, api.shapes.line(-4, -78, 4, -78, 0, 3, i + 2), 2, 'rgba(58,47,42,0.4)');
        api.paint(ctx, api.shapes.ring(0, -84, 4, 4, 8), { wash: PAL.clay, sw: 1.4 });
      }
      ctx.restore();
    }
    // 剪刀
    ctx.save();
    ctx.translate(12, -92);
    ctx.rotate(0.16 + Math.sin(t * 1.1 + phase) * 0.008);
    api.inkLine(ctx, [[-1, -58], [4, -6]], 3.4, '#aab5b3');
    api.inkLine(ctx, [[5, -58], [-2, -6]], 3.4, '#aab5b3');
    api.paint(ctx, api.shapes.ring(2, -60, 6, 5, 8, 0, 0.1, 3), { wash: PAL.rose, sw: 1.8 });
    api.paint(ctx, api.shapes.ring(12, -62, 6, 5, 8, 0.2, 0.1, 5), { wash: PAL.rose, sw: 1.8 });
    ctx.restore();

    // 收纳盒主体（三格）
    api.paint(ctx, api.shapes.poly([[-104, -96], [104, -96], [92, -10], [-92, -10]], 4), { wash, sw: 3.6 });
    // 分格
    api.paint(ctx, api.shapes.poly([[-4, -96], [10, -96], [8, -10], [-6, -10]], 3), { wash: PAL.paper, sw: 0, washOp: 0.55 });
    api.paint(ctx, api.shapes.poly([[-104, -60], [104, -60], [100, -48], [-100, -48]], 3), { wash: PAL.paper, sw: 0, washOp: 0.35 });
    api.inkLine(ctx, api.shapes.line(-104, -96, 104, -96, 1, 10, 3), 3, PAL.ink);
    // 木纹
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-88, -80 + i * 14, -12, -80 + i * 14, 0.8, 6, i + 4), 1.1, 'rgba(90,45,25,0.25)');
    }

    // 前一格里的尺子与便签
    api.paint(ctx, api.shapes.poly([[18, -84], [86, -86], [86, -78], [18, -76]], 2), { wash: '#efe4c8', sw: 1.8 });
    for (let i = 0; i < 6; i++) {
      api.inkLine(ctx, api.shapes.line(26 + i * 10, -83, 26 + i * 10, -78, 0, 2, i + 2), 1, 'rgba(58,47,42,0.35)');
    }
    api.paint(ctx, api.shapes.poly([[24, -60], [72, -62], [70, -30], [26, -28]], 3), { wash: PAL.paper, sw: 1.6, washOp: 0.95 });
    api.inkLine(ctx, api.shapes.line(32, -54, 64, -55, 0, 4, 3), 1.2, 'rgba(58,47,42,0.3)');
    api.inkLine(ctx, api.shapes.line(32, -46, 54, -47, 0, 4, 5), 1.2, 'rgba(58,47,42,0.22)');
    // 夹子
    api.paint(ctx, api.shapes.ring(48, -62, 5, 3, 8), { wash: PAL.teal, sw: 1.4 });
  },
};
