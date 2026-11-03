import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_stratus_cloud: ComponentDef<ClawdApi> = {
name: 'pr_stratus_cloud',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour stratus cloud drawn as three stacked, overlapping flat bands that widen toward the bottom, with a white-lit top edge, a shaded underside and thin drifting brush filaments. It is 480×210 px with the anchor at the bottom centre and suits a sky layer or overcast weather backdrop; the grey tone adds short rain streaks below the base.',
  tags: ['catalog', 'sky', 'cloud', 'stratus', 'weather', 'background', 'decor'],
  size: [480, 210],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the internal wave and wobble of the cloud, used to desynchronise several copies.' },
    drift: { type: 'number', default: 1, min: 0, max: 4, description: 'Amount of horizontal sway of the cloud bands and filaments over time; 0 keeps it still.' },
    tone: { type: 'enum', default: 'day', options: ['day', 'dusk', 'grey'], description: 'Colour scheme: \'day\' pale blue-white, \'dusk\' pink-mauve, \'grey\' overcast grey which also adds falling rain streaks under the cloud.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, drift = 1, tone = 'day' } = params as { phase?: number; drift?: number; tone?: string };
    const base = tone === 'dusk' ? '#f3dade' : tone === 'grey' ? '#dbe1e4' : '#f6faf9';
    const shade = tone === 'dusk' ? '#cea9b2' : tone === 'grey' ? '#aeb9bf' : '#d3e2e6';
    const deep = tone === 'dusk' ? '#b48c98' : tone === 'grey' ? '#8f9da4' : '#b8cdd4';
    const sh = Math.sin(t * 0.45 + phase) * 7 * drift;

    // 三条厚实的扁平云带（下宽上窄），彼此部分重叠
    const bands = [
      { y: -38, half: 226, th: 40, cx: 0 },
      { y: -76, half: 192, th: 38, cx: -20 },
      { y: -112, half: 146, th: 34, cx: 28 },
    ];
    for (let i = 0; i < bands.length; i++) {
      const b = bands[i];
      const cx = b.cx + sh * (0.8 + i * 0.26);
      const top: P2[] = [];
      const bottom: P2[] = [];
      for (let s = 0; s <= 16; s++) {
        const u = s / 16;
        const wob = Math.sin(u * Math.PI * 2.6 + i * 1.9 + phase) * 3.4;
        top.push([cx - b.half + u * b.half * 2, b.y - Math.sin(u * Math.PI) * b.th - wob]);
        bottom.push([cx - b.half * 0.98 + u * b.half * 1.96, b.y + b.th * 0.5 - Math.sin(u * Math.PI) * 6]);
      }
      const body = top.concat(bottom.slice().reverse());
      api.paint(ctx, body, { wash: base, sw: i === 0 ? 2.6 : 1.8, ink: i === 0 ? 'rgba(140,164,172,0.55)' : 'rgba(160,182,190,0.4)' });
      // 下缘阴影：沿底边向上的一条带
      const shadow = bottom.concat(bottom.map((p) => [p[0], p[1] - 16] as P2).reverse());
      api.paint(ctx, shadow, { wash: shade, sw: 0, washOp: 0.85 });
      // 上缘受光
      api.inkLine(ctx, top.map((p) => [p[0], p[1] + 5] as P2), 3, 'rgba(255,255,255,0.85)');
    }
    // 云丝笔触（只在云带内部）
    for (let i = 0; i < 5; i++) {
      const y = -56 - i * 20;
      const x0 = -150 + i * 16 + sh;
      api.inkLine(ctx, api.shapes.line(x0, y, 150 - i * 18 + sh, y - 3, 3, 8, i + 3), 1.4, 'rgba(150,175,182,0.32)');
    }
    // 整块云的底部加深
    api.paint(ctx, api.shapes.ring(6 + sh, -30, 196, 8, 22, 0, 0.06, 7), { wash: deep, sw: 0, washOp: 0.3 });
    // 灰云下的小雨
    if (tone === 'grey') {
      for (let i = 0; i < 9; i++) {
        const x = -160 + i * 40 + sh;
        api.inkLine(ctx, api.shapes.line(x, -26, x - 5, -4, 1, 3, i + 3), 1.6, 'rgba(120,150,160,0.5)');
      }
    }
  },
};
