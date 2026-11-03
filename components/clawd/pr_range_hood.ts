import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_range_hood: ComponentDef<ClawdApi> = {
name: 'pr_range_hood',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour kitchen range hood: a narrow chimney duct rising to the top edge, a wide inverted-trapezoid canopy, a round fan grille with spinning blades, a grease cup below, and a small button panel on the right, with faint steam drifting underneath. Anchor is bottom centre, 440×300 px, sized to hang above a stove or counter in kitchen scenes.',
  tags: ['catalog', 'kitchen', 'appliance', 'range-hood', 'metal', 'wall', 'decor'],
  size: [440, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the fan spin and steam motion between copies.' },
    fan: { type: 'number', default: 0.6, min: 0, max: 1, description: 'Fan speed and steam amount; 0 stops the blades and hides the steam, higher values spin faster and draw more steam.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, fan = 0.6 } = params as { phase?: number; fan?: number };
    const { PAL } = api;
    const spin = t * (2 + fan * 4) + phase;

    // 上方排烟管（到画面顶端）
    api.paint(ctx, api.shapes.poly([[-52, -300], [52, -300], [52, -210], [-52, -210]], 3), { wash: '#cfd6d4', sw: 2.8 });
    for (let i = 0; i < 4; i++) {
      api.inkLine(ctx, api.shapes.line(-52, -292 + i * 22, 52, -292 + i * 22, 0, 5, i + 2), 1.2, 'rgba(140,160,158,0.35)');
    }

    // 倒梯形罩体
    api.paint(ctx, api.shapes.poly([[-96, -212], [96, -212], [212, -110], [-212, -110]], 5), { wash: '#dfe4e0', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-96, -212], [-14, -212], [-70, -110], [-212, -110]], 4), { wash: '#ffffff', sw: 0, washOp: 0.25 });
    api.paint(ctx, api.shapes.poly([[40, -212], [96, -212], [212, -110], [120, -110]], 4), { wash: PAL.night, sw: 0, washOp: 0.1 });

    // 底部集烟罩（薄板 + 油网）
    api.paint(ctx, api.shapes.poly([[-212, -110], [212, -110], [206, -84], [-206, -84]], 3), { wash: '#b9c2c2', sw: 2.8 });
    api.paint(ctx, api.shapes.poly([[-190, -90], [190, -90], [186, -98], [-186, -98]], 3), { wash: '#7f8a8e', sw: 1.4 });
    // 风扇（透视椭圆）
    api.paint(ctx, api.shapes.ring(0, -128, 62, 20, 22), { wash: '#8f9b99', sw: 2.2, washOp: 0.85 });
    api.paint(ctx, api.shapes.ring(0, -128, 48, 15, 20), { wash: '#6b7376', sw: 0, washOp: 0.5 });
    for (let i = 0; i < 4; i++) {
      const a = spin + (i / 4) * Math.PI * 2;
      const blade: P2[] = [
        [0, -128],
        [Math.cos(a) * 44, -128 + Math.sin(a) * 13],
        [Math.cos(a + 0.7) * 26, -128 + Math.sin(a + 0.7) * 8],
      ];
      api.paint(ctx, api.shapes.poly(blade, 3), { wash: '#cfd6d4', sw: 1.6 });
    }
    api.paint(ctx, api.shapes.ring(0, -128, 8, 4, 12), { wash: '#3f464b', sw: 1.4 });
    // 油杯
    api.paint(ctx, api.shapes.poly([[-40, -84], [40, -84], [30, -62], [-30, -62]], 3), { wash: '#8f9b99', sw: 2, washOp: 0.9 });
    api.paint(ctx, api.shapes.poly([[-26, -74], [26, -74], [24, -64], [-24, -64]], 3), { wash: '#6b7376', sw: 0, washOp: 0.6 });

    // 控制面板（右侧按钮 + 灯）
    for (let i = 0; i < 3; i++) {
      api.paint(ctx, api.shapes.round(112 + i * 24, -150, 128 + i * 24, -134, 3, 3), { wash: '#6b7376', sw: 1.2 });
      api.paint(ctx, api.shapes.ring(120 + i * 24, -142, 4, 4, 8), { wash: i === 0 ? PAL.ochre : '#9aa3a5', sw: 0, washOp: 0.8 });
    }
    api.paint(ctx, api.shapes.round(112, -128, 184, -112, 3, 3), { wash: '#7f8a8e', sw: 1.2 });

    // 下方升起的蒸汽
    if (fan > 0.1) {
      for (let i = 0; i < 3; i++) {
        const pts: P2[] = [];
        for (let s = 0; s <= 7; s++) {
          const u = s / 7;
          pts.push([-120 + i * 120 + Math.sin(u * 5 + t * 1.8 + i * 2 + phase) * (8 + u * 10), -8 - u * 62]);
        }
        api.inkLine(ctx, pts, 2.2, `rgba(200,196,186,${0.28 * fan})`);
      }
    }
  },
};
