import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P = readonly [number, number];
// small loop: right ventricle → lungs → left atrium (blue up, red back)
const LUNG: readonly P[] = [[930, 500], [880, 430], [800, 360], [790, 290], [860, 240], [960, 228], [1060, 240], [1130, 290], [1120, 360], [1040, 430], [990, 500]];
// big loop: left ventricle → body → back to the right atrium (red down, blue back)
const BODY: readonly P[] = [[995, 565], [1090, 640], [1160, 750], [1110, 850], [960, 880], [810, 850], [760, 750], [830, 640], [925, 565]];

/** Catmull-Rom subdivision so the loops read as smooth hand-drawn curves */
function smooth(path: readonly P[], n = 8): P[] {
  const out: P[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const p0 = path[Math.max(0, i - 1)], p1 = path[i], p2 = path[i + 1], p3 = path[Math.min(path.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const u = k / n, u2 = u * u, u3 = u2 * u;
      const f = (a: number, b: number, c: number, d: number): number => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(path[path.length - 1]);
  return out;
}
const LUNG_S = smooth(LUNG);
const BODY_S = smooth(BODY);

function length(path: readonly P[]): number {
  let d = 0;
  for (let i = 1; i < path.length; i++) d += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
  return d;
}
function at(path: readonly P[], k: number): P {
  let left = Math.max(0, Math.min(1, k)) * length(path);
  for (let i = 1; i < path.length; i++) {
    const seg = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    if (left <= seg) { const u = left / (seg || 1); return [path[i - 1][0] + (path[i][0] - path[i - 1][0]) * u, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * u]; }
    left -= seg;
  }
  return path[path.length - 1];
}

export const circulationMap: ComponentDef<ClawdApi> = {
  name: 'bg_circulation_map',
  style: 'clawd',
  kind: 'background',
  description: 'Hand-painted diagram of the whole body\'s two blood loops on paper: faint body silhouette (x 660–1260), heart at (960,530), two lungs at (800,320) and (1120,320). Small loop heart → lungs → heart (blue going up, red coming back); big loop heart → body → heart (red going down, blue coming back). A little red-cell dot can travel the loops. Leave x 1350–1850 free for the presenter and labels (label spots: 心脏 960,470 · 肺 800,190 · 全身 960,960 is under subtitles, use 1240,860)',
  tags: ['bio', 'diagram', 'map', 'overview', 'circulation'],
  size: [1920, 1080],
  params: {
    show: { type: 'enum', default: 'both', options: ['both', 'lung', 'body', 'none'], description: 'which loop is drawn strongly (the other stays faint)' },
    dot: { type: 'enum', default: 'none', options: ['none', 'lung', 'body', 'full'], description: 'which path the red-cell dot travels' },
    progress: { type: 'number', default: 0, min: 0, max: 1, description: 'dot position along its path (animate 0 → 1)' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    api.subSeed('paper');
    api.washRect(ctx, -100, -100, 2120, 1300, [[0, '#F6EEDF'], [1, '#EFE3CD']]);
    // body silhouette
    api.subSeed('body');
    api.wcolor(ctx, api.ellPts(960, 110, 78, 84, 20), '#EAD3C0', 0.7, 3, 6);
    api.wcolor(ctx, api.roundRectPts(680, 190, 560, 720, 160), '#EAD3C0', 0.7, 3, 8);
    // lungs + heart
    for (const [x, s] of [[800, 'L'], [1120, 'R']] as const) {
      api.subSeed('lung' + s);
      api.paint(ctx, api.ellPts(x, 320, 95, 120, 20, 3), { wash: '#F1B9BE', sw: 3.5, tex: 0.6 });
    }
    const show = String(p.show);
    const loop = (path: readonly P[], split: number, first: string, second: string, strong: boolean, part: string): void => {
      const pts = path.map(([x, y]) => [x, y] as [number, number]);
      const op = strong ? 1 : 0.25;
      api.subSeed(part + 'a');
      api.inkLine(ctx, pts.slice(0, split + 1), strong ? 14 : 9, first, false, op);
      api.subSeed(part + 'b');
      api.inkLine(ctx, pts.slice(split), strong ? 14 : 9, second, false, op);
      if (strong) {
        // flow arrows
        for (const k of [0.25, 0.75]) {
          const [x0, y0] = at(path, k);
          const [x1, y1] = at(path, k + 0.03);
          const a = Math.atan2(y1 - y0, x1 - x0);
          api.inkLine(ctx, [[x1 - Math.cos(a - 0.5) * 26, y1 - Math.sin(a - 0.5) * 26], [x1, y1], [x1 - Math.cos(a + 0.5) * 26, y1 - Math.sin(a + 0.5) * 26]], 5, PAL.ink, false, 0.8);
        }
      }
    };
    const blue = '#5B6EB5';
    const red = '#D24C40';
    loop(LUNG_S, 5 * 8, blue, red, show === 'both' || show === 'lung', 'lungloop');
    loop(BODY_S, 4 * 8, red, blue, show === 'both' || show === 'body', 'bodyloop');
    const beat = 1 + 0.08 * Math.exp(-(((t * 1.2) % 1) ** 2) / 0.01);
    api.subSeed('heart');
    ctx.save();
    ctx.translate(960, 540);
    ctx.scale(beat, beat);
    api.heart(ctx, 0, 0, 120, '#D9433A', 6);
    ctx.restore();
    // travelling dot
    const dot = String(p.dot);
    if (dot !== 'none') {
      const k = Number(p.progress);
      const lungShare = length(LUNG_S) / (length(LUNG_S) + length(BODY_S));
      const [path, u] = dot === 'lung' ? [LUNG_S, k] : dot === 'body' ? [BODY_S, k] : k < lungShare ? [LUNG_S, k / lungShare] : [BODY_S, (k - lungShare) / (1 - lungShare)];
      const [x, y] = at(path, u);
      const oxy = path === LUNG_S ? u > 0.5 : u < 0.5;
      api.glow(ctx, x, y, 60, '#FFE3A0', 0.8);
      api.subSeed('dot');
      api.paint(ctx, api.ellPts(x, y, 20, 15, 14, 1), { wash: oxy ? '#D9433A' : '#8E4C7E', sw: 3, tex: 0 });
    }
  },
};
