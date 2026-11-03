import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_motorcycle: ComponentDef<ClawdApi> = {
name: 'pr_motorcycle',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour side view of a motorcycle with two spoked wheels, mudguards, a teardrop fuel tank, stepped seat, finned engine block, curved exhaust pipe, headlamp and mirrors. It is 510×290 px with its anchor at the bottom centre, and works as a parked or idling street prop in roadside and town scenes.',
  tags: ['catalog', 'motorcycle', 'vehicle', 'traffic', 'ground', 'watercolour'],
  size: [510, 290],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the idle bob and exhaust cycle, used to desynchronise multiple copies.' },
    idle: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of engine idling: vertical bob of the body and puffing exhaust from the tailpipe; 0 freezes it completely.' },
    tank: { type: 'enum', default: 'ochre', options: ['ochre', 'teal', 'rose'], description: 'Colour scheme of the fuel tank and mudguards: warm ochre, blue-green teal, or dusty rose.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, idle = 1, tank = 'ochre' } = params as { phase?: number; idle?: number; tank?: string };
    const { PAL } = api;
    const tankWash = tank === 'teal' ? '#4e8a86' : tank === 'rose' ? '#c47f72' : '#d3a74f';
    const tankDark = tank === 'teal' ? '#356360' : tank === 'rose' ? '#96584f' : '#a8802f';
    const vib = Math.sin(t * 26 + phase) * 0.7 * idle;

    api.paint(ctx, api.shapes.ring(0, -12, 212, 12, 24, 0, 0, 5), { wash: '#8b8172', sw: 0, washOp: 0.22 });

    ctx.save();
    ctx.translate(0, vib);

    // 车轮
    const wheel = (x: number, r: number) => {
      api.paint(ctx, api.shapes.ring(x, -r, r, r, 28), { wash: '#3a4147', sw: 3 });
      api.paint(ctx, api.shapes.ring(x, -r, r * 0.8, r * 0.8, 24), { wash: '#cfc8b8', sw: 1.2, washOp: 0.55 });
      api.paint(ctx, api.shapes.ring(x, -r, r * 0.15, r * 0.15, 12), { wash: '#8f9b99', sw: 1.4 });
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + 0.25;
        api.inkLine(ctx, api.shapes.line(x + Math.cos(a) * r * 0.17, -r + Math.sin(a) * r * 0.17, x + Math.cos(a) * r * 0.72, -r + Math.sin(a) * r * 0.72, 0, 2, i + 3),
          1, 'rgba(58,47,42,0.26)');
      }
    };
    wheel(-156, 56);
    wheel(160, 56);

    // 后挡泥板 + 前挡泥板（贴着轮子）
    api.paint(ctx, api.shapes.arc(-156, -56, 72, 72, Math.PI * 1.1, Math.PI * 1.94, 12).concat(api.shapes.arc(-156, -56, 62, 62, Math.PI * 1.94, Math.PI * 1.1, 12)), {
      wash: tankWash,
      sw: 2.4,
    });
    api.paint(ctx, api.shapes.arc(160, -56, 74, 74, Math.PI * 1.06, Math.PI * 1.6, 10).concat(api.shapes.arc(160, -56, 64, 64, Math.PI * 1.6, Math.PI * 1.06, 10)), {
      wash: tankWash,
      sw: 2.4,
    });

    // 前叉两根 + 车把
    api.inkLine(ctx, api.shapes.line(160, -110, 128, -212, 3, 8, 2), 7, '#8f9b99');
    api.inkLine(ctx, api.shapes.line(150, -110, 120, -208, 2, 8, 3), 4, '#c9c3b4');
    api.inkLine(ctx, api.shapes.line(96, -232, 152, -214, 4, 6, 4), 5, '#3f464b');
    api.paint(ctx, api.shapes.ring(94, -234, 8, 8, 12), { wash: '#3a4147', sw: 1.6 });
    api.paint(ctx, api.shapes.ring(154, -212, 7, 7, 12), { wash: '#3a4147', sw: 1.6 });
    // 后视镜
    api.inkLine(ctx, api.shapes.line(120, -228, 108, -254, 0, 4, 5), 2.6, '#6b7376');
    api.paint(ctx, api.shapes.ring(105, -258, 8, 6, 12), { wash: '#cfc8b8', sw: 1.4 });

    // 大灯
    api.paint(ctx, api.shapes.ring(148, -172, 20, 18, 18), { wash: '#d9d2c2', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(150, -172, 12, 11, 14), { wash: '#f8edc6', sw: 0 });
    api.glow(ctx, 164, -172, 48, PAL.ochre, 0.16 + 0.06 * Math.sin(t * 3 + phase));

    // 车架主梁
    api.inkLine(ctx, api.shapes.line(122, -166, -62, -150, 2, 7, 4), 6, '#6b7376');
    api.inkLine(ctx, api.shapes.line(-62, -150, -86, -96, 1, 6, 5), 6, '#6b7376');
    api.inkLine(ctx, api.shapes.line(122, -150, -6, -84, 1, 7, 6), 5, '#6b7376');

    // 油箱（水滴形）
    api.paint(
      ctx,
      api.shapes.poly([[92, -184], [56, -192], [4, -188], [-26, -172], [-22, -146], [16, -140], [66, -148], [92, -164]], 5),
      { wash: tankWash, sw: 3 }
    );
    api.paint(ctx, api.shapes.poly([[76, -180], [30, -186], [-6, -176], [0, -168], [56, -168]], 4), { wash: '#ffffff', sw: 0, washOp: 0.22 });
    api.paint(ctx, api.shapes.poly([[16, -140], [66, -148], [64, -158], [12, -152]], 3), { wash: tankDark, sw: 0, washOp: 0.4 });
    api.paint(ctx, api.shapes.ring(52, -190, 8, 4, 12), { wash: '#c9c3b4', sw: 1.4 });
    // 油箱徽标
    api.paint(ctx, api.shapes.ring(40, -164, 9, 9, 12), { wash: PAL.paper, sw: 1.2, washOp: 0.8 });

    // 座垫（后跷）+ 车尾
    api.paint(ctx, api.shapes.poly([[-158, -152], [-60, -158], [-52, -138], [-150, -132]], 4), { wash: '#3f342b', sw: 2.6 });
    api.paint(ctx, api.shapes.poly([[-176, -156], [-150, -156], [-146, -134], [-174, -132]], 4), { wash: '#3f342b', sw: 2.2 });
    api.paint(ctx, api.shapes.poly([[-150, -132], [-56, -138], [-56, -128], [-148, -124]], 3), { wash: '#5a4b3c', sw: 1.6 });

    // 发动机：缸体 + 散热片 + 曲轴箱
    api.paint(ctx, api.shapes.round(-16, -128, 58, -74, 8), { wash: '#8b949a', sw: 2.6 });
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-10, -118 + i * 14, 52, -118 + i * 14, 0, 5, i + 2), 2, 'rgba(58,47,42,0.32)');
    }
    api.paint(ctx, api.shapes.ring(-42, -88, 26, 24, 20), { wash: '#7f8a8e', sw: 2.6 });
    api.paint(ctx, api.shapes.ring(-42, -88, 13, 12, 14), { wash: '#c9c3b4', sw: 1.6 });
    api.paint(ctx, api.shapes.ring(-42, -88, 4, 4, 10), { wash: '#6b7376', sw: 1 });

    // 排气管：从缸体前下方绕到车尾
    const pipe: P2[] = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12;
      pipe.push([api.shapes.lerp(58, -150, u), api.shapes.lerp(-70, -58, u) + Math.sin(u * Math.PI) * 4]);
    }
    api.inkLine(ctx, pipe, 7, '#b9b2a2');
    api.inkLine(ctx, pipe, 3, 'rgba(246,239,223,0.5)');
    api.paint(ctx, api.shapes.poly([[-150, -72], [-206, -68], [-206, -52], [-150, -56]], 4), { wash: '#c9c3b4', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(-208, -62, 8, 8, 12), { wash: '#6b7376', sw: 1.6 });

    // 后减震 + 摇臂 + 尾灯
    api.inkLine(ctx, api.shapes.line(-146, -140, -160, -62, 2, 6, 5), 7, '#6b7376');
    api.inkLine(ctx, api.shapes.line(-60, -78, -156, -58, 1, 6, 7), 5, '#8f9b99');
    api.paint(ctx, api.shapes.poly([[-196, -128], [-178, -126], [-178, -112], [-196, -114]], 3), { wash: PAL.rose, sw: 1.8 });
    api.glow(ctx, -198, -120, 24, PAL.rose, 0.18);

    // 侧撑 + 脚踏
    api.inkLine(ctx, api.shapes.line(-30, -62, -8, -18, 2, 5, 6), 3.4, '#4a4f52');
    api.paint(ctx, api.shapes.round(-18, -56, 2, -48, 2), { wash: '#4a4f52', sw: 1.2 });
    ctx.restore();

    // 怠速排气
    if (idle > 0.3) {
      for (let i = 0; i < 2; i++) {
        const k = (t * 0.6 + i * 0.5) % 1;
        api.paint(ctx, api.shapes.ring(-212 - k * 20, -70 - k * 16, 6 + k * 10, 5 + k * 8, 12, 0, 0.15, i + 2), {
          wash: '#b7ae9c',
          sw: 0,
          washOp: 0.24 * (1 - k) * idle,
        });
      }
    }
  },
};
