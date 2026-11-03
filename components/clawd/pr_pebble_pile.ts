import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const pr_pebble_pile: ComponentDef<ClawdApi> = {
name: 'pr_pebble_pile',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour cluster of rounded pebbles arranged in layered rows, with small scattered stones, soft highlights, contact shadows, and a faint wet-sand ring. It is anchored at the bottom centre and measures 320×170 px, suitable for ground cover, rocky patches, or shoreline details.',
  tags: ['catalog', 'terrain', 'pebble', 'pile', 'ground', 'prop', 'watercolor'],
  size: [320, 170],
  params: {
    wet: { type: 'number', default: 0.6, min: 0, max: 1, description: 'Controls the strength of the damp sheen and wet ground tint; higher values make the pile look wetter.' },
  },
  draw(api, params) {
    const ctx = api.ctx;
    const { wet = 0.6 } = params as { wet?: number };
    const { PAL } = api;

    // 湿沙 / 地面
    api.paint(ctx, api.shapes.ring(0, -18, 152, 16, 24, 0, 0.06, 3), { wash: '#c8bfae', sw: 0, washOp: 0.5 });
    api.paint(ctx, api.shapes.ring(0, -12, 118, 13, 20, 0, 0.08, 7), { wash: '#8fb6c6', sw: 0, washOp: 0.18 * wet });

    // 鹅卵石：大小不一、颜色分层，用确定性哈希布点
    const pebble = (x: number, y: number, rx: number, ry: number, rot: number, col: string, seed: number) => {
      api.paint(ctx, api.shapes.ring(x, y, rx, ry, 16, rot, 0.1, seed), { wash: col, sw: 2 });
      // 高光
      api.paint(ctx, api.shapes.ring(x - rx * 0.3, y - ry * 0.36, rx * 0.4, ry * 0.3, 10, rot, 0.06, seed + 2), {
        wash: '#ffffff',
        sw: 0,
        washOp: 0.45,
      });
      // 底部投影
      api.paint(ctx, api.shapes.ring(x + rx * 0.1, y + ry * 0.55, rx * 0.8, ry * 0.28, 10, rot, 0.08, seed + 4), {
        wash: PAL.night,
        sw: 0,
        washOp: 0.12,
      });
    };

    // 后排（大石）
    pebble(-96, -52, 44, 30, -0.12, '#a79c88', 3);
    pebble(6, -62, 52, 34, 0.08, '#b8ae9c', 7);
    pebble(96, -48, 40, 26, 0.16, '#a79c88', 11);
    // 中排
    pebble(-128, -30, 32, 22, 0.2, '#c2b8a6', 13);
    pebble(-46, -32, 36, 24, -0.06, '#9d9483', 17);
    pebble(50, -34, 34, 22, 0.1, '#c8bfae', 19);
    pebble(126, -26, 28, 19, -0.14, '#b8ae9c', 23);
    // 前排（小石）
    pebble(-86, -16, 24, 16, 0.14, '#8f8a78', 27);
    pebble(-14, -15, 26, 17, -0.1, '#c2b8a6', 29);
    pebble(64, -16, 22, 15, 0.06, '#a79c88', 31);
    // 零散小石
    for (let i = 0; i < 6; i++) {
      const x = -140 + api.shapes.hash(i + 5) * 280;
      const y = -10 - api.shapes.hash(i + 15) * 8;
      api.paint(ctx, api.shapes.ring(x, y, 6 + api.shapes.hash(i) * 5, 4.4, 9), { wash: '#b8ae9c', sw: 1 });
    }
    // 一颗带纹路的石头
    api.inkLine(ctx, api.shapes.arc(6, -62, 40, 24, Math.PI * 1.15, Math.PI * 1.85, 12), 1.6, 'rgba(120,112,96,0.45)');
    api.inkLine(ctx, api.shapes.arc(6, -56, 34, 20, Math.PI * 1.2, Math.PI * 1.8, 12), 1.2, 'rgba(120,112,96,0.35)');
    // 一点水光
    api.paint(ctx, api.shapes.ring(-30, -40, 90, 12, 20, 0, 0.1, 33), { wash: '#cfe0e2', sw: 0, washOp: 0.22 * wet });
  },
};
