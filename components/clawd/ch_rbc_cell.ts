import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const rbcCell: ComponentDef<ClawdApi> = {
  name: 'ch_rbc_cell',
  style: 'clawd',
  kind: 'actor',
  description: 'Red blood cell character "Xiaohong": a squishy dimpled disc with a face. o2 = 1 is bright red and perky with little blue O2 bubbles riding along; o2 = 0 turns plum-purple and droopy. Body centre is 95 px above the anchor; can squeeze through capillaries',
  tags: ['bio', 'blood', 'cell', 'character', 'hero'],
  size: [240, 200],
  params: {
    o2: { type: 'number', default: 1, min: 0, max: 1, description: 'oxygen load: colour, mood and carried bubbles (animate it to show loading / unloading)' },
    mood: { type: 'enum', default: 'auto', options: ['auto', 'happy', 'tired', 'surprised', 'determined'], description: 'face; auto = happy when o2 > 0.5 else tired' },
    squeeze: { type: 'number', default: 0, min: 0, max: 1, description: 'squash into a tall oval (capillary)' },
    speed: { type: 'number', default: 0, min: 0, max: 1, description: 'motion streaks + lean when rushing' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    const o2 = api.clamp(Number(p.o2));
    const sq = api.clamp(Number(p.squeeze));
    const sp = api.clamp(Number(p.speed));
    const sx = 1 - 0.38 * sq;
    const sy = 1 + 0.32 * sq;
    const bob = api.wob(t, 0.9) * 5 * (1 - sp);
    const cy = -95 + bob;
    const rx = 92 * sx;
    const ry = 66 * sy;
    const col = api.mixCol('#8E4C7E', '#D9433A', o2);
    const dk = api.mixCol('#5A2C55', '#9C2A26', o2);
    const mood = p.mood === 'auto' ? (o2 > 0.5 ? 'happy' : 'tired') : String(p.mood);
    ctx.save();
    ctx.translate(0, cy);
    ctx.rotate(-0.12 * sp + api.wob(t, 0.5) * 0.04);
    if (sp > 0) {
      for (let i = 0; i < 4; i++) {
        api.subSeed('streak' + i);
        const y = -40 + i * 26;
        api.inkLine(ctx, [[-rx - 20 - 60 * sp, y], [-rx - 20, y]], 3, PAL.cream, false, 0.7 * sp);
      }
    }
    api.subSeed('body');
    api.paint(ctx, api.ellPts(0, 0, rx, ry, 26, 3), { wash: col, dk, sw: 5, tex: 0.6 });
    // the dimple: a darker sunken centre with a lit lower rim
    api.subSeed('dimple');
    api.blob(ctx, 0, ry * 0.32, rx * 0.42, ry * 0.26, dk, 0.35, 3);
    api.blob(ctx, -rx * 0.45, -ry * 0.5, rx * 0.2, ry * 0.12, '#FFFFFF', 0.35, 2);
    // face (above the dimple)
    const ey = -ry * 0.28;
    const ex = rx * 0.3;
    api.subSeed('face');
    for (const s of [-1, 1]) {
      const x = s * ex;
      if (mood === 'happy') api.inkLine(ctx, [[x - 10, ey + 4], [x, ey - 6], [x + 10, ey + 4]], 4);
      else if (mood === 'tired') { api.inkLine(ctx, [[x - 11, ey], [x + 11, ey]], 4); api.inkLine(ctx, [[x - 9, ey + 6], [x + 9, ey + 6]], 2, PAL.ink, false, 0.5); }
      else if (mood === 'surprised') api.paint(ctx, api.ellPts(x, ey, 8, 10, 12, 0.8), { wash: PAL.ink, ink: null, tex: 0 });
      else { api.inkLine(ctx, [[x + s * 12, ey - 9], [x - s * 10, ey - 2]], 3.5); api.paint(ctx, api.ellPts(x, ey + 5, 5, 6, 10, 0.5), { wash: PAL.ink, ink: null, tex: 0 }); }
    }
    const my = ey + 24;
    if (mood === 'happy') api.inkLine(ctx, [[-14, my - 3], [0, my + 6], [14, my - 3]], 3.5);
    else if (mood === 'tired') api.inkLine(ctx, [[-12, my + 3], [0, my - 2], [12, my + 3]], 3);
    else if (mood === 'surprised') api.paint(ctx, api.ellPts(0, my + 2, 7, 9, 12, 0.6), { wash: PAL.mouth, sw: 2.5, tex: 0 });
    else api.inkLine(ctx, [[-12, my], [12, my]], 3.5);
    if (o2 > 0.5) { api.blob(ctx, -ex - 12, ey + 18, 10, 6, PAL.rose, 0.6, 2); api.blob(ctx, ex + 12, ey + 18, 10, 6, PAL.rose, 0.6, 2); }
    if (mood === 'tired') { api.subSeed('sweat'); api.paint(ctx, [[rx * 0.75, -ry * 0.7], [rx * 0.82, -ry * 0.45], [rx * 0.68, -ry * 0.45]], { wash: PAL.sky, sw: 2, tex: 0 }); }
    ctx.restore();
    // carried oxygen bubbles orbit the cell
    const n = Math.round(o2 * 3);
    for (let i = 0; i < n; i++) {
      const a = t * 1.4 + (i * api.TAU) / 3;
      const bx = Math.cos(a) * (rx + 16);
      const by = cy - ry * 0.2 + Math.sin(a) * (ry * 0.55);
      api.subSeed('o2' + i);
      api.paint(ctx, api.ellPts(bx, by, 13, 13, 12, 1), { wash: PAL.sky, sw: 2.4, tex: 0.2 });
      api.blob(ctx, bx - 4, by - 4, 4, 3, '#FFFFFF', 0.7, 1);
    }
  },
};
