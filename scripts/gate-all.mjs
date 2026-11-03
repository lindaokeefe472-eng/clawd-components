#!/usr/bin/env node
// Gate every component in components/clawd against the pinned clawd-kit.
//   node scripts/gate-all.mjs                 # gate only
//   node scripts/gate-all.mjs --previews      # also write out/cards and out/context sheets
//   node scripts/gate-all.mjs ch_critter ...  # only the named components
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gateComponent } from '../vendor/clawd-kit/src/core/gates.ts';
import { validateComponentSource } from '../vendor/clawd-kit/src/core/security.ts';
import { isComponentDef } from '../vendor/clawd-kit/src/core/registry.ts';
import { CLAWD_INFO } from '../vendor/clawd-kit/src/styles/clawd/adapter.ts';
import { setupClawdCanvas, clawdRenderBytes, clawdAnchorApi } from '../vendor/clawd-kit/scripts/lib/clawd-node.mjs';
import { previewCard } from '../vendor/clawd-kit/scripts/preview-clawd.mjs';
import { inContextSheet } from '../vendor/clawd-kit/scripts/lib/render-clawd.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB = path.join(ROOT, 'components', 'clawd');
const OUT = path.join(ROOT, 'out');

const args = process.argv.slice(2);
const withPreviews = args.includes('--previews');
const only = args.filter((a) => !a.startsWith('--'));

const files = fs.readdirSync(LIB)
  .filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'))
  .filter((f) => !only.length || only.some((n) => f === n || f === `${n}.ts`))
  .sort();

if (!files.length) {
  console.error(`no components matched${only.length ? `: ${only.join(', ')}` : ''}`);
  process.exit(1);
}

setupClawdCanvas();
const failures = [];
let passed = 0;

for (const file of files) {
  const full = path.join(LIB, file);
  const source = fs.readFileSync(full, 'utf8');
  try {
    validateComponentSource(source, file, { style: 'clawd' });
    const mod = await import(`${pathToFileURL(full).href}?t=${Date.now()}`);
    const def = Object.values(mod).find(isComponentDef);
    if (!def) throw new Error('no ComponentDef export');
    const report = gateComponent(source, file, def, 'clawd', CLAWD_INFO.world, clawdRenderBytes, clawdAnchorApi);
    if (!report.ok) {
      failures.push({ file, errors: report.errors });
      console.log(`FAIL ${def.name}`);
      continue;
    }
    passed++;
    if (withPreviews) {
      fs.mkdirSync(path.join(OUT, 'cards'), { recursive: true });
      fs.mkdirSync(path.join(OUT, 'context'), { recursive: true });
      fs.writeFileSync(path.join(OUT, 'cards', `${def.name}.png`), previewCard(def).toBuffer('image/png'));
      const sheet = await inContextSheet(def, { projectDir: ROOT, cols: 3, cellW: 640 });
      fs.writeFileSync(path.join(OUT, 'context', `${def.name}.png`), sheet.toBuffer('image/png'));
      console.log(`ok   ${def.name}  (card + context)`);
    } else {
      console.log(`ok   ${def.name}`);
    }
  } catch (e) {
    failures.push({ file, errors: [e instanceof Error ? e.message : String(e)] });
    console.log(`FAIL ${file}`);
  }
}

console.log(`\n${passed}/${files.length} passed`);
for (const f of failures) {
  console.log(`\n${f.file}`);
  for (const e of f.errors) console.log(`  - ${e}`);
}
process.exit(failures.length ? 1 : 0);
