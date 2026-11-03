import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';
import type { Hat, Opts } from '../../src/styles/clawd/critters.ts';
import type { View } from '../../src/styles/clawd/core.ts';

const EMOTION_IDS = ['happy', 'joy', 'love', 'shy', 'sad', 'cry', 'angry', 'surprised', 'scared', 'confused', 'sleepy', 'dizzy',
  'proud', 'idea', 'nervous', 'bored', 'gloomy', 'excited', 'smug', 'hungry', 'wink', 'cool', 'music', 'calm'] as const;

export const critter: ComponentDef<ClawdApi> = {
  name: 'ch_critter',
  style: 'clawd',
  kind: 'actor',
  description: 'One of the five blocky watercolour animals (jiu 啾啾 yellow chick, bean 豆丁 green frog, mian 棉棉 pink bunny, mo 墨球 purple cat, bing 冰冰 blue penguin) with 24 emotions, 5 views, hats and simple actions. Anchor = ground point between the feet; at scale 1 it is about the size of the presenter',
  tags: ['character', 'animal', 'cast', 'emotion'],
  size: [360, 330],
  params: {
    char: { type: 'enum', default: 'jiu', options: ['jiu', 'bean', 'mian', 'mo', 'bing'], description: 'which animal' },
    emotion: { type: 'enum', default: 'calm', options: EMOTION_IDS, description: 'mood; keyed changes get a blink and a little take' },
    view: { type: 'enum', default: 'front', options: ['front', 'q', 'side', 'qback', 'back'], description: 'facing: front, three-quarter, side, three-quarter back, back (all face right; use flip to face left)' },
    action: { type: 'enum', default: 'none', options: ['none', 'walk', 'jump', 'dance', 'shiver'], description: 'body action layered on the mood (walk = walk cycle in place, move it with an x Track)' },
    hat: { type: 'enum', default: 'none', options: ['none', 'party', 'crown', 'halo', 'wizard', 'top', 'beanie', 'bow', 'flower', 'headphones', 'band', 'hard', 'leaf'], description: 'hat' },
    look: { type: 'number', default: 0, min: -1, max: 1, description: 'eye direction left (-1) to right (1)' },
    tint: { type: 'enum', default: 'none', options: ['none', 'night', 'warm'], description: 'lighting tint to match bg_night / bg_dusk' },
  },
  draw(api, p, t, lt) {
    const emotion = String(p.emotion);
    let o: Opts = api.acting(lt, [[lt - api.since('emotion'), emotion]]);
    const a0 = lt - api.since('action');
    switch (p.action) {
      case 'walk': {
        const d = lt * 1.8;
        o = api.combine(o, { walk: d, dy: -Math.abs(Math.sin(d * Math.PI)) * 0.5, view: p.view === 'front' ? 'q' : (p.view as View) });
        break;
      }
      case 'jump': o = api.combine(o, api.jump(lt, a0 + 0.1, a0 + 0.6, 3)); break;
      case 'dance': {
        const b = lt / 0.6;
        o = api.combine(o, { dy: -Math.abs(Math.sin(b * Math.PI)) * 0.9, rot: Math.sin(b * Math.PI) * 0.1, aL: Math.floor(b) % 2 ? 1.4 : -0.3, aR: Math.floor(b) % 2 ? -0.3 : 1.4, tailWag: 4 });
        break;
      }
      case 'shiver': o = api.combine(o, { shake: 0.04, sq: 0.06 }); break;
      default: break;
    }
    const extra: Partial<Opts> = { key: api.key, lookX: Number(p.look) || o.lookX };
    if (p.action !== 'walk') extra.view = p.view as View;
    if (p.hat !== 'none') extra.hat = p.hat as Hat;
    if (p.tint === 'night') { extra.tint = '#5B6AA8'; extra.tintK = 0.55; }
    if (p.tint === 'warm') { extra.tint = '#F2A060'; extra.tintK = 0.3; }
    api.critter(api.ctx, api.charById(String(p.char)), 0, 0, 24, api.combine(o, extra), t);
  },
};
