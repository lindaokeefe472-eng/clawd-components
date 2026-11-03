import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_storm_cloud: ComponentDef<ClawdApi> = {
name: 'pr_storm_cloud',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour storm cloud made of stacked grey puffs with a soft dark underside, drifting side to side and dropping thin rain streaks; during brief pulses a jagged lightning bolt, side fork and warm glow appear inside. Anchored at the bottom centre and 460×330 px, it suits a sky or backdrop element in a rainy or dramatic outdoor scene.',
  tags: ['catalog', 'weather', 'cloud', 'storm', 'sky', 'hanging', 'decor'],
  size: [460, 330],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the drift bob and lightning pulse so several copies do not move or flash in sync.' },
    drift: { type: 'number', default: 0.6, min: 0, max: 4, description: 'Amount of horizontal sway and per-puff bobbing; 0 keeps the cloud still, higher values make it rock and churn more.' },
    lightning: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the lightning effect; 0 disables the bolt and glow entirely, higher values make the flash brighter and more frequent in the pulse cycle.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, drift = 0.6, lightning = 1 } = params as { phase?: number; drift?: number; lightning?: number };
    const sh = Math.sin(t * 0.38 + phase) * 5 * drift;
    // 闪电：短时间内闪几下
    const pulse = Math.pow(Math.max(0, Math.sin(t * 1.1 + phase)), 18);
    const flash = lightning > 0.2 ? pulse * lightning : 0;

    // 乌云：深灰团块
    const puffs = [
      { x: -120, y: -190, r: 66, c: '#6b7378' },
      { x: -40, y: -222, r: 80, c: '#7f8a8e' },
      { x: 54, y: -200, r: 70, c: '#6b7378' },
      { x: 126, y: -166, r: 52, c: '#5d6669' },
      { x: -168, y: -156, r: 46, c: '#5d6669' },
      { x: 8, y: -262, r: 54, c: '#8f9b99' },
    ];
    // 云底
    api.paint(ctx, api.shapes.ring(0 + sh, -150, 196, 40, 24, 0, 0.1, 5), { wash: '#3f464b', sw: 0, washOp: 0.55 });
    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i];
      const bob = Math.sin(t * 0.8 + i + phase) * 2 * drift;
      api.paint(ctx, api.shapes.ring(p.x + sh, p.y + bob, p.r, p.r * 0.88, 20, 0, 0.14, i + 3), { wash: p.c, sw: 0 });
      // 暗部下缘
      api.paint(ctx, api.shapes.ring(p.x + sh, p.y + bob + p.r * 0.44, p.r * 0.82, p.r * 0.3, 16, 0, 0.12, i + 9), {
        wash: '#3f464b',
        sw: 0,
        washOp: 0.45,
      });
      // 亮部上缘
      api.paint(ctx, api.shapes.ring(p.x + sh - p.r * 0.26, p.y + bob - p.r * 0.3, p.r * 0.44, p.r * 0.3, 14, 0, 0.1, i + 14), {
        wash: '#b9c2c2',
        sw: 0,
        washOp: 0.35,
      });
    }
    // 云底：软边
    const under: P2[] = [];
    for (let s = 0; s <= 16; s++) {
      const u = s / 16;
      under.push([-200 + u * 400 + sh, -136 - Math.sin(u * Math.PI) * 18]);
    }
    for (let s = 16; s >= 0; s--) {
      const u = s / 16;
      under.push([-192 + u * 384 + sh, -104 - Math.sin(u * Math.PI) * 10]);
    }
    api.paint(ctx, under, { wash: '#4a5155', sw: 0, washOp: 0.9 });
    api.inkLine(ctx, api.shapes.line(-186 + sh, -140, 184 + sh, -142, 4, 10, 4), 1.8, 'rgba(58,47,42,0.35)');

    // 闪电
    if (flash > 0.05) {
      const bolt: P2[] = [
        [26 + sh, -138],
        [10 + sh, -96],
        [28 + sh, -92],
        [2 + sh, -44],
        [18 + sh, -40],
        [-14 + sh, 8],
      ];
      api.inkLine(ctx, bolt, 9, `rgba(255,246,200,${0.35 * flash})`);
      api.inkLine(ctx, bolt, 4, `rgba(255,250,220,${0.9 * flash})`);
      // 分叉
      api.inkLine(ctx, api.shapes.poly([[24 + sh, -74], [46 + sh, -56], [40 + sh, -34]], 3), 2, `rgba(255,246,200,${0.6 * flash})`);
      api.glow(ctx, 10 + sh, -70, 120, '#fff2c4', 0.4 * flash);
    }
    // 雨丝
    for (let i = 0; i < 12; i++) {
      const x = -186 + i * 34 + sh;
      const k = (i % 3) * 8;
      api.inkLine(ctx, api.shapes.line(x, -104 - k, x - 10, -56 - k, 1, 4, i + 3), 1.8, 'rgba(140,166,176,0.5)');
    }
    // 云内隐约的暖光（闪电时整团云提亮）
    if (flash > 0.02) {
      api.paint(ctx, api.shapes.ring(0 + sh, -190, 190, 90, 24, 0, 0.1, 7), { wash: '#fff6d8', sw: 0, washOp: 0.18 * flash });
    }
  },
};
