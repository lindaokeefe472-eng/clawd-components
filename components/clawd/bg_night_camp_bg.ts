import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const bg_night_camp_bg: ComponentDef<ClawdApi> = {
name: 'bg_night_camp_bg',
  style: 'clawd',
  kind: 'background',
  description: 'A watercolour night-campsite backdrop, 1920×1080 with its anchor at the bottom centre: a dark blue sky with twinkling stars and a cratered moon, thin drifting cloud bands, two layered mountain ridges, a row of pine silhouettes, near-black ground, a warm campfire glow at centre-right, and foreground grass with drifting fireflies. Used as a full-frame night scene behind camp, forest or fireside subjects. The near ground line is about y 972 (standing band y 960-1020); the campfire glow sits at about x 1180, y 1010.',
  tags: ['catalog', 'background', 'night', 'camp', 'landscape', 'moon', 'watercolour', 'sky'],
  size: [1920, 1080],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the twinkle, cloud drift, flame flicker and firefly cycles, so copies of the background do not animate in sync.' },
    moon: { type: 'number', default: 1, min: 0, max: 1, description: 'Visibility of the moon: at 0 the moon disc and its halo disappear, at 1 the full moon with craters and bright glow is drawn.' },
    fire: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the warm campfire glow on the ground at centre-right; 0 removes the glow entirely, 1 gives the brightest flickering pool of light.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, moon = 1, fire = 1 } = params as { phase?: number; moon?: number; fire?: number };

    // 夜空底色
    ctx.save();
    ctx.fillStyle = '#1e2a3e';
    ctx.fillRect(0, 0, 1920, 1080);
    ctx.restore();
    // 地平线附近的微亮与银河
    api.glow(ctx, 900, 1040, 900, '#42577a', 0.16);
    api.glow(ctx, 620, 300, 620, '#4a5f86', 0.1);
    api.glow(ctx, 1480, 230, 420, '#8aa8c8', 0.14 * moon);

    // 星星
    for (let i = 0; i < 90; i++) {
      const x = api.shapes.hash(i * 1.37) * 1920;
      const y = api.shapes.hash(i * 2.71 + 3) * 700;
      const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.6 + i * 1.9 + phase));
      const r = 1.2 + api.shapes.hash(i + 9) * 1.6;
      api.paint(ctx, api.shapes.ring(x, y, r * tw, r * tw, 6), { wash: '#fdf3d4', sw: 0, washOp: 0.25 + 0.6 * tw });
      if (i % 11 === 0) {
        api.glow(ctx, x, y, r * 7 * tw, '#ffeec2', 0.2 * tw);
        api.inkLine(ctx, [[x - r * 3, y], [x + r * 3, y]], 1.1, `rgba(253,243,212,${0.45 * tw})`);
        api.inkLine(ctx, [[x, y - r * 3], [x, y + r * 3]], 1.1, `rgba(253,243,212,${0.45 * tw})`);
      }
    }

    // 月亮
    if (moon > 0) {
      api.glow(ctx, 1480, 230, 170, '#f2f6fb', 0.3 * moon);
      api.paint(ctx, api.shapes.ring(1480, 230, 82, 82, 38, 0, 0.02, 4), { wash: '#f4f2e0', sw: 2.6, washOp: 0.96 });
      api.paint(ctx, api.shapes.ring(1458, 208, 19, 17, 14, 0.3), { wash: '#dcd9c6', sw: 0, washOp: 0.5 });
      api.paint(ctx, api.shapes.ring(1502, 252, 12, 11, 12, -0.2), { wash: '#dcd9c6', sw: 0, washOp: 0.42 });
      api.paint(ctx, api.shapes.ring(1486, 198, 8, 7, 10, 0.1), { wash: '#dcd9c6', sw: 0, washOp: 0.38 });
    }

    // 薄云带
    api.paint(ctx, api.shapes.ring(700 + Math.sin(t * 0.2 + phase) * 34, 330, 340, 22, 34, 0, 0.06, 9), {
      wash: '#dbe6f5',
      sw: 0,
      washOp: 0.09,
    });
    api.paint(ctx, api.shapes.ring(1180 + Math.sin(t * 0.16 + 2) * 26, 470, 250, 17, 30, 0, 0.06, 12), {
      wash: '#dbe6f5',
      sw: 0,
      washOp: 0.07,
    });

    // 远岭剪影
    const ridge = (baseY: number, amp: number, off: number, wash: string, alpha: number) => {
      const pts: P2[] = [[-40, 1120]];
      for (let i = 0; i <= 32; i++) {
        const u = i / 32;
        pts.push([u * 2000 - 40, baseY - Math.sin(u * 2.4 + off) * amp - Math.sin(u * 7.1 + off) * amp * 0.3]);
      }
      pts.push([1960, 1120]);
      api.paint(ctx, pts, { wash, sw: 0, washOp: alpha });
      api.inkLine(ctx, pts.slice(1, 34), 2.2, 'rgba(18,26,40,0.55)');
    };
    ridge(742, 76, 0.4, '#1a2434', 0.96);
    ridge(872, 58, 2.2, '#141b27', 0.98);

    // 松树剪影（同色三角叠层，无描边避免接缝）
    for (let i = 0; i < 15; i++) {
      const x = 30 + i * 132 + api.shapes.jit(i + 4, 44);
      const y = 906 + api.shapes.jit(i + 8, 22);
      const h = 104 + api.shapes.hash(i + 5) * 82;
      const w = h * 0.42;
      for (let k = 0; k < 4; k++) {
        const yy = y - (k * h) / 5;
        const ww = w * (1 - k * 0.2);
        const hh = h * 0.46;
        api.paint(ctx, [[x, yy - hh], [x + ww, yy], [x - ww, yy]], {
          wash: k < 2 ? '#1d2839' : '#1a2331',
          sw: 0,
          washOp: 0.98,
        });
      }
      api.paint(ctx, api.shapes.round(x - 6, y - 8, x + 6, y + 18, 2), { wash: '#0c1219', sw: 0, washOp: 0.95 });
    }

    // 地面
    const ground: P2[] = [[-40, 1120]];
    for (let i = 0; i <= 30; i++) {
      const u = i / 30;
      ground.push([u * 2000 - 40, 972 - Math.sin(u * 3.6 + 1.2) * 22]);
    }
    ground.push([1960, 1120]);
    api.paint(ctx, ground, { wash: '#0a0f16', sw: 0, washOp: 0.99 });
    api.inkLine(ctx, ground.slice(1, 33), 2.4, 'rgba(12,18,26,0.7)');

    // 营地暖光
    if (fire > 0) {
      const fl = 0.85 + 0.15 * Math.sin(t * 4.2 + phase);
      api.glow(ctx, 1180, 1010, 470, '#f0a057', 0.24 * fire * fl);
      api.glow(ctx, 1180, 1000, 190, '#ffd08a', 0.22 * fire * fl);
    }

    // 前景草与萤火虫
    for (let i = 0; i < 34; i++) {
      const x = 8 + i * 58 + api.shapes.jit(i + 2, 22);
      const h = 24 + Math.abs(api.shapes.jit(i + 14, 28));
      const s = Math.sin(t * 0.9 + i * 0.5 + phase) * 5;
      api.inkLine(ctx, [[x, 1080], [x + s, 1080 - h]], 2.4, 'rgba(9,13,19,0.95)');
    }
    for (let i = 0; i < 12; i++) {
      const x = 120 + api.shapes.hash(i * 2.3) * 1700 + Math.sin(t * 0.6 + i * 1.7 + phase) * 40;
      const y = 760 + api.shapes.hash(i * 3.9 + 2) * 280 + Math.sin(t * 0.9 + i) * 22;
      const k = 0.5 + 0.5 * Math.sin(t * 1.8 + i * 2.4);
      api.glow(ctx, x, y, 16 + 10 * k, '#f4e6a0', 0.28 * k);
      api.paint(ctx, api.shapes.ring(x, y, 2, 2, 6), { wash: '#fdf6c8', sw: 0, washOp: 0.9 * k });
    }
  },
};
