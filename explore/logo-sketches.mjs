// Phác 3 hướng logo cho "Đi làm với AI" → explore/logo-{a,b,c}.svg + logo-compare.svg/.png
// Chạy: node explore/logo-sketches.mjs
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { COLORS } from '../src/tokens.mjs';
import { textPath } from '../src/textpath.mjs';
import { fontPath } from '../src/fonts.mjs';
import { renderPng } from '../src/render.mjs';

const C = COLORS;
const HEAD = { family: 'Bricolage Grotesque', weight: 800 };
const BODY = { family: 'Be Vietnam Pro', weight: 600 };
const OUT = 'explore';

// Chiều cao chữ hoa (đơn vị font) để canh baseline theo tâm quang học.
const capRatio = (() => {
  const f = opentype.loadSync(fontPath(HEAD.family, HEAD.weight));
  return (f.tables.os2.sCapHeight || f.charToGlyph('H').getBoundingBox().y2) / f.unitsPerEm;
})();
// Baseline để chữ hoa cỡ `size` nằm giữa theo trục dọc tại `cy`.
const baselineFor = (cy, size) => cy + (capRatio * size) / 2;

// Sừng trâu trái (khung 0..200): gốc rộng ở chân, cong ra ngoài rồi vểnh vào ở chóp.
// Đối xứng sang phải bằng scale(-1,1) quanh trục giữa `mid`.
const hornLeft = (sx, sy, k = 1) => {
  const p = (x, y) => `${(sx + x * k).toFixed(1)} ${(sy + y * k).toFixed(1)}`;
  // Sừng trâu nước: gốc dày ~24, quét ngang ra ngoài rồi vểnh lên, chóp hơi quặp vào.
  return `M ${p(8, -6)} C ${p(-20, -6)} ${p(-38, -14)} ${p(-44, -42)} `
    + `C ${p(-60, -12)} ${p(-36, 18)} ${p(6, 18)} Z`;
};
const hornPair = (sx, sy, mid, k = 1) => {
  const d = hornLeft(sx, sy, k);
  const st = `fill="${C.horn}" stroke="${C.text}" stroke-width="6" stroke-linejoin="round"`;
  return `<path d="${d}" ${st}/>`
    + `<path d="${d}" ${st} transform="translate(${2 * mid} 0) scale(-1 1)"/>`;
};

// A — Thẻ nhân viên mọc sừng.
export function iconA() {
  const x = 40, y = 44, w = 120, h = 150;
  const ai = textPath('AI', { ...HEAD, size: 64, x: 100, y: baselineFor(y + 30 + (h - 30) / 2, 64), fill: C.background, anchor: 'middle' });
  return `<g>`
    + hornPair(x + 16, y + 8, 100, 0.92)
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${C.primary}" stroke="${C.text}" stroke-width="6"/>`
    + `<rect x="82" y="${y + 18}" width="36" height="10" rx="5" fill="${C.background}"/>`
    + ai.svg
    + `</g>`;
}

// B — Đầu Nghé tối giản (vẽ trong khung 228 rồi thu về 200 để sừng/tai không chạm mép).
export function iconB() {
  const cx = 114, cy = 132, r = 88;
  const ear = (s) => `<ellipse cx="${cx + s * 82}" cy="${cy - 20}" rx="22" ry="13" transform="rotate(${s * 22} ${cx + s * 82} ${cy - 20})" fill="${C.buffalo}" stroke="${C.text}" stroke-width="6"/>`;
  const eye = (s) => `<circle cx="${cx + s * 34}" cy="${cy - 8}" r="9" fill="${C.text}"/>`
    + `<circle cx="${cx + s * 34 + 3}" cy="${cy - 11}" r="3" fill="#FFFFFF"/>`;
  const cheek = (s) => `<ellipse cx="${cx + s * 56}" cy="${cy + 12}" rx="12" ry="7" fill="${C.cheek}"/>`;
  // lỗ mũi hạt đậu, xoè chéo ra hai bên (mõm trâu rộng, tránh ra mõm heo)
  const nostril = (s) => `<ellipse cx="${cx + s * 20}" cy="${cy + 54}" rx="5" ry="8" transform="rotate(${s * -24} ${cx + s * 20} ${cy + 54})" fill="${C.text}"/>`;
  return `<g transform="scale(${200 / 228})">`
    + hornPair(cx - 40, cy - 72, cx, 1.18)
    + ear(-1) + ear(1)
    + `<clipPath id="ngheHead"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`
    + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.buffalo}"/>`
    // mõm là dải rộng ôm nửa dưới mặt (kiểu trâu/bò), cắt theo đường tròn đầu
    + `<ellipse cx="${cx}" cy="${cy + 64}" rx="72" ry="40" fill="${C.nose}" clip-path="url(#ngheHead)"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.text}" stroke-width="6"/>`
    + eye(-1) + eye(1) + cheek(-1) + cheek(1)
    + nostril(-1) + nostril(1)
    + `</g>`;
}

// C — Hai sừng chụm đỉnh thành chữ A, cạnh là chữ I.
export function iconC() {
  const T = 22; // độ dày nét
  // Chân sừng trái: rộng T ở đáy, cong phình ra rồi thon nhọn về đỉnh.
  const mid = 75; // trục đối xứng của chữ A; hai chóp sừng chạm nhau ở đỉnh (không bắt chéo: ở 32px chéo nhau trông như dấu thanh)
  const L = `M 14 186 C 8 124 26 50 79 10 C 56 46 36 118 ${14 + T} 186 Z`;
  const horn = `<path d="${L}" fill="${C.primary}" stroke="${C.primary}" stroke-width="2" stroke-linejoin="round"/>`;
  return `<g>`
    + horn
    + `<g transform="translate(${2 * mid} 0) scale(-1 1)">${horn}</g>`
    + `<rect x="${mid - 36}" y="118" width="72" height="20" rx="10" fill="${C.text}"/>`
    + `<rect x="166" y="40" width="${T}" height="146" rx="${T / 2}" fill="${C.primary}"/>`
    + `</g>`;
}

// Wordmark: "Đi làm với " màu text + "AI" màu primary, canh giữa theo tâm icon.
export function wordmark(x, cy, size = 64) {
  const lead = 'Đi làm với ';
  const y = baselineFor(cy, size);
  const a = textPath(lead, { ...HEAD, size, x, y, fill: C.text });
  const b = textPath('AI', { ...HEAD, size, x: x + a.width, y, fill: C.primary });
  return { svg: a.svg + b.svg, width: a.width + b.width };
}

const ICONS = { a: iconA, b: iconB, c: iconC };
const OPTICAL_CY = { a: 122, b: 114, c: 104 }; // tâm quang học (khung 200) để canh wordmark

const lockup = (k) => {
  const wm = wordmark(232, OPTICAL_CY[k]);
  return `${ICONS[k]()}${wm.svg}`;
};
const svgDoc = (w, h, body, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
  + (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') + body + `</svg>\n`;

const LABELS = {
  a: 'A — Thẻ nhân viên mọc sừng',
  b: 'B — Đầu Nghé tối giản',
  c: 'C — Sừng thành chữ A',
};

function compareSheet() {
  const W = 1600, ROW = 300, H = ROW * 3 + 40;
  let body = '';
  ['a', 'b', 'c'].forEach((k, i) => {
    const y0 = 20 + i * ROW;
    if (i) body += `<rect x="40" y="${y0}" width="${W - 80}" height="2" fill="${C.surface}"/>`;
    body += textPath(LABELS[k], { ...BODY, size: 22, x: 48, y: y0 + 44, fill: C['text-muted'] }).svg;
    body += `<g transform="translate(48 ${y0 + 70})">${lockup(k)}</g>`;
    // thử cỡ nhỏ: 96 / 48 / 32, và 32 trong khung avatar tròn
    const sx = 900;
    const sizes = [96, 48, 32];
    let x = sx;
    sizes.forEach((s) => {
      const ty = y0 + 70 + (200 - s) / 2 + 40;
      body += `<g transform="translate(${x} ${ty}) scale(${s / 200})">${ICONS[k]()}</g>`;
      body += textPath(`${s}px`, { ...BODY, size: 14, x: x + s / 2, y: y0 + 270, fill: C['text-muted'], anchor: 'middle' }).svg;
      x += s + 48;
    });
    // avatar tròn 32px (Facebook cắt tròn)
    const ax = x + 16, ay = y0 + 70 + 100 + 40;
    body += `<circle cx="${ax}" cy="${ay}" r="16" fill="${C.surface}"/>`;
    body += `<g transform="translate(${ax - 13} ${ay - 13}) scale(${26 / 200})">${ICONS[k]()}</g>`;
    body += textPath('avatar 32', { ...BODY, size: 14, x: ax, y: y0 + 270, fill: C['text-muted'], anchor: 'middle' }).svg;
    // nền tối 48px
    const dx = ax + 64;
    body += `<rect x="${dx}" y="${ay - 36}" width="72" height="72" rx="14" fill="${C['dark-bg']}"/>`;
    body += `<g transform="translate(${dx + 12} ${ay - 24}) scale(${48 / 200})">${ICONS[k]()}</g>`;
    body += textPath('nền tối', { ...BODY, size: 14, x: dx + 36, y: y0 + 270, fill: C['text-muted'], anchor: 'middle' }).svg;
  });
  return svgDoc(W, H, body, C.background);
}

if (path.basename(process.argv[1] ?? '') === 'logo-sketches.mjs') {
  fs.mkdirSync(OUT, { recursive: true });
  for (const k of ['a', 'b', 'c']) {
    fs.writeFileSync(path.join(OUT, `logo-${k}.svg`), svgDoc(760, 200, lockup(k)));
  }
  const cmp = compareSheet();
  fs.writeFileSync(path.join(OUT, 'logo-compare.svg'), cmp);
  fs.writeFileSync(path.join(OUT, 'logo-compare.png'), renderPng(cmp, 1600));
  console.log('ok: logo-a/b/c.svg, logo-compare.svg, logo-compare.png');
}
