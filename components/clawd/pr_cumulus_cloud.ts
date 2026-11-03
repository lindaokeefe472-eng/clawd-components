import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_cumulus_cloud: ComponentDef<ClawdApi> = {
name: 'pr_cumulus_cloud',
  style: 'clawd',
  kind: 'prop',
  description: 'A soft watercolour cumulus cloud built from overlapping rounded puffs, with a broad flat base, pale shadow washes and broken ink outline strokes; it drifts and bobs gently. Anchor is bottom centre at 440×300 px, good for filling skies, horizon backdrops and open landscape scenes.',
  tags: ['catalog', 'cloud', 'cumulus', 'sky', 'weather', 'watercolour', 'background', 'floating'],
  size: [440, 300],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the drift and bob cycle so multiple clouds do not move in sync.' },
    drift: { type: 'number', default: 1, min: 0, max: 4, description: 'Strength of the horizontal sway and puff bobbing; 0 holds the cloud still, higher values make it move more.' },
    tone: { type: 'enum', default: 'day', options: ['day', 'dusk'], description: 'Colour scheme: \'day\' uses cool white and blue-grey washes, \'dusk\' uses warm cream and peach shadows.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, drift = 1, tone = 'day' } = params as { phase?: number; drift?: number; tone?: string };
    const base = tone === 'dusk' ? '#f7ded2' : '#fcfffd';
    const shade = tone === 'dusk' ? '#d8ac9a' : '#dbe7ea';
    const deep = tone === 'dusk' ? '#c1907f' : '#b9cdd4';
    const sh = Math.sin(t * 0.4 + phase) * 8 * drift;

    // 云底：宽而软的带
    const basePts: P2[] = [];
    for (let s = 0; s <= 16; s++) {
      const u = s / 16;
      basePts.push([-192 + u * 384 + sh, -70 - Math.sin(u * Math.PI) * 16]);
    }
    for (let s = 16; s >= 0; s--) {
      const u = s / 16;
      basePts.push([-184 + u * 368 + sh, -34 - Math.sin(u * Math.PI) * 5]);
    }
    api.paint(ctx, basePts, { wash: base, sw: 2.2, ink: 'rgba(160,184,190,0.35)' });
    // 云底内侧的阴影
    api.paint(ctx, api.shapes.poly([[-176 + sh, -46], [178 + sh, -48], [166 + sh, -36], [-166 + sh, -34]], 4), { wash: shade, sw: 0, washOp: 0.7 });

    // 主体团块，彼此重叠成一体
    const puffs = [
      { x: -108, y: -108, r: 70 },
      { x: 18, y: -120, r: 84 },
      { x: 112, y: -96, r: 62 },
      { x: -46, y: -184, r: 66 },
      { x: 56, y: -178, r: 56 },
      { x: 6, y: -238, r: 46 },
    ];
    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i];
      const bob = Math.sin(t * 0.65 + i * 1.1 + phase) * 2.6 * drift;
      const cx = p.x + sh;
      const cy = p.y + bob;
      api.paint(ctx, api.shapes.ring(cx, cy, p.r, p.r * 0.92, 24, 0, 0.12, i + 2), { wash: base, sw: 0 });
      api.paint(ctx, api.shapes.ring(cx + p.r * 0.06, cy + p.r * 0.5, p.r * 0.84, p.r * 0.32, 18, 0, 0.12, i + 7), {
        wash: shade,
        sw: 0,
        washOp: 0.8,
      });
      api.paint(ctx, api.shapes.ring(cx - p.r * 0.32, cy - p.r * 0.34, p.r * 0.44, p.r * 0.32, 16, 0, 0.1, i + 11), {
        wash: '#ffffff',
        sw: 0,
        washOp: 0.85,
      });
    }
    // 底部整片阴影
    api.paint(ctx, api.shapes.ring(0 + sh, -52, 172, 12, 22, 0, 0.05, 19), { wash: deep, sw: 0, washOp: 0.28 });

    // 外轮廓（断续，水彩感）
    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i];
      for (let s = 0; s < 3; s++) {
        const a0 = Math.PI * 1.08 + (s / 3) * Math.PI * 0.84;
        api.inkLine(ctx, api.shapes.arc(p.x + sh, p.y, p.r, p.r * 0.92, a0, a0 + 0.52, 5), 1.8, 'rgba(160,184,190,0.35)');
      }
    }
    // 云絮笔触
    for (let i = 0; i < 8; i++) {
      const x = -140 + i * 40 + sh;
      const y = -150 - (i % 3) * 30;
      api.inkLine(ctx, api.shapes.arc(x, y, 24, 9, Math.PI * 1.1, Math.PI * 1.9, 6), 1.2, 'rgba(170,192,198,0.4)');
    }
  },
};
