import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_game_controller: ComponentDef<ClawdApi> = {
name: 'pr_game_controller',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour game controller with a pale grey body and two rounded grips, a cross-shaped d-pad on the left, four coloured face buttons on the right, two thumbsticks and small start buttons in the centre panel, and a short cable curling up from the top edge. It is anchored at the bottom centre at 280×170 px and suits a living-room, desk or handheld scene where a character is playing.',
  tags: ['catalog', 'game', 'controller', 'prop', 'handheld', 'electronics', 'decor'],
  size: [280, 170],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the animation cycle in radians, so several controllers shake and blink out of sync.' },
    playing: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of active play: scales the body shake and the glow on the face buttons; 0 keeps it still and unlit.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, playing = 1 } = params as { phase?: number; playing?: number };
    const { PAL } = api;
    const shake = Math.sin(t * 9 + phase) * 1.4 * playing;

    // 阴影
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = PAL.night;
    ctx.beginPath();
    ctx.ellipse(0, -5, 112, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(shake, 0);

    // 线缆
    const cable: P2[] = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12;
      cable.push([-4 + Math.sin(u * 6 + t * 1.6 + phase) * 7, -96 - u * 40]);
    }
    api.inkLine(ctx, cable, 3, 'rgba(58,47,42,0.45)');

    // 机身：中段 + 左右握把的连续轮廓
    const body: P2[] = api.shapes.poly(
      [
        [-46, -96], [46, -96],
        [76, -90], [106, -66], [112, -38], [94, -18], [70, -20], [54, -40],
        [30, -50], [0, -52], [-30, -50],
        [-54, -40], [-70, -20], [-94, -18], [-112, -38], [-106, -66], [-76, -90],
      ],
      4,
    );
    api.paint(ctx, body, { wash: '#edeff0', sw: 3.6 });
    // 中央面板
    api.paint(ctx, api.shapes.poly([[-34, -92], [34, -92], [26, -56], [-26, -56]], 3), { wash: '#dfe3e4', sw: 0, washOp: 0.85 });

    // 十字键
    const dx = -68;
    const dy = -60;
    api.paint(ctx, api.shapes.poly([[dx - 6, dy - 21], [dx + 6, dy - 21], [dx + 6, dy + 21], [dx - 6, dy + 21]], 3), { wash: '#5a6168', sw: 1.8 });
    api.paint(ctx, api.shapes.poly([[dx - 21, dy - 6], [dx + 21, dy - 6], [dx + 21, dy + 6], [dx - 21, dy + 6]], 3), { wash: '#5a6168', sw: 1.8 });
    api.paint(ctx, api.shapes.ring(dx, dy, 7, 6, 10), { wash: '#4a5057', sw: 0, washOp: 0.9 });

    // 四颗功能键
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (i / 4) * Math.PI * 2;
      const bx = 64 + Math.cos(a) * 21;
      const by = -60 + Math.sin(a) * 21;
      const on = Math.sin(t * 2.4 + i * 1.7 + phase) > 0.55 ? 1 : 0;
      api.paint(ctx, api.shapes.ring(bx, by, 8.5, 8.5, 12), { wash: [PAL.rose, PAL.ochre, PAL.teal, '#8f9b99'][i], sw: 1.9 });
      if (on) api.glow(ctx, bx, by, 22, PAL.ochre, 0.22 * playing);
    }

    // 摇杆与开始键
    api.paint(ctx, api.shapes.ring(-6, -78, 13, 11, 16), { wash: '#5a6168', sw: 2.2 });
    api.paint(ctx, api.shapes.ring(-6, -80, 7, 6, 12), { wash: '#3f454b', sw: 0 });
    api.paint(ctx, api.shapes.ring(18, -78, 5, 4, 10), { wash: PAL.teal, sw: 0, washOp: 0.8 });
    api.paint(ctx, api.shapes.ring(32, -78, 5, 4, 10), { wash: PAL.rose, sw: 0, washOp: 0.8 });

    // 握把防滑纹
    for (let i = 0; i < 3; i++) {
      api.inkLine(ctx, api.shapes.line(-100 + i * 3, -44 + i * 8, -80 + i * 2, -34 + i * 8, 1, 4, i + 2), 1.5, 'rgba(58,47,42,0.22)');
      api.inkLine(ctx, api.shapes.line(100 - i * 3, -44 + i * 8, 80 - i * 2, -34 + i * 8, -1, 4, i + 5), 1.5, 'rgba(58,47,42,0.22)');
    }
    ctx.restore();
  },
};
