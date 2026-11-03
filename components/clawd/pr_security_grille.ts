import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_security_grille: ComponentDef<ClawdApi> = {
name: 'pr_security_grille',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour window cage: a warm lit window behind a protruding iron security grille with nine vertical bars, four horizontal bars, weld spots, a padlock, rust streaks and a small blinking red alarm lamp. Anchor is bottom centre, 344×310 px; useful as a facade or wall-mounted detail for shuttered shops, back alleys or guarded houses.',
  tags: ['catalog', 'security', 'grille', 'window', 'facade', 'wall', 'metal', 'decor'],
  size: [344, 310],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the alarm lamp blink, used to desynchronise copies.' },
    lamp: { type: 'number', default: 1, min: 0, max: 1, description: 'Brightness of the warm glow inside the window behind the bars; 0 leaves the room dark.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, lamp = 1 } = params as { phase?: number; lamp?: number };
    const { PAL } = api;

    // 窗（被保护的窗，亮一点）
    api.paint(ctx, api.shapes.poly([[-156, -296], [156, -296], [156, -14], [-156, -14]], 3), { wash: '#cfc6b2', sw: 3 });
    api.paint(ctx, api.shapes.poly([[-140, -282], [140, -282], [140, -28], [-140, -28]], 3), { wash: '#f0dfb0', sw: 2.2 });
    api.glow(ctx, 0, -150, 130, '#ffe7b0', 0.16 * lamp);
    api.paint(ctx, api.shapes.poly([[-140, -282], [140, -282], [140, -170], [-140, -170]], 3), { wash: '#e9cf92', sw: 0, washOp: 0.5 });
    // 窗棂
    api.paint(ctx, api.shapes.poly([[-8, -282], [8, -282], [8, -28], [-8, -28]], 3), { wash: '#d8cfba', sw: 2 });

    // 防盗网框
    api.paint(ctx, api.shapes.poly([[-172, -306], [172, -306], [172, -6], [-172, -6]], 3), { wash: 'rgba(0,0,0,0)', sw: 5, ink: '#6b7376' });
    // 外凸的笼体（顶部与底部的前沿）
    api.paint(ctx, api.shapes.poly([[-172, -306], [172, -306], [150, -286], [-150, -286]], 3), { wash: '#8f9b99', sw: 3 });
    api.paint(ctx, api.shapes.poly([[-172, -6], [172, -6], [150, -26], [-150, -26]], 3), { wash: '#8f9b99', sw: 3 });
    // 竖向铁栅
    for (let i = 0; i < 9; i++) {
      const x = -144 + i * 36;
      api.inkLine(ctx, api.shapes.line(x, -290, x, -22, 1, 8, i + 2), 5, '#6b7376');
      api.inkLine(ctx, api.shapes.line(x, -290, x, -22, 1, 8, i + 2), 1.6, PAL.ink);
    }
    // 横向铁条
    for (let i = 0; i < 4; i++) {
      const y = -270 + i * 68;
      api.inkLine(ctx, api.shapes.line(-150, y, 150, y, 1, 10, i + 6), 4, '#6b7376');
      api.inkLine(ctx, api.shapes.line(-150, y, 150, y, 1, 10, i + 6), 1.4, PAL.ink);
    }
    // 焊点
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 3; k++) {
        api.paint(ctx, api.shapes.ring(-108 + k * 108, -270 + i * 68, 4, 4, 8), { wash: '#9aa3a5', sw: 0, washOp: 0.9 });
      }
    }

    // 挂锁
    api.paint(ctx, api.shapes.ring(0, -76, 13, 13, 16), { wash: PAL.ochre, sw: 2.4 });
    api.inkLine(ctx, api.shapes.arc(0, -84, 9, 9, Math.PI, Math.PI * 2, 10), 3, '#8f9b99');
    api.paint(ctx, api.shapes.ring(0, -76, 4, 4, 8), { wash: '#6b7376', sw: 0 });

    // 锈迹与雨痕
    for (let i = 0; i < 5; i++) {
      api.inkLine(ctx, api.shapes.line(-120 + i * 60, -40 - (i % 2) * 30, -118 + i * 60, -10, 0, 4, i + 4), 1.4, 'rgba(140,90,50,0.3)');
    }
    // 警报小灯
    const k = 0.5 + 0.5 * Math.sin(t * 2 + phase);
    api.glow(ctx, 150, -296, 24, PAL.rose, 0.22 * k);
    api.paint(ctx, api.shapes.ring(150, -296, 7, 7, 10), { wash: PAL.rose, sw: 1.8 });
  },
};
