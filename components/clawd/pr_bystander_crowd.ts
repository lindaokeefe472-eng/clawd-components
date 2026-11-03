import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_bystander_crowd: ComponentDef<ClawdApi> = {
name: 'pr_bystander_crowd',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour crowd prop showing five dark, anonymous bystanders with question-mark thought bubbles around a small rose-clad figure raising a heart, with orange distress ripples and faint gaze arrows. It is anchored at bottom centre and measures 340×230 px, suited to scenes about the bystander effect, crowd apathy, or a call for help.',
  tags: ['catalog', 'crowd', 'bystander', 'people', 'psychology', 'ground', 'watercolour'],
  size: [340, 230],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the crowd\'s bobbing, waving, and ripple animation across copies.' },
    help: { type: 'number', default: 0, min: 0, max: 1, description: 'Help amount; higher values fade the central figure\'s orange distress ripples, with 0 showing full ripples and 1 hiding them.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, help = 0 } = params as { phase?: number; help?: number };
    const { PAL } = api;

    // 地面
    api.paint(ctx, api.shapes.poly([[-170, 0], [170, 0], [164, -8], [-164, -8]], 3), { wash: '#d8c7a6', sw: 2.6 });

    // 一排旁观者（逐个大一号、更靠后）
    for (let i = 0; i < 5; i++) {
      const x = -132 + i * 46;
      const hgt = 92 + (i % 2) * 10;
      const bob = Math.sin(t * 1.2 + i * 1.5 + phase) * 2;
      const aw = 0.22 + 0.1 * (i % 3);
      api.paint(ctx, api.shapes.poly([[x - 16, -8], [x + 16, -8], [x + 12, -8 - hgt * 0.55], [x - 12, -8 - hgt * 0.55]], 3), {
        wash: 'rgba(58,47,42,0.32)',
        sw: 2,
      });
      api.paint(ctx, api.shapes.ring(x, -8 - hgt * 0.72 + bob, 13, 14, 16, 0, 0.04, i + 2), { wash: 'rgba(58,47,42,0.32)', sw: 2 });
      // 疑问气泡
      api.paint(ctx, api.shapes.ring(x + 16, -8 - hgt * 1.02 + bob, 9, 7, 12), { wash: PAL.paper, sw: 1.6, washOp: 0.9 });
      api.inkLine(ctx, api.shapes.arc(x + 16, -8 - hgt * 1.02 + bob, 3, 4, Math.PI * 1.1, Math.PI * 2.1, 6), 1.6, 'rgba(58,47,42,0.55)');
      void aw;
    }

    // 中间需要帮助的人（小、亮、举着爱心）
    const wave = Math.sin(t * 3 + phase) * 0.2;
    ctx.save();
    ctx.translate(0, -14);
    api.paint(ctx, api.shapes.poly([[-14, 0], [14, 0], [10, -44], [-10, -44]], 3), { wash: PAL.rose, sw: 2.8 });
    api.paint(ctx, api.shapes.ring(0, -56, 12, 12, 16, 0, 0.03, 7), { wash: '#f0d3b6', sw: 2.6 });
    ctx.save();
    ctx.translate(10, -46);
    ctx.rotate(wave);
    api.inkLine(ctx, api.shapes.line(0, 0, 14, -22, 0, 4, 4), 4, '#f0d3b6');
    api.paint(ctx, api.shapes.heart(18, -30, 9), { wash: PAL.rose, sw: 1.8 });
    ctx.restore();
    // 呼救波纹
    for (let i = 0; i < 3; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 2.4 - i * 0.7 + phase);
      api.inkLine(ctx, api.shapes.arc(0, -60, 24 + i * 12, 20 + i * 10, Math.PI * 1.15, Math.PI * 1.85, 10), 1.6, `rgba(226,128,60,${0.4 * (1 - help) * k})`);
    }
    ctx.restore();

    // 视线（旁观的箭头，没有一条真的指向中间）
    for (let i = 0; i < 4; i++) {
      const x = -110 + i * 46;
      api.inkLine(ctx, api.shapes.line(x + 6, -96, x + 22, -104, 0, 4, i + 3), 1.4, 'rgba(58,47,42,0.22)');
    }
  },
};
