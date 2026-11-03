import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_car_sedan: ComponentDef<ClawdApi> = {
name: 'pr_car_sedan',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour sedan with a boxy body, trapezoid cabin, pale windows, two spoked wheels, bumpers, lights and door details; anchor is bottom centre, 470×215 px. It suits street traffic, parked curbside, or roadside scenes.',
  tags: ['catalog', 'vehicle', 'car', 'sedan', 'traffic', 'ground', 'watercolour'],
  size: [470, 215],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the bobbing and wheel-spin animation to desynchronise copies.' },
    speed: { type: 'number', default: 0.5, min: 0, max: 4, description: 'Scales the bobbing and wheel rotation; above 0.2 also adds a headlight glow.' },
    body: { type: 'enum', default: 'rose', options: ['rose', 'sky', 'ochre'], description: 'Selects the body wash colour: rose, sky blue, or ochre.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, speed = 0.5, body = 'rose' } = params as { phase?: number; speed?: number; body?: string };
    const { PAL } = api;
    const bodyWash = body === 'sky' ? '#9db9c4' : body === 'ochre' ? '#d3a74f' : '#c0766c';
    const dark = body === 'sky' ? '#6b8894' : body === 'ochre' ? '#a8802f' : '#94544c';
    const bob = Math.sin(t * 7 * speed + phase) * 1.2;
    const spin = t * 2.6 * speed + phase;

    api.paint(ctx, api.shapes.ring(0, -12, 206, 12, 24, 0, 0, 7), { wash: '#8b8172', sw: 0, washOp: 0.22 });

    ctx.save();
    ctx.translate(0, bob);

    const wheel = (x: number, r: number) => {
      api.paint(ctx, api.shapes.ring(x, -r, r, r, 24), { wash: '#3a4147', sw: 2.4 });
      api.paint(ctx, api.shapes.ring(x, -r, r * 0.5, r * 0.5, 18), { wash: '#d3ccbc', sw: 1.8 });
      for (let i = 0; i < 5; i++) {
        const a = spin + (i / 5) * Math.PI * 2;
        api.inkLine(ctx, api.shapes.line(x + Math.cos(a) * 4, -r + Math.sin(a) * 4, x + Math.cos(a) * r * 0.44, -r + Math.sin(a) * r * 0.44, 0, 3, i + 2), 2.4,
          'rgba(58,47,42,0.4)');
      }
    };
    wheel(-140, 38);
    wheel(146, 38);

    // 方正车身
    api.paint(
      ctx,
      api.shapes.poly([[-212, -40], [-216, -84], [-198, -100], [190, -100], [214, -84], [214, -40]], 3),
      { wash: bodyWash, sw: 3.2 }
    );
    // 后备箱 + 引擎盖（两段平直腰线）
    api.paint(ctx, api.shapes.poly([[-206, -100], [-118, -104], [-112, -134], [-198, -130]], 3), { wash: bodyWash, sw: 2.6 });
    api.paint(ctx, api.shapes.poly([[74, -104], [204, -100], [206, -84], [74, -88]], 3), { wash: bodyWash, sw: 2.6 });

    // 座舱（梯形，方角）
    api.paint(ctx, api.shapes.poly([[-124, -100], [-92, -152], [58, -152], [92, -100]], 3), { wash: bodyWash, sw: 3.2 });
    // 车窗：前挡 + 后窗 + 侧窗
    api.paint(ctx, api.shapes.poly([[-86, -146], [-64, -104], [-14, -104], [-14, -146]], 3), { wash: '#c6dade', sw: 2 });
    api.paint(ctx, api.shapes.poly([[-4, -146], [52, -146], [78, -104], [-4, -104]], 3), { wash: '#c6dade', sw: 2 });
    api.paint(ctx, api.shapes.poly([[-14, -146], [-4, -146], [-4, -104], [-14, -104]], 3), { wash: '#3a4147', sw: 0, washOp: 0.5 });
    api.paint(ctx, api.shapes.poly([[-84, -142], [-66, -108], [-24, -108], [-24, -142]], 3), { wash: '#ffffff', sw: 0, washOp: 0.16 });

    // 腰线 + 黑色防擦条
    api.inkLine(ctx, api.shapes.poly([[-206, -86], [208, -86]], 6), 2.2, 'rgba(58,47,42,0.35)');
    api.paint(ctx, api.shapes.poly([[-212, -62], [214, -62], [214, -52], [-212, -52]], 3), { wash: '#4a4f52', sw: 1.6 });

    // 前后保险杠
    api.paint(ctx, api.shapes.poly([[-218, -52], [-186, -52], [-186, -34], [-218, -34]], 3), { wash: '#4a4f52', sw: 1.6 });
    api.paint(ctx, api.shapes.poly([[190, -52], [220, -52], [220, -34], [190, -34]], 3), { wash: '#4a4f52', sw: 1.6 });

    // 方形大灯 + 转向灯
    api.paint(ctx, api.shapes.poly([[196, -92], [214, -92], [214, -74], [196, -74]], 3), { wash: '#f6ecc4', sw: 1.8 });
    api.paint(ctx, api.shapes.poly([[-214, -92], [-196, -92], [-196, -74], [-214, -74]], 3), { wash: '#c47f72', sw: 1.8 });
    if (speed > 0.2) {
      api.glow(ctx, 216, -82, 46, PAL.ochre, 0.16 + 0.08 * Math.sin(t * 4 + phase));
    }

    // 车门缝 + 把手
    for (let i = 0; i < 2; i++) {
      const x = -100 + i * 132;
      api.inkLine(ctx, api.shapes.poly([[x, -100], [x - 2, -46]], 4), 1.5, 'rgba(58,47,42,0.35)');
    }
    api.paint(ctx, api.shapes.round(-74, -96, -42, -88, 3), { wash: '#8f9b99', sw: 1.2 });
    api.paint(ctx, api.shapes.round(60, -96, 92, -88, 3), { wash: '#8f9b99', sw: 1.2 });

    // 轮眉 + 排气管
    api.inkLine(ctx, api.shapes.arc(-140, -38, 46, 46, Math.PI * 1.05, Math.PI * 1.95, 12), 2.6, dark);
    api.inkLine(ctx, api.shapes.arc(146, -38, 46, 46, Math.PI * 1.05, Math.PI * 1.95, 12), 2.6, dark);
    api.paint(ctx, api.shapes.ring(-158, -24, 8, 6, 10), { wash: '#9aa3a5', sw: 1.4 });

    ctx.restore();
  },
};
