import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_car_vintage: ComponentDef<ClawdApi> = {
name: 'pr_car_vintage',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour side view of a vintage automobile with a rounded cabin, two split windows, spoked wheels under curved fenders, a chrome grille, a headlamp, a rear spare tyre and a running board. The 450×260 px prop is anchored at its bottom centre and gently bobs with spinning wheels, making it suitable for period street scenes or a parked vehicle at the kerb.',
  tags: ['catalog', 'vehicle', 'car', 'vintage', 'ground', 'watercolour', 'transport'],
  size: [450, 260],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the bobbing and wheel-spin cycle in radians so several copies do not move in sync.' },
    speed: { type: 'number', default: 0.5, min: 0, max: 4, description: 'Animation rate: higher values bob and spin the wheels faster, brighten the headlamp glow and add dust puffs behind the car.' },
    body: { type: 'enum', default: 'teal', options: ['teal', 'rose', 'ochre'], description: 'Paint colour of the bodywork; teal-green, dusty rose or warm ochre, each with a matching darker shade for shading.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, speed = 0.5, body = 'teal' } = params as { phase?: number; speed?: number; body?: string };
    const { PAL } = api;
    const bodyWash = body === 'rose' ? '#c47f72' : body === 'ochre' ? '#d3a74f' : '#4e8a86';
    const bodyDark = body === 'rose' ? '#96584f' : body === 'ochre' ? '#a8802f' : '#356360';
    const bob = Math.sin(t * 6 * speed + phase) * 1.6;
    const spin = t * 2 * speed + phase;

    api.paint(ctx, api.shapes.ring(0, -13, 196, 13, 24, 0, 0, 9), { wash: '#8b8172', sw: 0, washOp: 0.24 });

    ctx.save();
    ctx.translate(0, bob);

    // 车轮
    const wheel = (x: number, r: number) => {
      api.paint(ctx, api.shapes.ring(x, -r, r, r, 26), { wash: '#3d444a', sw: 2.4 });
      api.paint(ctx, api.shapes.ring(x, -r, r * 0.56, r * 0.56, 20), { wash: '#d5cdbb', sw: 1.8 });
      api.paint(ctx, api.shapes.ring(x, -r, r * 0.18, r * 0.18, 12), { wash: '#8f9b99', sw: 1 });
      for (let i = 0; i < 4; i++) {
        const a = spin + (i / 4) * Math.PI * 2;
        api.inkLine(ctx, api.shapes.line(x + Math.cos(a) * r * 0.2, -r + Math.sin(a) * r * 0.2, x + Math.cos(a) * r * 0.52, -r + Math.sin(a) * r * 0.52, 0, 3, i + 2),
          1.6, 'rgba(58,47,42,0.32)');
      }
    };
    wheel(-132, 48);
    wheel(136, 48);

    // 前后翼子板（大弧形包住车轮）
    const fender = (cx: number, r0: number, r1: number, a0: number, a1: number) => {
      const outer = api.shapes.arc(cx, -48, r1, r1, Math.PI * a0, Math.PI * a1, 16);
      const inner = api.shapes.arc(cx, -48, r0, r0, Math.PI * a1, Math.PI * a0, 16);
      api.paint(ctx, outer.concat(inner), { wash: bodyWash, sw: 2.6 });
      api.inkLine(ctx, api.shapes.arc(cx, -48, (r0 + r1) / 2, (r0 + r1) / 2, Math.PI * a0, Math.PI * a1, 12), 1.6, 'rgba(255,246,230,0.45)');
    };
    // 主车身（圆润卧舱）
    api.paint(ctx, api.shapes.round(-188, -116, 188, -56, 26, 7), { wash: bodyWash, sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-184, -56], [184, -56], [180, -74], [-180, -74]], 4), { wash: bodyDark, sw: 0, washOp: 0.32 });
    // 翼子板压在车身上（形成轮眉）
    fender(-132, 48, 74, 1.0, 2.0);
    fender(136, 48, 78, 1.0, 2.0);

    // 引擎盖（向右略微下倾）+ 中缝
    api.paint(ctx, api.shapes.poly([[34, -116], [166, -122], [182, -108], [182, -70], [34, -90]], 4), { wash: bodyWash, sw: 2.8 });
    api.inkLine(ctx, api.shapes.line(36, -104, 178, -96, 1, 8, 3), 1.8, 'rgba(58,47,42,0.3)');
    // 立标
    api.paint(ctx, api.shapes.ring(172, -128, 4, 7, 10), { wash: PAL.ochre, sw: 1.2 });

    // 座舱（圆顶 + 分体风挡）
    api.paint(
      ctx,
      api.shapes.poly([[-150, -74], [-156, -166], [-136, -204], [-64, -218], [18, -216], [50, -190], [62, -74]], 6),
      { wash: bodyWash, sw: 3.2 }
    );
    // 侧窗（两个圆顶窗）
    api.paint(ctx, api.shapes.round(-134, -198, -58, -140, 14, 5), { wash: '#cfe0e2', sw: 2.2 });
    api.paint(ctx, api.shapes.round(-46, -202, 26, -142, 14, 5), { wash: '#cfe0e2', sw: 2.2 });
    api.paint(ctx, api.shapes.poly([[-128, -192], [-72, -192], [-74, -148], [-126, -146]], 4), { wash: '#ffffff', sw: 0, washOp: 0.2 });
    // 车窗框（木/金属细条）
    api.inkLine(ctx, api.shapes.line(-52, -200, -52, -142, 0, 5, 4), 3, 'rgba(58,47,42,0.5)');
    // 车顶高光
    api.paint(ctx, api.shapes.arc(-22, -216, 74, 12, Math.PI * 1.06, Math.PI * 1.9, 12), { wash: '#ffffff', sw: 0, washOp: 0.16 });

    // 后部行李箱斜背
    api.paint(ctx, api.shapes.poly([[-188, -116], [-152, -122], [-150, -164], [-180, -150], [-190, -130]], 4), { wash: bodyWash, sw: 2.6 });

    // 前格栅（镀铬竖条）
    api.paint(ctx, api.shapes.poly([[176, -112], [196, -108], [196, -58], [176, -62]], 4), { wash: '#d9d2c2', sw: 2.4 });
    for (let i = 0; i < 5; i++) {
      api.inkLine(ctx, api.shapes.line(179, -102 + i * 9, 194, -100 + i * 9, 0, 3, i + 2), 1.4, 'rgba(58,47,42,0.42)');
    }
    // 前后保险杠
    api.paint(ctx, api.shapes.poly([[186, -58], [202, -56], [202, -46], [186, -48]], 3), { wash: '#cfc8b8', sw: 1.8 });
    api.paint(ctx, api.shapes.poly([[-198, -58], [-182, -60], [-182, -50], [-198, -48]], 3), { wash: '#cfc8b8', sw: 1.8 });

    // 大灯（挂在翼子板与格栅之间）
    api.paint(ctx, api.shapes.ring(168, -100, 15, 15, 18), { wash: '#d9d2c2', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(169, -100, 9, 9, 14), { wash: '#f8edc6', sw: 0 });
    if (speed > 0.2) {
      api.glow(ctx, 186, -100, 52, PAL.ochre, 0.16 + 0.08 * Math.sin(t * 4 + phase));
    }

    // 踏板 + 门缝 + 把手 + 备胎
    api.paint(ctx, api.shapes.poly([[-92, -54], [100, -54], [100, -42], [-92, -42]], 3), { wash: '#6d5a45', sw: 1.8 });
    api.inkLine(ctx, api.shapes.poly([[-6, -110], [-2, -132], [2, -56], [-4, -56]], 3), 1.6, 'rgba(58,47,42,0.38)');
    api.paint(ctx, api.shapes.round(-16, -118, 6, -108, 3), { wash: '#8f9b99', sw: 1.2 });
    api.paint(ctx, api.shapes.ring(-196, -100, 28, 28, 22), { wash: '#3d444a', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(-196, -100, 14, 14, 14), { wash: '#cfc8b8', sw: 1.6 });
    api.inkLine(ctx, api.shapes.line(-196, -128, -196, -72, 0, 4, 6), 1.4, 'rgba(58,47,42,0.3)');

    // 排气管
    api.paint(ctx, api.shapes.ring(-146, -32, 9, 7, 12), { wash: '#9aa3a5', sw: 1.6 });
    ctx.restore();

    // 扬尘
    if (speed > 0.3) {
      for (let i = 0; i < 3; i++) {
        const k = (t * 0.5 + i * 0.33) % 1;
        api.paint(ctx, api.shapes.ring(-188 - k * 8, -16 - k * 12, 7 + k * 12, 5 + k * 8, 12, 0, 0.15, i + 3), {
          wash: '#b7ae9c',
          sw: 0,
          washOp: 0.2 * (1 - k) * speed,
        });
      }
    }
  },
};
