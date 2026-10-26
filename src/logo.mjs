// Bộ logo "Đi làm với AI" — hướng A: thẻ nhân viên mọc sừng (Nghé đi làm).
// Chạy: node src/logo.mjs → 01-logo/svg/*.svg + 01-logo/png/*-{512,1024,2048}.png
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { COLORS, ROUNDED } from './tokens.mjs';
import { textPath } from './textpath.mjs';
import { fontPath } from './fonts.mjs';
import { renderSizes, renderPng } from './render.mjs';

const HEAD = { family: 'Bricolage Grotesque', weight: 800 };
const STROKE = 6; // nét viền ở khung 200

// Chiều cao chữ hoa / em, để đặt baseline sao cho chữ hoa nằm giữa theo trục dọc.
const capRatio = (() => {
  const f = opentype.loadSync(fontPath(HEAD.family, HEAD.weight));
  return (f.tables.os2.sCapHeight || f.charToGlyph('H').getBoundingBox().y2) / f.unitsPerEm;
})();
const baselineFor = (cy, size) => cy + (capRatio * size) / 2;

// Hình học icon (khung 0..200). Mọi vị trí khác suy ra từ tâm thẻ `cx`.
const CARD = { w: 100, h: 116, top: 66, rx: 22 };
CARD.x = 100 - CARD.w / 2;
const CARD_CY = CARD.top + CARD.h / 2 + 6; // tâm mặt thẻ (dưới khe đeo)
// Wordmark ngang canh theo thân thẻ (khối nặng nhất), không theo khung có sừng.
const OPTICAL_CY = CARD.top + CARD.h / 2;

// Sừng trâu nước bên trái, gốc nằm sau mép trên thẻ ở (rx, ry):
// thân dày quét gần như nằm ngang ra ngoài, rồi cong ngược lên thành lưỡi liềm, chóp quặp vào.
const hornLeft = (rx, ry) => {
  const p = (dx, dy) => `${rx + dx} ${ry + dy}`;
  return `M ${p(0, -2)}`
    + ` C ${p(-28, -2)} ${p(-48, -12)} ${p(-40, -48)}` // mép trong: ra ngang, vút lên, chóp quặp vào
    + ` C ${p(-60, -32)} ${p(-66, 14)} ${p(-34, 28)}` // mép ngoài: ôm vòng xuống dưới
    + ` C ${p(-22, 30)} ${p(-10, 30)} ${p(4, 30)} Z`; // đáy sừng quay về gốc
};

// Mặt thẻ: 'ai' = chữ AI; 'smile' = hai mắt chấm + miệng cười (gợi Nghé).
function faceShapes(face, cx, fill) {
  if (face === 'smile') {
    const ey = CARD_CY - 8, dx = 22;
    return `<circle cx="${cx - dx}" cy="${ey}" r="9" fill="${fill}"/>`
      + `<circle cx="${cx + dx}" cy="${ey}" r="9" fill="${fill}"/>`
      + `<path d="M ${cx - 18} ${ey + 22} Q ${cx} ${ey + 40} ${cx + 18} ${ey + 22}" fill="none" stroke="${fill}" stroke-width="8" stroke-linecap="round"/>`;
  }
  const size = 58;
  return textPath('AI', { ...HEAD, size, x: cx, y: baselineFor(CARD_CY, size), fill, anchor: 'middle' }).svg;
}

/**
 * Icon thẻ nhân viên mọc sừng, khung 200×200 thu về `size`.
 * Mọi màu lấy từ palette `c` (outline, card, face, horn, strap, clip).
 * c.knockout = true → bản 1 màu: thẻ tô mực, mặt thẻ đục thủng (mask), sừng chỉ có viền.
 */
export function icon(c, { size = 200, face = 'ai' } = {}) {
  const { x, w, h, top, rx } = CARD;
  const cx = x + w / 2;
  const line = `stroke="${c.outline}" stroke-width="${STROKE}" stroke-linejoin="round"`;

  // Sừng: vẽ trước, gốc khuất sau thẻ.
  const horn = hornLeft(x + 14, top + 8);
  const horns = `<path d="${horn}" fill="${c.horn}" ${line}/>`
    + `<path d="${horn}" fill="${c.horn}" ${line} transform="translate(${2 * cx} 0) scale(-1 1)"/>`;

  // Dây đeo: hai quai ngắn chụm xuống kẹp ở khe thẻ.
  const slotY = top + 14;
  const strapTop = top - 32, spread = 24, strapW = 10;
  const strapD = `M ${cx - spread} ${strapTop} L ${cx} ${top - 4} L ${cx + spread} ${strapTop}`;
  const strapLine = (color, width) => `<path d="${strapD}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const straps = c.knockout ? strapLine(c.strap, strapW + STROKE)
    : strapLine(c.outline, strapW + STROKE) + strapLine(c.strap, strapW);
  const clip = `<rect x="${cx - 8}" y="${top - 12}" width="16" height="${slotY - top + 18}" rx="5" fill="${c.clip}"/>`;
  const slot = (fill) => `<rect x="${cx - 20}" y="${slotY - 5}" width="40" height="10" rx="5" fill="${fill}"/>`;

  const cardRect = (extra) => `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="${rx}" ${extra}/>`;
  let card;
  if (c.knockout) {
    const id = `the-${face}`;
    card = `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">`
      + `<rect width="200" height="200" fill="#fff"/>${slot('#000')}${faceShapes(face, cx, '#000')}</mask>`
      + cardRect(`fill="${c.card}" ${line} mask="url(#${id})"`);
  } else {
    card = cardRect(`fill="${c.card}" ${line}`) + slot(c.face) + faceShapes(face, cx, c.face);
  }

  const body = horns + straps + card + clip;
  return size === 200 ? `<g>${body}</g>` : `<g transform="scale(${size / 200})">${body}</g>`;
}

const WM = { ...HEAD, size: 64 };
function wordmark(c, x, y, anchor = 'start') {
  const head = textPath('Đi làm với ', WM);
  const ai = textPath('AI', WM);
  const total = head.width + ai.width;
  const x0 = anchor === 'middle' ? x - total / 2 : x;
  return {
    width: total,
    svg: textPath('Đi làm với ', { ...WM, x: x0, y, fill: c.lead }).svg
      + textPath('AI', { ...WM, x: x0 + head.width, y, fill: c.accent }).svg,
  };
}

const FULL = {
  // Thẻ xanh pastel viền navy, mặt thẻ navy (7.75 trên pastel); dây đeo xanh đậm, kẹp navy.
  outline: COLORS.text, card: COLORS['primary-soft'], face: COLORS.text, horn: COLORS.horn,
  strap: COLORS.primary, clip: COLORS.text, lead: COLORS.text, accent: COLORS.primary,
};
const mono = (ink) => ({
  knockout: true, outline: ink, card: ink, horn: 'none', strap: ink, clip: ink, lead: ink, accent: ink,
});
export const PALETTES = {
  full: FULL,
  'mono-navy': mono(COLORS.text),
  'mono-trang': mono('#FFFFFF'),
  // Nền tối: chữ primary không đủ tương phản trên dark-bg → chữ dẫn trắng, "AI" xanh pastel.
  'nen-toi': { ...FULL, lead: COLORS.background, accent: COLORS['primary-soft'] },
};

const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
  + (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') + body + '</svg>\n';

const WM_GAP = 28; // khoảng icon → wordmark ở bản ngang
const PAD = 12;
function ngang(c, bg) {
  const wm = wordmark(c, 200 + WM_GAP, baselineFor(OPTICAL_CY, WM.size));
  return svg(Math.ceil(200 + WM_GAP + wm.width + PAD), 200, icon(c, { face: 'smile' }) + wm.svg, bg);
}
// Bản dọc: icon trên, wordmark dưới; khoảng hở icon → đỉnh chữ hoa = WM_GAP.
const ICON_BOTTOM = CARD.top + CARD.h + STROKE / 2;
function doc(c, bg) {
  const W = 480;
  const baseline = ICON_BOTTOM + WM_GAP + capRatio * WM.size;
  const wm = wordmark(c, W / 2, baseline, 'middle');
  return svg(W, Math.ceil(baseline + 2 * PAD), `<g transform="translate(${W / 2 - 100} 0)">${icon(c, { face: 'smile' })}</g>${wm.svg}`, bg);
}

export function variants() {
  const A = 240, inset = 20;
  return {
    'logo-ngang': ngang(PALETTES.full),
    'logo-doc': doc(PALETTES.full),
    'logo-ngang-mono-navy': ngang(PALETTES['mono-navy']),
    'logo-ngang-mono-trang': ngang(PALETTES['mono-trang']),
    'logo-ngang-nen-toi': ngang(PALETTES['nen-toi'], COLORS['dark-bg']),
    'logo-doc-nen-toi': doc(PALETTES['nen-toi'], COLORS['dark-bg']),
    icon: svg(200, 200, icon(PALETTES.full)),
    'icon-avatar': svg(A, A, `<rect width="${A}" height="${A}" rx="${ROUNDED.lg}" fill="${COLORS.background}"/>`
      + `<g transform="translate(${inset} ${inset})">${icon(PALETTES.full)}</g>`),
  };
}

export function buildLogos(dir = '01-logo') {
  const out = [];
  fs.mkdirSync(`${dir}/svg`, { recursive: true });
  for (const [name, s] of Object.entries(variants())) {
    const f = `${dir}/svg/${name}.svg`;
    fs.writeFileSync(f, s);
    out.push(f, ...renderSizes(f, `${dir}/png/${name}`));
  }
  return out;
}

// Trang duyệt: 8 biến thể trên nền trung tính, mỗi ô đặt trên nền đúng mục đích, kèm thử 32px.
const LABEL = { family: 'Be Vietnam Pro', weight: 600, size: 18 };
const DARK = COLORS['dark-bg'];
const TILE_BG = { // ô mặc định nền trắng xanh; bản nền tối tự có nền
  'logo-ngang-mono-trang': DARK, 'logo-ngang-nen-toi': DARK, 'logo-doc-nen-toi': DARK,
  'icon-avatar': '#C9D3DE', // xám xanh trung tính để thấy viền ô vuông nền sáng
};
export function previewSheet() {
  const all = variants();
  const W = 1820, cellW = 850, cellH = 400, gap = 40, cols = 2;
  const names = Object.keys(all);
  const H = gap + Math.ceil(names.length / cols) * (cellH + gap);
  let body = '';
  names.forEach((name, i) => {
    const x0 = gap + (i % cols) * (cellW + gap), y0 = gap + Math.floor(i / cols) * (cellH + gap);
    const doc = all[name];
    const [, vw, vh] = doc.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
    const bg = TILE_BG[name] ?? COLORS.background;
    body += `<rect x="${x0}" y="${y0}" width="${cellW}" height="${cellH}" rx="16" fill="${bg}"/>`;
    const href = `data:image/svg+xml;base64,${Buffer.from(doc).toString('base64')}`;
    const maxW = cellW - 200, maxH = cellH - 110;
    const k = Math.min(maxW / vw, maxH / vh);
    const iw = vw * k, ih = vh * k;
    body += `<image href="${href}" x="${x0 + 40 + (maxW - iw) / 2}" y="${y0 + 30 + (maxH - ih) / 2}" width="${iw}" height="${ih}"/>`;
    // thử nhỏ: chiều cao 32px
    const sk = 32 / vh;
    body += `<image href="${href}" x="${x0 + cellW - 40 - vw * sk}" y="${y0 + cellH / 2 - 16}" width="${vw * sk}" height="32"/>`;
    const ink = bg === DARK ? COLORS.surface : COLORS['text-muted'];
    body += textPath(`${name}.svg`, { ...LABEL, x: x0 + 28, y: y0 + cellH - 26, fill: ink }).svg;
    body += textPath('cao 32px', { ...LABEL, size: 14, x: x0 + cellW - 40 - (vw * sk) / 2, y: y0 + cellH / 2 + 40, fill: ink, anchor: 'middle' }).svg;
  });
  return svg(W, H, body, '#DDE4EC');
}

if (path.basename(process.argv[1] ?? '') === 'logo.mjs') {
  console.log(buildLogos().length, 'files');
  fs.writeFileSync('01-logo/preview-all.png', renderPng(previewSheet(), 1820));
  console.log('+ 01-logo/preview-all.png');
}
