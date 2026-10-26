// Tải TTF tĩnh từ Google Fonts CSS2 API (UA mặc định của Node nhận về truetype).
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'assets/fonts';
const SPECS = [
  ['Bricolage Grotesque', 800, 'BricolageGrotesque-800.ttf'],
  ['Bricolage Grotesque', 700, 'BricolageGrotesque-700.ttf'],
  ['Be Vietnam Pro', 400, 'BeVietnamPro-400.ttf'],
  ['Be Vietnam Pro', 500, 'BeVietnamPro-500.ttf'],
  ['Be Vietnam Pro', 600, 'BeVietnamPro-600.ttf'],
];

export const FONT_FILES = SPECS.map(([, , file]) => path.join(DIR, file));
export const fontPath = (family, weight) =>
  path.join(DIR, SPECS.find(([f, w]) => f === family && w === weight)[2]);

async function download() {
  fs.mkdirSync(DIR, { recursive: true });
  for (const [family, weight, file] of SPECS) {
    const css = await (await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replaceAll(' ', '+')}:wght@${weight}`
    )).text();
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) throw new Error(`Không thấy TTF cho ${family} ${weight}`);
    fs.writeFileSync(path.join(DIR, file), Buffer.from(await (await fetch(url)).arrayBuffer()));
    console.log('ok', file);
  }
}

if (path.basename(process.argv[1] ?? '') === 'fonts.mjs') await download();
