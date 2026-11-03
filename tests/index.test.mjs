import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistry } from '../vendor/clawd-kit/src/core/registry-node.ts';
import { CLAWD_INFO } from '../vendor/clawd-kit/src/styles/clawd/adapter.ts';
import { libraryIndexJson } from '../vendor/clawd-kit/scripts/lib/library-index.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB = path.join(ROOT, 'components', 'clawd');

const { registry } = await loadRegistry('clawd', CLAWD_INFO.world, [{ dir: LIB, origin: 'library' }]);
const defs = [...registry.values()];

test('the machine-readable index is built from the loaded registry: every component, sorted by kind then name', () => {
  const idx = libraryIndexJson(defs);
  assert.equal(idx.version, 1);
  assert.equal(idx.count, defs.length);
  assert.equal(idx.components.length, defs.length);
  const KINDS = ['background', 'actor', 'prop', 'foreground'];
  const order = idx.components.map((c) => `${KINDS.indexOf(c.kind)}/${c.name}`);
  assert.ok(idx.components.every((c) => KINDS.includes(c.kind)));
  assert.deepEqual(order, [...order].sort((a, b) => Number(a.split('/')[0]) - Number(b.split('/')[0]) || a.split('/')[1].localeCompare(b.split('/')[1])));
  assert.deepEqual(libraryIndexJson([...defs].reverse()), idx, 'input order does not change the output (stable diffs, no merge noise)');
});

test('each entry carries what the model needs to use the component: size, tags, description, typed params, anchors, surface', () => {
  const idx = libraryIndexJson(defs);
  const critter = idx.components.find((c) => c.name === 'ch_critter');
  assert.deepEqual(critter.size, defs.find((d) => d.name === 'ch_critter').size);
  assert.ok(critter.tags.length > 0 && critter.description.length > 10);
  const char = critter.params.find((p) => p.name === 'char');
  assert.equal(char.type, 'enum');
  assert.deepEqual(char.options, ['jiu', 'bean', 'mian', 'mo', 'bing']);
  assert.ok('default' in char && typeof char.description === 'string');
  const girl = idx.components.find((c) => c.name === 'ch_clawd_girl');
  assert.ok(girl.anchors.includes('handL'), 'attach anchors are listed');
  assert.equal(typeof idx.components.find((c) => c.kind === 'background').surface, 'boolean');
  assert.deepEqual(JSON.parse(JSON.stringify(idx)), idx, 'plain JSON: no functions or undefined survive');
});

test('index.json agrees with INDEX.md (the human view) on the component names', () => {
  const idx = libraryIndexJson(defs);
  const md = fs.existsSync(path.join(LIB, 'INDEX.md')) ? fs.readFileSync(path.join(LIB, 'INDEX.md'), 'utf8') : null;
  if (md === null) return;
  const names = [...md.matchAll(/\*\*`([a-z0-9_]+)`\*\*/g)].map((m) => m[1]).sort();
  assert.deepEqual(idx.components.map((c) => c.name).sort(), names);
});
