import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadRegistry } from '../vendor/clawd-kit/src/core/registry-node.ts';
import { gateComponent } from '../vendor/clawd-kit/src/core/gates.ts';
import { CLAWD_INFO } from '../vendor/clawd-kit/src/styles/clawd/adapter.ts';
import { clawdAnchorApi, clawdRenderBytes, setupClawdCanvas } from '../vendor/clawd-kit/scripts/lib/clawd-node.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'components', 'clawd');
const EXPECTED = ['bg_meadow', 'bg_pond', 'bg_dusk', 'bg_night', 'ch_critter', 'ch_butterfly', 'pr_lotus_leaf', 'pr_flower_patch', 'pr_cloud', 'pr_sun_moon', 'fg_reeds'];

test('every clawd library component loads through the AST gate with no errors', async () => {
  const { registry, errors } = await loadRegistry('clawd', CLAWD_INFO.world, [{ dir: DIR, origin: 'library' }]);
  assert.deepEqual(errors, []);
  for (const n of EXPECTED) assert.ok(registry.has(n), `missing core component ${n}`);
  assert.equal(registry.size, fs.readdirSync(DIR).filter((f) => f.endsWith('.ts')).length);
});

test('every clawd library component passes the full gate (scan, contract, determinism, draws something)', async () => {
  setupClawdCanvas();
  const { registry } = await loadRegistry('clawd', CLAWD_INFO.world, [{ dir: DIR, origin: 'library' }]);
  for (const def of registry.values()) {
    const file = fs.readdirSync(DIR).find((f) => f.endsWith('.ts') && fs.readFileSync(path.join(DIR, f), 'utf8').includes(`name: '${def.name}'`));
    const r = gateComponent(fs.readFileSync(path.join(DIR, file), 'utf8'), file, def, 'clawd', CLAWD_INFO.world, clawdRenderBytes, clawdAnchorApi);
    assert.deepEqual(r.errors, [], def.name);
  }
});

test('ch_critter: every char × emotion and every enum option renders without throwing', async () => {
  setupClawdCanvas();
  const { registry } = await loadRegistry('clawd', CLAWD_INFO.world, [{ dir: DIR, origin: 'library' }]);
  for (const def of registry.values()) {
    const base = Object.fromEntries(Object.entries(def.params ?? {}).map(([k, p]) => [k, p.default]));
    for (const [k, p] of Object.entries(def.params ?? {})) {
      const values = p.type === 'enum' ? p.options : p.type === 'boolean' ? [true, false] : p.type === 'number' ? [p.min ?? 0, p.max ?? 1] : [p.default];
      for (const v of values) clawdRenderBytes(def, { ...base, [k]: v }, 2.2, 1.4);
    }
  }
  const critter = registry.get('ch_critter');
  for (const ch of critter.params.char.options) for (const e of critter.params.emotion.options) clawdRenderBytes(critter, { ...Object.fromEntries(Object.entries(critter.params).map(([k, p]) => [k, p.default])), char: ch, emotion: e }, 1, 1);
});
