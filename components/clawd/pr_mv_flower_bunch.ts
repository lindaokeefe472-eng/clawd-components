// clawd-mv flower bunch (vendored kit in src/styles/clawd/sketch)
import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const mvFlowerBunch: ComponentDef<ClawdApi> = {
  name: 'pr_mv_flower_bunch',
  style: 'clawd',
  kind: 'prop',
  description: 'A patch of 3–12 yellow watercolour flowers of mixed heights swaying out of step; grow 0→1 makes them sprout one after another (animate it with a Track). About 9 × size px wide (≈ 230 px at size 26), flowers up to ~ 4.5 × size px tall',
  tags: ['nature', 'flower', 'plant', 'grow', 'garden', 'mv'],
  size: [280, 150],
  params: {
    grow: { type: 'number', default: 1, min: 0, max: 1, description: 'sprouting progress of the whole patch' },
    count: { type: 'number', default: 7, min: 3, max: 12, description: 'number of flowers' },
    size: { type: 'number', default: 26, min: 10, max: 50, description: 'average petal radius in px' },
  },
  draw(api, p, t) {
    api.bunch(api.sk, t, 0, 0, Number(p.size), Math.round(Number(p.count)), Number(p.grow), api.key);
  },
};
