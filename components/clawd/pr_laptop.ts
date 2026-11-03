import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_laptop: ComponentDef<ClawdApi> = {
name: 'pr_laptop',
  style: 'clawd',
  kind: 'prop',
  description: 'An open watercolour laptop with a pale screen showing a teal panel, a small orange bar chart and a note card, over a keyboard deck with rows of keys, a touchpad and a teal power light; a teacup and a pen sit on the desk at either side. Anchor is bottom centre, 372×230 px, sized for desk, study or office scenes.',
  tags: ['catalog', 'laptop', 'computer', 'desk', 'screen', 'stationery', 'ground', 'indoor'],
  size: [372, 230],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the animation clock so several laptops on screen flicker and breathe out of sync.' },
    glow: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the screen backlight and interface overlay; at 0 the screen is dark and blank.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, glow = 1 } = params as { phase?: number; glow?: number };
    const { PAL } = api;
    const open = 0.86 + Math.sin(t * 0.8 + phase) * 0.01;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 138, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 屏幕背板（微微后仰）
    ctx.save();
    ctx.translate(0, -40);
    ctx.scale(1, open);
    api.paint(ctx, api.shapes.round(-118, -166, 118, -4, 8, 5), { wash: '#cfd6d6', sw: 3.4 });
    // 屏幕
    api.paint(ctx, api.shapes.poly([[-108, -156], [108, -156], [108, -16], [-108, -16]], 3), { wash: '#3d4a55', sw: 2.6 });
    if (glow > 0) {
      api.glow(ctx, 0, -86, 150, '#8fd0d8', 0.16 * glow);
      // 界面元素
      api.paint(ctx, api.shapes.poly([[-96, -146], [-6, -146], [-6, -120], [-96, -120]], 2), { wash: '#7fc2cc', sw: 0, washOp: 0.85 });
      for (let i = 0; i < 5; i++) {
        const k = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.6 + i * 0.9 + phase));
        api.paint(ctx, api.shapes.poly([[-96 + i * 19, -24], [-86 + i * 19, -24], [-86 + i * 19, -24 - 44 * k], [-96 + i * 19, -24 - 44 * k]], 2), {
          wash: '#f0b06a',
          sw: 0,
          washOp: 0.75 * glow,
        });
      }
      api.paint(ctx, api.shapes.poly([[8, -146], [96, -146], [96, -96], [8, -96]], 2), { wash: '#efe6d2', sw: 0, washOp: 0.7 });
      api.inkLine(ctx, api.shapes.line(16, -136, 82, -136, 0, 4, 2), 2, 'rgba(58,47,42,0.35)');
      api.inkLine(ctx, api.shapes.line(16, -124, 62, -124, 0, 4, 4), 2, 'rgba(58,47,42,0.25)');
      api.inkLine(ctx, api.shapes.line(16, -112, 74, -112, 0, 4, 6), 2, 'rgba(58,47,42,0.2)');
    }
    ctx.restore();

    // 键盘面
    api.paint(ctx, api.shapes.poly([[-134, -42], [134, -42], [148, -12], [-148, -12]], 4), { wash: '#dfe4e3', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-118, -36], [118, -36], [126, -18], [-126, -18]], 3), { wash: '#cfd6d5', sw: 0, washOp: 0.7 });
    // 按键
    for (let r = 0; r < 2; r++) {
      for (let i = 0; i < 11; i++) {
        api.paint(ctx, api.shapes.poly([[-108 + i * 20, -33 + r * 8], [-98 + i * 20, -33 + r * 8], [-98 + i * 20, -28 + r * 8], [-108 + i * 20, -28 + r * 8]], 2), {
          wash: '#eef2f1',
          sw: 0,
          washOp: 0.9,
        });
      }
    }
    // 触控板
    api.paint(ctx, api.shapes.poly([[-22, -22], [22, -22], [26, -15], [-26, -15]], 2), { wash: '#c9d0cf', sw: 0 });

    // 电源指示
    api.paint(ctx, api.shapes.ring(120, -26, 3, 2, 8), { wash: PAL.teal, sw: 0, washOp: 0.8 });

    // 桌上小物：杯子与笔
    api.paint(ctx, api.shapes.poly([[-174, -10], [-122, -10], [-128, -60], [-168, -60]], 4), { wash: '#f0e2c6', sw: 2.8 });
    api.paint(ctx, api.shapes.ring(-148, -60, 20, 6, 18), { wash: '#e6d4b2', sw: 2.2 });
    api.inkLine(ctx, api.shapes.arc(-120, -38, 11, 12, -Math.PI * 0.45, Math.PI * 0.5, 10), 3, PAL.ink);
    api.inkLine(ctx, api.shapes.line(-166, -40, -130, -40, 0.6, 5, 6), 1.2, 'rgba(58,47,42,0.25)');
    api.inkLine(ctx, api.shapes.line(140, -14, 176, -46, 0, 5, 4), 3.4, PAL.ochre);
    api.paint(ctx, [[176, -46], [182, -52], [178, -44]], { wash: PAL.ink, sw: 0 });
  },
};
