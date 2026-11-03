import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_towel_rack: ComponentDef<ClawdApi> = {
name: 'pr_towel_rack',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wall-mounted towel rack with a wooden bar, a large draped towel, a small square towel and a rolled towel, anchored at bottom centre and sized 280×300 px. It suits bathroom, kitchen or laundry wall scenes.',
  tags: ['catalog', 'bathroom', 'towel-rack', 'wall', 'home', 'textile', 'decor'],
  size: [280, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the towel sway and flutter animation; useful for desynchronising multiple racks.' },
    hue: { type: 'string', default: 'sky', description: 'Selects the palette colour of the large hanging towel.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, hue = 'sky' } = params as { phase?: number; hue?: string };
    const { PAL } = api;
    const towel = (PAL as Record<string, string>)[hue] || PAL.sky;

    // 墙面挂条与支架
    api.paint(ctx, api.shapes.poly([[-118, -262], [118, -262], [118, -244], [-118, -244]], 3), { wash: '#ded2ba', sw: 2.8 });
    for (let i = 0; i < 2; i++) {
      api.paint(ctx, api.shapes.ring(-90 + i * 180, -253, 3, 3, 8), { wash: PAL.ink, sw: 0, washOp: 0.45 });
    }
    api.inkLine(ctx, api.shapes.line(-108, -244, -108, -200, 0, 5, 2), 4, '#b9a887');
    api.inkLine(ctx, api.shapes.line(108, -244, 108, -200, 0, 5, 3), 4, '#b9a887');

    // 横杆
    api.inkLine(ctx, api.shapes.line(-112, -202, 112, -202, 0.6, 10, 4), 5.5, '#b08a63');
    api.inkLine(ctx, api.shapes.line(-112, -202, 112, -202, 0.6, 10, 4), 1.8, PAL.ink);
    api.paint(ctx, api.shapes.ring(-112, -202, 5, 5, 10), { wash: PAL.ochre, sw: 1.8 });
    api.paint(ctx, api.shapes.ring(112, -202, 5, 5, 10), { wash: PAL.ochre, sw: 1.8 });

    // 大浴巾：搭在杆上，前片垂下 + 底部波浪
    const panel: P2[] = [[-100, -206], [4, -210], [4, -110]];
    for (let i = 0; i <= 8; i++) {
      const u = i / 8;
      panel.push([api.shapes.lerp(4, -100, u), -110 + Math.sin(u * Math.PI * 2.2 + t * 1.2 + phase) * 5 + Math.sin(u * 3) * 4]);
    }
    api.paint(ctx, panel, { wash: towel, sw: 3.2 });
    // 搭在杆上的折边
    api.paint(ctx, api.shapes.arc(-48, -210, 54, 10, Math.PI, Math.PI * 2, 18), { wash: towel, sw: 2.6, washOp: 0.9 });
    // 条纹与褶
    for (let i = 0; i < 3; i++) {
      const x = -84 + i * 30;
      api.inkLine(ctx, api.shapes.line(x, -196, x + 1, -116, 1.2, 6, i + 2), 2.6, 'rgba(246,239,223,0.7)');
    }
    api.inkLine(ctx, api.shapes.line(-86, -178, 0, -180, 1, 8, 5), 1.2, 'rgba(58,47,42,0.22)');
    api.inkLine(ctx, api.shapes.line(-84, -140, -2, -142, 1, 8, 7), 1.2, 'rgba(58,47,42,0.18)');

    // 小方巾（挂在右侧）
    ctx.save();
    ctx.translate(72, -204 + Math.sin(t * 1.5 + phase) * 1.5);
    ctx.rotate(0.04 + Math.sin(t * 1.2 + phase) * 0.02);
    api.paint(ctx, api.shapes.poly([[-26, 0], [26, 0], [24, 66], [-24, 62]], 3), { wash: PAL.rose, sw: 2.8 });
    for (let i = 0; i < 2; i++) {
      api.inkLine(ctx, api.shapes.line(-18, 18 + i * 18, 18, 18 + i * 18, 1, 5, i + 3), 2, 'rgba(246,239,223,0.65)');
    }
    api.inkLine(ctx, api.shapes.line(-24, 66, 24, 62, 1, 6, 4), 2.4, PAL.ink);
    ctx.restore();

    // 挂钩上的小毛巾卷
    api.paint(ctx, api.shapes.ring(52, -200, 14, 9, 16, 0.3), { wash: PAL.ochre, sw: 2 });
    api.inkLine(ctx, api.shapes.arc(52, -200, 7, 4.5, 0.2, Math.PI * 1.6, 10), 1.2, 'rgba(120,85,40,0.5)');
  },
};
