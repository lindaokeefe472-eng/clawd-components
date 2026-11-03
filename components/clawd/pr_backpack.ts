import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_backpack: ComponentDef<ClawdApi> = {
name: 'pr_backpack',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour backpack drawn as a rounded pack body with two side pockets, a folded paper-coloured top flap and ochre buckle, curved shoulder straps, a top grab handle, a small orange patch and dashed base stitching. It measures 190×230 px with the anchor at the bottom centre, and works as ground-standing luggage or carried gear in a travel, school or hiking scene.',
  tags: ['catalog', 'backpack', 'outdoor', 'travel', 'gear', 'prop', 'ground'],
  size: [190, 230],
  anchorNames: ['grip'],
  anchors() { return { grip: [0, -208] }; },
  params: {
    breathe: { type: 'number', default: 1, min: 0, max: 1, description: 'Amount of idle breathing squash-and-stretch; 0 keeps the pack perfectly still.' },
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians for the breathing cycle, so several copies do not pulse in sync.' },
    hue: { type: 'string', default: 'sap', description: 'Palette colour key used for the bag body and side pockets (default \'sap\' green); unknown keys fall back to \'sap\'.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { breathe = 1, phase = 0, hue = 'sap' } = params as { breathe?: number; phase?: number; hue?: string };
    const { PAL } = api;
    const squash = 1 + Math.sin(t * 1.4 + phase) * 0.008 * breathe;

    ctx.save();
    ctx.translate(0, -6);
    ctx.scale(squash, 2 - squash);
    ctx.translate(0, 6);

    // 背带
    api.inkLine(ctx, api.shapes.arc(-56, -96, 32, 48, Math.PI * 0.65, Math.PI * 1.75, 16), 7, 'rgba(120,90,70,0.75)');
    api.inkLine(ctx, api.shapes.arc(56, -96, 32, 48, Math.PI * 1.25, Math.PI * 0.35, 16), 7, 'rgba(120,90,70,0.55)');

    // 包体
    const bag = api.shapes.round(-74, -186, 74, -14, 26, 6);
    const wash = (PAL as Record<string, string>)[hue] || PAL.sap;
    api.paint(ctx, bag, { wash, sw: 3.8 });

    // 侧袋
    api.paint(ctx, api.shapes.round(-88, -96, -62, -46, 10), { wash, sw: 2.6, washOp: 0.85 });
    api.paint(ctx, api.shapes.round(62, -96, 88, -46, 10), { wash, sw: 2.6, washOp: 0.85 });

    // 翻盖
    const flap: P2[] = [[-74, -186], [74, -186], [78, -140], [0, -122], [-78, -140]];
    api.paint(ctx, flap, { wash: PAL.paper, sw: 3.2, washOp: 0.62 });
    api.inkLine(ctx, [[-74, -142], [0, -124], [74, -142]], 2.4, 'rgba(58,47,42,0.55)');

    // 搭扣
    api.paint(ctx, api.shapes.round(-12, -142, 12, -122, 5), { wash: PAL.ochre, sw: 2.4 });
    api.inkLine(ctx, api.shapes.ring(0, -134, 4, 4, 8), 1.6, PAL.ink);

    // 提手
    api.inkLine(ctx, api.shapes.arc(0, -190, 22, 18, Math.PI, Math.PI * 2, 14), 4, PAL.ink);

    // 补丁
    api.paint(ctx, api.shapes.round(-46, -104, -18, -78, 6), { wash: PAL.orange, sw: 2.2 });
    api.inkLine(ctx, api.shapes.line(-40, -94, -24, -94, 0, 4, 3), 1.5, PAL.paper);
    api.inkLine(ctx, api.shapes.line(-40, -88, -24, -88, 0, 4, 5), 1.5, PAL.paper);

    // 底部缝线
    for (let i = 0; i < 7; i++) {
      api.inkLine(ctx, [[-62 + i * 20, -36], [-54 + i * 20, -30]], 1.4, 'rgba(58,47,42,0.35)');
    }
    ctx.restore();
  },
};
