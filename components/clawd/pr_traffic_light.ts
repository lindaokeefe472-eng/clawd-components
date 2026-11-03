import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_traffic_light: ComponentDef<ClawdApi> = {
name: 'pr_traffic_light',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour traffic light with a dark three-lamp housing on a slim pole, plus a side pedestrian signal; anchor is bottom centre and size is 210×350 px. Useful as a street-side prop in urban or roadside scenes.',
  tags: ['catalog', 'street', 'traffic-light', 'signal', 'prop', 'ground', 'urban'],
  size: [210, 350],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians; shifts the light cycle so copies do not switch in sync.' },
    cycle: { type: 'number', default: 1, min: 0, max: 1, description: 'Animation speed for the signal cycle; 0 freezes the lights and 1 runs at full speed.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, cycle = 1 } = params as { phase?: number; cycle?: number };
    const { PAL } = api;
    const a = t * 0.5 * cycle + phase;
    const red = api.shapes.clamp01(Math.sin(a) * 1.6 - 0.35);
    const green = api.shapes.clamp01(-Math.sin(a) * 1.6 - 0.35);
    const amber = api.shapes.clamp01(1 - Math.abs(Math.sin(a)) * 7);

    // 地面阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 40, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 底座 + 立杆
    api.paint(ctx, api.shapes.poly([[-24, -4], [24, -4], [17, -20], [-17, -20]], 3), { wash: '#8f9b99', sw: 2.6 });
    api.inkLine(ctx, api.shapes.line(0, -18, 0, -186, 0, 10, 2), 12, '#8f9b99');
    api.inkLine(ctx, api.shapes.line(0, -18, 0, -186, 0, 10, 2), 3, PAL.ink);
    api.paint(ctx, api.shapes.round(-14, -200, 14, -182, 4), { wash: '#a3aeac', sw: 2.2 });

    // 灯箱（三灯竖排）
    api.paint(ctx, api.shapes.round(-46, -340, 46, -194, 16, 6), { wash: '#4a5157', sw: 3.6 });
    api.paint(ctx, api.shapes.round(-39, -333, 39, -201, 12, 5), { wash: '#3b4147', sw: 0, washOp: 0.7 });
    // 每颗灯的遮阳檐
    for (let i = 0; i < 3; i++) {
      const y = -310 + i * 48;
      api.paint(ctx, api.shapes.arc(0, y - 17, 36, 11, Math.PI * 1.02, Math.PI * 1.98, 14), { wash: '#3b4147', sw: 2.2 });
    }

    // 三颗灯
    const lamps: Array<[number, number, string, string]> = [
      [-310, red, '#e0553f', '#ff9b7a'],
      [-262, amber, '#d9a441', '#ffe0a0'],
      [-214, green, '#4f9c98', '#9fe6df'],
    ];
    for (let i = 0; i < lamps.length; i++) {
      const [y, k, dark, light] = lamps[i];
      if (k > 0.05) api.glow(ctx, 0, y, 56, light, 0.36 * k);
      api.paint(ctx, api.shapes.ring(0, y, 24, 24, 26), { wash: k > 0.05 ? dark : '#2b3136', sw: 2.8 });
      api.paint(ctx, api.shapes.ring(0, y, 17, 17, 22), { wash: k > 0.05 ? light : 'rgba(20,24,28,0.85)', sw: 0, washOp: k > 0.05 ? 0.55 + 0.45 * k : 0.8 });
      api.paint(ctx, api.shapes.ring(-6, y - 7, 6, 4.4, 10, -0.5), { wash: '#ffffff', sw: 0, washOp: 0.16 + 0.36 * k });
    }

    // 行人灯（挂在箱体右侧，带悬臂）
    api.inkLine(ctx, api.shapes.line(46, -300, 62, -300, 0, 3, 3), 4, '#8f9b99');
    api.paint(ctx, api.shapes.round(58, -326, 104, -268, 6, 4), { wash: '#4a5157', sw: 2.8 });
    api.paint(ctx, api.shapes.round(63, -321, 99, -273, 4, 3), { wash: '#2b3136', sw: 0 });
    const walk = api.shapes.clamp01(green);
    const blinkOn = Math.sin(t * 6 + phase) > -0.2 ? 1 : 0.25;
    if (walk > 0.2) {
      api.glow(ctx, 81, -297, 30, '#9fe6df', 0.28 * walk);
      api.inkLine(ctx, [[81, -310], [81, -296]], 3, '#9fe6df');
      api.inkLine(ctx, [[81, -297], [73, -284]], 2.8, '#9fe6df');
      api.inkLine(ctx, [[81, -297], [90, -286]], 2.8, '#9fe6df');
      api.paint(ctx, api.shapes.ring(81, -314, 3.6, 3.6, 8), { wash: '#9fe6df', sw: 0 });
    } else {
      api.glow(ctx, 81, -297, 22, '#e0553f', 0.2 * blinkOn);
      api.inkLine(ctx, [[81, -310], [81, -292]], 3, `rgba(224,85,63,${0.5 + 0.4 * blinkOn})`);
      api.paint(ctx, api.shapes.ring(81, -314, 3.6, 3.6, 8), { wash: 'rgba(224,85,63,0.9)', sw: 0 });
    }
    // 接线盒与线缆
    api.paint(ctx, api.shapes.round(-12, -196, 12, -176, 4), { wash: '#6d757a', sw: 2 });
    api.inkLine(ctx, api.shapes.arc(20, -182, 20, 14, -0.4, Math.PI * 0.7, 10), 3, 'rgba(58,47,42,0.3)');
  },
};
