import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_metronome: ComponentDef<ClawdApi> = {
name: 'pr_metronome',
  style: 'clawd',
  kind: 'prop',
  description: 'A pyramid-shaped wooden metronome with a light front panel, ruled scale marks, and a pendulum rod swinging an ochre weight, with small teal ripple notes pulsing beside it; anchored at the bottom centre, 190×250 px. Useful as a desk or shelf prop in a music room or practice scene, and its swing can be sped up or slowed.',
  tags: ['catalog', 'metronome', 'music', 'instrument', 'wood', 'desk', 'ground', 'decor'],
  size: [190, 250],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the swing and ripple cycle so several copies tick out of sync.' },
    bpm: { type: 'number', default: 1, min: 0, max: 1, description: 'Swing speed multiplier; 0 freezes the pendulum nearly still, 1 gives the full ticking rate.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, bpm = 1 } = params as { phase?: number; bpm?: number };
    const { PAL } = api;
    const swing = Math.sin(t * 2.6 * bpm + phase) * 0.42;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 68, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 木壳（金字塔形）
    api.paint(ctx, api.shapes.poly([[-72, -6], [72, -6], [26, -226], [-26, -226]], 4), { wash: '#b9834f', sw: 3.6 });
    // 前面板
    api.paint(ctx, api.shapes.poly([[-56, -18], [56, -18], [20, -206], [-20, -206]], 4), { wash: '#d2a06b', sw: 2.4 });
    // 刻度
    for (let i = 0; i < 5; i++) {
      api.inkLine(ctx, api.shapes.line(-14 + i * 7, -184 + i * 32, 14 - i * 7, -184 + i * 32, 0, 4, i + 2), 1.4, 'rgba(70,45,25,0.4)');
    }

    // 摆杆（带摆锤）
    ctx.save();
    ctx.translate(0, -22);
    ctx.rotate(swing);
    api.inkLine(ctx, api.shapes.line(0, 0, 0, -196, 0, 6, 3), 3.6, PAL.ink);
    api.paint(ctx, api.shapes.poly([[-9, -128], [9, -128], [7, -104], [-7, -104]], 3), { wash: PAL.ochre, sw: 2.2 });
    ctx.restore();

    // 顶端装饰
    api.paint(ctx, api.shapes.ring(0, -232, 8, 8, 12), { wash: PAL.clay, sw: 2.2 });

    // 底部摆锤
    api.inkLine(ctx, api.shapes.arc(0, -18, 14, 10, 0, Math.PI, 10), 2, 'rgba(58,47,42,0.5)');

    // 打拍子的音符波纹
    for (let i = 0; i < 3; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 2.6 * bpm + i * 2.1 + phase);
      api.paint(ctx, api.shapes.ring(58 + i * 12, -150 - i * 18, 4 + k * 2, 3 + k * 1.5, 8), { wash: PAL.teal, sw: 0, washOp: 0.4 * k });
    }
  },
};
