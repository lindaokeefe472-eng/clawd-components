import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_platform_bench: ComponentDef<ClawdApi> = {
name: 'pr_platform_bench',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour station bench with cast-iron legs, a wooden slat seat and backrest, armrests, a folded newspaper, and an optional seated passenger. Anchored at bottom centre and 420×270 px, it suits platform, waiting-area, or street scenes.',
  tags: ['catalog', 'bench', 'station', 'platform', 'furniture', 'wood', 'iron', 'ground'],
  size: [420, 270],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; desynchronises the gentle sway and newspaper flutter between copies.' },
    occupied: { type: 'number', default: 0, min: 0, max: 1, description: 'Adds a seated passenger silhouette when above 0.5; higher values also increase the small swaying motion.' },
    paper: { type: 'number', default: 1, min: 0, max: 1, description: 'Fades the folded newspaper on the seat; 0 removes it and 1 shows it fully.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, occupied = 0, paper = 1 } = params as { phase?: number; occupied?: number; paper?: number };
    const { PAL } = api;
    const sway = Math.sin(t * 1.1 + phase) * 1.4 * occupied;

    // 站台地面
    api.paint(ctx, api.shapes.poly([[-210, -18], [210, -18], [210, 0], [-210, 0]], 3), { wash: '#c8bfae', sw: 0, washOp: 0.5 });
    api.paint(ctx, api.shapes.ring(0, -12, 168, 9, 22, 0, 0, 4), { wash: '#8b8172', sw: 0, washOp: 0.24 });

    // 铸铁侧腿（八字形，实心）
    for (let i = 0; i < 2; i++) {
      const x = i ? 148 : -148;
      api.paint(
        ctx,
        api.shapes.poly([[x - 14, -58], [x + 14, -58], [x + 26, -8], [x + 36, -4], [x + 20, -4], [x + 8, -30], [x - 8, -30], [x - 20, -4], [x - 36, -4], [x - 26, -8]], 4),
        { wash: '#4a5155', sw: 2.4 }
      );
      api.paint(ctx, api.shapes.ring(x, -34, 4.4, 4.4, 10), { wash: '#7f8a8e', sw: 1 });
      api.paint(ctx, api.shapes.round(x - 38, -6, x + 38, -1, 2), { wash: '#3f464b', sw: 1.2, washOp: 0.9 });
    }

    // 靠背立柱
    for (let i = 0; i < 2; i++) {
      const x = i ? 142 : -142;
      api.paint(ctx, api.shapes.round(x - 9, -262, x + 9, -58, 4), { wash: '#4f585c', sw: 2.2 });
    }
    // 靠背三条横板
    for (let i = 0; i < 3; i++) {
      const y = -256 + i * 40;
      api.paint(ctx, api.shapes.round(-160, y, 160, y + 24, 6), { wash: i === 1 ? '#b98a5c' : '#c79a6a', sw: 2.6 });
      api.inkLine(ctx, api.shapes.line(-146, y + 7, 146, y + 7, 1, 8, i + 3), 1.2, 'rgba(120,80,44,0.28)');
    }
    // 扶手
    for (let i = 0; i < 2; i++) {
      const x = i ? 172 : -172;
      api.paint(ctx, api.shapes.round(x - 28, -148, x + 28, -136, 6), { wash: '#4a5155', sw: 2.2 });
      api.paint(ctx, api.shapes.round(x - 6, -136, x + 6, -58, 4), { wash: '#4a5155', sw: 1.8 });
    }

    // 坐板四条
    for (let i = 0; i < 4; i++) {
      const y = -142 + i * 22;
      api.paint(ctx, api.shapes.round(-176, y, 176, y + 15, 4), { wash: i % 2 ? '#c79a6a' : '#b98a5c', sw: 2.2 });
      api.inkLine(ctx, api.shapes.line(-164, y + 4, 164, y + 4, 1, 8, i + 4), 1, 'rgba(120,80,44,0.24)');
    }
    api.paint(ctx, api.shapes.poly([[-176, -66], [176, -66], [170, -58], [-170, -58]], 3), { wash: '#8a6d4e', sw: 0, washOp: 0.35 });

    // 报纸（折两次，摊在座板上）
    if (paper > 0) {
      const flap = Math.sin(t * 2.2 + phase) * 2.4 * paper;
      api.paint(ctx, api.shapes.poly([[-128, -136], [-20, -142], [-14, -112], [-122, -106]], 3), { wash: '#f4eddd', sw: 1.8, washOp: paper });
      api.paint(ctx, api.shapes.poly([[-122, -106], [-14, -112], [-8, -84 + flap], [-116, -78 + flap]], 3), { wash: '#e9dfc7', sw: 1.6, washOp: paper });
      api.inkLine(ctx, api.shapes.line(-122, -110, -14, -116, 0, 4, 6), 1.6, `rgba(58,47,42,${0.32 * paper})`);
      api.inkLine(ctx, api.shapes.line(-114, -130, -40, -134, 0, 4, 3), 3.4, `rgba(58,47,42,${0.45 * paper})`);
      for (let i = 0; i < 2; i++) {
        api.inkLine(ctx, api.shapes.line(-114, -122 + i * 7, -26, -125 + i * 7, 0, 5, i + 4), 1.3, `rgba(58,47,42,${0.26 * paper})`);
        api.inkLine(ctx, api.shapes.line(-108, -98 + i * 7 + flap * 0.2, -20, -101 + i * 7 + flap * 0.2, 0, 5, i + 7), 1.2, `rgba(58,47,42,${0.2 * paper})`);
      }
    }

    // 乘客（可选：帽子 + 大衣剪影）
    if (occupied > 0.5) {
      ctx.save();
      ctx.translate(88, sway * 0.4);
      api.paint(ctx, api.shapes.round(-30, -240, 30, -150, 14), { wash: '#4f585c', sw: 2.2, washOp: 0.92 });
      api.paint(ctx, api.shapes.ring(0, -258, 20, 20, 20), { wash: '#c9a884', sw: 2 });
      api.paint(ctx, api.shapes.poly([[-28, -268], [28, -268], [20, -284], [-20, -284]], 3), { wash: PAL.ochre, sw: 1.8 });
      api.paint(ctx, api.shapes.poly([[-30, -152], [30, -152], [24, -132], [-24, -132]], 3), { wash: '#3f464b', sw: 1.8 });
      api.paint(ctx, api.shapes.round(-26, -156, -6, -132, 6), { wash: '#4f585c', sw: 1.6 });
      api.paint(ctx, api.shapes.round(6, -156, 26, -132, 6), { wash: '#4f585c', sw: 1.6 });
      api.paint(ctx, api.shapes.ring(40, -190, 8, 10, 10), { wash: '#d8cbb2', sw: 1.4 });
      ctx.restore();
    }

    // 站台黄色安全线
    api.inkLine(ctx, api.shapes.line(-210, -21, 210, -21, 0, 10, 6), 2.6, 'rgba(217,164,65,0.5)');
  },
};
