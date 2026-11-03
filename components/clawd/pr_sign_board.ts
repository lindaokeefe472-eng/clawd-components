import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_sign_board: ComponentDef<ClawdApi> = {
name: 'pr_sign_board',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour hanging shop sign: a wooden board with a cream inset panel showing a coffee cup and two lines of lettering, suspended by two rings from a grey wrought-iron bracket on a plastered wall with faint brick lines. Anchored at the bottom centre at 300×250 px, it is suited to café fronts, shop facades and street scenes.',
  tags: ['catalog', 'sign', 'hanging', 'wall', 'cafe', 'metal', 'decor'],
  size: [300, 250],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the rocking cycle so repeated copies do not sway in unison.' },
    swing: { type: 'number', default: 1, min: 0, max: 1, description: 'Swing amount; 0 keeps the board hanging still, 1 gives the full gentle rocking motion.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, swing = 1 } = params as { phase?: number; swing?: number };
    const { PAL } = api;
    const rock = Math.sin(t * 0.9 + phase) * 0.03 * swing;

    // 墙面
    api.paint(ctx, api.shapes.poly([[-150, -250], [150, -250], [150, 0], [-150, 0]], 5), { wash: '#d9d0bc', sw: 0, washOp: 0.5 });
    for (let i = 0; i < 6; i++) {
      api.inkLine(ctx, api.shapes.line(-150, -30 - i * 38, 150, -30 - i * 38, 0.6, 12, i + 2), 1.1, 'rgba(58,47,42,0.1)');
    }

    // 铁艺支架：竖贴墙杆 + 横臂 + 斜撑 + 两个吊环
    api.paint(ctx, api.shapes.poly([[-124, -236], [-108, -236], [-108, -40], [-124, -40]], 4), { wash: '#6b7376', sw: 2.4 });
    api.inkLine(ctx, api.shapes.line(-116, -30, -116, -214, 0, 8, 3), 4, '#6b7376');
    api.inkLine(ctx, api.shapes.line(-116, -214, 26, -214, 0, 6, 4), 5, '#6b7376');
    api.inkLine(ctx, api.shapes.line(-116, -150, -40, -214, 1, 5, 5), 3, '#6b7376');
    api.inkLine(ctx, api.shapes.line(26, -214, 26, -196, 0, 3, 6), 2.4, 'rgba(58,47,42,0.5)');
    api.inkLine(ctx, api.shapes.line(-54, -214, -54, -196, 0, 3, 7), 2.4, 'rgba(58,47,42,0.5)');

    // 招牌（绕两个吊环摆动）
    ctx.save();
    ctx.translate(-14, -196);
    ctx.rotate(rock);
    api.paint(ctx, api.shapes.poly([[-84, 0], [84, 0], [84, 108], [-84, 108]], 6), { wash: '#a97b4f', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-73, 11], [73, 11], [73, 97], [-73, 97]], 4), { wash: '#f2e8d2', sw: 2, ink: 'rgba(58,47,42,0.4)' });
    // 图案：咖啡杯 + 两行文字
    // 咖啡杯
    api.paint(ctx, api.shapes.poly([[-58, 30], [-26, 30], [-30, 62], [-54, 62]], 4), { wash: '#c98d5c', sw: 2 });
    api.inkLine(ctx, api.shapes.arc(-24, 46, 8, 9, -Math.PI * 0.5, Math.PI * 0.5, 8), 2.2, PAL.ink);
    api.inkLine(ctx, api.shapes.line(-58, 38, -26, 38, 0, 2, 6), 2, 'rgba(58,47,42,0.35)');
    // 热气
    for (let i = 0; i < 2; i++) {
      api.inkLine(ctx, api.shapes.line(-50 + i * 14, 26, -46 + i * 14, 16, 1, 3, i + 3), 1.4, 'rgba(120,120,120,0.4)');
    }
    // 两行"文字"
    api.inkLine(ctx, api.shapes.line(-14, 38, 62, 38, 0, 6, 4), 5, 'rgba(58,47,42,0.72)');
    api.inkLine(ctx, api.shapes.line(-14, 54, 50, 54, 0, 6, 6), 3.2, 'rgba(58,47,42,0.45)');
    api.inkLine(ctx, api.shapes.line(-58, 78, 62, 78, 0, 8, 8), 2, 'rgba(58,47,42,0.22)');
    // 铆钉与高光
    for (let i = 0; i < 2; i++) {
      api.paint(ctx, api.shapes.ring(-70 + i * 140, 14, 3.4, 3.4, 8), { wash: '#8f9b99', sw: 1 });
    }
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.beginPath();
    ctx.moveTo(-62, 12);
    ctx.lineTo(-26, 12);
    ctx.lineTo(-62, 96);
    ctx.lineTo(-78, 96);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
    ctx.restore();

    // 墙面挂钩
    api.paint(ctx, api.shapes.ring(-116, -220, 7, 5, 10), { wash: '#6b7376', sw: 1.8 });
  },
};
