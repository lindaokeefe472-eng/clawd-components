// clawd-mv character (vendored kit in src/styles/clawd/sketch): clawd_boy
import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const clawdBoy: ComponentDef<ClawdApi> = {
  name: 'ch_clawd_boy',
  style: 'clawd',
  kind: 'actor',
  description: 'Clawd hero: warm clay-orange body (10u wide, 8u tall at u=24; arms reach ~ 320 px) with stubby legs and ink outline; 31 emotions, 12 dances, five views, 18 hats, 18 speech bubbles, can hold a guitar or wear a pinned flower. Faces RIGHT by default (flip: true faces left). Head top ~ 230 px above the anchor (feet); bubbles and tall hats reach ~ 290 px.',
  tags: ['character', 'clawd', 'boy', 'hero', 'cute', 'mv'],
  size: [320, 290],
  params: {
    emotion: { type: 'enum', default: 'happy', options: ["neutral","happy","excited","laugh","love","shy","proud","smug","relieved","sad","cry","angry","furious","scared","surprised","confused","thinking","idea","determined","sleepy","bored","nervous","suspicious","disgusted","dizzy","cool","starstruck","ko","playful","mischief","hopeful"], description: 'face, body motion and tint of one of 31 emotions' },
    move: { type: 'enum', default: 'none', options: ["none","bounce","hop","roof","sway","spin","wave","walk","run","idle","stomp","shimmy","mix"], description: 'dance / locomotion in place, on the 69 BPM beat (walk/run only move the legs: travel with the x Track)' },
    view: { type: 'enum', default: 'q', options: ["q","front","side","qback","back"], description: 'front, three-quarter, side, three-quarter back, back' },
    hat: { type: 'enum', default: 'none', options: ["none","party","hard","crown","halo","wizard","hood","top","fedora","band","sweatband","beanie","bow","flower","headphones","cat","mask","masq","bowtie"], description: 'hat or face piece' },
    emote: { type: 'enum', default: 'none', options: ["none","!","?","!!","!?","zzz","sweat","spark","heart","hearts","anger","steam","bulb","dots","scribble","music","swirl","stars","cloud"], description: 'speech-bubble symbol over the head (pops in when it changes); none = the emotion\'s own, if any' },
    look: { type: 'number', default: 0, min: -1, max: 1, description: 'gaze left (-1) .. right (1)' },
    prop: { type: 'enum', default: 'none', options: ['none', 'guitar', 'flower'], description: 'guitar in the left hand, or a little flower pinned to the chest' },
  },
  anchorNames: ['handL', 'handR', 'head', 'chest'],
  // the same pose draw() uses (with the guitar the left arm is held at 0.6), so a prop attached here sits on the real hand
  anchors(api, p, t) {
    const o = { ...api.feelMv(String(p.emotion), t), view: p.view as 'q' | 'front' | 'side' | 'qback' | 'back', ...(p.move !== 'none' ? api.moveMv(String(p.move), t) : {}), ...(p.prop === 'guitar' ? { aL: 0.6 } : {}) };
    const u = 24;
    return { handL: api.armTip(o, u, 'L'), handR: api.armTip(o, u, 'R'), head: api.bodyPoint(o, u, [0, -8]), chest: api.bodyPoint(o, u, [0, -5]) };
  },
  draw(api, p, t) {
    const mood = api.feelMv(String(p.emotion), t);
    const moving = p.move !== 'none' ? api.moveMv(String(p.move), t) : {};
    const since = api.since('emote');
    const bubble = p.emote !== 'none' ? { emote: String(p.emote), emoteAge: since, emoteK: api.clamp(since / 0.3) } : {};
    api.boy(api.sk, 0, 0, 24, {
      ...mood,
      view: p.view as 'q' | 'front' | 'side' | 'qback' | 'back',
      ...moving,
      ...bubble,
      hat: p.hat === 'none' ? undefined : String(p.hat),
      lookX: Number(p.look),
      ...(p.prop === 'guitar' ? { armL: api.guitar, aL: 0.6 } : p.prop === 'flower' ? { draw: api.pinned } : {}),
      boilKey: api.key,
    });
  },
};
