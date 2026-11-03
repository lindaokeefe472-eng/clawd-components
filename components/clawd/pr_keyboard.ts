import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_keyboard: ComponentDef<ClawdApi> = {
name: 'pr_keyboard',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour computer keyboard drawn in slight perspective, with four rows of twelve pale keycaps, a wide space bar, a loose cable curling off the right edge and faint teal ripple marks above it. Anchored at the bottom centre at 320×130 px, it suits desk and office scenes where a character types.',
  tags: ['catalog', 'keyboard', 'computer', 'desk', 'prop', 'ground', 'indoor'],
  size: [320, 130],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the key-press and ripple animation timing in radians so several keyboards in a scene do not move in sync.' },
    typing: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of typing activity: at 0 the ripples disappear, higher values make the teal press marks above the keys more visible.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, typing = 1 } = params as { phase?: number; typing?: number };
    const { PAL } = api;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -4, 140, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 键盘主体（上宽下窄的透视）
    api.paint(ctx, api.shapes.poly([[-146, -96], [146, -96], [126, -10], [-126, -10]], 4), { wash: '#e2e7e5', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-136, -88], [136, -88], [118, -18], [-118, -18]], 4), { wash: '#d3d9d7', sw: 0 });

    // 键帽
    for (let r = 0; r < 4; r++) {
      const y0 = -80 + r * 17;
      const inset = r * 3;
      for (let i = 0; i < 12; i++) {
        const x0 = -122 + inset + i * 20;
        const press = Math.sin(t * 6 + r * 3 + i * 1.7 + phase) > 0.86 ? 1.6 : 0;
        api.paint(ctx, api.shapes.poly([[x0, y0 + press], [x0 + 16, y0 + press], [x0 + 16, y0 + 12 + press], [x0, y0 + 12 + press]], 2), {
          wash: '#f6f8f6',
          sw: 1.1,
          ink: 'rgba(58,47,42,0.35)',
        });
      }
    }
    // 空格键
    api.paint(ctx, api.shapes.poly([[-56, -15], [56, -15], [52, -6], [-52, -6]], 2), { wash: '#f6f8f6', sw: 1.2, ink: 'rgba(58,47,42,0.35)' });

    // 一根线缆
    const cable: P2[] = [];
    for (let i = 0; i <= 10; i++) {
      const u = i / 10;
      cable.push([146 + u * 4, -60 + Math.sin(u * 6 + t * 1.2 + phase) * 3 + u * 24]);
    }
    api.inkLine(ctx, cable, 2.4, 'rgba(58,47,42,0.5)');

    // 敲击波纹
    if (typing > 0) {
      for (let i = 0; i < 3; i++) {
        const k = 0.5 + 0.5 * Math.sin(t * 3 + i * 2.1 + phase);
        api.inkLine(ctx, api.shapes.arc(-60 + i * 60, -104, 16 + k * 6, 5 + k * 3, Math.PI * 1.1, Math.PI * 1.9, 8), 1.6, `rgba(79,156,152,${0.3 * k * typing})`);
      }
    }
  },
};
