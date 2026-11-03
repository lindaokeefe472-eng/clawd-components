// clawd-mv falling petals (vendored kit in src/styles/clawd/sketch)
import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const mvPetalShower: ComponentDef<ClawdApi> = {
  name: 'fg_mv_petal_shower',
  style: 'clawd',
  kind: 'foreground',
  description: 'Yellow petals drifting down and across the whole frame in an endless gentle stream (bursts overlap, so it never resets). Covers 1920×1080: place it at x 960, y 1080',
  tags: ['nature', 'flower', 'petals', 'wind', 'romantic', 'mv'],
  size: [1920, 1080],
  params: {
    density: { type: 'number', default: 10, min: 3, max: 30, description: 'petals per burst (a burst every 2 s)' },
    wind: { type: 'enum', default: 'right', options: ['right', 'left'], description: 'which way they drift' },
  },
  draw(api, p, _t, lt) {
    const side = p.wind === 'left' ? -1 : 1;
    const period = 2;
    const life = 6;
    const now = Math.floor(lt / period);
    // the last few bursts are all still falling, so a new one joins the stream instead of replacing it
    // each burst starts somewhere else (a petal only falls ~800 px in its life, so starting heights are spread too)
    const slot = (b: number, n: number, k: number): number => ((((b * k) % n) + n) % n) / (n - 1);
    for (let b = now - 3; b <= now; b++) {
      const x0 = -side * (900 - 1300 * slot(b, 5, 3));
      const y0 = -1150 + 520 * slot(b, 4, 3);
      api.petals(api.sk, lt, b * period, x0, y0, Math.round(Number(p.density)), life, side);
    }
  },
};
