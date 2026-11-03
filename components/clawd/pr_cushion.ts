import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_cushion: ComponentDef<ClawdApi> = {
name: 'pr_cushion',
  style: 'clawd',
  kind: 'prop',
  description: 'A plump square cushion with rounded, slightly drooping corners, a dimpled centre button, an inner seam and small tassels at each corner, painted in loose watercolour washes with a soft shadow beneath. It is 320×270 px with the anchor at the bottom centre, and works as a soft furnishing on a sofa, bed, bench or floor in a scene.',
  tags: ['catalog', 'household', 'cushion', 'pillow', 'decor', 'fabric', 'ground'],
  size: [320, 270],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that desynchronises the cushion\'s slow breathing wobble between copies.' },
    color: { type: 'enum', default: 'rose', options: ['rose', 'teal', 'ochre'], description: 'Fabric colour of the cushion body and button: rose, teal or ochre.' },
    squash: { type: 'number', default: 1, min: 0, max: 1, description: 'How far the animated breathing motion compresses and widens the body; 0 keeps it rigid, 1 gives full squash.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, color = 'rose', squash = 1 } = params as { phase?: number; color?: string; squash?: number };
    const { PAL } = api;
    const col = color === 'teal' ? '#7fb3ae' : color === 'ochre' ? '#d3a74f' : PAL.rose;
    const br = Math.sin(t * 1.3 + phase) * 2.4 * squash;
    const w = 128;
    const h = 108;

    api.paint(ctx, api.shapes.ring(0, -8, 138, 10, 22, 0, 0, 5), { wash: '#8b8172', sw: 0, washOp: 0.2 });

    // 枕体：大圆角的方形，四角微垂
    const body = api.shapes.round(-w - br, -2 * h - 22 + br * 0.5, w + br, -22 - br * 0.4, 46, 7);
    api.paint(ctx, body, { wash: col, sw: 3.2 });
    // 鼓起感：中间亮、四周暗
    api.paint(ctx, api.shapes.ring(0, -h - 22, w * 0.62, h * 0.56, 28, 0, 0.05, 6), { wash: '#ffffff', sw: 0, washOp: 0.2 });
    api.paint(ctx, api.shapes.poly([[-w, -h * 0.6 - 22], [-w, -h * 0.2 - 22], [w, -h * 0.2 - 22], [w, -h * 0.62 - 22]], 4), { wash: PAL.night, sw: 0, washOp: 0.06 });
    // 边缘缝线
    api.paint(ctx, api.shapes.round(-w + 16, -2 * h - 6, w - 16, -38, 34, 6), { wash: col, sw: 1.6, ink: 'rgba(140,90,84,0.45)' });
    api.inkLine(ctx, api.shapes.round(-w + 16, -2 * h - 6, w - 16, -38, 34, 6), 1.4, 'rgba(140,90,84,0.4)');
    // 布面褶皱
    for (let i = 0; i < 2; i++) {
      api.inkLine(ctx, api.shapes.line(-w + 30 + i * 150, -2 * h + 8, -w + 44 + i * 140, -52, 2, 6, i + 3), 1.2, 'rgba(255,255,255,0.25)');
    }
    // 中心扣
    api.paint(ctx, api.shapes.ring(0, -h - 22, 11, 11, 14), { wash: col, sw: 2 });
    api.paint(ctx, api.shapes.ring(0, -h - 22, 4.4, 4.4, 10), { wash: '#8f6b5f', sw: 0 });

    // 四角流苏
    for (let i = 0; i < 4; i++) {
      const sx = i === 0 || i === 3 ? -1 : 1;
      const sy = i < 2 ? -1 : 1;
      const cx = sx * (w - 6);
      const cy = -h - 22 + sy * (h - 6);
      // 流苏：一个填充的毛束 + 几根垂线
      api.paint(ctx, api.shapes.poly([[cx, cy], [cx + sx * 18, cy + sy * 3], [cx + sx * 15, cy + sy * 19], [cx + sx * 4, cy + sy * 17]], 3), {
        wash: '#b8827a',
        sw: 1.4,
      });
      for (let k = 0; k < 3; k++) {
        api.inkLine(ctx, api.shapes.line(cx + sx * (4 + k * 4), cy + sy * 16, cx + sx * (5 + k * 5), cy + sy * (24 + k * 2), 0, 3, i * 3 + k + 2), 2,
          'rgba(150,96,88,0.8)');
      }
      api.paint(ctx, api.shapes.ring(cx, cy, 6, 6, 10), { wash: '#c89a8f', sw: 1.2 });
    }
  },
};
