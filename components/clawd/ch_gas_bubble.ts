import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const gasBubble: ComponentDef<ClawdApi> = {
  name: 'ch_gas_bubble',
  style: 'clawd',
  kind: 'actor',
  description: 'A floating gas bubble with its formula written on it: O₂ is a sky-blue bubble, CO₂ a grey one. Centre is 40 px above the anchor; move it with x/y Tracks to show gas exchange',
  tags: ['bio', 'gas', 'oxygen', 'small'],
  size: [90, 80],
  params: {
    gas: { type: 'enum', default: 'o2', options: ['o2', 'co2'], description: 'which gas' },
    fade: { type: 'number', default: 1, min: 0, max: 1, description: 'opacity (0 = gone)' },
  },
  draw(api, p, t) {
    const { ctx, PAL } = api;
    const a = api.clamp(Number(p.fade));
    if (a <= 0.01) return;
    const o2 = p.gas === 'o2';
    const r = o2 ? 30 : 34;
    const cy = -40 + api.wob(t, 1.1, api.hash(api.key.length)) * 4;
    ctx.save();
    ctx.globalAlpha = a;
    api.paint(ctx, api.ellPts(0, cy, r, r, 16, 1.2), { wash: o2 ? PAL.sky : '#A8A3AE', sw: 3, tex: 0.25 });
    api.blob(ctx, -r * 0.4, cy - r * 0.4, r * 0.25, r * 0.16, '#FFFFFF', 0.75, 1);
    ctx.font = `700 ${o2 ? 24 : 21}px "Kaiti SC","STKaiti","PingFang SC",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = o2 ? PAL.indigo : PAL.ink;
    ctx.fillText(o2 ? 'O₂' : 'CO₂', 0, cy + 1);
    ctx.restore();
  },
};
