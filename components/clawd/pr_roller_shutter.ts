import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_roller_shutter: ComponentDef<ClawdApi> = {
name: 'pr_roller_shutter',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour roller shutter for a shopfront or garage: a grey corrugated metal curtain hanging from a top roller box, with a dark doorway behind, a pull handle, graffiti and tape, and a small number plate. It is 336×360 px with the anchor at bottom centre, suitable as a street-level facade prop that can be raised or lowered.',
  tags: ['catalog', 'facade', 'roller-shutter', 'metal', 'shopfront', 'street', 'ground'],
  size: [336, 360],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians (default 0); shifts the small wobble animation so multiple shutters do not move in sync.' },
    open: { type: 'number', default: 0.25, min: 0, max: 1, description: 'Open amount (default 0.25): 0 leaves the shutter fully shut, 1 lifts it fully open.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, open = 0.25 } = params as { phase?: number; open?: number };
    const lift = api.shapes.clamp01(open) * 260;
    const wob = Math.sin(t * 1.3 + phase) * 1.2;

    // 门洞（卷帘后面黑）
    api.paint(ctx, api.shapes.poly([[-160, -350], [160, -350], [160, -8], [-160, -8]], 3), { wash: '#b6ae9c', sw: 3 });
    api.paint(ctx, api.shapes.poly([[-138, -330], [138, -330], [138, -12], [-138, -12]], 3), { wash: '#33383d', sw: 2.4 });
    // 洞里的微光
    api.glow(ctx, 0, -120, 110, '#ffe7b0', 0.1);

    // 卷帘（瓦楞铁，自顶部垂下，open 越大抬得越高）
    const bottom = -330 + 14 + lift + wob;
    ctx.save();
    if (bottom < -14) {
      api.paint(ctx, api.shapes.poly([[-140, -338], [140, -338], [140, bottom], [-140, bottom]], 3), { wash: '#9aa3a5', sw: 3 });
      // 楞
      for (let y = -330; y < bottom - 4; y += 18) {
        api.inkLine(ctx, api.shapes.line(-136, y, 136, y, 0.6, 10, Math.round(y)), 2.2, 'rgba(58,47,42,0.22)');
        api.inkLine(ctx, api.shapes.line(-136, y + 5, 136, y + 5, 0.4, 8, Math.round(y) + 1), 1.2, 'rgba(246,239,223,0.35)');
      }
      // 底边加强条
      api.paint(ctx, api.shapes.poly([[-140, bottom], [140, bottom], [140, bottom + 16], [-140, bottom + 16]], 3), { wash: '#7f8a8e', sw: 2.6 });
      // 拉手
      api.paint(ctx, api.shapes.round(-22, bottom + 26, 22, bottom + 34, 4), { wash: '#6b7376', sw: 1.8 });
    }
    ctx.restore();

    // 卷轴箱
    api.paint(ctx, api.shapes.poly([[-148, -350], [148, -350], [148, -322], [-148, -322]], 3), { wash: '#8f9b99', sw: 3 });
    api.paint(ctx, api.shapes.ring(-130, -336, 8, 8, 12), { wash: '#6b7376', sw: 1.8 });
    api.paint(ctx, api.shapes.ring(130, -336, 8, 8, 12), { wash: '#6b7376', sw: 1.8 });

    // 卷帘上的涂鸦与胶带
    if (bottom < -120) {
      api.inkLine(ctx, [[-96, -250], [-70, -230], [-86, -206], [-58, -190]], 2.6, 'rgba(226,128,60,0.55)');
      api.inkLine(ctx, [[-40, -240], [-8, -240], [-8, -206], [-40, -206]], 2.4, 'rgba(79,156,152,0.5)');
      api.paint(ctx, api.shapes.poly([[24, -238], [70, -238], [76, -230], [30, -230]], 2), { wash: 'rgba(246,239,223,0.4)', sw: 0 });
    }
    // 底部地面的台阶
    api.paint(ctx, api.shapes.poly([[-160, -8], [160, -8], [168, 0], [-168, 0]], 3), { wash: '#a6a094', sw: 2.4 });
    // 门牌号
    api.paint(ctx, api.shapes.round(-22, -318, 22, -300, 3), { wash: '#efe2c0', sw: 1.6 });
  },
};
