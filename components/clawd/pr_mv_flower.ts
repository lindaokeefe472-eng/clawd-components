// clawd-mv flower (vendored kit in src/styles/clawd/sketch)
import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const mvFlower: ComponentDef<ClawdApi> = {
  name: 'pr_mv_flower',
  style: 'clawd',
  kind: 'prop',
  description: 'One big yellow watercolour flower on a green stem with two leaves; grow 0→1 raises the stem, opens the leaves, then the six petals one by one (animate grow with a Track). Gently sways. Flower centre ~ 3.6 × size px above the anchor (≈ 110 px at size 30)',
  tags: ['nature', 'flower', 'plant', 'grow', 'mv'],
  size: [140, 170],
  params: {
    grow: { type: 'number', default: 1, min: 0, max: 1, description: 'stem → leaves → petals' },
    size: { type: 'number', default: 30, min: 8, max: 70, description: 'petal radius in px (the whole flower scales with it)' },
    sway: { type: 'number', default: 0.08, min: 0, max: 0.4, description: 'how much it sways in the breeze' },
    rich: { type: 'boolean', default: true, description: 'darker pigment inside the petals (hero flower)' },
  },
  draw(api, p, t) {
    api.flowerMv(api.sk, 0, 0, Number(p.size), Number(p.grow), Number(p.sway) * Math.sin(t * 1.6), api.key, p.rich === true);
  },
};
