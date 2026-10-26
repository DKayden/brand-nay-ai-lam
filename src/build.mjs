import { execFileSync } from 'node:child_process';
import { buildLogos } from './logo.mjs';
import { buildMascot } from './mascot.mjs';
import { buildBoard } from './board.mjs';

const files = [...buildLogos(), ...buildMascot(), ...buildBoard()];
execFileSync('python', ['-I', 'src/gif.py'], { stdio: 'inherit' });
console.log(`build xong: ${files.length} file + GIF`);
