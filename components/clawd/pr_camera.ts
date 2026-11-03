import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_camera: ComponentDef<ClawdApi> = {
name: 'pr_camera',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour camera with a dark grey body, round lens with focus-ring ticks, viewfinder hump, ochre shutter button, dial, flash window and a looped carry strap. It is anchored at the bottom centre and measures 260×218 px, so it sits on a desk, shelf or tabletop in a photo, travel or studio scene.',
  tags: ['catalog', 'camera', 'prop', 'desk', 'decor', 'handheld', 'watercolour'],
  size: [260, 218],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the timing of the periodic flash so multiple cameras do not flash in sync.' },
    flash: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the brief flashing glow and white burst from the flash window; 0 disables the flash entirely.' },
    strap: { type: 'number', default: 1, min: 0, max: 1, description: 'Draws the carry strap arc above the body when above 0; 0 removes the strap.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, flash = 1, strap = 1 } = params as { phase?: number; flash?: number; strap?: number };
    const { PAL } = api;
    const flap = Math.max(0, Math.sin(t * 0.9 + phase) - 0.85) / 0.15;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 106, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 背带
    if (strap > 0) {
      api.inkLine(ctx, api.shapes.arc(0, -150, 96, 60, Math.PI * 1.1, Math.PI * 1.9, 20), 5, 'rgba(120,85,60,0.8)');
    }

    // 机身
    api.paint(ctx, api.shapes.round(-108, -140, 108, -18, 12, 6), { wash: '#5a5f63', sw: 3.6 });
    // 顶盖与皮革纹理
    api.paint(ctx, api.shapes.poly([[-108, -140], [108, -140], [104, -124], [-104, -124]], 3), { wash: '#4a4f53', sw: 2.4 });
    api.paint(ctx, api.shapes.poly([[-96, -96], [96, -96], [92, -30], [-92, -30]], 3), { wash: '#6c7276', sw: 0, washOp: 0.6 });

    // 取景器
    api.paint(ctx, api.shapes.poly([[-38, -152], [16, -152], [12, -138], [-34, -138]], 3), { wash: '#3f4448', sw: 2.4 });
    // 快门按钮
    api.paint(ctx, api.shapes.ring(64, -146, 11, 6, 12), { wash: PAL.ochre, sw: 2.2 });
    // 拨盘
    api.paint(ctx, api.shapes.ring(96, -132, 9, 5, 12), { wash: '#b9c1c0', sw: 1.8 });

    // 镜头
    api.paint(ctx, api.shapes.ring(-8, -78, 52, 50, 34, 0, 0.01, 4), { wash: '#3f4448', sw: 3.4 });
    api.paint(ctx, api.shapes.ring(-8, -78, 40, 38, 30, 0, 0.01, 8), { wash: '#6b7d86', sw: 2.4 });
    api.paint(ctx, api.shapes.ring(-12, -82, 22, 21, 22, 0, 0.02, 12), { wash: '#274049', sw: 2 });
    api.paint(ctx, api.shapes.ring(-20, -92, 8, 7, 12, -0.4), { wash: '#bfe0e6', sw: 0, washOp: 0.55 });
    // 对焦环刻度
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      api.inkLine(ctx, [
        [-8 + Math.cos(a) * 44, -78 + Math.sin(a) * 42],
        [-8 + Math.cos(a) * 49, -78 + Math.sin(a) * 47],
      ], 1.4, 'rgba(246,239,223,0.35)');
    }

    // 闪光灯窗
    api.paint(ctx, api.shapes.poly([[62, -122], [96, -122], [94, -104], [60, -104]], 3), { wash: '#e9e2c8', sw: 2 });

    // 闪光
    if (flash > 0 && flap > 0) {
      api.glow(ctx, 78, -112, 70, '#fff6d0', 0.8 * flap);
      api.paint(ctx, api.shapes.ring(78, -112, 16 * flap, 16 * flap, 16), { wash: '#ffffff', sw: 0, washOp: 0.9 * flap });
    }

    // 皮革接缝
    for (let i = 0; i < 5; i++) {
      api.inkLine(ctx, api.shapes.line(-96 + i * 48, -34, -88 + i * 48, -28, 0, 3, i + 2), 1.2, 'rgba(246,239,223,0.3)');
    }
  },
};
