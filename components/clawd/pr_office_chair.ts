import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_office_chair: ComponentDef<ClawdApi> = {
name: 'pr_office_chair',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour office chair drawn in profile with a five-star base, gas lift, seat, tall backrest with stitching, headrest, lumbar pad and two armrests, anchored at the bottom centre at 270×320 px. It sways gently in place, making it useful as a desk or study prop in interior scenes.',
  tags: ['catalog', 'office', 'chair', 'furniture', 'desk', 'ground', 'decor'],
  size: [270, 320],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offset in radians that shifts the sway timing, so several chairs do not rock in unison.' },
    spin: { type: 'number', default: 1, min: 0, max: 4, description: 'Multiplier for the sway amount; 0 keeps the chair still, higher values increase the rocking.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, spin = 1 } = params as { phase?: number; spin?: number };
    const { PAL } = api;
    const turn = Math.sin(t * 0.6 + phase) * 0.03 * spin;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 100, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(0, -8);
    ctx.rotate(turn * 0.5);

    // 五星脚
    for (let i = 0; i < 5; i++) {
      const a = Math.PI + (i / 4) * Math.PI;
      const x = Math.cos(a) * 88;
      const y = -Math.sin(a) * 22;
      api.inkLine(ctx, api.shapes.line(0, -30, x, Math.max(-6, y - 6), 2, 6, i + 2), 5, '#8f9b99');
      api.paint(ctx, api.shapes.ring(x, Math.max(-8, y - 8), 7, 5, 10), { wash: PAL.ink, sw: 0, washOp: 0.55 });
    }
    api.paint(ctx, api.shapes.ring(0, -30, 10, 6, 12), { wash: '#aab5b3', sw: 2 });

    // 气压杆
    api.inkLine(ctx, api.shapes.line(0, -30, 0, -96, 0, 5, 3), 9, '#b3bebc');
    api.inkLine(ctx, api.shapes.line(0, -30, 0, -96, 0, 5, 3), 2.6, PAL.ink);

    // 座面
    api.paint(ctx, api.shapes.poly([[-78, -114], [78, -114], [66, -84], [-66, -84]], 4), { wash: '#4f5a63', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-70, -110], [70, -110], [60, -90], [-60, -90]], 3), { wash: '#67737c', sw: 0, washOp: 0.6 });

    // 靠背
    api.paint(ctx, api.shapes.round(-62, -252, 62, -126, 24, 6), { wash: '#4f5a63', sw: 3.4 });
    api.paint(ctx, api.shapes.round(-50, -240, 50, -140, 18, 5), { wash: '#5d6871', sw: 0, washOp: 0.65 });
    // 靠背缝线
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-38 + i * 4, -220 + i * 28, 38 - i * 4, -220 + i * 28, 0.6, 6, i + 3), 1.2, 'rgba(246,239,223,0.22)');
    }
    // 头枕
    api.paint(ctx, api.shapes.round(-36, -282, 36, -254, 12, 5), { wash: '#4f5a63', sw: 2.8 });
    // 腰托
    api.paint(ctx, api.shapes.round(-28, -184, 28, -158, 8), { wash: '#6d7880', sw: 0, washOp: 0.7 });

    // 扶手（立柱 + 软垫）
    for (let i = 0; i < 2; i++) {
      const dir = i ? 1 : -1;
      api.inkLine(ctx, api.shapes.line(dir * 72, -122, dir * 72, -148, 0, 4, i + 4), 5, '#8f9b99');
      api.inkLine(ctx, api.shapes.line(dir * 72, -122, dir * 72, -148, 0, 4, i + 4), 1.8, PAL.ink);
      api.paint(ctx, api.shapes.poly([[dir * 92, -156], [dir * 50, -156], [dir * 50, -146], [dir * 92, -146]], 3), { wash: '#3f4a52', sw: 2.2 });
    }
    ctx.restore();
  },
};
