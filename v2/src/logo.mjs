// [v2] Bộ logo "Đi làm với AI" — A2 sau đánh giá lại: bỏ cổ áo, cà vạt to-dày để đọc được ở 32px,
// wordmark canh theo tâm thẻ lệnh, cà vạt sáng hơn ở nền tối. Bản gốc ở src/logo.mjs giữ nguyên.
// AI là một đồng nghiệp cấp cao (cà vạt) có gương mặt là dấu nhắc lệnh — nơi mình giao việc cho Agent.
// Không sừng, không não, không chữ "AI" trong biểu tượng.
// Chạy (từ thư mục gốc repo): node v2/src/logo.mjs → v2/01-logo/...
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { COLORS, ROUNDED } from './tokens.mjs';
import { textPath } from '../../src/textpath.mjs';
import { fontPath } from '../../src/fonts.mjs';
import { renderSizes, renderPng } from '../../src/render.mjs';

const HEAD = { family: 'Bricolage Grotesque', weight: 800 };
const headFont = opentype.loadSync(fontPath(HEAD.family, HEAD.weight));
const capRatio = (headFont.tables.os2.sCapHeight || headFont.charToGlyph('H').getBoundingBox().y2) / headFont.unitsPerEm;

// Hình học đã duyệt trên canvas, khung 0 0 200 220 (vẽ đúng thứ tự này).
export const MARK = { w: 200, h: 220 };
// v2: không cổ áo. Nút to (34 rộng), thân rộng tới 50 — ở cao 32px vẫn thấy rõ hình cà vạt.
const TIE_KNOT = 'M83 132 L117 132 L111 158 L89 158 Z';
const TIE_BODY = 'M89 154 L111 154 L125 190 L100 216 L75 190 Z';
const TAG = { x: 18, y: 18, w: 164, h: 112, rx: 30 };
export const CHEVRON = 'M58 52 L84 74 L58 96';
const CURSOR = { x: 98, y: 86, w: 48, h: 13, rx: 6.5 };
// Hộp mực thật của biểu tượng (gồm nửa nét viền): x 14..186, y 14..219.
export const INK_BOX = { x1: 14, y1: 14, x2: 186, y2: 219 };

const tagRect = (attrs) => `<rect x="${TAG.x}" y="${TAG.y}" width="${TAG.w}" height="${TAG.h}" rx="${TAG.rx}" ${attrs}/>`;
const cursorRect = (fill) => `<rect x="${CURSOR.x}" y="${CURSOR.y}" width="${CURSOR.w}" height="${CURSOR.h}" rx="${CURSOR.rx}" fill="${fill}"/>`;
const chevron = (stroke) => `<path d="${CHEVRON}" fill="none" stroke="${stroke}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`;

let maskSeq = 0;
/**
 * Biểu tượng A2 khung 200×220, thu về rộng `size` (cao = 1.1 × size).
 * Mọi màu lấy từ palette `c` (outline, tie, tag, prompt).
 * c.knockout = true → bản 1 màu: mọi hình tô mực, rồi đục thủng (mask) dấu nhắc lệnh
 * và hai khe: thẻ / nút cà vạt, nút / thân cà vạt.
 */
export function icon(c, { size = MARK.w } = {}) {
  const line = `stroke="${c.outline}" stroke-width="6" stroke-linejoin="round"`;
  let body;
  if (c.knockout) {
    const ink = c.outline;
    const id = `a2-${++maskSeq}`;
    const white = 'fill="#fff" stroke="#fff" stroke-width="6" stroke-linejoin="round"';
    const mask = `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${MARK.w}" height="${MARK.h}">`
      + `<rect width="${MARK.w}" height="${MARK.h}" fill="#fff"/>`
      + `<path d="${TIE_KNOT}" ${white}/><path d="${TIE_BODY}" ${white}/>`
      + tagRect('fill="#fff" stroke="#fff" stroke-width="8"')
      + '<path d="M78 136.4 L122 136.4" stroke="#000" stroke-width="3.8"/>' // khe thẻ / nút cà vạt
      + '<path d="M80 156 L120 156" stroke="#000" stroke-width="3.5"/>' // khe nút / thân cà vạt
      + chevron('#000') + cursorRect('#000')
      + '</mask>';
    const solid = (d) => `<path d="${d}" fill="${ink}" ${line}/>`;
    body = mask + `<g mask="url(#${id})">`
      + solid(TIE_KNOT) + solid(TIE_BODY)
      + tagRect(`fill="${ink}" stroke="${ink}" stroke-width="8"`)
      + '</g>';
  } else {
    body = `<path d="${TIE_KNOT}" fill="${c.tie}" ${line}/>`
      + `<path d="${TIE_BODY}" fill="${c.tie}" ${line}/>`
      + tagRect(`fill="${c.tag}" stroke="${c.outline}" stroke-width="8"`)
      + chevron(c.prompt) + cursorRect(c.prompt);
  }
  return size === MARK.w ? `<g>${body}</g>` : `<g transform="scale(${size / MARK.w})">${body}</g>`;
}

// ---------- Wordmark: "Đi làm với " + "AI" trên viên thuốc tô nền ----------
const WM = { ...HEAD, size: 64 };
const PILL = { padX: 0.2, padY: 0.17, rx: 0.3 }; // theo tỉ lệ cỡ chữ
/** Hộp mực thật (theo opentype) của một chuỗi đặt tại (x, baseline). */
const inkBox = (text, x, y, size) => headFont.getPath(text, x, y, size, { kerning: true }).getBoundingBox();

/**
 * Wordmark đặt tại (x, baseline). Trả về svg + hộp mực {x1,y1,x2,y2} (gồm cả viên thuốc).
 * c.knockout → viên thuốc tô mực, chữ "AI" đục thủng.
 */
function wordmark(c, x, y, anchor = 'start') {
  const size = WM.size;
  const head = textPath('Đi làm với ', WM);
  const ai = textPath('AI', WM);
  const padX = PILL.padX * size, padY = PILL.padY * size;
  const total = head.width + ai.width + 2 * padX;
  const x0 = anchor === 'middle' ? x - total / 2 : x;
  const pill = { x: x0 + head.width, y: y - capRatio * size - padY, w: ai.width + 2 * padX, h: capRatio * size + 2 * padY };
  const aiX = pill.x + padX;
  const f = (v) => n2(v);
  const pillRect = (fill, extra = '') => `<rect x="${f(pill.x)}" y="${f(pill.y)}" width="${f(pill.w)}" height="${f(pill.h)}" rx="${f(PILL.rx * size)}" fill="${fill}"${extra}/>`;
  let svgPill;
  if (c.knockout) {
    const id = `a2-${++maskSeq}`;
    svgPill = `<mask id="${id}" maskUnits="userSpaceOnUse" x="${f(pill.x - 2)}" y="${f(pill.y - 2)}" width="${f(pill.w + 4)}" height="${f(pill.h + 4)}">`
      + pillRect('#fff') + textPath('AI', { ...WM, x: aiX, y, fill: '#000' }).svg + '</mask>'
      + pillRect(c.pill, ` mask="url(#${id})"`);
  } else {
    svgPill = pillRect(c.pill) + textPath('AI', { ...WM, x: aiX, y, fill: c.accent }).svg;
  }
  const hb = inkBox('Đi làm với ', x0, y, size);
  return {
    width: total,
    box: { x1: Math.min(hb.x1, pill.x), y1: Math.min(hb.y1, pill.y), x2: pill.x + pill.w, y2: Math.max(hb.y2, pill.y + pill.h) },
    svg: textPath('Đi làm với ', { ...WM, x: x0, y, fill: c.lead }).svg + svgPill,
  };
}

const FULL = {
  // Thẻ xanh pastel viền navy, dấu nhắc navy (7.75 trên pastel); cà vạt xanh đậm.
  outline: COLORS.text, tie: COLORS.primary, tag: COLORS['primary-soft'], prompt: COLORS.text,
  // Wordmark: chữ navy, "AI" xanh đậm trên viên thuốc pastel (4.73, chữ lớn).
  lead: COLORS.text, accent: COLORS.primary, pill: COLORS['primary-soft'],
};
const mono = (ink) => ({ knockout: true, outline: ink, lead: ink, pill: ink });
export const PALETTES = {
  full: FULL,
  'mono-navy': mono(COLORS.text),
  'mono-trang': mono('#FFFFFF'),
  // Nền tối: chữ dẫn trắng; "AI" navy trên viên thuốc pastel (7.75), viên thuốc pastel trên dark-bg (10.56).
  'nen-toi': { ...FULL, tie: COLORS['tie-dark'], lead: COLORS.background, accent: COLORS.text }, // cà vạt sáng: tách khỏi nền tối (>3:1)
};

const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
  + (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') + body + '</svg>\n';

const WM_GAP = 30; // khoảng hở mực icon → mực wordmark
const PAD = 14; // lề quanh mực
function n2(v) { return Math.round(v * 100) / 100; }

// Bản ngang: icon trái, wordmark phải; wordmark canh giữa theo tâm THẺ lệnh (cà vạt thả dưới như cà vạt thật).
const NGANG_BASE = 74 + (capRatio * WM.size) / 2;
function ngang(c, bg) {
  const wm = wordmark(c, INK_BOX.x2 + WM_GAP, NGANG_BASE);
  const top = Math.min(INK_BOX.y1, wm.box.y1), bottom = Math.max(INK_BOX.y2, wm.box.y2);
  const dx = PAD - INK_BOX.x1, dy = PAD - top;
  const W = Math.ceil(wm.box.x2 + dx + PAD), H = Math.ceil(bottom - top + 2 * PAD);
  return svg(W, H, `<g transform="translate(${n2(dx)} ${n2(dy)})">${icon(c)}${wm.svg}</g>`, bg);
}
/** Đường chân chữ wordmark trong bản ngang (đơn vị viewBox) — để trang khác canh chữ cùng hàng với logo. */
export function ngangBaseline() {
  const wm = wordmark(PALETTES.full, 0, NGANG_BASE);
  return NGANG_BASE + PAD - Math.min(INK_BOX.y1, wm.box.y1);
}

// Bản dọc: icon trên, wordmark dưới (canh giữa), khoảng hở mực = WM_GAP.
function doc(c, bg) {
  const probe = wordmark({ ...c, knockout: false }, 0, 0, 'middle');
  const half = Math.max(-probe.box.x1, probe.box.x2, (INK_BOX.x2 - INK_BOX.x1) / 2);
  const W = Math.ceil(2 * (half + PAD));
  const base = INK_BOX.y2 + WM_GAP - probe.box.y1; // đỉnh mực wordmark cách đáy icon WM_GAP
  const wm = wordmark(c, W / 2, base, 'middle');
  const dy = PAD - INK_BOX.y1;
  const H = Math.ceil(wm.box.y2 + dy + PAD);
  return svg(W, H, `<g transform="translate(0 ${n2(dy)})"><g transform="translate(${n2(W / 2 - MARK.w / 2)} 0)">${icon(c)}</g>${wm.svg}</g>`, bg);
}

// Icon vuông: mực biểu tượng (172×205) canh giữa ô vuông.
const MARK_CX = (INK_BOX.x1 + INK_BOX.x2) / 2, MARK_CY = (INK_BOX.y1 + INK_BOX.y2) / 2;
const centered = (S, k = 1) => `<g transform="translate(${n2(S / 2 - MARK_CX * k)} ${n2(S / 2 - MARK_CY * k)}) scale(${k})">${icon(PALETTES.full)}</g>`;

export function variants() {
  const S = 220, A = 240;
  // Mỗi file đánh số mask lại từ 1 → id ổn định giữa các lần build.
  const fresh = (f) => { maskSeq = 0; return f(); };
  return {
    'logo-ngang': fresh(() => ngang(PALETTES.full)),
    'logo-doc': fresh(() => doc(PALETTES.full)),
    'logo-ngang-mono-navy': fresh(() => ngang(PALETTES['mono-navy'])),
    'logo-ngang-mono-trang': fresh(() => ngang(PALETTES['mono-trang'])),
    'logo-ngang-nen-toi': fresh(() => ngang(PALETTES['nen-toi'], COLORS['dark-bg'])),
    'logo-doc-nen-toi': fresh(() => doc(PALETTES['nen-toi'], COLORS['dark-bg'])),
    icon: svg(S, S, centered(S)),
    'icon-avatar': svg(A, A, `<rect width="${A}" height="${A}" rx="${ROUNDED.lg}" fill="${COLORS.surface}"/>` + centered(A, 0.88)), // v2: nền xanh nhạt tách khỏi nền trắng, biểu tượng 88% để an toàn khi cắt avatar tròn
  };
}

export function buildLogos(dir = 'v2/01-logo') {
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
  fs.writeFileSync('v2/01-logo/preview-all.png', renderPng(previewSheet(), 1820));
  console.log('+ v2/01-logo/preview-all.png');
}
