import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_stock_pot: ComponentDef<ClawdApi> = {
name: 'pr_stock_pot',
  style: 'clawd',
  kind: 'prop',
  description: 'A wide stainless stock pot with two loop side handles, a slightly tilted glass lid with a dark knob, a pale soup surface with bubbles when uncovered, and optional steam wisps and a small burner flame underneath. Drawn in loose watercolour washes with ink outlines, 320×280 px, anchored at the bottom centre, it is good for kitchen, hearth or market-cooking scenes on a counter or stove.',
  tags: ['catalog', 'kitchen', 'pot', 'cookware', 'container', 'ground', 'steam', 'decor'],
  size: [320, 280],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Offsets the steam and lid-jiggle timing so several pots do not animate in sync.' },
    heat: { type: 'number', default: 0.7, min: 0, max: 1, description: 'Raises steam opacity and wobble and brightens the small flame ring under the pot; below 0.3 no steam is drawn.' },
    lid: { type: 'number', default: 1, min: 0, max: 1, description: 'Controls the lid: above 0.2 the glass lid appears and bobs, below 0.5 the soup surface and bubbles are also visible.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, heat = 0.7, lid = 1 } = params as { phase?: number; heat?: number; lid?: number };
    const { PAL } = api;
    const jig = Math.sin(t * 7 + phase) * (0.8 + heat * 1.4);

    api.paint(ctx, api.shapes.ring(0, -10, 132, 12, 22, 0, 0, 4), { wash: '#8b8172', sw: 0, washOp: 0.22 });

    // 锅身（略收口）
    api.paint(ctx, api.shapes.poly([[-124, -22], [124, -22], [132, -150], [-132, -150]], 5), { wash: '#b9c2c2', sw: 3.4 });
    api.paint(ctx, api.shapes.poly([[-124, -22], [124, -22], [126, -44], [-126, -44]], 3), { wash: '#8f9b99', sw: 0, washOp: 0.5 });
    // 高光
    api.paint(ctx, api.shapes.poly([[-108, -40], [-84, -40], [-78, -140], [-100, -140]], 4), { wash: '#ffffff', sw: 0, washOp: 0.3 });
    api.paint(ctx, api.shapes.poly([[88, -40], [108, -40], [104, -140], [84, -140]], 4), { wash: PAL.night, sw: 0, washOp: 0.12 });
    // 锅沿
    api.paint(ctx, api.shapes.ring(0, -150, 132, 16, 24), { wash: '#cfd6d4', sw: 2.8 });
    api.paint(ctx, api.shapes.ring(0, -150, 118, 12, 22), { wash: '#9aa3a5', sw: 0, washOp: 0.55 });
    // 汤面
    if (lid < 0.5) {
      api.paint(ctx, api.shapes.ring(0, -148, 118, 12, 22), { wash: PAL.ochre, sw: 0, washOp: 0.55 });
      for (let i = 0; i < 4; i++) {
        api.paint(ctx, api.shapes.ring(-40 + i * 26, -148 + Math.sin(t * 3 + i) * 2, 9, 3.4, 10), { wash: '#f2e8d2', sw: 0, washOp: 0.5 });
      }
    }

    // 两侧耳把
    for (let i = 0; i < 2; i++) {
      const dir = i ? 1 : -1;
      const h = api.shapes.arc(dir * 132, -132, 22, 16, dir > 0 ? -Math.PI * 0.5 : Math.PI * 0.5, dir > 0 ? Math.PI * 0.5 : Math.PI * 1.5, 10);
      api.inkLine(ctx, h, 8, '#7f8a8e');
      api.inkLine(ctx, h, 3.4, '#cfd6d4');
    }

    // 锅盖（歪着坐上去，微微跳动）
    if (lid > 0.2) {
      ctx.save();
      ctx.translate(6, -156 + jig * 0.4);
      ctx.rotate(0.04);
      api.paint(ctx, api.shapes.ring(0, 0, 122, 18, 24), { wash: '#cfd6d4', sw: 3.2 });
      api.paint(ctx, api.shapes.ring(-14, -4, 78, 10, 20), { wash: '#ffffff', sw: 0, washOp: 0.3 });
      api.paint(ctx, api.shapes.ring(0, -18, 30, 10, 18), { wash: '#7f8a8e', sw: 2.2 });
      api.paint(ctx, api.shapes.ring(0, -30, 14, 8, 14), { wash: '#4a5155', sw: 2 });
      // 玻璃盖边缘反射
      api.inkLine(ctx, api.shapes.arc(0, 0, 122, 18, Math.PI * 1.05, Math.PI * 1.6, 10), 2, 'rgba(255,255,255,0.55)');
      ctx.restore();
    }

    // 蒸汽
    if (heat > 0.3) {
      for (let i = 0; i < 2; i++) {
        const pts: P2[] = [];
        for (let s = 0; s <= 8; s++) {
          const u = s / 8;
          pts.push([-70 + i * 130 + Math.sin(u * 4.4 + t * 1.7 + i * 2 + phase) * (6 + u * 12), -186 - u * 62]);
        }
        api.inkLine(ctx, pts, 2.4, `rgba(200,196,186,${0.34 * heat})`);
      }
    }
    // 灶台小火
    api.paint(ctx, api.shapes.ring(0, -10, 46, 7, 16), { wash: PAL.orange, sw: 0, washOp: 0.3 * heat });
  },
};
