import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const bgNight: ComponentDef<ClawdApi> = {
  name: 'bg_night',
  style: 'clawd',
  kind: 'background',
  description: 'Starry night meadow: deep indigo sky with twinkling stars, glowing moon (≈ 1500,220), dark blue hills and grass, optional fireflies; ground ≈ y 800, standing band y 840–900; tint critters with emotion sleepy / calm',
  tags: ['nature', 'outdoor', 'night', 'stars', 'quiet'],
  size: [1920, 1080],
  params: {
    moon: { type: 'boolean', default: true, description: 'the moon with its halo' },
    stars: { type: 'number', default: 1, min: 0, max: 1, description: 'star density' },
    fireflies: { type: 'number', default: 0, min: 0, max: 1, description: 'firefly count (0 = none, 1 = about a dozen)' },
  },
  draw(api, p, t) {
    const { ctx } = api;
    api.subSeed('sky');
    api.washRect(ctx, -100, -100, 2120, 1000, [[0, '#1C2250'], [0.6, '#33397A'], [1, '#6A5B8E']]);
    const n = Math.round(70 * Number(p.stars));
    for (let i = 0; i < n; i++) {
      const sx = api.hash(i * 7.3) * 1920, sy = api.hash(i * 3.1) * 620, tw = 0.5 + 0.5 * Math.sin(t * (1 + api.hash(i) * 2) + i);
      api.subSeed('star' + i);
      api.glow(ctx, sx, sy, 10 + tw * 12, '#FFF1C8', 0.6 * tw + 0.2);
      if (i % 5 === 0) api.star(ctx, sx, sy, 6 + tw * 4, '#FFF3D0', 0, 0);
    }
    if (p.moon) {
      api.glow(ctx, 1500, 220, 300, '#FFF0C8', 0.55);
      api.subSeed('moon');
      api.blob(ctx, 1500, 220, 75, 75, '#F7EBC8', 1, 4);
    }
    api.subSeed('far'); api.wcolor(ctx, api.hillPts(660, 26, 0.7, 1), '#3A447A', 0.9, 3, 10);
    api.subSeed('near'); api.wcolor(ctx, api.hillPts(800, 12, 0.4, 2), '#2F3D60', 0.95, 4, 8);
    api.tufts(ctx, 26, 820, 1070, '#22304E', t, 31, 1.0);
    const ff = Math.round(12 * Number(p.fireflies));
    for (let i = 0; i < ff; i++) {
      api.subSeed('ff' + i);
      const fx = 200 + api.hash(i * 4.4) * 1500 + Math.sin(t * 0.6 + i) * 60, fy = 560 + api.hash(i * 2.2) * 340 + Math.cos(t * 0.8 + i * 2) * 40;
      api.glow(ctx, fx, fy, 26, '#F8F0A0', 0.5 + 0.5 * Math.sin(t * 3 + i));
    }
  },
};
