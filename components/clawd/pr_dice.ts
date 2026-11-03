import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_dice: ComponentDef<ClawdApi> = {
name: 'pr_dice',
  style: 'clawd',
  kind: 'prop',
  description: 'Two watercolour dice resting on the ground: a tilted back die showing five pips and a larger front die drawn in three-quarter perspective with visible top, front and side faces showing 2, 6 and 3 pips. Both are cream-coloured with terracotta pips and a soft shadow, anchored at bottom centre and sized 220×180 px, with a gentle rolling pulse good for tabletop, game or chance-themed scenes.',
  tags: ['catalog', 'dice', 'game', 'toy', 'prop', 'ground', 'watercolour'],
  size: [220, 180],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the gentle bobbing/rolling pulse so multiple copies move out of sync.' },
    roll: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the rolling pulse; 0 keeps the dice still, 1 gives the full bounce.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, roll = 1 } = params as { phase?: number; roll?: number };
    const { PAL } = api;
    const pulse = Math.sin(t * 1.4 + phase) * 2 * roll;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(10, -5, 88, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 后方骰子（斜放）
    ctx.save();
    ctx.translate(44, -20 + pulse * 0.4);
    ctx.rotate(0.28);
    const back = api.shapes.poly([[-46, -92], [46, -92], [46, 0], [-46, 0]], 4);
    api.paint(ctx, back, { wash: '#f6efdd', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-38, -84], [38, -84], [38, -8], [-38, -8]], 3), { wash: '#fbf6e8', sw: 2, ink: 'rgba(58,47,42,0.3)' });
    // 点数 5
    const pip = (x: number, y: number, r = 6.5, dark = false) => {
      api.paint(ctx, api.shapes.ring(x, y, r, r, 12), { wash: dark ? PAL.ink : '#c4553f', sw: 0, washOp: 0.95 });
    };
    pip(-20, -64);
    pip(20, -64);
    pip(0, -46);
    pip(-20, -28);
    pip(20, -28);
    ctx.restore();

    // 前方骰子（正面朝前）
    ctx.save();
    ctx.translate(-18, -8 + pulse);
    ctx.rotate(-0.08);
    // 顶面（透视）
    api.paint(ctx, api.shapes.poly([[-58, -100], [2, -122], [62, -100], [2, -80]], 3), { wash: '#fbf7ec', sw: 2.8 });
    // 正面
    api.paint(ctx, api.shapes.poly([[-58, -100], [2, -80], [2, -10], [-58, -24]], 3), { wash: '#f6efdd', sw: 3.2 });
    // 右侧面
    api.paint(ctx, api.shapes.poly([[62, -100], [2, -80], [2, -10], [62, -26]], 3), { wash: '#eae2cd', sw: 3 });
    // 顶面点数 2
    pip(-10, -100, 5.5);
    pip(14, -94, 5.5);
    // 正面点数 6
    pip(-40, -86, 6);
    pip(-40, -66, 6);
    pip(-40, -46, 6);
    pip(-16, -80, 6);
    pip(-16, -60, 6);
    pip(-16, -40, 6);
    // 侧面点数 3
    pip(32, -78, 5.5);
    pip(32, -58, 5.5);
    pip(32, -38, 5.5);
    // 棱线高光
    api.inkLine(ctx, api.shapes.line(-58, -100, 2, -80, 0, 5, 3), 1.4, 'rgba(246,239,223,0.8)');
    ctx.restore();
  },
};
