#!/usr/bin/env node
// Fetch the clawd-kit revision pinned in kit.lock into vendor/clawd-kit and install its runtime deps.
// Vendored (not node_modules) because Node refuses to type-strip .ts files under node_modules.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VENDOR = path.join(ROOT, 'vendor');
const DIR = path.join(VENDOR, 'clawd-kit');
const STAMP = path.join(DIR, '.kit-commit');
const lock = JSON.parse(fs.readFileSync(path.join(ROOT, 'kit.lock'), 'utf8'));

function git(args, cwd) {
  return execFileSync('git', args, { cwd, stdio: 'pipe' }).toString().trim();
}

fs.mkdirSync(VENDOR, { recursive: true });
if (!fs.existsSync(path.join(DIR, '.git'))) {
  fs.rmSync(DIR, { recursive: true, force: true });
  git(['clone', '--no-checkout', lock.repo, DIR], VENDOR);
}

try {
  git(['fetch', '--depth=1', 'origin', lock.commit], DIR);
} catch {
  git(['fetch', 'origin'], DIR);
}
git(['checkout', '--detach', lock.commit], DIR);

const head = git(['rev-parse', 'HEAD'], DIR);
if (head !== lock.commit) throw new Error(`clawd-kit is at ${head}, expected ${lock.commit} (kit.lock)`);

const installed = fs.existsSync(path.join(DIR, 'node_modules')) && fs.existsSync(STAMP) && fs.readFileSync(STAMP, 'utf8').trim() === lock.commit;
if (!installed) {
  execSync('npm ci --omit=dev --no-audit --no-fund', { cwd: DIR, stdio: 'inherit' });
  fs.writeFileSync(STAMP, lock.commit);
}
console.log(`clawd-kit @ ${head.slice(0, 8)} (${lock.version})`);
