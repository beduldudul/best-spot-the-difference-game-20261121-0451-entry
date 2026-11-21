// Twin Tides — Spot the Difference: the entry program (Node 22, stdlib only).
// Copies game/ and screenshots/ from this repository into the output directory
// and writes /output/dossier.json with buildDossier from vendor/makefun-game.ts.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');
if (!existsSync(gameDir)) throw new Error('game/: no such directory in this repository');
cpSync(gameDir, join(outDir, 'game'), { recursive: true });
if (existsSync(shotsDir)) cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`Twin Tides: wrote ${outDir} (dossier ${dossier.length} bytes)`);
