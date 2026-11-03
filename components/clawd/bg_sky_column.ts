import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const bgSkyColumn: ComponentDef<ClawdApi> = {
  name: 'bg_sky_column',
  style: 'clawd',
  kind: 'background',
  description: 'Vertical cross-section of the sky above a meadow, painted as one continuous column so the camera can tilt up and down with cam.cy. Fixed landmarks (never move): grass ground line at y ≈ 830, soft green grass band y 830–1080 with a few tufts and tiny flowers; low warm air y 560–830 in peachy amber with faint heat-shimmer squiggles; mid air y 400–560 pale blue; the cloud bank sits between cloud top y ≈ 150 and cloud base y ≈ 400 (soft grey-white billows, scalloped base fringe); high cold air y 0–150 in violet-grey with a few faint ice specks. Warm ochre sun glow around (1620, 220) when sun = true. A faint column of drifting motes runs up the middle (x 700–1000) so a rising droplet reads as climbing. Put a puddle prop at y ≈ 905 on the grass line. cloudBase and cloudTop map to y = 1000 − value × 1000.',
  tags: ['sky', 'weather', 'vertical', 'cross-section', 'atmosphere'],
  size: [1920, 1080],
  params: {
    pan: { type: 'number', default: 0.5, min: 0, max: 1, description: 'tilt suggestion: the sky gradient, cloud bank and sun drift by (0.5 − pan) × 120 px; the ground line never moves' },
    cloudBase: { type: 'number', default: 0.62, min: 0.4, max: 0.8, description: 'cloud base height; 0.62 puts the cloud base at y ≈ 380' },
    cloudTop: { type: 'number', default: 0.86, min: 0.7, max: 0.95, description: 'cloud top height; 0.86 puts the cloud top at y ≈ 140' },
    sun: { type: 'boolean', default: true, description: 'draw the warm sun glow upper right' },
    dark: { type: 'number', default: 0, min: 0, max: 1, description: 'thickens and greys the cloud bank; 1 = heavy storm cloud' },
  },
  draw(api, p, t) {
    const { ctx } = api;
    const pan = api.clamp(Number(p.pan));
    const cb = api.clamp(Number(p.cloudBase), 0.4, 0.8);
    const ct = api.clamp(Number(p.cloudTop), 0.7, 0.95);
    const dark = api.clamp(Number(p.dark));
    const sunOn = p.sun !== false;

    // camera tilt: pan 0 = looking down at the meadow (ground low in frame),
    // pan 0.5 = the described default framing, pan 1 = looking up into the cold layer.
    const S = pan < 0.5 ? (pan - 0.5) * 560 : (pan - 0.5) * 1620;

    const yBase = 1000 - cb * 1000;
    const yTop = 1000 - ct * 1000;
    const bandH = Math.max(80, yBase - yTop);
    const sx = 1620;
    const sy = 220;

    ctx.save();
    ctx.translate(0, S);

    const vis0 = -S - 160;
    const vis1 = -S + 1240;
    const H = vis1 - vis0;

    // ---------- 1. one continuous sky column ----------
    api.subSeed('sky');
    const keys: [number, string][] = [
      [-1800, '#847CA6'],
      [-950, '#9A92B9'],
      [-300, '#AFA6C5'],
      [40, '#BCB3CE'],
      [150, '#C2B9D1'],
      [290, '#CBD8E4'],
      [410, '#D6E7F0'],
      [520, '#E3EDF0'],
      [615, '#EFEDE0'],
      [715, '#F9E7CA'],
      [830, '#F6DCBC'],
      [1010, '#F0D6B2'],
      [1450, '#E3CBA7'],
    ];
    const stops: [number, string][] = [];
    for (const k of keys) {
      if (k[0] > vis0 && k[0] < vis1) stops.push([(k[0] - vis0) / H, k[1]]);
    }
    if (!stops.length) {
      stops.push([0, '#9A92B9'], [1, '#F6DCBC']);
    } else {
      if (stops[0][0] > 0.001) stops.unshift([0, stops[0][1]]);
      const last = stops[stops.length - 1];
      if (last[0] < 0.999) stops.push([1, last[1]]);
    }
    api.washRect(ctx, -120, vis0, 2160, H, stops);

    // ---------- 2. high cold air: violet haze + a few faint ice specks ----------
    api.subSeed('cold');
    for (let i = 0; i < 6; i++) {
      const x = 120 + i * 360 + Math.sin(t * 0.21 + i * 1.7) * 34;
      const y = -520 + i * 118 + Math.sin(t * 0.26 + i) * 18;
      api.blob(ctx, x, y, 320, 140, '#AFA5CB', 0.15, 3);
    }
    for (let i = 0; i < 11; i++) {
      const x = 40 + api.hash(i * 3.3) * 1840;
      const y = -420 + api.hash(i * 7.7) * 570;
      api.subSeed('ice' + i);
      api.star(ctx, x, y, 3 + api.hash(i * 5.1) * 5, '#F0F3FB', 1.1, api.hash(i) * 3, 4);
    }

    // ---------- 3. the cloud bank ----------
    const cloudCol = api.mixCol('#FCFAF3', '#8B87A0', dark * 0.75);
    const cloudShade = api.mixCol('#DCD7E3', '#5E5A77', dark * 0.85);

    const topEdge: [number, number][] = [];
    const botEdge: [number, number][] = [];
    for (let i = 0; i <= 16; i++) {
      const x = -140 + i * 138;
      topEdge.push([x, yTop + Math.sin(i * 0.82 + 1.1) * bandH * 0.14 + api.jit(9)]);
      botEdge.push([x, yBase + Math.sin(i * 1.15 + 0.4) * bandH * 0.06 + api.jit(5)]);
    }
    api.subSeed('cloudband');
    api.wcolor(ctx, [...topEdge, ...botEdge.slice().reverse()], cloudCol, 0.55, 4, 15);

    // billowing puffs, warmed on the sun side
    for (let i = 0; i < 12; i++) {
      const x = -90 + i * 178 + (api.hash(i * 3.1) - 0.5) * 86;
      const y = yTop + bandH * (0.16 + api.hash(i * 5.3) * 0.3);
      const s = api.clamp(bandH * (0.3 + api.hash(i * 8.9) * 0.26) * (1 + 0.2 * dark), 52, 176);
      const d = Math.hypot(x - sx, y - sy);
      const warm = sunOn ? api.clamp(1 - d / 820) : 0;
      api.subSeed('cl' + i);
      api.cloud(ctx, x, y, s, 'cl' + i, api.mixCol(cloudCol, '#FFD9A0', warm * 0.7), 0.9);
      if (warm > 0.25) {
        api.subSeed('clwarm' + i);
        api.blob(ctx, x + (sx > x ? s * 0.34 : -s * 0.34), y - s * 0.28, s * 0.5, s * 0.32, '#FFE8BE', 0.3 * warm, 2);
      }
    }

    // under-shadow, heavier when dark
    api.subSeed('cloudunder');
    const underPts: [number, number][] = [];
    for (let i = 0; i <= 12; i++) underPts.push([-140 + i * 184, yBase - bandH * 0.36 + Math.sin(i) * 9]);
    for (let i = 12; i >= 0; i--) underPts.push([-140 + i * 184, yBase + Math.sin(i * 1.3) * 7]);
    api.wcolor(ctx, underPts, cloudShade, 0.18 + 0.36 * dark, 3, 13);

    // scalloped base fringe
    for (let i = 0; i < 15; i++) {
      const x = -70 + i * 140 + (api.hash(i * 4.7) - 0.5) * 54;
      const s = api.clamp(bandH * (0.13 + api.hash(i * 9.3) * 0.1), 24, 62);
      const d = Math.hypot(x - sx, yBase - sy);
      const warm = sunOn ? api.clamp(1 - d / 900) : 0;
      api.subSeed('cf' + i);
      api.cloud(ctx, x, yBase - s * 0.62, s, 'cf' + i, api.mixCol(api.mixCol(cloudCol, cloudShade, 0.4), '#FFD9A0', warm * 0.6), 0.85);
    }

    // ---------- 4. the sun, glowing at cloud height and warming the cloud edges ----------
    if (sunOn) {
      api.subSeed('sun');
      const br = 0.94 + 0.06 * Math.sin(t * 1.1);
      api.glow(ctx, sx, sy, 420 * br, '#FFB44E', 0.22);
      api.glow(ctx, sx, sy, 250 * br, '#FFC259', 0.3);
      api.glow(ctx, sx, sy, 140 * br, '#FFDC92', 0.4);
      api.glow(ctx, sx, sy, 62 * br, '#FFF0C4', 0.55);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * api.TAU + t * 0.13;
        const r = 150 + Math.sin(t * 1.3 + i) * 14;
        api.subSeed('ray' + i);
        api.inkLine(ctx, [
          [sx + Math.cos(a) * r, sy + Math.sin(a) * r],
          [sx + Math.cos(a) * (r + 58), sy + Math.sin(a) * (r + 58)],
        ], 3.5, api.rgba('#F2A54B', 0.28), false, 0.6);
      }
    }

    // ---------- 5. mid air: pale blue haze ----------
    api.subSeed('midhaze');
    for (let i = 0; i < 4; i++) {
      const x = 200 + i * 470 + Math.sin(t * 0.28 + i) * 26;
      const y = 440 + api.hash(i * 6.1) * 110;
      api.blob(ctx, x, y, 250, 58, '#E9F3F8', 0.3, 3);
    }

    // ---------- 6. low warm air: heat shimmer squiggles ----------
    api.subSeed('shimmer');
    for (let i = 0; i < 6; i++) {
      const y0 = 610 + i * 38;
      const pts: [number, number][] = [];
      for (let k = 0; k <= 10; k++) {
        const x = 70 + k * 182 + api.hash(i * 3.1 + k) * 48;
        pts.push([x, y0 + Math.sin(k * 1.2 + t * 1.6 + i * 1.4) * 7]);
      }
      api.inkLine(ctx, pts, 2.2, api.rgba('#E9A96A', 0.2), false, 0.5);
    }

    // ---------- 7. the narrow rising column of vapour motes (x 700–1000) ----------
    api.subSeed('motecol');
    for (let i = 0; i < 5; i++) {
      const y = -320 + i * 250 + Math.sin(t * 0.3 + i * 1.3) * 12;
      api.blob(ctx, 850, y, 118, 175, '#FFFFFF', 0.09, 2);
    }
    for (let i = 0; i < 15; i++) {
      const bx = 714 + api.hash(i * 5.5) * 272;
      const sp = 16 + api.hash(i * 2.9) * 26;
      const raw = api.hash(i * 7.3) * 1500 - t * sp;
      const y = ((raw % 1500) + 1500) % 1500 - 520;
      const x = bx + Math.sin(t * 0.7 + i) * 14;
      const s = 2.5 + api.hash(i * 3.7) * 3;
      api.subSeed('mote' + i);
      api.blob(ctx, x, y, s, s * 1.7, '#B9DFF2', 0.3 + api.hash(i * 1.7) * 0.2, 1);
    }

    // ---------- 8. meadow (ground line y ≈ 830) ----------
    api.subSeed('ground');
    api.wcolor(ctx, api.hillPts(838, 14, 0.85, 0.4, 1460), '#8DB569', 0.94, 4, 9);
    api.subSeed('ground2');
    api.wcolor(ctx, api.hillPts(886, 10, 1.4, 2.3, 1470), '#A5C87B', 0.88, 4, 9);
    api.subSeed('ground3');
    api.wcolor(ctx, api.hillPts(958, 12, 1.1, 4.1, 1480), '#BBD68C', 0.85, 4, 10);

    api.subSeed('horizon');
    const hpts: [number, number][] = [];
    for (let i = 0; i <= 18; i++) hpts.push([-100 + i * 120, 838 + Math.sin(i * 0.9) * 8]);
    api.inkLine(ctx, hpts, 3, '#6E9450', false, 0.45);

    api.subSeed('tufts');
    api.tufts(ctx, 46, 852, 1072, '#6F9B52', t, 11, 1.15);
    api.subSeed('tufts2');
    api.tufts(ctx, 30, 902, 1078, '#5C8746', t, 27, 1.4);
    api.subSeed('flowers');
    api.flowers(ctx, 16, 880, 1070, t, 5);

    // ---------- 9. the puddle prop ----------
    const px = 470;
    const py = 906;
    api.subSeed('puddle');
    api.paint(ctx, api.ellPts(px, py, 138, 30, 24, 2.5), { wash: '#CFE4EF', dk: '#9CBACD', lt: '#F4FBFE', sw: 3.5, tex: 0.35 });
    api.blob(ctx, px - 42, py - 7, 46, 8, '#FFFFFF', 0.5, 2);
    api.subSeed('ripple');
    for (let i = 0; i < 2; i++) {
      const ph = (t * 0.42 + i * 0.5) % 1;
      const rr = 14 + ph * 62;
      api.inkLine(ctx, api.ellPts(px + 34, py, rr, rr * 0.24, 20, 1), 1.7, api.rgba('#7E9EB4', 0.45 * (1 - ph)), true, 0.6);
    }

    ctx.restore();
  },
};
