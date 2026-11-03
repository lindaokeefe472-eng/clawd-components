import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_wall_clock: ComponentDef<ClawdApi> = {
name: 'pr_wall_clock',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour wall clock with a wooden outer ring, pale face, fine minute ticks, dark hour and minute hands, a thin red second hand, and a hanging ring above the frame. It is 280×290 px with a bottom-centre anchor and is suited to interior wall scenes or household decor.',
  tags: ['catalog', 'household', 'wall', 'clock', 'decor', 'prop', 'wood', 'hanging'],
  size: [280, 290],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the animated second hand to desynchronise copies.' },
    hour: { type: 'number', default: 10, min: 0, max: 20, description: 'Hour value used to set the angle of the short hour hand.' },
    minute: { type: 'number', default: 10, min: 0, max: 20, description: 'Minute value used to set the angle of the long minute hand.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, hour = 10, minute = 10 } = params as { phase?: number; hour?: number; minute?: number };
    const { PAL } = api;
    const sec = t * 0.6 + phase;

    // 挂钉与吊环
    api.paint(ctx, api.shapes.ring(0, -282, 7, 7, 10), { wash: '#b9b2a2', sw: 1.8 });
    api.inkLine(ctx, api.shapes.arc(0, -266, 18, 16, Math.PI * 1.1, Math.PI * 1.9, 12), 3, '#8f9b99');

    // 外框（木边 + 金属圈）
    api.paint(ctx, api.shapes.ring(0, -150, 132, 132, 40), { wash: '#b98a5c', sw: 3.6 });
    api.paint(ctx, api.shapes.ring(0, -150, 116, 116, 36), { wash: '#f6efdf', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(0, -150, 118, 118, 36), { wash: '#ffffff', sw: 0, washOp: 0.25 });
    // 木纹高光
    api.inkLine(ctx, api.shapes.arc(0, -150, 124, 124, Math.PI * 1.15, Math.PI * 1.6, 12), 2.4, 'rgba(255,246,230,0.5)');
    api.inkLine(ctx, api.shapes.arc(0, -150, 124, 124, Math.PI * 0.1, Math.PI * 0.55, 12), 2, 'rgba(58,47,42,0.2)');

    // 分钟细刻度
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
      api.inkLine(ctx, api.shapes.line(Math.cos(a) * 100, -150 + Math.sin(a) * 100, Math.cos(a) * 106, -150 + Math.sin(a) * 106, 0, 2, i + 30), 1.4,
        'rgba(58,47,42,0.22)');
    }
    // 刻度
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const major = i % 3 === 0;
      const r0 = major ? 88 : 96;
      api.inkLine(
        ctx,
        api.shapes.line(Math.cos(a) * r0, -150 + Math.sin(a) * r0, Math.cos(a) * 106, -150 + Math.sin(a) * 106, 0, 2, i + 2),
        major ? 5 : 2,
        major ? 'rgba(58,47,42,0.7)' : 'rgba(58,47,42,0.35)'
      );
      if (major) {
        for (let k = 0; k < 2; k++) {
          const a2 = a + (k ? 0.09 : -0.09);
          api.inkLine(ctx, api.shapes.line(Math.cos(a2) * 92, -150 + Math.sin(a2) * 92, Math.cos(a2) * 100, -150 + Math.sin(a2) * 100, 0, 2, i * 2 + k + 5), 1.6,
            'rgba(58,47,42,0.5)');
        }
      }
    }
    // 品牌小字
    api.inkLine(ctx, api.shapes.line(-26, -66, 26, -66, 0, 5, 4), 1.6, 'rgba(58,47,42,0.25)');

    // 指针
    const hourA = ((hour % 12) / 12) * Math.PI * 2 - Math.PI / 2;
    const minA = (minute / 60) * Math.PI * 2 - Math.PI / 2;
    const secA = (sec % 60) / 60 * Math.PI * 2 - Math.PI / 2;
    // 时针
    api.inkLine(ctx, api.shapes.line(0, -150, Math.cos(hourA) * 62, -150 + Math.sin(hourA) * 62, 0, 5, 3), 10, '#3a2f2a');
    // 分针
    api.inkLine(ctx, api.shapes.line(0, -150, Math.cos(minA) * 92, -150 + Math.sin(minA) * 92, 0, 6, 4), 7, '#3a2f2a');
    // 秒针（细红针）
    api.inkLine(ctx, api.shapes.line(Math.cos(secA + Math.PI) * 18, -150 + Math.sin(secA + Math.PI) * 18, Math.cos(secA) * 96, -150 + Math.sin(secA) * 96, 0, 5, 5),
      2.6, PAL.rose);
    // 中心轴
    api.paint(ctx, api.shapes.ring(0, -150, 8, 8, 14), { wash: PAL.ochre, sw: 1.6 });
    api.paint(ctx, api.shapes.ring(0, -150, 3, 3, 8), { wash: '#3a2f2a', sw: 0 });

    // 玻璃反光
    api.paint(ctx, api.shapes.poly([[-92, -238], [-46, -250], [-30, -166], [-76, -156]], 3), { wash: '#ffffff', sw: 0, washOp: 0.12 });
  },
};
