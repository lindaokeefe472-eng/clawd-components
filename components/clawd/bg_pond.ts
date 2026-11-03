import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const bgPond: ComponentDef<ClawdApi> = {
  name: 'bg_pond',
  style: 'clawd',
  kind: 'background',
  description: 'Quiet pond in a wood: misty sky, band of round trees, grassy bank, wide blue pond (centre ≈ 1180,840, rx 760, ry 230) with drifting ripples; put pr_lotus_leaf props on the water, ch_critter actors on the bank (y 600–700) or on a leaf',
  tags: ['nature', 'outdoor', 'water', 'pond', 'calm'],
  size: [1920, 1080],
  params: {
    reeds: { type: 'boolean', default: true, description: 'cattails at the right edge of the pond' },
    mist: { type: 'number', default: 0, min: 0, max: 1, description: 'morning mist over the trees' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    api.subSeed('sky');
    api.washRect(ctx, -100, -100, 2120, 800, [[0, '#BCD9DE'], [1, '#EFE7CF']]);
    api.cloud(ctx, 500 + t * 8, 160, 50, 'p1');
    api.cloud(ctx, 1500 + t * 6, 120, 40, 'p2');
    api.subSeed('treeband');
    api.wcolor(ctx, [[-100, 470], [2020, 470], [2020, 640], [-100, 640]], '#6C955C', 0.9, 3, 10, false);
    for (let i = 0; i < 14; i++) {
      api.subSeed('tree' + i);
      api.blob(ctx, i * 150 + api.hash(i) * 60, 500 - api.hash(i * 2) * 40, 110, 90 + api.hash(i) * 30, i % 2 ? '#7EA46A' : '#6C955C', 0.85, 3);
    }
    if (Number(p.mist) > 0) {
      api.subSeed('mist');
      api.washRect(ctx, -100, 380, 2120, 260, [[0, api.rgba('#FFFFFF', 0)], [0.5, api.rgba('#F4F1E6', 0.75 * Number(p.mist))], [1, api.rgba('#FFFFFF', 0)]]);
    }
    api.subSeed('bank'); api.wcolor(ctx, api.hillPts(560, 8, 0.5, 2), '#C2CF8E', 0.95, 4, 8);
    api.tufts(ctx, 22, 600, 1080, '#7E9A55', t, 11, 0.9);
    api.subSeed('pond');
    const pond = api.ellPts(1180, 840, 760, 230, 30);
    api.wcolor(ctx, pond, '#6FAFC0', 0.95, 4, 12);
    ctx.save();
    api.trace(ctx, pond);
    ctx.clip();
    api.washRect(ctx, 400, 610, 1600, 460, [[0, 'rgba(255,255,255,0.18)'], [1, 'rgba(40,60,90,0.18)']]);
    for (let i = 0; i < 9; i++) {
      api.subSeed('rip' + i);
      const rx = 600 + api.hash(i) * 1200, ry = 700 + api.hash(i * 3) * 300, l = 40 + api.hash(i * 5) * 60, d = Math.sin(t * 1.2 + i) * 8;
      api.inkLine(ctx, [[rx - l + d, ry], [rx + l + d, ry]], 2.2, PAL.cream, false, 0.5);
    }
    ctx.restore();
    api.inkLine(ctx, pond, 2, api.mixCol('#77B6B0', PAL.ink, 0.4), true, 0.5);
    if (p.reeds) {
      for (let i = 0; i < 9; i++) {
        api.subSeed('reed' + i);
        const rx = 1720 + i * 26 + api.hash(i) * 20, ry = 760 + api.hash(i * 2) * 60, h = 180 + api.hash(i * 4) * 120, sway = Math.sin(t * 1.3 + i) * 8;
        api.inkLine(ctx, [[rx, ry], [rx + sway, ry - h]], 4, '#5E7F45');
        if (i % 2 === 0) api.paint(ctx, [[rx + sway - 7, ry - h + 10], [rx + sway + 7, ry - h + 10], [rx + sway + 7, ry - h + 60], [rx + sway - 7, ry - h + 60]], { wash: '#8A5A3A', sw: 2, tex: 0.5 });
      }
    }
  },
};
