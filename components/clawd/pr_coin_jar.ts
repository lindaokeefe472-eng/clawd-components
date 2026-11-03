import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';
import type { Pt } from '../../src/styles/clawd/paint.ts';

export const coinJar: ComponentDef<ClawdApi> = {
  name: 'pr_coin_jar',
  style: 'clawd',
  kind: 'prop',
  description: 'Glass money jar with a cork, pale blue watercolour glass and ink outline; golden coins pile up inside (coins 0–24). When coins goes up, the new coin drops in from above the mouth and lands with a glint; when lost goes up, a coin pops out of the mouth and tumbles away (step coins down at the same key). leak 0..1 cracks the bottom and lets coins seep out. Jar 180 px wide, mouth at ~ 280 px above the anchor',
  tags: ['prop', 'money', 'energy', 'metaphor', 'container'],
  size: [220, 360],
  params: {
    coins: { type: 'number', default: 3, min: 0, max: 24, description: 'coins inside (step it up: each step drops one coin in)' },
    glow: { type: 'number', default: 0, min: 0, max: 1, description: 'warm glow when the jar matters' },
    lost: { type: 'number', default: 0, min: 0, max: 24, description: 'coins thrown out so far (step it up: each step pops one coin out of the mouth)' },
    leak: { type: 'number', default: 0, min: 0, max: 1, description: 'crack in the bottom: coins seep out (0 = none)' },
  },
  draw(api, p, t, lt) {
    const { ctx, PAL } = api;
    const n = Math.round(Number(p.coins));
    const age = api.since('coins');
    // a coin drops only when coins actually stepped up during the shot (not at its first key)
    const dropping = n > 0 && age < 0.55 && age < lt - 1e-3;
    const shown = dropping ? n - 1 : n;
    const g = Number(p.glow);
    if (g > 0) api.glow(ctx, 0, -150, 210, '#FFD98A', g * (0.75 + 0.25 * Math.sin(t * 3)));
    // back of the glass
    api.subSeed('back');
    api.paint(ctx, api.roundRectPts(-92, -262, 184, 252, 46, 2), { wash: '#DCEEF5', washOp: 0.35, ink: null, tex: 0.3 });
    // coin pile
    const coin = (x: number, y: number, k: string, rot = 0): void => {
      api.subSeed(k);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      api.paint(ctx, api.ellPts(0, 0, 25, 9, 16, 1), { wash: PAL.ochre, sw: 2.2, tex: 0.4 });
      api.paint(ctx, api.ellPts(-3, -2, 14, 4, 12, 0.5), { wash: '#FFE6A3', ink: null, tex: 0 });
      ctx.restore();
    };
    const spot = (i: number): Pt => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return [(col - 1) * 44 + (row % 2 ? 14 : -6) + (api.hash(i + 3) - 0.5) * 8, -26 - row * 15];
    };
    for (let i = 0; i < shown; i++) {
      const [x, y] = spot(i);
      coin(x, y, `c${i}`, (api.hash(i) - 0.5) * 0.3);
    }
    // the coin falling in
    if (dropping) {
      const k = api.easeIn(api.clamp(age / 0.42));
      const [tx, ty] = spot(n - 1);
      coin(api.lerp(0, tx, k), api.lerp(-340, ty, k), 'drop', age * 9);
      if (age > 0.42) api.glow(ctx, tx, ty, 50, '#FFF1B8', 1 - (age - 0.42) / 0.13);
    }
    // a coin thrown out of the mouth (wrong timing loses one)
    const lostAge = api.since('lost');
    if (Number(p.lost) > 0 && lostAge < 0.7 && lostAge < lt - 1e-3) {
      const k = lostAge / 0.7;
      api.subSeed('lost');
      ctx.save();
      ctx.globalAlpha = 1 - api.clamp((k - 0.6) / 0.4);
      coin(70 + 150 * k, -300 - 160 * k + 260 * k * k, 'lostcoin', k * 8);
      ctx.restore();
    }
    // a crack in the bottom and coins seeping out of it
    const leak = Number(p.leak);
    if (leak > 0.02) {
      api.subSeed('crack');
      api.inkLine(ctx, [[-70, -14], [-58, -30], [-66, -44], [-52, -60]], 3, PAL.ink);
      for (let i = 0; i < Math.round(1 + leak * 3); i++) {
        const ph = (t * (0.7 + 0.3 * leak) + i / 3) % 1;
        api.subSeed(`seep${i}`);
        ctx.save();
        ctx.globalAlpha = 1 - ph;
        api.paint(ctx, api.ellPts(-74 - 30 * ph, -16 + 40 * ph * ph, 10, 4, 10, 0.5), { wash: PAL.ochre, sw: 1.5, tex: 0 });
        ctx.restore();
      }
    }
    // front of the glass: outline, neck, cork, highlights
    api.subSeed('glass');
    api.paint(ctx, api.roundRectPts(-92, -262, 184, 252, 46, 2), { wash: '#FFFFFF', washOp: 0.08, sw: 3.2, tex: 0 });
    api.paint(ctx, api.roundRectPts(-62, -292, 124, 34, 10, 1.5), { wash: '#E6F3F8', washOp: 0.5, sw: 3 });
    api.subSeed('cork');
    api.paint(ctx, api.roundRectPts(-48, -326, 96, 38, 10, 1.5), { wash: '#B98A5E', sw: 3, tex: 0.5 });
    api.subSeed('shine');
    api.inkLine(ctx, [[-66, -228], [-70, -150], [-64, -70]], 7, 'rgba(255,255,255,0.75)');
    api.inkLine(ctx, [[-48, -236], [-50, -205]], 4, 'rgba(255,255,255,0.6)');
  },
};
