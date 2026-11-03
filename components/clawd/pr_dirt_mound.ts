import type { ComponentDef } from '../../src/core/types.ts';
import type { ClawdApi } from '../../src/styles/clawd/api.ts';

type P2 = [number, number];

export const pr_dirt_mound: ComponentDef<ClawdApi> = {
name: 'pr_dirt_mound',
  style: 'clawd',
  kind: 'prop',
  description: 'A rounded watercolour dirt mound with a sunlit top, shaded right flank, scattered clods, cracks, small pebbles and a few blades of grass at its base; at full freshness a trowel stands buried in the soil and a worm trail is visible. Anchor is bottom centre at 340×200 px, sized to sit on the ground line as a digging or garden prop in a scene.',
  tags: ['catalog', 'terrain', 'dirt', 'mound', 'ground', 'garden', 'prop'],
  size: [340, 200],
  params: {
    phase: { type: 'number', default: 0, min: 0, max: 6.283, description: 'Phase offset in radians that shifts the wobble of the mound\'s top contour, used to desynchronise several copies so they do not look identical.' },
    fresh: { type: 'number', default: 1, min: 0, max: 1, description: 'How freshly dug the mound looks; above 0.5 a worm trail and a trowel stuck in the soil are drawn, below that the mound reads as settled.' },
    pebbles: { type: 'number', default: 1, min: 0, max: 1, description: 'Opacity and presence of the small grey stones scattered over the mound surface; 0 removes them entirely.' },
  },
  draw(api, params, t) {
    const ctx = api.ctx;
    const { phase = 0, fresh = 1, pebbles = 1 } = params as { phase?: number; fresh?: number; pebbles?: number };

    // 地面
    api.paint(ctx, api.shapes.ring(0, -12, 158, 14, 24, 0, 0.05, 3), { wash: '#b9a67d', sw: 0, washOp: 0.35 });

    // 土堆主体：两层（亮面 + 暗面）
    const moundTop: P2[] = [];
    for (let i = 0; i <= 14; i++) {
      const u = i / 14;
      const x = api.shapes.lerp(-152, 152, u);
      const y = -14 - Math.sin(u * Math.PI) * 118 - Math.sin(u * Math.PI * 3.2 + phase) * 4;
      moundTop.push([x, y]);
    }
    const mound = moundTop.concat([[152, -10], [-152, -10]]);
    api.paint(ctx, mound, { wash: '#a97b4f', sw: 3.4 });
    // 顶部亮土
    const light: P2[] = [];
    for (let i = 0; i <= 14; i++) {
      const u = i / 14;
      const x = api.shapes.lerp(-130, 96, u);
      const y = -40 - Math.sin(u * Math.PI) * 84;
      light.push([x, y]);
    }
    for (let i = 14; i >= 0; i--) {
      const u = i / 14;
      const x = api.shapes.lerp(-130, 96, u);
      const y = -52 - Math.sin(u * Math.PI) * 78;
      light.push([x, y]);
    }
    api.paint(ctx, light, { wash: '#c79a6a', sw: 0, washOp: 0.75 });
    // 暗部（右下）
    api.paint(ctx, api.shapes.poly([[40, -96], [152, -22], [152, -10], [56, -12]], 4), { wash: '#8a6d4e', sw: 0, washOp: 0.45 });

    // 表面纹理：小土块与裂纹
    for (let i = 0; i < 14; i++) {
      const x = -140 + api.shapes.hash(i + 3) * 280;
      const lift = Math.sin(((x + 152) / 304) * Math.PI) * 110;
      const y = -18 - lift * (0.2 + api.shapes.hash(i + 9) * 0.7);
      const r = 4 + api.shapes.hash(i) * 7;
      api.paint(ctx, api.shapes.ring(x, y, r, r * 0.66, 8, 0, 0.2, i + 2), { wash: i % 3 === 0 ? '#8a6d4e' : '#b9a67d', sw: 0, washOp: 0.55 });
    }
    for (let i = 0; i < 5; i++) {
      const x = -110 + i * 50;
      const lift = Math.sin(((x + 152) / 304) * Math.PI) * 104;
      api.inkLine(ctx, api.shapes.poly([[x, -26 - lift * 0.2], [x + 10, -36 - lift * 0.4], [x + 2, -46 - lift * 0.5]], 3), 1.3,
        'rgba(110,74,42,0.4)');
    }

    // 小石子
    if (pebbles > 0.2) {
      for (let i = 0; i < 5; i++) {
        const x = -110 + api.shapes.hash(i + 21) * 220;
        const lift = Math.sin(((x + 152) / 304) * Math.PI) * 100;
        api.paint(ctx, api.shapes.ring(x, -30 - lift * (0.35 + api.shapes.hash(i + 31) * 0.4), 8 + api.shapes.hash(i) * 4, 6, 10, 0.2, 0.12, i + 5),
          { wash: '#c2b8a6', sw: 1.4, washOp: pebbles });
      }
    }
    // 刚挖出的蚯蚓 / 小铲子的痕迹
    if (fresh > 0.5) {
      api.inkLine(ctx, api.shapes.poly([[-58, -70], [-40, -84], [-24, -74], [-30, -60]], 3), 1.6, 'rgba(150,90,70,0.55)');
      // 插在土里的小铲子
      api.paint(ctx, api.shapes.poly([[70, -92], [86, -96], [96, -78], [80, -70]], 3), { wash: '#cfd6d4', sw: 1.8 });
      api.inkLine(ctx, api.shapes.line(84, -96, 108, -150, 1, 5, 5), 5, '#8a6d4e');
      api.paint(ctx, api.shapes.round(102, -164, 118, -140, 4, 3), { wash: '#6b7376', sw: 1.8 });
    }
    // 边上探出的小草
    for (let i = 0; i < 4; i++) {
      const x = -140 + i * 92;
      api.inkLine(ctx, api.shapes.line(x, -12, x + 6 + Math.sin(t + i) * 2, -34, 1, 3, i + 7), 2, 'rgba(109,143,85,0.7)');
    }
  },
};
