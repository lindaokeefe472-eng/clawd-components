import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const bodyCell: ComponentDef<ClawdApi> = {
  name: 'pr_body_cell',
  style: 'clawd',
  kind: 'prop',
  description: 'A body (tissue) cell waiting for oxygen: soft peach blob with a nucleus and a face. fed = 0 is deflated, wrinkled and sad; fed = 1 is plump and happy. Centre is 105 px above the anchor',
  tags: ['bio', 'cell', 'tissue', 'character'],
  size: [300, 220],
  params: {
    fed: { type: 'number', default: 0, min: 0, max: 1, description: 'how well fed with oxygen (animate 0 → 1 as it receives O2)' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    const f = api.clamp(Number(p.fed));
    const breathe = api.wob(t, 0.6) * 0.03 * f;
    const rx = (110 + 25 * f) * (1 + breathe);
    const ry = (70 + 30 * f) * (1 - breathe);
    const cy = -105 + (1 - f) * 20;
    const col = api.mixCol('#D9B9A0', '#F2A283', f);
    // deflated cells sag: flatten the bottom and dent the top
    const pts = api.ellPts(0, cy, rx, ry, 28, 3).map(([x, y]) => [x, y < cy ? y + (1 - f) * 18 * Math.cos((x / rx) * Math.PI * 1.5) ** 2 : y] as [number, number]);
    api.subSeed('membrane');
    api.paint(ctx, pts, { wash: col, sw: 4.5, tex: 0.7 });
    api.subSeed('nucleus');
    api.paint(ctx, api.ellPts(rx * 0.35, cy + ry * 0.15, 30, 24, 16, 1.5), { wash: api.mixCol(PAL.violet, '#FFFFFF', 0.35), sw: 3, tex: 0.4 });
    api.subSeed('face');
    const ey = cy - ry * 0.15;
    for (const s of [-1, 1]) {
      const x = -rx * 0.25 + s * 22;
      if (f > 0.5) api.inkLine(ctx, [[x - 9, ey + 3], [x, ey - 6], [x + 9, ey + 3]], 3.5);
      else api.inkLine(ctx, [[x - 9, ey - 2 * s], [x + 9, ey + 2 * s]], 3.5);
    }
    const my = ey + 24;
    if (f > 0.5) api.inkLine(ctx, [[-rx * 0.25 - 12, my - 2], [-rx * 0.25, my + 6], [-rx * 0.25 + 12, my - 2]], 3);
    else api.inkLine(ctx, [[-rx * 0.25 - 12, my + 4], [-rx * 0.25, my - 3], [-rx * 0.25 + 12, my + 4]], 3);
    if (f < 0.4) {
      api.subSeed('wrinkle');
      for (let i = 0; i < 3; i++) api.inkLine(ctx, [[-rx * 0.6 + i * 50, cy + ry * 0.55], [-rx * 0.6 + i * 50 + 16, cy + ry * 0.4]], 2, api.mixCol(col, PAL.ink, 0.5), false, 0.6);
    }
  },
};
