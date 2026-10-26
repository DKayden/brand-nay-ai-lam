// Phác lại logo "Đi làm với AI" (bỏ sừng): não + chữ "AI" + nhân sự cấp cao.
// → explore/logo2-{a,b,c}.svg + logo2-compare.svg/.png
// Chạy: node explore/logo2-sketches.mjs
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
const SW = 6; // viền navy 6px ở khung 200, như Nghé

const capRatio = (() => {
  const f = opentype.loadSync(fontPath(HEAD.family, HEAD.weight));
  return (f.tables.os2.sCapHeight || f.charToGlyph('H').getBoundingBox().y2) / f.unitsPerEm;
})();
const baselineFor = (cy, size) => cy + (capRatio * size) / 2;

// Bảng màu icon: sáng (mặc định) và nền tối.
const LIGHT = { ink: C.text, suit: C.primary, brain: C['primary-soft'], shirt: C.background, fold: C.text };
const DARK = { ink: C['dark-bg'], suit: C['primary-soft'], brain: C.background, shirt: C.background, fold: C['dark-bg'] };

// Bóng não (nhìn từ trên): hai bán cầu liền khối, khía ở đỉnh và đáy; mép mỗi bên gồm 8 thuỳ nhỏ
// (cung bậc 2 phình ra ngoài) — nhiều thuỳ nhỏ để khỏi thành đám mây. Toạ độ gốc: tâm (0,0), rộng ±66, cao -46..44.
const HEMI = [[0, -30], [-16, -42], [-34, -42], [-50, -32], [-60, -16], [-62, 2], [-56, 20], [-42, 34], [-22, 40], [0, 32]];
const BRAIN_D = (() => {
  const seg = (pts, sx) => pts.slice(1).map(([x, y], i) => {
    const [x0, y0] = pts[i];
    const mx = (x0 + x) / 2, my = (y0 + y) / 2;
    const nx = mx - (-30), ny = my - 0, n = Math.hypot(nx, ny) || 1;
    const bump = 7;
    return `Q ${(sx * (mx + (nx / n) * bump)).toFixed(1)} ${(my + (ny / n) * bump).toFixed(1)} ${sx * x} ${y}`;
  }).join(' ');
  const right = [...HEMI].reverse();
  return `M 0 -30 ${seg(HEMI, 1)} ${seg(right, -1)} Z`;
})();

// Vẽ não tại (cx,cy) tỉ lệ k. `folds`: danh sách path (toạ độ gốc) vẽ nét navy dày `fw` (px khung 200).
const brain = (cx, cy, k, p, folds = [], fw = 8, ow = SW) => {
  const inner = folds.map((d) => `<path d="${d}" fill="none" stroke="${p.fold}" stroke-width="${(fw / k).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  return `<g transform="translate(${cx} ${cy}) scale(${k})">`
    + `<path d="${BRAIN_D}" fill="${p.brain}" stroke="${p.ink}" stroke-width="${(ow / k).toFixed(2)}" stroke-linejoin="round"/>`
    + inner + `</g>`;
};
// Nếp não chung (cho đầu nhỏ): khe giữa + một cung ôm mép trên mỗi bán cầu (nếp ở giữa mặt dễ thành mắt/ria).
const SIMPLE_FOLDS = ['M 0 -30 L 0 32', 'M -12 -26 C -24 -34 -40 -30 -46 -16', 'M 12 -26 C 24 -34 40 -30 46 -16'];

// Vai áo vest + cổ sơ mi chữ V + cà vạt. (cx: tâm, top: mép vai, bottom: đáy cắt, w: nửa bề ngang)
const suit = (cx, top, bottom, w, p, { tie = true } = {}) => {
  const vw = w * 0.3, vd = (bottom - top) * 0.72;
  const body = `M ${cx - w} ${bottom} L ${cx - w} ${top + w * 0.36} C ${cx - w} ${top + 4} ${cx - w * 0.6} ${top} ${cx - w * 0.36} ${top} `
    + `L ${cx + w * 0.36} ${top} C ${cx + w * 0.6} ${top} ${cx + w} ${top + 4} ${cx + w} ${top + w * 0.36} L ${cx + w} ${bottom} Z`;
  const v = `M ${cx - vw} ${top} L ${cx + vw} ${top} L ${cx} ${top + vd} Z`;
  const t = vw * 0.42;
  const tieSvg = tie
    ? `<path d="M ${cx - t} ${top + 2} L ${cx + t} ${top + 2} L ${cx + t * 0.6} ${top + vd * 0.22} L ${cx - t * 0.6} ${top + vd * 0.22} Z" fill="${p.ink}"/>`
      + `<path d="M ${cx - t * 0.7} ${top + vd * 0.22} L ${cx + t * 0.7} ${top + vd * 0.22} L ${cx + t * 1.05} ${top + vd * 0.86} L ${cx} ${top + vd * 1.02} L ${cx - t * 1.05} ${top + vd * 0.86} Z" fill="${p.ink}"/>`
    : '';
  return `<path d="${body}" fill="${p.suit}" stroke="${p.ink}" stroke-width="${SW}" stroke-linejoin="round"/>`
    + `<path d="${v}" fill="${p.shirt}" stroke="${p.ink}" stroke-width="${SW}" stroke-linejoin="round"/>`
    + tieSvg;
};

// A — Sếp đầu não: bán thân vest, đầu là não, nếp não viết "AI".
export function iconA(p = LIGHT) {
  const k = 1.08, cx = 100, cy = 62;
  // "A" ở bán cầu trái, "I" ở bán cầu phải (nét dày); khe giữa chỉ là hai khía mảnh;
  // nếp cuộn mảnh ôm theo mép trên/ngoài để bóng đọc ra là não.
  const letters = ['M -46 22 L -31 -18 L -16 22', 'M -41 9 L -21 9', 'M 26 -18 L 26 22'];
  const gyri = ['M 0 -30 L 0 -20', 'M 0 32 L 0 24', 'M -12 -28 C -24 -36 -40 -32 -48 -20',
    'M 12 -28 C 24 -36 40 -32 48 -20', 'M 46 26 C 52 18 50 8 54 0'];
  return `<g>`
    + `<rect x="${cx - 20}" y="100" width="40" height="28" fill="${p.brain}" stroke="${p.ink}" stroke-width="${SW}"/>`
    + suit(cx, 118, 194, 80, p)
    + brain(cx, cy, k, p, letters, 12)
    + `<g transform="translate(${cx} ${cy}) scale(${k})">${gyri.map((d) => `<path d="${d}" fill="none" stroke="${p.fold}" stroke-width="${(5 / k).toFixed(2)}" stroke-linecap="round"/>`).join('')}</g>`
    + `</g>`;
}

// B — Chữ A là người: thân vest hình chữ A (khe chân), cổ V + cà vạt là thanh ngang; đầu não nhỏ; chữ I cạnh bên.
export function iconB(p = LIGHT) {
  const cx = 72, top = 68, bot = 192;
  const body = `M ${cx - 20} ${top} L ${cx + 20} ${top} C ${cx + 34} ${top} ${cx + 40} ${top + 8} ${cx + 44} ${top + 22} `
    + `L ${cx + 60} ${bot} L ${cx + 14} ${bot} L ${cx} ${bot - 44} L ${cx - 14} ${bot} L ${cx - 60} ${bot} `
    + `L ${cx - 44} ${top + 22} C ${cx - 40} ${top + 8} ${cx - 34} ${top} ${cx - 20} ${top} Z`;
  const v = `M ${cx - 16} ${top} L ${cx + 16} ${top} L ${cx} ${top + 48} Z`;
  const tie = `M ${cx - 6} ${top + 2} L ${cx + 6} ${top + 2} L ${cx + 4} ${top + 12} L ${cx + 8} ${top + 40} L ${cx} ${top + 50} L ${cx - 8} ${top + 40} L ${cx - 4} ${top + 12} Z`;
  return `<g>`
    + `<path d="${body}" fill="${p.suit}" stroke="${p.ink}" stroke-width="${SW}" stroke-linejoin="round"/>`
    + `<path d="${v}" fill="${p.shirt}" stroke="${p.ink}" stroke-width="${SW}" stroke-linejoin="round"/>`
    + `<path d="${tie}" fill="${p.ink}"/>`
    + `<rect x="${cx - 9}" y="52" width="18" height="20" fill="${p.brain}" stroke="${p.ink}" stroke-width="${SW}"/>`
    + brain(cx, 34, 0.6, p, SIMPLE_FOLDS, 5)
    + `<rect x="150" y="${top}" width="36" height="${bot - top}" rx="8" fill="${p.suit}" stroke="${p.ink}" stroke-width="${SW}"/>`
    + `</g>`;
}

// C — Thẻ nhân sự cấp cao: thẻ đeo (không sừng), ảnh chân dung là sếp đầu não, dòng chức danh "AI".
export function iconC(p = LIGHT) {
  const x = 34, y = 26, w = 132, h = 168;
  const win = { x: 48, y: 46, w: 104, h: 98 };
  const clip = `badgeWin${p === DARK ? 'D' : 'L'}`;
  const ai = textPath('AI', { ...HEAD, size: 40, x: 100, y: baselineFor(169, 40), fill: p.ink === C['dark-bg'] ? C['dark-bg'] : C.text, anchor: 'middle' });
  return `<g>`
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${p.brain}" stroke="${p.ink}" stroke-width="${SW}"/>`
    + `<rect x="80" y="10" width="40" height="26" rx="8" fill="${p.ink}"/>`
    + `<rect x="88" y="18" width="24" height="8" rx="4" fill="${p.brain}"/>`
    + `<clipPath id="${clip}"><rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="12"/></clipPath>`
    + `<rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="12" fill="${p.shirt}"/>`
    + `<g clip-path="url(#${clip})">${suit(100, 116, 152, 46, p)}${brain(100, 82, 0.62, p, SIMPLE_FOLDS, 4, 5)}</g>`
    + `<rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="12" fill="none" stroke="${p.ink}" stroke-width="${SW}"/>`
    + ai.svg
    + `</g>`;
}

export function wordmark(x, cy, size = 64) {
  const lead = 'Đi làm với ';
  const y = baselineFor(cy, size);
  const a = textPath(lead, { ...HEAD, size, x, y, fill: C.text });
  const b = textPath('AI', { ...HEAD, size, x: x + a.width, y, fill: C.primary });
  return { svg: a.svg + b.svg, width: a.width + b.width };
}

const ICONS = { a: iconA, b: iconB, c: iconC };
const OPTICAL_CY = { a: 104, b: 116, c: 110 };

const lockup = (k) => `${ICONS[k]()}${wordmark(232, OPTICAL_CY[k]).svg}`;
const svgDoc = (w, h, body, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
  + (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') + body + `</svg>\n`;

const LABELS = {
  a: 'A — Sếp đầu não (nếp não viết AI)',
  b: 'B — Chữ A là người',
  c: 'C — Thẻ nhân sự cấp cao',
};

function compareSheet() {
  const W = 1600, ROW = 300, H = ROW * 3 + 40;
  let body = '';
  ['a', 'b', 'c'].forEach((k, i) => {
    const y0 = 20 + i * ROW;
    if (i) body += `<rect x="40" y="${y0}" width="${W - 80}" height="2" fill="${C.surface}"/>`;
    body += textPath(LABELS[k], { ...BODY, size: 22, x: 48, y: y0 + 44, fill: C['text-muted'] }).svg;
    body += `<g transform="translate(48 ${y0 + 70})">${lockup(k)}</g>`;
    let x = 900;
    [96, 48, 32].forEach((s) => {
      const ty = y0 + 70 + (200 - s) / 2 + 40;
      body += `<g transform="translate(${x} ${ty}) scale(${s / 200})">${ICONS[k]()}</g>`;
      body += textPath(`${s}px`, { ...BODY, size: 14, x: x + s / 2, y: y0 + 270, fill: C['text-muted'], anchor: 'middle' }).svg;
      x += s + 48;
    });
    // avatar tròn 40px trên surface (Facebook cắt tròn), icon chiếm ~32px
    const ax = x + 20, ay = y0 + 70 + 100 + 40;
    body += `<circle cx="${ax}" cy="${ay}" r="20" fill="${C.surface}"/>`;
    body += `<g transform="translate(${ax - 15} ${ay - 15}) scale(${30 / 200})">${ICONS[k]()}</g>`;
    body += textPath('avatar', { ...BODY, size: 14, x: ax, y: y0 + 270, fill: C['text-muted'], anchor: 'middle' }).svg;
    // nền tối 48px
    const dx = ax + 56;
    body += `<rect x="${dx}" y="${ay - 36}" width="72" height="72" rx="14" fill="${C['dark-bg']}"/>`;
    body += `<g transform="translate(${dx + 12} ${ay - 24}) scale(${48 / 200})">${ICONS[k](DARK)}</g>`;
    body += textPath('nền tối', { ...BODY, size: 14, x: dx + 36, y: y0 + 270, fill: C['text-muted'], anchor: 'middle' }).svg;
  });
  return svgDoc(W, H, body, C.background);
}

if (path.basename(process.argv[1] ?? '') === 'logo2-sketches.mjs') {
  fs.mkdirSync(OUT, { recursive: true });
  for (const k of ['a', 'b', 'c']) {
    fs.writeFileSync(path.join(OUT, `logo2-${k}.svg`), svgDoc(760, 200, lockup(k)));
  }
  const cmp = compareSheet();
  fs.writeFileSync(path.join(OUT, 'logo2-compare.svg'), cmp);
  fs.writeFileSync(path.join(OUT, 'logo2-compare.png'), renderPng(cmp, 1600));
  console.log('ok: logo2-a/b/c.svg, logo2-compare.svg, logo2-compare.png');
}
