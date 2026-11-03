import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_door_metal: ComponentDef<ClawdApi> = {
name: 'pr_door_metal',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour industrial metal door set in a grey concrete frame, with rivets, a wire-mesh viewing window, push bar, warning sign, and optional red alarm lamp; anchor bottom centre, 256×390 px. Useful as a secure entrance or backdrop element in urban, prison, or factory scenes.',
  tags: ['catalog', 'door', 'metal', 'facade', 'wall', 'industrial', 'prop'],
  size: [256, 390],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the alarm lamp\'s pulse timing so multiple doors blink out of sync.' },
    open: { type: 'number', default: 0, min: 0, max: 1, description: 'Swings the door leaf outward on its hinge from shut (0) to fully open (1).' },
    alarm: { type: 'number', default: 0, min: 0, max: 1, description: 'Turns on the red alarm lamp and its pulsing glow; 0 hides it, 1 gives maximum glow.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, open = 0, alarm = 0 } = params as { phase?: number; open?: number; alarm?: number };
    const { PAL } = api;
    const k = 0.5 + 0.5 * Math.sin(t * 3 + phase);

    // 门框（水泥墙）
    api.paint(ctx, api.shapes.poly([[-120, -390], [120, -390], [120, 0], [-120, 0]], 6), { wash: '#b8b2a4', sw: 3 });
    api.paint(ctx, api.shapes.poly([[-104, -376], [104, -376], [104, -12], [-104, -12]], 6), { wash: '#3f4448', sw: 2.6 });

    // 门扇
    ctx.save();
    ctx.translate(104, -196);
    ctx.rotate(-0.85 * api.shapes.clamp01(open));
    ctx.translate(-104, 196);
    api.paint(ctx, api.shapes.poly([[-100, -374], [100, -374], [100, -14], [-100, -14]], 6), { wash: '#7f8a8e', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-88, -362], [88, -362], [88, -26], [-88, -26]], 6), { wash: '#8d979b', sw: 0, washOp: 0.7 });
    // 铆钉
    for (let i = 0; i < 6; i++) {
      api.paint(ctx, api.shapes.ring(-78 + i * 31, -348, 4, 4, 8), { wash: '#a6afb2', sw: 1 });
      api.paint(ctx, api.shapes.ring(-78 + i * 31, -40, 4, 4, 8), { wash: '#a6afb2', sw: 1 });
    }
    // 观察窗（铁丝网）
    api.paint(ctx, api.shapes.round(-46, -300, 46, -236, 5), { wash: '#3a4046', sw: 2.4 });
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-40 + i * 20, -296, -30 + i * 20, -240, 0, 4, i + 2), 1.4, 'rgba(200,210,213,0.5)');
      api.inkLine(ctx, api.shapes.line(-44 + i * 20, -240, -34 + i * 20, -296, 0, 4, i + 6), 1.4, 'rgba(200,210,213,0.35)');
    }
    // 推杠
    api.paint(ctx, api.shapes.round(-76, -170, 76, -156, 7), { wash: '#b9c1c0', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(-64, -156, 5, 5, 8), { wash: '#8f9b99', sw: 1.2 });
    api.paint(ctx, api.shapes.ring(64, -156, 5, 5, 8), { wash: '#8f9b99', sw: 1.2 });
    // 警示标
    api.paint(ctx, api.shapes.poly([[-92, -108], [-58, -108], [-58, -74], [-92, -74]], 3), { wash: PAL.ochre, sw: 1.8 });
    api.inkLine(ctx, api.shapes.line(-84, -100, -66, -82, 0, 3, 3), 2, 'rgba(58,47,42,0.6)');
    // 编号
    api.inkLine(ctx, api.shapes.line(44, -108, 80, -108, 0, 4, 4), 2.4, 'rgba(58,47,42,0.45)');
    api.inkLine(ctx, api.shapes.line(44, -96, 66, -96, 0, 3, 6), 1.6, 'rgba(58,47,42,0.3)');
    ctx.restore();

    // 门框上的警报灯
    if (alarm > 0) {
      api.glow(ctx, 0, -382, 60, '#e0553f', 0.4 * k * alarm);
      api.paint(ctx, api.shapes.ring(0, -382, 12, 12, 14), { wash: '#e0553f', sw: 2.2 });
      api.paint(ctx, api.shapes.ring(0, -382, 6, 6, 10), { wash: '#ff9b7a', sw: 0, washOp: 0.6 + 0.4 * k });
    } else {
      api.paint(ctx, api.shapes.ring(0, -382, 10, 10, 12), { wash: '#9aa3a5', sw: 1.8 });
    }
    // 地面门槛
    api.paint(ctx, api.shapes.poly([[-120, -8], [120, -8], [128, 0], [-128, 0]], 3), { wash: '#a6a094', sw: 2.2 });
  },
};
