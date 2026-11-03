import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_desktop_monitor: ComponentDef<ClawdApi> = {
name: 'pr_desktop_monitor',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour desktop monitor with a dark bezel, pale stand, power light, and a screen showing either abstract canvas swatches, code lines, or a landscape photo. It is 360×310 px with its anchor at the bottom centre, suited to desk and office scenes.',
  tags: ['catalog', 'office', 'desktop', 'monitor', 'electronics', 'screen', 'prop', 'ground'],
  size: [360, 310],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians used to desynchronise screen flicker between copies.' },
    on: { type: 'number', default: 1, min: 0, max: 1, description: 'Screen on/off amount; 1 shows the screen content and glow, 0 leaves it dark.' },
    screen: { type: 'enum', default: 'canvas', options: ['canvas', 'code', 'photo'], description: 'Screen content style: abstract canvas swatches, code lines, or a landscape photo.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, on = 1, screen = 'canvas' } = params as { phase?: number; on?: number; screen?: string };
    const { PAL } = api;
    const flick = 0.94 + 0.06 * Math.sin(t * 2.1 + phase);

    // 桌面阴影
    api.paint(ctx, api.shapes.ring(0, -8, 150, 11, 22, 0, 0, 7), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 底座 + 支臂
    api.paint(ctx, api.shapes.poly([[-88, -10], [88, -10], [72, -24], [-72, -24]], 3), { wash: '#b9b2a2', sw: 2.6 });
    api.paint(ctx, api.shapes.poly([[-26, -26], [26, -26], [18, -92], [-18, -92]], 4), { wash: '#cfc8b8', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(0, -28, 30, 6, 14), { wash: '#9aa3a5', sw: 0, washOp: 0.5 });

    // 屏幕外框
    api.paint(ctx, api.shapes.poly([[-178, -92], [178, -92], [178, -296], [-178, -296]], 4), { wash: '#4a5155', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-166, -102], [166, -102], [166, -288], [-166, -288]], 4), { wash: '#2f3a41', sw: 2 });

    // 屏幕内容
    if (on > 0.1) {
      const glass = screen === 'code' ? '#334a52' : screen === 'photo' ? '#cfe0e2' : '#3d5259';
      api.paint(ctx, api.shapes.poly([[-164, -104], [164, -104], [164, -286], [-164, -286]], 4), { wash: glass, sw: 0, washOp: on });
      ctx.save();
      ctx.globalAlpha = on;
      // 顶栏
      api.paint(ctx, api.shapes.poly([[-164, -104], [164, -104], [164, -122], [-164, -122]], 3), { wash: '#26333a', sw: 0, washOp: 0.8 });
      for (let i = 0; i < 3; i++) {
        api.paint(ctx, api.shapes.ring(-152 + i * 14, -113, 4, 4, 8), { wash: i === 0 ? PAL.rose : i === 1 ? PAL.ochre : PAL.sap, sw: 0 });
      }
      if (screen === 'code') {
        for (let i = 0; i < 8; i++) {
          const w = 40 + api.shapes.hash(i + 3) * 90;
          api.inkLine(ctx, api.shapes.line(-146, -140 - i * 16, -146 + w, -140 - i * 16, 0, 6, i + 2), 4, i % 3 === 0 ? PAL.teal : 'rgba(230,238,235,0.5)');
        }
      } else if (screen === 'photo') {
        api.paint(ctx, api.shapes.poly([[-160, -280], [160, -280], [160, -190], [-160, -212]], 3), { wash: PAL.sky, sw: 0, washOp: 0.8 });
        api.paint(ctx, api.shapes.poly([[-160, -212], [-60, -250], [40, -206], [160, -238], [160, -180], [-160, -180]], 3), { wash: PAL.sap, sw: 0, washOp: 0.7 });
        api.paint(ctx, api.shapes.ring(96, -252, 16, 16, 16), { wash: PAL.ochre, sw: 0, washOp: 0.85 });
      } else {
        // 画布：几笔水彩色块 + 一支笔
        api.paint(ctx, api.shapes.poly([[-136, -264], [-30, -272], [-22, -176], [-130, -168]], 3), { wash: PAL.rose, sw: 0, washOp: 0.55 });
        api.paint(ctx, api.shapes.poly([[-24, -268], [92, -262], [98, -186], [-16, -192]], 3), { wash: PAL.teal, sw: 0, washOp: 0.45 });
        api.paint(ctx, api.shapes.ring(58, -220, 26, 22, 16), { wash: PAL.ochre, sw: 0, washOp: 0.5 });
        api.inkLine(ctx, api.shapes.line(-120, -196, 80, -204, 2, 8, 4), 3, 'rgba(246,239,223,0.6)');
      }
      // 反光
      api.paint(ctx, api.shapes.poly([[-164, -286], [-96, -286], [-164, -150]], 3), { wash: '#ffffff', sw: 0, washOp: 0.09 * flick });
      ctx.restore();
      api.glow(ctx, 0, -190, 190, '#bfe0e6', 0.1 * on);
    }
    // 电源指示灯
    api.paint(ctx, api.shapes.ring(150, -98, 4, 4, 8), { wash: on > 0.1 ? PAL.sap : '#6b7376', sw: 0 });
    // 外框高光
    api.inkLine(ctx, api.shapes.line(-172, -290, 172, -290, 0, 8, 3), 1.6, 'rgba(255,246,230,0.35)');
  },
};
