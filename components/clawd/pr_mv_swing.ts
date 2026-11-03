// clawd-mv swing (vendored kit in src/styles/clawd/sketch)
import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

export const mvSwing: ComponentDef<ClawdApi> = {
  name: 'pr_mv_swing',
  style: 'clawd',
  kind: 'prop',
  description: 'Wooden A-frame swing (460 px wide, beam 300 px high) swinging on the 69 BPM beat, optionally with the Clawd girl or boy on the seat swinging with it (the rider is part of this component: do not add a separate character). pose: sit, stand, squat, pump = stands up at the bottom of each swing and squats at the ends (how you pump a swing higher), or mistimed = the opposite (stands at the ends, squats at the bottom: the swing dies down)',
  tags: ['playground', 'swing', 'park', 'outdoor', 'wood', 'mv'],
  size: [480, 330],
  params: {
    rider: { type: 'enum', default: 'girl', options: ['girl', 'boy', 'none'], description: 'who sits on the seat' },
    emotion: { type: 'enum', default: 'happy', options: ['neutral', 'happy', 'excited', 'laugh', 'love', 'shy', 'proud', 'smug', 'relieved', 'sad', 'cry', 'angry', 'furious', 'scared', 'surprised', 'confused', 'thinking', 'idea', 'determined', 'sleepy', 'bored', 'nervous', 'suspicious', 'disgusted', 'dizzy', 'cool', 'starstruck', 'ko', 'playful', 'mischief', 'hopeful'], description: 'rider emotion (all 31 of ch_clawd_girl / ch_clawd_boy)' },
    amp: { type: 'number', default: 0.3, min: 0, max: 1, description: 'swing angle in radians (0 = still; 0.35 ≈ 20°, 0.87 ≈ 50°, 1 ≈ 57°)' },
    pose: { type: 'enum', default: 'sit', options: ['sit', 'stand', 'squat', 'pump', 'mistimed'], description: 'rider pose; pump = stand at the bottom, squat at the ends; mistimed = the other way round' },
  },
  draw(api, p, t) {
    const ang = api.swingAng(t, Number(p.amp));
    const [sx, sy] = api.swing(api.sk, 0, 0, 300, ang);
    if (p.rider === 'none') return;
    // 0 = sitting, 1 = standing tall, -1 = squatting; pump blends smoothly with the swing phase
    const amp = Math.max(1e-3, Number(p.amp));
    const pumpUp = 1 - 2 * Math.min(1, (ang / amp) ** 2);
    const up = p.pose === 'stand' ? 1 : p.pose === 'squat' ? -1 : p.pose === 'pump' ? pumpUp : p.pose === 'mistimed' ? -pumpUp : 0;
    // sitting: the body rests on the seat and the legs hang in front of it; standing / squatting: feet on the seat
    const body = p.pose === 'sit'
      ? { dy: 1.8 }
      : { dy: -0.1, sq: up >= 0 ? -0.08 * up : -0.3 * up, aL: 1 + 0.3 * up, aR: 1 + 0.3 * up };
    const opts = { ...api.feelMv(String(p.emotion), t), noShadow: true, rot: ang, ...body, boilKey: `${api.key}:rider` };
    if (p.rider === 'boy') api.boy(api.sk, sx, sy - 2, 22, opts);
    else api.girl(api.sk, sx, sy - 2, 24, opts);
  },
};
