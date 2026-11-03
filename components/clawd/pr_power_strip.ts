import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_power_strip: ComponentDef<ClawdApi> = {
name: 'pr_power_strip',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour extension lead seen slightly from above: a long pale rounded body with four sockets, a rocker switch with a blinking orange indicator, and up to two plugs with trailing cords. Anchored at bottom centre and 400×170 px, it suits desks, floors or workshop scenes as a small electrical prop.',
  tags: ['catalog', 'household', 'power-strip', 'electrical', 'prop', 'floor', 'desk'],
  size: [400, 170],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the blinking indicator and cord sway; change it to desynchronise multiple strips.' },
    on: { type: 'number', default: 1, min: 0, max: 1, description: 'Turns the strip on or off; values above 0.5 light the switch and make the orange indicator blink.' },
    plugs: { type: 'number', default: 2, min: 0, max: 4, description: 'Number of plugs to show plugged in; the artwork draws up to two plug shapes.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, on = 1, plugs = 2 } = params as { phase?: number; on?: number; plugs?: number };
    const { PAL } = api;
    const blink = 0.6 + 0.4 * Math.sin(t * 2.2 + phase);

    api.paint(ctx, api.shapes.ring(0, -8, 176, 9, 22, 0, 0, 5), { wash: '#8b8172', sw: 0, washOp: 0.18 });

    // 插排主体（斜放的圆角长条）
    api.paint(ctx, api.shapes.round(-176, -84, 176, -24, 10, 5), { wash: '#e2e7e5', sw: 3.2 });
    api.paint(ctx, api.shapes.round(-168, -78, 168, -32, 8, 4), { wash: '#f2f5f2', sw: 0, washOp: 0.7 });

    // 四个插孔（每个孔 = 圆 + 两个插槽）
    for (let i = 0; i < 4; i++) {
      const cx = -132 + i * 62;
      api.paint(ctx, api.shapes.ring(cx, -55, 24, 20, 18), { wash: '#d3dad6', sw: 2 });
      api.paint(ctx, api.shapes.ring(cx, -55, 18, 15, 16), { wash: '#b9c2c2', sw: 0, washOp: 0.7 });
      for (let s = 0; s < 2; s++) {
        api.paint(ctx, api.shapes.round(cx - 9 + s * 12, -60, cx - 5 + s * 12, -50, 2, 3), { wash: '#4a5155', sw: 0 });
      }
    }
    // 总开关 + 指示灯
    api.paint(ctx, api.shapes.round(116, -76, 158, -44, 5, 4), { wash: on > 0.5 ? '#b9c2c2' : '#cfd6d4', sw: 1.8 });
    api.paint(ctx, api.shapes.round(120, -72, 136, -48, 3, 3), { wash: on > 0.5 ? PAL.sap : '#8f9b99', sw: 1 });
    if (on > 0.5) {
      api.paint(ctx, api.shapes.ring(148, -60, 5, 5, 10), { wash: PAL.orange, sw: 0, washOp: blink });
      api.glow(ctx, 148, -60, 22, PAL.orange, 0.2 * blink);
    }

    // 插上的两个插头
    if (plugs > 0) {
      api.paint(ctx, api.shapes.poly([[-154, -84], [-110, -84], [-104, -122], [-148, -128]], 4), { wash: '#4a5155', sw: 2.4 });
      api.paint(ctx, api.shapes.round(-146, -118, -108, -104, 4, 3), { wash: '#6b7376', sw: 1.4 });
      // 电线
      const cord: P2[] = [];
      for (let i = 0; i <= 8; i++) {
        const u = i / 8;
        cord.push([api.shapes.lerp(-128, -186, u) + Math.sin(u * 3) * 6, api.shapes.lerp(-126, -40, u)]);
      }
      api.inkLine(ctx, cord, 4, '#3f464b');
    }
    if (plugs > 1) {
      api.paint(ctx, api.shapes.poly([[-30, -84], [14, -84], [20, -120], [-24, -124]], 4), { wash: PAL.rose, sw: 2.4 });
      const cord: P2[] = [];
      for (let i = 0; i <= 8; i++) {
        const u = i / 8;
        cord.push([api.shapes.lerp(-4, 60, u), api.shapes.lerp(-124, -8, u) + Math.sin(u * 4 + phase) * 10]);
      }
      api.inkLine(ctx, cord, 4, PAL.rose);
    }

    // 电源线（从左端接到画面外）
    const main: P2[] = [];
    for (let i = 0; i <= 10; i++) {
      const u = i / 10;
      main.push([api.shapes.lerp(-176, -196, u) - u * 4, api.shapes.lerp(-54, -20, u) + Math.sin(u * 3.4) * 8]);
    }
    api.inkLine(ctx, main, 5, '#3f464b');
    api.paint(ctx, api.shapes.round(-196, -60, -176, -44, 4, 3), { wash: '#6b7376', sw: 1.6 });
  },
};
