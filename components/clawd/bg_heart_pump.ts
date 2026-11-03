import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

const CH = {
  ra: { x: 640, y: 390, rx: 210, ry: 150, blood: 'vein' },
  rv: { x: 700, y: 720, rx: 240, ry: 190, blood: 'vein' },
  la: { x: 1280, y: 390, rx: 210, ry: 150, blood: 'art' },
  lv: { x: 1230, y: 720, rx: 250, ry: 200, blood: 'art' },
} as const;

export const heartPump: ComponentDef<ClawdApi> = {
  name: 'bg_heart_pump',
  style: 'clawd',
  kind: 'background',
  description: 'Cross-section of the heart as a four-room pump (viewer left = the body\'s right side): right atrium RA (640,390), right ventricle RV (700,720), left atrium LA (1280,390), left ventricle LV (1230,720, thickest wall). Right side holds plum (low-oxygen) blood, left side red. Vessels: vena cava enters RA from the top-left (≈ 380,120), pulmonary artery leaves the top-right of RV straight up between RA and the septum (x ≈ 905; RV exit ≈ 880,600), pulmonary vein enters LA from the top-right (≈ 1540,140), aorta leaves LV upward (≈ 1060,90). Atria squeeze, then ventricles; valves between atrium and ventricle open and shut with the beat. Rooms are painted light so a ch_rbc_cell (scale ≈ 0.75, anchor ≈ room centre y + 70) reads clearly inside',
  tags: ['bio', 'heart', 'organ', 'pump', 'cross-section'],
  size: [1920, 1080],
  params: {
    beat: { type: 'number', default: 1.2, min: 0, max: 3, description: 'beats per second (0 = still)' },
    highlight: { type: 'enum', default: 'none', options: ['none', 'ra', 'rv', 'la', 'lv', 'right', 'left'], description: 'glow on one room or one side' },
    squeeze: { type: 'number', default: 0, min: 0, max: 1, description: 'extra manual squeeze of the highlighted room (animate for a big "thump")' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    api.subSeed('bg');
    api.washRect(ctx, -100, -100, 2120, 1300, [[0, '#F6E2D6'], [1, '#EBC6B6']]);
    const ph = (t * Number(p.beat)) % 1;
    const atria = Number(p.beat) > 0 ? Math.exp(-((ph - 0.1) ** 2) / 0.004) : 0;
    const vent = Number(p.beat) > 0 ? Math.exp(-((ph - 0.35) ** 2) / 0.008) : 0;
    const hl = String(p.highlight);
    const extra = api.clamp(Number(p.squeeze));
    const isHl = (k: string): boolean => hl === k || (hl === 'right' && (k === 'ra' || k === 'rv')) || (hl === 'left' && (k === 'la' || k === 'lv'));
    // vessels behind the heart
    const tube = (pts: [number, number][], col: string, w: number, part: string): void => {
      api.subSeed(part);
      api.inkLine(ctx, pts, w + 10, PAL.ink, false, 0.75);
      api.inkLine(ctx, pts, w, col, false, 1);
      api.inkLine(ctx, pts, w * 0.35, api.mixCol(col, '#FFFFFF', 0.35), false, 0.6);
    };
    tube([[300, 60], [380, 160], [520, 300]], '#8E5C93', 70, 'cava');
    tube([[880, 620], [905, 320], [905, 40]], '#8E5C93', 60, 'pulmart');
    tube([[1640, 80], [1540, 170], [1420, 300]], '#D24C40', 60, 'pulmvein');
    tube([[1150, 600], [1080, 300], [1040, 140], [1120, 40]], '#D24C40', 80, 'aorta');
    // muscle body
    api.subSeed('muscle');
    const outline: [number, number][] = [];
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * api.TAU;
      const r = 1 - 0.035 * vent;
      outline.push([960 + Math.cos(a) * 560 * r + Math.sin(a * 3) * 10, 560 + Math.sin(a) * 430 * r + (Math.sin(a) > 0 ? Math.sin(a) ** 3 * 90 : 0)]);
    }
    api.paint(ctx, outline, { wash: '#C9665A', dk: '#8F3A33', sw: 6, tex: 0.8 });
    // septum
    api.inkLine(ctx, [[960, 220], [965, 560], [955, 930]], 9, '#8F3A33', false, 0.8);
    // rooms
    for (const [k, c] of Object.entries(CH)) {
      const isAtrium = k === 'ra' || k === 'la';
      const s = 1 - (isAtrium ? atria : vent) * 0.08 - (isHl(k) ? extra * 0.14 : 0);
      const blood = c.blood === 'vein' ? '#C9A2C8' : '#F0A08F';
      if (isHl(k)) api.glow(ctx, c.x, c.y, Math.max(c.rx, c.ry) * 1.25, '#FFE3A0', 0.55);
      api.subSeed('room' + k);
      api.paint(ctx, api.ellPts(c.x, c.y, c.rx * s, c.ry * s, 26, 4), { wash: blood, dk: api.mixCol(blood, PAL.ink, 0.35), sw: isHl(k) ? 6 : 4, tex: 0.5 });
      api.blob(ctx, c.x - c.rx * 0.35 * s, c.y - c.ry * 0.4 * s, c.rx * 0.25, c.ry * 0.15, '#FFFFFF', 0.25, 2);
    }
    // valves between atrium and ventricle: open while the atria push, shut when the ventricles squeeze
    const open = api.clamp(1 - vent * 1.4);
    for (const [x, side] of [[690, 'r'], [1250, 'l']] as const) {
      const y = 552;
      for (const s of [-1, 1]) {
        const ang = 0.15 + open * 1.1;
        api.subSeed('valve' + side + s);
        api.inkLine(ctx, [[x + s * 70, y], [x + s * 70 - s * Math.cos(ang) * 62, y + Math.sin(ang) * 62]], 7, PAL.cream, false, 0.95);
      }
    }
  },
};
