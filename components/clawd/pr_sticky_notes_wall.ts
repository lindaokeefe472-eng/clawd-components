import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_sticky_notes_wall: ComponentDef<ClawdApi> = {
name: 'pr_sticky_notes_wall',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour corkboard panel framed in wood, holding up to three pastel sticky notes with folded corners and scribbled lines, plus a small checklist paper pinned below. Anchored at the bottom centre and sized 360×320 px, it suits an office or study wall as background decor behind a desk scene.',
  tags: ['catalog', 'office', 'corkboard', 'sticky-notes', 'wall', 'decor', 'paper'],
  size: [360, 320],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the notes\' sway animation, used to desynchronise copies of the prop.' },
    count: { type: 'number', default: 3, min: 0, max: 12, description: 'Number of sticky notes drawn; the layout only defines three notes, so values are clamped to 1–3 (0 also shows one).' },
    curl: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of paper sway/curl motion; 0 keeps the notes still, 1 gives the full gentle flutter.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, count = 3, curl = 1 } = params as { phase?: number; count?: number; curl?: number };
    const { PAL } = api;

    // 墙面 / 软木板
    api.paint(ctx, api.shapes.poly([[-178, -318], [178, -318], [178, -6], [-178, -6]], 4), { wash: '#c79a6a', sw: 3 });
    api.paint(ctx, api.shapes.poly([[-166, -306], [166, -306], [166, -18], [-166, -18]], 4), { wash: '#d3a74f', sw: 0, washOp: 0.45 });
    // 木框
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-178 + i * 2, -318 + i * 22, 178 - i * 2, -318 + i * 22, 0, 6, i + 2), 1.4, 'rgba(255,246,230,0.22)');
    }
    // 图钉痕迹
    for (let i = 0; i < 6; i++) {
      const x = -120 + api.shapes.hash(i + 2) * 240;
      const y = -60 - api.shapes.hash(i + 7) * 200;
      api.paint(ctx, api.shapes.ring(x, y, 3.4, 3.4, 8), { wash: '#a8802f', sw: 0, washOp: 0.35 });
    }

    // 三张便利贴（不同颜色/角度）
    const notes = [
      { x: -84, y: -196, w: 96, h: 92, rot: -0.07, wash: '#f4e08a', lines: 3 },
      { x: 26, y: -250, w: 88, h: 84, rot: 0.05, wash: PAL.rose, lines: 2 },
      { x: 44, y: -140, w: 100, h: 96, rot: -0.03, wash: '#a9d3cf', lines: 4 },
    ];
    ctx.save();
    for (let i = 0; i < Math.min(3, Math.max(1, Math.round(count))); i++) {
      const n = notes[i];
      const sway = Math.sin(t * 1.3 + i * 1.7 + phase) * 0.012 * curl;
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(n.rot + sway);
      // 纸张阴影
      api.paint(ctx, api.shapes.poly([[2, 4], [n.w + 2, 4], [n.w + 2, n.h + 4], [2, n.h + 4]], 3), { wash: PAL.night, sw: 0, washOp: 0.1 });
      api.paint(ctx, api.shapes.poly([[0, 0], [n.w, 0], [n.w, n.h], [0, n.h]], 3), { wash: n.wash, sw: 2 });
      // 折角
      api.paint(ctx, api.shapes.poly([[n.w - 18, 0], [n.w, 0], [n.w, 18]], 3), { wash: '#ffffff', sw: 1.4, washOp: 0.55 });
      // 字迹
      for (let k = 0; k < n.lines; k++) {
        api.inkLine(ctx, api.shapes.line(12, 22 + k * 18, n.w - 14 - api.shapes.hash(k + i) * 20, 24 + k * 18, 0, 5, k + i + 3), 2.2,
          'rgba(58,47,42,0.45)');
      }
      ctx.restore();
    }
    ctx.restore();

    // 图钉（钉在中间那张上）
    for (let i = 0; i < 2; i++) {
      const px = 12 + i * 130;
      api.paint(ctx, api.shapes.ring(px, -268 + i * 4, 7, 7, 12), { wash: i ? PAL.teal : PAL.rose, sw: 1.6 });
      api.paint(ctx, api.shapes.ring(px - 2, -270 + i * 4, 2.4, 2.4, 8), { wash: '#ffffff', sw: 0, washOp: 0.7 });
    }

    // 便签下方挂着的小清单纸
    ctx.save();
    ctx.translate(-8, -52);
    ctx.rotate(0.04);
    api.paint(ctx, api.shapes.poly([[-96, 0], [96, 0], [96, 30], [-96, 30]], 3), { wash: '#f6efdf', sw: 1.8 });
    for (let i = 0; i < 3; i++) {
      api.paint(ctx, api.shapes.poly([[-84 + i * 60, 8], [-78 + i * 60, 8], [-78 + i * 60, 14], [-84 + i * 60, 14]], 3), { wash: PAL.sap, sw: 1 });
      api.inkLine(ctx, api.shapes.line(-70 + i * 60, 11, -24 + i * 60, 11, 0, 3, i + 5), 2.2, 'rgba(58,47,42,0.35)');
    }
    ctx.restore();
  },
};
