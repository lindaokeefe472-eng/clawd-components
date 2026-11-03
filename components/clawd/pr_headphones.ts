import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_headphones: ComponentDef<ClawdApi> = {
name: 'pr_headphones',
  style: 'clawd',
  kind: 'prop',
  description: 'Watercolour over-ear headphones with a padded headband, two ear cups, a wavy cable, and a small music player resting beside them. Anchor is bottom centre at 288×240 px, suited to desk, room, or listening-themed scenes.',
  tags: ['catalog', 'headphones', 'audio', 'prop', 'desk', 'decor'],
  size: [288, 240],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the sound-wave pulse and cable sway between copies.' },
    beat: { type: 'number', default: 1, min: 0, max: 4, description: 'Controls the strength of the animated sound-wave pulses; 0 disables them.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, beat = 1 } = params as { phase?: number; beat?: number };
    const { PAL } = api;
    const pulse = 0.5 + 0.5 * Math.sin(t * 3.2 + phase);

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 82, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 头梁
    api.inkLine(ctx, api.shapes.arc(0, -106, 94, 92, Math.PI * 1.04, Math.PI * 1.96, 26), 13, '#4f5a63');
    api.inkLine(ctx, api.shapes.arc(0, -106, 94, 92, Math.PI * 1.04, Math.PI * 1.96, 26), 3, PAL.ink);
    // 头梁软垫
    api.inkLine(ctx, api.shapes.arc(0, -100, 74, 76, Math.PI * 1.14, Math.PI * 1.86, 20), 9, PAL.clay);
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.arc(0, -100, 74, 76, Math.PI * 1.2 + i * 0.18, Math.PI * 1.24 + i * 0.18, 4), 2, 'rgba(90,50,30,0.35)');
    }

    // 左右耳罩
    for (let i = 0; i < 2; i++) {
      const dir = i ? 1 : -1;
      const cx = dir * 88;
      ctx.save();
      ctx.translate(cx, -80);
      ctx.rotate(dir * 0.1);
      api.paint(ctx, api.shapes.ring(0, 0, 30, 42, 26, 0, 0.02, i + 4), { wash: '#4f5a63', sw: 3.2 });
      api.paint(ctx, api.shapes.ring(0, 0, 22, 33, 22, 0, 0.02, i + 8), { wash: '#5f6a73', sw: 0 });
      // 蛋白皮内圈
      api.paint(ctx, api.shapes.ring(0, 0, 14, 24, 18, 0, 0.02, i + 2), { wash: PAL.clay, sw: 0, washOp: 0.65 });
      ctx.restore();
      // 音波
      if (beat > 0) {
        for (let k = 0; k < 2; k++) {
          api.inkLine(ctx, api.shapes.arc(cx + dir * 34, -80, 10 + k * 8, 16 + k * 10, -0.9 + (dir > 0 ? 0 : Math.PI), 0.9 + (dir > 0 ? 0 : Math.PI), 8), 2, `rgba(79,156,152,${0.35 * pulse * beat})`);
        }
      }
    }

    // 线缆
    const cable: P2[] = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12;
      cable.push([-88 + u * 12 + Math.sin(u * 5 + t * 1.4 + phase) * 10, -46 + u * 40]);
    }
    api.inkLine(ctx, cable, 2.6, 'rgba(58,47,42,0.55)');

    // 播放器
    api.paint(ctx, api.shapes.poly([[-24, -14], [52, -14], [58, -52], [-18, -52]], 3), { wash: '#e8ece9', sw: 2.8 });
    api.paint(ctx, api.shapes.poly([[-14, -22], [42, -22], [46, -44], [-10, -44]], 3), { wash: '#7fc2cc', sw: 0, washOp: 0.8 });
    api.paint(ctx, api.shapes.ring(4, -33, 6, 6, 10), { wash: PAL.paper, sw: 1.4 });
  },
};
