import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const flowerPatch: ComponentDef<ClawdApi> = {
  name: 'pr_flower_patch',
  style: 'clawd',
  kind: 'prop',
  description: 'A clump of grass tufts and little five-petal flowers swaying in the wind; dress up any ground line or frame a critter',
  tags: ['nature', 'plant', 'grass', 'flower', 'decor'],
  size: [320, 110],
  params: {
    flowers: { type: 'number', default: 6, min: 0, max: 14, description: 'number of flowers' },
    palette: { type: 'enum', default: 'spring', options: ['spring', 'warm', 'cool', 'white'], description: 'flower colours' },
    grass: { type: 'enum', default: 'green', options: ['green', 'dusk', 'night'], description: 'grass colour to match the background' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    const grass = p.grass === 'night' ? '#22304E' : p.grass === 'dusk' ? '#6F8C4C' : '#5E8B48';
    const cols = p.palette === 'warm' ? [PAL.rose, PAL.orange, '#F6D27A'] : p.palette === 'cool' ? ['#C9B6E4', PAL.sky, PAL.cream] : p.palette === 'white' ? [PAL.cream] : api.FLOWER_COLS;
    api.tufts(ctx, 9, -30, -4, grass, t, 41, 1.0, -140, 140);
    api.flowers(ctx, Math.round(Number(p.flowers)), -40, -6, t, 42, -130, 130, cols);
    api.tufts(ctx, 6, -12, 0, grass, t, 43, 1.2, -150, 150);
  },
};
