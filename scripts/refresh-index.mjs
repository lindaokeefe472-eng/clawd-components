#!/usr/bin/env node
// Rebuild components/clawd/INDEX.md and index.json from the loaded registry.
// Previews are opt-in because they are generated artifacts:
//   node scripts/refresh-index.mjs              # index only (what CI checks)
//   node scripts/refresh-index.mjs --previews   # also write components/clawd/previews/*.png
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { refreshLibrary } from '../vendor/clawd-kit/scripts/preview-clawd.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB = path.join(ROOT, 'components', 'clawd');

const r = await refreshLibrary(LIB, [], { previews: process.argv.includes('--previews') });
for (const e of r.errors) console.error(`✖ ${e}`);
console.log(`index.json + INDEX.md: ${r.count} components${process.argv.includes('--previews') ? ' (+ previews)' : ''}`);
process.exit(r.errors.length ? 1 : 0);
