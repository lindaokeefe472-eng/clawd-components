import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_window_open: ComponentDef<ClawdApi> = {
name: 'pr_window_open',
  style: 'clawd',
  kind: 'prop',
  description: 'A watercolour sliding window with its sash pushed open to the left, revealing a pale sky, distant hills, a sun and a small cottage; a rose curtain on the right bulges inward on the breeze, with a sill below and drifting leaves and wind lines crossing the opening. Anchor is bottom centre, 340×320 px, sized to sit into a house facade or an interior wall in a scene.',
  tags: ['catalog', 'facade', 'window', 'open', 'architecture', 'decor', 'wall'],
  size: [340, 320],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the curtain sway, leaf drift and wind-line timing so copies of the window do not move in sync.' },
    breeze: { type: 'number', default: 1, min: 0, max: 1, description: 'Strength of the wind: how far the curtain edge and its loose corner flap swing, and how pronounced the drifting motion reads.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, breeze = 1 } = params as { phase?: number; breeze?: number };
    const { PAL } = api;

    // 窗框外沿 + 窗洞
    api.paint(ctx, api.shapes.poly([[-162, -310], [162, -310], [162, -12], [-162, -12]], 4), { wash: '#cfc6b2', sw: 3.2 });
    api.paint(ctx, api.shapes.poly([[-148, -296], [148, -296], [148, -26], [-148, -26]], 4), { wash: '#5d646b', sw: 2.6 });

    // 窗外景色：天空 + 远山 + 太阳
    api.paint(ctx, api.shapes.poly([[-148, -296], [148, -296], [148, -26], [-148, -26]], 4), { wash: '#cfe4e6', sw: 0, washOp: 0.62 });
    api.paint(ctx, api.shapes.poly([[-148, -26], [148, -26], [148, -88], [-14, -124], [-148, -80]], 4), { wash: PAL.sap, sw: 0, washOp: 0.42 });
    api.paint(ctx, api.shapes.ring(72, -100, 18, 18, 20), { wash: PAL.ochre, sw: 0, washOp: 0.55 });
    // 远处小房子
    api.paint(ctx, api.shapes.poly([[44, -88], [92, -88], [92, -62], [44, -62]], 3), { wash: '#d8cfba', sw: 1.6, washOp: 0.7 });
    api.paint(ctx, api.shapes.poly([[38, -88], [68, -106], [98, -88]], 3), { wash: PAL.clay, sw: 1.6, washOp: 0.8 });

    // 推开的窗扇：滑到左侧，露出大半窗洞
    api.paint(ctx, api.shapes.poly([[-148, -294], [-98, -294], [-98, -28], [-148, -28]], 4), { wash: '#d8cfba', sw: 3 });
    api.paint(ctx, api.shapes.poly([[-140, -284], [-106, -284], [-106, -38], [-140, -38]], 4), { wash: '#bfd4d8', sw: 2.2 });
    api.paint(ctx, api.shapes.poly([[-136, -280], [-118, -280], [-118, -44], [-136, -44]], 4), { wash: '#ffffff', sw: 0, washOp: 0.3 });
    api.paint(ctx, api.shapes.round(-106, -176, -98, -148, 3), { wash: PAL.ochre, sw: 1.6 });
    // 滑轨
    api.inkLine(ctx, api.shapes.line(-148, -300, 148, -300, 0, 8, 4), 2.6, '#9aa3a5');
    api.inkLine(ctx, api.shapes.line(-148, -22, 148, -22, 0, 8, 5), 2.6, '#9aa3a5');

    // 右侧窗帘（被风吹起，内缘摆动）
    const top = -290;
    const bot = -40;
    const pts: P2[] = [];
    for (let s = 0; s <= 8; s++) {
      const u = s / 8;
      pts.push([148 - Math.sin(u * 2.2) * 5, top + u * (bot - top)]);
    }
    for (let s = 8; s >= 0; s--) {
      const u = s / 8;
      const wave = Math.sin(u * 5.2 + t * 1.6 + phase) * (10 * u + 3) * breeze;
      pts.push([46 + wave + 16 * Math.sin(u * 3.1), top + u * (bot - top)]);
    }
    api.paint(ctx, pts, { wash: PAL.rose, sw: 2.2, washOp: 0.95 });
    for (let k = 0; k < 3; k++) {
      const fx = 72 + k * 22;
      const fold: P2[] = [];
      for (let s = 0; s <= 6; s++) {
        const u = s / 6;
        fold.push([fx + Math.sin(u * 4 + k * 2) * 6, top + 6 + u * (bot - top - 18)]);
      }
      api.inkLine(ctx, fold, 1.3, 'rgba(150,120,110,0.28)');
    }
    // 窗帘被吹出的一角
    const flap = Math.sin(t * 1.9 + phase) * 8 * breeze;
    api.paint(ctx, api.shapes.poly([[46, -150], [96, -142 + flap], [104, -108 + flap], [44, -116]], 3), { wash: PAL.rose, sw: 2, washOp: 0.9 });

    // 窗台
    api.paint(ctx, api.shapes.poly([[-170, -20], [170, -20], [160, 0], [-160, 0]], 4), { wash: '#c2b8a2', sw: 3 });

    // 飘进来的叶子与风线
    for (let i = 0; i < 3; i++) {
      const a = t * 1.4 + i * 2.1 + phase;
      api.paint(ctx, api.shapes.ring(-30 + Math.cos(a) * 46, -150 + Math.sin(a * 1.3) * 44, 6, 3, 8, a), { wash: PAL.sap, sw: 1.2, washOp: 0.8 });
    }
    for (let i = 0; i < 2; i++) {
      const k = 0.5 + 0.5 * Math.sin(t * 2.4 + i * 2 + phase);
      api.inkLine(ctx, api.shapes.line(-92, -190 - i * 40, -34 - k * 14, -196 - i * 40, 2, 5, i + 3), 1.6, 'rgba(120,150,150,0.35)');
    }
  },
};
