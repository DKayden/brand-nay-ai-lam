// Brand board 1080×1350 + 4 mockup + poster phẳng cho bài dự thi "Nghé — nhân sự AI mới của Đi làm với AI".
// Tái dùng SVG logo/mascot đã duyệt (nhúng thẳng, không vẽ lại). Mọi chữ là path (textPath), không có <text>.
// Chạy: node src/board.mjs → board/*.svg|png
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { COLORS as C } from './tokens.mjs';
import { textPath, measure } from './textpath.mjs';
import { fontPath } from './fonts.mjs';
import { renderPng } from './render.mjs';

const LOGO = '01-logo/svg', MASCOT = '03-mascot/svg', OUT = 'board';
const H800 = { family: 'Bricolage Grotesque', weight: 800 };
const H700 = { family: 'Bricolage Grotesque', weight: 700 };
const B400 = { family: 'Be Vietnam Pro', weight: 400 };
const B500 = { family: 'Be Vietnam Pro', weight: 500 };
const B600 = { family: 'Be Vietnam Pro', weight: 600 };
const INK = C.text;

let embedCount = 0;
/**
 * Nhúng một file SVG vào (x, y), co giãn để rộng `w` (scale = w / viewBoxWidth).
 * Mỗi lần nhúng đổi tên id (id-<n>) để nhiều SVG trong một tài liệu không đụng id
 * (vd. mask "the-smile" của logo mono).
 * opts.noBg: bỏ hình chữ nhật nền phủ kín viewBox (bản logo nền tối) để đặt lên nền riêng.
 */
export function embed(file, x, y, w, { noBg = false } = {}) {
  const s = fs.readFileSync(file, 'utf8');
  const [, , vw, vh] = s.match(/viewBox="([\d.\s-]+)"/)[1].trim().split(/\s+/).map(Number);
  let inner = s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  if (noBg) inner = inner.replace(new RegExp(`^<rect width="${vw}" height="${vh}" fill="[^"]+"/>`), '');
  const n = ++embedCount;
  const ids = [...inner.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) {
    inner = inner.replaceAll(`id="${id}"`, `id="${id}-${n}"`)
      .replaceAll(`url(#${id})`, `url(#${id}-${n})`)
      .replaceAll(`href="#${id}"`, `href="#${id}-${n}"`);
  }
  return `<g transform="translate(${x},${y}) scale(${w / vw})">${inner}</g>`;
}
const ratio = (file) => {
  const [, , vw, vh] = fs.readFileSync(file, 'utf8').match(/viewBox="([\d.\s-]+)"/)[1].trim().split(/\s+/).map(Number);
  return vh / vw;
};

// ---------- chữ ----------
const capCache = new Map();
/** Chiều cao chữ hoa (px) của một kiểu chữ ở cỡ size — dùng để canh dọc theo mép trên chữ. */
const cap = (style, size = style.size) => {
  const k = `${style.family}|${style.weight}`;
  if (!capCache.has(k)) {
    const f = opentype.loadSync(fontPath(style.family, style.weight));
    capCache.set(k, (f.tables.os2.sCapHeight || f.charToGlyph('H').getBoundingBox().y2) / f.unitsPerEm);
  }
  return capCache.get(k) * size;
};
const T = (s, style, x, y, fill = INK, anchor = 'start') => textPath(s, { ...style, x, y, fill, anchor }).svg;
const W_ = (s, style) => measure(s, style);

/** Ngắt dòng tham lam theo bề rộng tối đa. */
export function wrap(text, style, maxW) {
  const lines = [];
  let cur = '';
  for (const word of text.split(/\s+/)) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && W_(next, style) > maxW) { lines.push(cur); cur = word; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}
/** Đoạn văn nhiều dòng; trả về { svg, bottom } với bottom = baseline dòng cuối. */
function para(text, style, x, y, maxW, lh, fill = INK, anchor = 'start') {
  const lines = wrap(text, style, maxW);
  return {
    svg: lines.map((l, i) => T(l, style, x, y + i * lh, fill, anchor)).join(''),
    bottom: y + (lines.length - 1) * lh,
    lines: lines.length,
  };
}
/** Một dòng nhiều màu: [[chữ, màu], ...]. */
function runs(parts, style, x, y, anchor = 'start') {
  const total = parts.reduce((a, [s]) => a + W_(s, style), 0);
  let cx = anchor === 'middle' ? x - total / 2 : anchor === 'end' ? x - total : x;
  return parts.map(([s, fill]) => { const o = T(s, style, cx, y, fill); cx += W_(s, style); return o; }).join('');
}

const doc = (w, h, body, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
  + `<rect width="${w}" height="${h}" fill="${bg}"/>${body}</svg>\n`;
const rect = (x, y, w, h, rx, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const OUTLINE = (sw = 3) => `stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"`;
/** Thẻ nổi kiểu sticker: bóng cứng lệch xuống, không mờ. */
const stickerCard = (x, y, w, h, rx, fill, { sw = 3, drop = 6 } = {}) =>
  rect(x, y + drop, w, h, rx, INK) + rect(x, y, w, h, rx, fill, OUTLINE(sw));
const pill = (label, style, x, y, { fill, ink, padX = 20, h = 44 }) => {
  const w = W_(label, style) + padX * 2;
  return { w, svg: rect(x, y, w, h, h / 2, fill) + T(label, style, x + padX, y + h / 2 + cap(style) / 2, ink) };
};

// ================= BRAND BOARD 1080×1350 =================
export function brandBoard() {
  const W = 1080, H = 1350, M = 56, colW = W - 2 * M;
  let b = '';

  // --- Hero: trái logo + slogan, phải Nghé + 3 sticker ---
  const eyebrow = { ...B600, size: 20 };
  b += T('BỘ NHẬN DIỆN THƯƠNG HIỆU', eyebrow, M, M + cap(eyebrow), C.primary);
  const logoW = 500, logoY = 116;
  b += embed(`${LOGO}/logo-ngang.svg`, M - 4, logoY, logoW);
  const sl = { ...H800, size: 44 };
  const s1 = logoY + logoW * ratio(`${LOGO}/logo-ngang.svg`) + 52 + cap(sl);
  b += T('AI làm việc,', sl, M, s1);
  b += T('mình làm chủ.', sl, M, s1 + 52, C.primary);
  const desc = para('Group cho người đi làm muốn giao việc cho AI, và Nghé là nhân sự AI mới của group.',
    { ...B400, size: 22 }, M, s1 + 52 + 74, 470, 36, C['text-muted']);
  b += desc.svg;

  const nX = W - M - 380, nY = 40;
  b += `<circle cx="${nX + 190}" cy="${nY + 205}" r="178" fill="${C.surface}"/>`;
  b += embed(`${MASCOT}/nghe-nghe.svg`, nX, nY, 380);
  const stY = 432, stW = 116, stGap = (380 - 3 * stW) / 2;
  ['xong-roi-sep', 'y-sep-la', 'ca-phe-sang'].forEach((p, i) => {
    const x = nX + i * (stW + stGap);
    b += rect(x, stY, stW, stW, 20, C.surface);
    b += embed(`${MASCOT}/${p}.svg`, x + 4, stY + 4, stW - 8);
  });

  // --- tiêu đề mục ---
  const secHead = (n, title, y) => `<rect x="${M}" y="${y}" width="${colW}" height="2" fill="${C.surface}"/>`
    + T(n, { ...H700, size: 22 }, M, y + 24 + cap(H700, 22), C.primary)
    + T(title, { ...H700, size: 26 }, M + 44, y + 24 + cap(H700, 22), INK);
  const secTitleBase = (y) => y + 24 + cap(H700, 22);

  // --- 01 Màu ---
  let y = 576;
  b += secHead('01', 'Màu sắc', y);
  const sw = [['Cam đất', 'primary'], ['Cam nhạt', 'primary-soft'], ['Kem', 'background'],
    ['Be', 'surface'], ['Nâu đất', 'text'], ['Nâu đêm', 'dark-bg']];
  const cw = colW / 6, cy = secTitleBase(y) + 26 + 44;
  sw.forEach(([name, key], i) => {
    const cx = M + cw * i + cw / 2;
    b += `<circle cx="${cx}" cy="${cy}" r="44" fill="${C[key]}" ${OUTLINE(3)}/>`;
    b += T(name, { ...B600, size: 21 }, cx, cy + 44 + 34, INK, 'middle');
    b += T(C[key], { ...B500, size: 18 }, cx, cy + 44 + 60, C['text-muted'], 'middle');
  });

  // --- 02 Chữ ---
  y = cy + 44 + 60 + 32;
  b += secHead('02', 'Kiểu chữ', y);
  const aaBase = secTitleBase(y) + 28 + cap(H800, 88);
  const half = colW / 2;
  [[H800, 'Bricolage Grotesque', 'Tiêu đề · 700–800'], [B600, 'Be Vietnam Pro', 'Nội dung · 400–600']].forEach(([st, name, use], i) => {
    const x = M + i * half;
    b += T('Aa', { ...st, size: 88 }, x, aaBase, i === 0 ? C.primary : INK);
    const tx = x + W_('Aa', { ...st, size: 88 }) + 24;
    b += T(name, { ...B600, size: 22 }, tx, aaBase - 34, INK);
    b += T(use, { ...B500, size: 18 }, tx, aaBase, C['text-muted']);
  });
  const sample = aaBase + 44;
  b += T('Học AI bằng việc thật: giao rõ, duyệt kỹ, làm chủ.', { ...B500, size: 22 }, M, sample, INK);

  // --- 03 Giọng ---
  y = sample + 30;
  b += secHead('03', 'Giọng thương hiệu', y);
  const cardY = secTitleBase(y) + 24, cardH = 140, gap = 24, cardW = (colW - gap) / 2;
  const voice = [
    ['Giọng Group', 'Mang theo một việc lặp đi lặp lại, mình cùng biến nó thành quy trình.', C.surface],
    ['Giọng Nghé', 'Nghé nghe! Việc này để Nghé lo, cả nhà cứ đi pha cà phê ạ.', C.background],
  ];
  voice.forEach(([tag, line, fill], i) => {
    const x = M + i * (cardW + gap);
    b += stickerCard(x, cardY, cardW, cardH, 24, fill, { sw: 2, drop: 6 });
    b += T(tag.toUpperCase(), { ...B600, size: 16 }, x + 24, cardY + 24 + cap(B600, 16), i ? C.primary : C['text-muted']);
    b += para(`“${line}”`, { ...B500, size: 21 }, x + 24, cardY + 24 + cap(B600, 16) + 40, cardW - 48, 31, INK).svg;
  });

  // --- chân trang nền tối ---
  const fY = H - 88;
  b += rect(0, fY, W, 88, 0, C['dark-bg']);
  const ldW = 104, ldH = ldW * ratio(`${LOGO}/logo-doc-nen-toi.svg`);
  b += embed(`${LOGO}/logo-doc-nen-toi.svg`, M - 12, fY + (88 - ldH) / 2, ldW);
  b += T('Bài dự thi · Đi làm với AI', { ...B500, size: 18 }, M + ldW + 8, fY + 44 + cap(B500, 18) / 2, C.surface);
  b += T('#BrandNayAiLam', { ...H800, size: 30 }, W - M, fY + 44 + cap(H800, 30) / 2, C['primary-soft'], 'end');

  return doc(W, H, b, C.background);
}

// ================= MOCKUP: cover group 1640×856 =================
export function coverGroup() {
  const W = 1640, H = 856, SAFE_TOP = (H - 624) / 2; // 116
  let b = '';
  // Nghé bên phải trên đĩa kem
  const nS = 600, nX = W - 140 - nS, nY = SAFE_TOP - 4;
  b += `<circle cx="${nX + nS / 2}" cy="${nY + nS / 2 + 10}" r="${nS * 0.44}" fill="${C.background}"/>`;
  b += embed(`${MASCOT}/nghe-nghe.svg`, nX, nY, nS);
  // Trái: wordmark trên tấm nền tối + slogan kem
  const X = 120, lw = 600, lh = lw * ratio(`${LOGO}/logo-ngang-nen-toi.svg`);
  const panelY = SAFE_TOP + 118, pad = 28;
  b += stickerCard(X, panelY, lw + pad * 2, lh + pad, 28, C['dark-bg'], { sw: 0, drop: 0 });
  b += embed(`${LOGO}/logo-ngang-nen-toi.svg`, X + pad, panelY + pad / 2, lw, { noBg: true });
  const sl = { ...H800, size: 64 };
  const sy = panelY + lh + pad + 56 + cap(sl);
  b += T('AI làm việc,', sl, X, sy, C.background);
  b += T('mình làm chủ.', sl, X, sy + 74, C.background);
  return doc(W, H, b, C.primary);
}

// ================= MOCKUP: thẻ nhân viên 1200×900 =================
export function badgeMockup() {
  const W = 1200, H = 900;
  let b = '';
  const cardW = 480, cardH = 680, cx = W / 2, cardX = cx - cardW / 2, cardY = 170;
  b += `<circle cx="${cx}" cy="${cardY + cardH / 2}" r="400" fill="${C.surface}"/>`;
  // dây đeo: hai quai chụm vào kẹp
  const strap = (color, w) => `<path d="M ${cx - 150} -20 L ${cx - 14} ${cardY - 44} M ${cx + 150} -20 L ${cx + 14} ${cardY - 44}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  b += strap(INK, 46) + strap(C['primary-soft'], 34);
  b += rect(cx - 30, cardY - 62, 60, 44, 12, INK);
  b += rect(cx - 16, cardY - 28, 32, 56, 8, C.buffalo, OUTLINE(4));
  // thân thẻ
  b += stickerCard(cardX, cardY, cardW, cardH, 36, C.primary, { sw: 6, drop: 12 });
  b += rect(cx - 50, cardY + 22, 100, 18, 9, C['dark-bg']); // khe đeo
  // đầu thẻ: icon + wordmark kem (chữ kem trên primary đạt 4.88)
  b += embed(`${LOGO}/icon-avatar.svg`, cardX + 40, cardY + 58, 60);
  b += T('Đi làm với AI', { ...H800, size: 30 }, cardX + 116, cardY + 88 + cap(H800, 30) / 2, C.background);
  // ảnh Nghé
  const phX = cardX + 40, phY = cardY + 136, phW = cardW - 80, phH = 300;
  b += rect(phX, phY, phW, phH, 20, C.background, OUTLINE(4));
  b += `<clipPath id="anh-nghe"><rect x="${phX + 2}" y="${phY + 2}" width="${phW - 4}" height="${phH - 4}" rx="18"/></clipPath>`;
  b += `<g clip-path="url(#anh-nghe)">${embed(`${MASCOT}/nghe-nghe.svg`, cx - 256, phY - 40, 512)}</g>`;
  // tên + chức danh + mã NV
  b += T('Nghé', { ...H800, size: 72 }, cx, phY + phH + 84, C.background, 'middle');
  b += T('Nhân sự AI', { ...B600, size: 28 }, cx, phY + phH + 128, C.background, 'middle');
  const code = 'Mã NV: AI-001', cs = { ...B600, size: 22 };
  const cw = W_(code, cs) + 48;
  b += rect(cx - cw / 2, phY + phH + 152, cw, 48, 24, C.background);
  b += T(code, cs, cx, phY + phH + 152 + 24 + cap(cs) / 2, INK, 'middle');
  return doc(W, H, b, C.background);
}

// ================= MOCKUP: ly cà phê 1200×900 =================
export function cupMockup() {
  const W = 1200, H = 900;
  let b = '';
  const floorY = 770;
  b += rect(0, floorY, W, H - floorY, 0, C.surface);
  // ly giấy: thân hình thang, nắp, đai giấy
  const cx = 400, top = 250, bot = floorY, tw = 340, bw = 260;
  const lidY = top - 70;
  b += `<ellipse cx="${cx}" cy="${floorY}" rx="${bw / 2 + 40}" ry="14" fill="${INK}" opacity=".12"/>`;
  b += `<path d="M ${cx - tw / 2} ${top} L ${cx + tw / 2} ${top} L ${cx + bw / 2} ${bot} L ${cx - bw / 2} ${bot} Z" fill="${C.background}" ${OUTLINE(6)}/>`;
  // đai giấy cam đất
  const sTop = 400, sBot = 600;
  const xAt = (y) => tw / 2 - ((tw - bw) / 2) * ((y - top) / (bot - top));
  b += `<path d="M ${cx - xAt(sTop)} ${sTop} L ${cx + xAt(sTop)} ${sTop} L ${cx + xAt(sBot)} ${sBot} L ${cx - xAt(sBot)} ${sBot} Z" fill="${C.primary}" ${OUTLINE(6)}/>`;
  b += `<circle cx="${cx}" cy="${(sTop + sBot) / 2}" r="76" fill="${C.background}" ${OUTLINE(5)}/>`;
  b += embed(`${LOGO}/icon.svg`, cx - 64, (sTop + sBot) / 2 - 68, 128);
  // wordmark nhỏ trên thân ly (chữ text trên nền sáng)
  b += runs([['Đi làm với ', INK], ['AI', C.primary]], { ...H800, size: 30 }, cx, sBot + 64, 'middle');
  // nắp
  b += rect(cx - tw / 2 - 22, lidY + 30, tw + 44, 46, 18, INK);
  b += `<path d="M ${cx - tw / 2 + 4} ${lidY + 32} Q ${cx - tw / 2 + 20} ${lidY} ${cx - 60} ${lidY} L ${cx + 60} ${lidY} Q ${cx + tw / 2 - 20} ${lidY} ${cx + tw / 2 - 4} ${lidY + 32} Z" fill="${INK}"/>`;
  // hơi nóng
  const steam = (x) => `<path d="M ${x} ${lidY - 30} C ${x - 22} ${lidY - 60} ${x + 22} ${lidY - 90} ${x} ${lidY - 120}" stroke="${C['primary-soft']}" stroke-width="10" stroke-linecap="round" fill="none"/>`;
  b += steam(cx - 50) + steam(cx + 10) + steam(cx + 70);
  // Nghé bên cạnh
  const nS = 560;
  b += embed(`${MASCOT}/ca-phe-sang.svg`, 640, floorY - nS + 30, nS);
  return doc(W, H, b, C.background);
}

// ================= MOCKUP: slide webinar 1920×1080 =================
export function webinarSlide() {
  const W = 1920, H = 1080, M = 120;
  let b = '';
  // khối phải: Nghé đang chạy trên tấm surface
  const pX = 1080, pY = 0;
  b += rect(pX, pY, W - pX, H, 0, C.surface);
  b += embed(`${MASCOT}/dang-chay.svg`, pX + (W - pX - 760) / 2, 150, 760);
  // logo góc trên trái
  b += embed(`${LOGO}/logo-ngang.svg`, M - 6, 72, 300);
  // nội dung trái
  const ey = { ...B600, size: 26 };
  const p = pill('WEBINAR · TỐI THỨ NĂM · 20:00', ey, M, 330, { fill: C.primary, ink: C.background, padX: 28, h: 56 });
  b += p.svg;
  const ttl = { ...H800, size: 128 };
  const t1 = 330 + 56 + 64 + cap(ttl);
  b += T('Giao việc', ttl, M, t1, INK);
  b += runs([['cho ', INK], ['Agent', C.primary]], ttl, M, t1 + 140);
  b += para('Mang theo một việc lặp đi lặp lại, mình cùng biến nó thành quy trình.',
    { ...B400, size: 36 }, M, t1 + 140 + 92, 820, 54, C['text-muted']).svg;
  b += T('AI làm việc, mình làm chủ.', { ...H700, size: 30 }, M, H - 96, C.primary);
  return doc(W, H, b, C.background);
}

// ================= POSTER PHẲNG 1080×1350 =================
export function flatPoster() {
  const W = 1080, H = 1350;
  let b = '';
  const nS = 760, nX = (W - nS) / 2, nY = 196;
  b += `<circle cx="${W / 2}" cy="${nY + nS / 2 + 10}" r="350" fill="${C.surface}"/>`;
  b += embed(`${MASCOT}/nghe-nghe.svg`, nX, nY, nS);
  // bong bóng thoại
  const bs = { ...H800, size: 50 };
  const parts = [['Chào cả nhà, em là ', INK], ['Nghé', C.primary], ['!', INK]];
  const tw = parts.reduce((a, [s]) => a + W_(s, bs), 0);
  const bw = tw + 96, bh = 110, bx = (W - bw) / 2, by = 64;
  const tail = `<path d="M ${W / 2 - 34} ${by + bh - 8} L ${W / 2 - 6} ${by + bh + 44} L ${W / 2 + 26} ${by + bh - 8}" fill="${C.background}" ${OUTLINE(5)}/>`;
  b += rect(bx, by + 8, bw, bh, bh / 2, INK);
  b += `<path d="M ${W / 2 - 34} ${by + bh + 4} L ${W / 2 - 6} ${by + bh + 52} L ${W / 2 + 26} ${by + bh + 4} Z" fill="${INK}"/>`;
  b += rect(bx, by, bw, bh, bh / 2, C.background, OUTLINE(5));
  b += tail; // vẽ sau thân bóng: phần tô kem che nét viền chỗ đuôi nối thân
  b += runs(parts, bs, W / 2, by + bh / 2 + cap(bs) / 2, 'middle');
  // logo + slogan
  const lw = 560, lh = lw * ratio(`${LOGO}/logo-ngang.svg`);
  const ly = 1024;
  b += embed(`${LOGO}/logo-ngang.svg`, (W - lw) / 2, ly, lw);
  b += runs([['AI làm việc, ', INK], ['mình làm chủ.', C.primary]], { ...H800, size: 44 }, W / 2, ly + lh + 52, 'middle');
  return doc(W, H, b, C.background);
}

// ================= build =================
export const mockupJobs = () => [
  ['mockup-cover-group', coverGroup(), 1640],
  ['mockup-the-nhan-vien', badgeMockup(), 1200],
  ['mockup-ly-ca-phe', cupMockup(), 1200],
  ['mockup-slide-webinar', webinarSlide(), 1920],
  ['poster-nghe-phang', flatPoster(), 1080],
];

export function buildBoard(dir = OUT) {
  fs.mkdirSync(dir, { recursive: true });
  const out = [];
  const board = brandBoard();
  fs.writeFileSync(`${dir}/brand-board.svg`, board);
  out.push(`${dir}/brand-board.svg`);
  const jobs = [['brand-board', board, 2160], ...mockupJobs()];
  for (const [name, svg, w] of jobs) {
    const f = `${dir}/${name}.png`;
    fs.writeFileSync(f, renderPng(svg, w));
    out.push(f);
  }
  return out;
}

if (path.basename(process.argv[1] ?? '') === 'board.mjs') {
  for (const f of buildBoard()) console.log('+', f);
}
