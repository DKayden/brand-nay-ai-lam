// Mascot Nghé — nghé (trâu con) Việt, "nhân sự AI" của group. Chibi tròn mềm, viền nâu đều.
// Mọi bộ phận vẽ trong khung 512×512, nét viền 6px màu COLORS.text.
// Chạy: node src/mascot.mjs → 03-mascot/svg/*.svg, 03-mascot/png/*, 03-mascot/character-sheet.{svg,png}
import fs from 'node:fs';
import path from 'node:path';
import { COLORS } from './tokens.mjs';
import { textPath } from './textpath.mjs';
import { renderSizes, renderPng } from './render.mjs';

const INK = COLORS.text;
const SW = 6;
const LINE = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"`;
export const MASCOT_COLORS = {
  buffalo: COLORS.buffalo, // thân
  belly: '#A99A8F', // bụng, mõm dưới sáng hơn thân
  horn: COLORS.horn,
  nose: COLORS.nose,
  cheek: COLORS.cheek,
  ink: INK,
  badge: COLORS.primary,
  strap: COLORS['primary-soft'],
};
const C = MASCOT_COLORS;

// Hình học chính (khung 512). Đầu to ~55% chiều cao nhân vật, thân bé.
const HEAD = { cx: 256, cy: 196, rx: 150, ry: 124 };
const EYE = { dx: 64, y: 180, r: 23 };
const MUZZLE = { cx: 256, top: 226, bottom: 302, half: 92 };
const BODY = { x: 186, y: 300, w: 140, h: 146, rx: 62 };
const CARD = { cx: 256, top: 350, w: 76, h: 86, rx: 13 };

const mirror = (svg) => `<g transform="translate(512 0) scale(-1 1)">${svg}</g>`;

// Sừng trâu nước — cùng họ với sừng logo (src/logo.mjs hornLeft), phóng k lần:
// thân dày quét ngang ra ngoài rồi vút lên thành lưỡi liềm, chóp quặp vào.
const hornLeft = (rx, ry, kx, ky = kx) => {
  const p = (dx, dy) => `${rx + dx * kx} ${ry + dy * ky}`;
  return `M ${p(0, -2)}`
    + ` C ${p(-28, -2)} ${p(-48, -12)} ${p(-40, -48)}`
    + ` C ${p(-60, -32)} ${p(-66, 14)} ${p(-34, 28)}`
    + ` C ${p(-22, 30)} ${p(-10, 30)} ${p(4, 30)} Z`;
};

function horns() {
  const one = `<path d="${hornLeft(160, 108, 1.75, 1.2)}" fill="${C.horn}" ${LINE}/>`;
  return `<g class="horns">${one}${mirror(one)}</g>`;
}

// Tai cụp ngang hai bên (trâu: tai to, chĩa ngang, đầu tai hơi rủ).
function ears() {
  const one = `<g transform="translate(112 170) rotate(-22)">`
    + `<ellipse cx="-30" cy="0" rx="44" ry="23" fill="${C.buffalo}" ${LINE}/>`
    + `<ellipse cx="-34" cy="2" rx="27" ry="11" fill="${C.cheek}"/></g>`;
  return `<g class="ears">${one}${mirror(one)}</g>`;
}

const EYES = {
  open: (x, y) => `<circle cx="${x}" cy="${y}" r="${EYE.r}" fill="${INK}"/>`
    + `<circle cx="${x - 7}" cy="${y - 8}" r="7.5" fill="#fff"/>`
    + `<circle cx="${x + 7}" cy="${y + 8}" r="3" fill="#fff"/>`,
  small: (x, y) => `<circle cx="${x}" cy="${y}" r="14" fill="${INK}"/>`
    + `<circle cx="${x - 5}" cy="${y - 5}" r="5" fill="#fff"/>`,
  happy: (x, y) => `<path d="M ${x - 19} ${y + 6} Q ${x} ${y - 22} ${x + 19} ${y + 6}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>`,
  sleepy: (x, y) => `<path d="M ${x - 19} ${y + 2} Q ${x} ${y + 14} ${x + 19} ${y + 2}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`,
};
function eyes(kind) {
  const L = HEAD.cx - EYE.dx, R = HEAD.cx + EYE.dx, y = EYE.y;
  if (kind === 'confused') return EYES.open(L, y) + EYES.small(R, y + 2);
  const f = EYES[kind];
  if (!f) throw new Error(`eyes không hỗ trợ: ${kind}`);
  return f(L, y) + f(R, y);
}

// Mõm trâu: bản rộng, chữ nhật bo mềm (rộng ≈ 2× cao), không tròn như mõm heo.
function muzzle() {
  const { cx, top, bottom, half } = MUZZLE;
  const L = cx - half, R = cx + half, mid = top + 30;
  const d = `M ${L} ${mid} C ${L} ${top + 4} ${cx - 50} ${top} ${cx} ${top}`
    + ` C ${cx + 50} ${top} ${R} ${top + 4} ${R} ${mid}`
    + ` C ${R} ${bottom - 18} ${cx + 52} ${bottom} ${cx} ${bottom}`
    + ` C ${cx - 52} ${bottom} ${L} ${bottom - 18} ${L} ${mid} Z`;
  // lỗ mũi hạt đậu: nghiêng, đặt xa nhau gần mép trên mõm
  const bean = (x, y, a) => `<path transform="translate(${x} ${y}) rotate(${a}) scale(1.3)" d="M -5 -11 C 3 -13 8 -5 6 3 C 4 11 -4 13 -7 7 C -9 2 -3 0 -4 -4 C -5 -7 -9 -9 -5 -11 Z" fill="${INK}"/>`;
  return `<path d="${d}" fill="${C.nose}" ${LINE}/>`
    + `<ellipse cx="${cx}" cy="${top + 14}" rx="44" ry="6" fill="#fff" opacity=".22"/>`
    + bean(cx - 42, top + 28, 160) + bean(cx + 42, top + 28, 20);
}

const MOUTHS = {
  smile: (x, y) => `<path d="M ${x - 14} ${y} Q ${x} ${y + 12} ${x + 14} ${y}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
  open: (x, y) => `<path d="M ${x - 17} ${y - 2} L ${x + 17} ${y - 2} Q ${x + 17} ${y + 22} ${x} ${y + 22} Q ${x - 17} ${y + 22} ${x - 17} ${y - 2} Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M ${x - 10} ${y + 17} Q ${x} ${y + 7} ${x + 10} ${y + 17} Q ${x} ${y + 23} ${x - 10} ${y + 17} Z" fill="${C.cheek}"/>`,
  o: (x, y) => `<ellipse cx="${x}" cy="${y + 7}" rx="8" ry="10" fill="${INK}"/>`,
};

function head({ eyes: e = 'open', mouth = 'smile' } = {}) {
  const { cx, cy, rx, ry } = HEAD;
  const m = MOUTHS[mouth];
  if (!m) throw new Error(`mouth không hỗ trợ: ${mouth}`);
  return '<g class="head">'
    + `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.buffalo}" ${LINE}/>`
    // xoáy lông trán: 3 lọn nhỏ (nghé có lông tơ)
    + `<path d="M 232 80 Q 238 58 252 70 Q 258 50 270 66 Q 284 58 282 80" fill="${C.buffalo}" ${LINE}/>`
    + `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 3}" ry="${ry - 3}" fill="${C.buffalo}"/>`
    + `<ellipse cx="236" cy="112" rx="72" ry="28" transform="rotate(-8 236 112)" fill="#fff" opacity=".18"/>`
    + `<ellipse cx="${cx - 104}" cy="226" rx="24" ry="13" fill="${C.cheek}" opacity=".85"/>`
    + `<ellipse cx="${cx + 104}" cy="226" rx="24" ry="13" fill="${C.cheek}" opacity=".85"/>`
    + eyes(e)
    + muzzle()
    + m(cx, MUZZLE.top + 50)
    + '</g>';
}

function body() {
  const { x, y, w, h, rx } = BODY;
  return '<g class="body">'
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${C.buffalo}" ${LINE}/>`
    + `<ellipse cx="256" cy="${y + h - 46}" rx="48" ry="36" fill="${C.belly}"/>`
    + '</g>';
}

// Thẻ nhân viên — cùng họ với thẻ trong logo: dây cam nhạt viền nâu, kẹp nâu, khe kem, thân cam đất.
function badge() {
  const { cx, top, w, h, rx } = CARD;
  const x = cx - w / 2;
  const strapD = `M ${cx - 34} ${top - 52} L ${cx} ${top - 4} L ${cx + 34} ${top - 52}`;
  const strap = (color, width) => `<path d="${strapD}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const name = textPath('Nghé', { family: 'Bricolage Grotesque', weight: 800, size: 22, x: cx, y: top + 50, fill: COLORS.background, anchor: 'middle' }).svg;
  const role = textPath('Nhân sự AI', { family: 'Be Vietnam Pro', weight: 600, size: 11, x: cx, y: top + 70, fill: COLORS.background, anchor: 'middle' }).svg;
  return '<g class="badge">'
    + strap(INK, 8 + SW * 2) + strap(C.strap, 8)
    + `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="${rx}" fill="${C.badge}" ${LINE}/>`
    + `<rect x="${cx - 16}" y="${top + 9}" width="32" height="8" rx="4" fill="${COLORS.background}"/>`
    + `<rect x="${cx - 7}" y="${top - 12}" width="14" height="26" rx="5" fill="${INK}"/>`
    + name + role
    + '</g>';
}

// Tay = ống bo tròn hơi cong (qua điểm điều khiển qx,qy), đầu là móng guốc nâu chẻ đôi.
function limb(x1, y1, qx, qy, x2, y2, w = 38) {
  const len = Math.hypot(x2 - qx, y2 - qy), ux = (x2 - qx) / len, uy = (y2 - qy) / len; // tiếp tuyến cuối
  const nx = -uy, ny = ux, r = w / 2, depth = 14;
  const pt = (along, side) => `${(x2 + ux * along + nx * side).toFixed(1)} ${(y2 + uy * along + ny * side).toFixed(1)}`;
  const seg = (color, width) => `<path d="M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" fill="none"/>`;
  const d = r - depth, half = Math.sqrt(r * r - d * d);
  const hoof = `<path d="M ${pt(d, half)} A ${r} ${r} 0 0 0 ${pt(d, -half)} Z" fill="${INK}"/>`;
  const cleft = `<path d="M ${pt(d - 1, 0)} L ${pt(r - 3, 0)}" stroke="${C.buffalo}" stroke-width="3" stroke-linecap="round"/>`;
  return seg(INK, w + SW * 2) + seg(C.buffalo, w) + hoof + cleft;
}
const sideX = (side, x) => (side === 'right' ? 512 - x : x);
function armDown(side = 'left') {
  return `<g class="arm-down-${side}">${limb(sideX(side, 206), 350, sideX(side, 180), 372, sideX(side, 172), 414)}</g>`;
}
function armUp(side = 'right') {
  return `<g class="arm-up-${side}">${limb(sideX(side, 200), 352, sideX(side, 150), 340, sideX(side, 112), 282)}</g>`;
}

function legs() {
  const leg = (x) => `<rect x="${x}" y="408" width="44" height="66" rx="20" fill="${C.buffalo}" ${LINE}/>`
    + `<path d="M ${x + 3} 456 L ${x + 41} 456 L ${x + 41} 458 Q ${x + 41} 471 ${x + 28} 471 L ${x + 16} 471 Q ${x + 3} 471 ${x + 3} 458 Z" fill="${INK}"/>`
    + `<path d="M ${x + 22} 461 L ${x + 22} 471" stroke="${C.buffalo}" stroke-width="3" stroke-linecap="round"/>`;
  return `<g class="legs">${leg(204)}${leg(264)}</g>`;
}

export const part = { horns, ears, head, body, badge, armUp, armDown, legs };

export const POSES = ['nghe-nghe', 'dang-chay', 'xong-roi-sep', 'y-sep-la', 'ca-phe-sang', 'chao-member-moi'];

const wrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">${inner}</svg>\n`;

// Vạch hào hứng cạnh tay giơ.
const sparks = (x, y) => [[8, -32, 16, -52], [22, -22, 40, -36], [28, -4, 50, -6]]
  .map(([a, b, c, d]) => `<path d="M ${x + a} ${y + b} L ${x + c} ${y + d}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`).join('');

const BUILDERS = {
  'nghe-nghe': () => horns() + ears() + legs() + armUp('right') + armDown('left') + body() + badge()
    + head({ eyes: 'open', mouth: 'open' }) + sparks(sideX('right', 108), 276),
};

export function pose(name) {
  if (!POSES.includes(name)) throw new Error(`Không có tư thế: ${name}`);
  const b = BUILDERS[name];
  if (!b) throw new Error(`Tư thế "${name}" not implemented in Task 6`);
  return wrap(b());
}

// ---------- Character sheet 1600×1000 ----------
const H800 = { family: 'Bricolage Grotesque', weight: 800 };
const B500 = { family: 'Be Vietnam Pro', weight: 500 };
const B600 = { family: 'Be Vietnam Pro', weight: 600 };
const T = (s, o) => textPath(s, o).svg;
const place = (inner, x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">${inner}</g>`;

export function characterSheet() {
  const W = 1600, H = 1000, bg = COLORS.background;
  let b = `<rect width="${W}" height="${H}" fill="${bg}"/>`;
  // Trái: Nghé chính trên ô surface
  b += `<rect x="40" y="40" width="720" height="920" rx="24" fill="${COLORS.surface}"/>`;
  b += `<ellipse cx="400" cy="772" rx="160" ry="20" fill="${INK}" opacity=".10"/>`;
  b += place(pose('nghe-nghe').replace(/^<svg[^>]*>|<\/svg>\n?$/g, ''), 400 - 256 * 1.36, 120, 1.36);
  b += T('Dáng gốc: "Nghé nghe!"', { ...B600, size: 18, x: 400, y: 916, fill: COLORS['text-muted'], anchor: 'middle' });

  // Phải: tên + câu cửa miệng
  const X = 820;
  b += T('Nghé', { ...H800, size: 64, x: X, y: 120, fill: INK });
  b += T('Nhân sự AI của group "Đi làm với AI" · chăm, hơi ngáo', { ...B500, size: 18, x: X, y: 156, fill: COLORS['text-muted'] });
  b += T('Nói là Nghé nghe!', { ...H800, size: 40, x: X, y: 220, fill: COLORS.primary });

  // 4 biểu cảm
  b += T('BIỂU CẢM', { ...B600, size: 14, x: X, y: 280, fill: COLORS['text-muted'] });
  const faces = [['open', 'smile', 'Mở (open)'], ['happy', 'open', 'Vui (happy)'], ['sleepy', 'smile', 'Buồn ngủ (sleepy)'], ['confused', 'o', 'Ngơ (confused)']];
  faces.forEach(([e, m, label], i) => {
    const cx = X + 90 + i * 186, k = 0.36;
    b += `<rect x="${cx - 86}" y="296" width="172" height="150" rx="14" fill="${COLORS.surface}"/>`;
    b += place(horns() + ears() + head({ eyes: e, mouth: m }), cx - 256 * k, 300, k);
    b += T(label, { ...B600, size: 15, x: cx, y: 474, fill: INK, anchor: 'middle' });
  });

  // Bảng màu
  b += T('BẢNG MÀU MASCOT', { ...B600, size: 14, x: X, y: 530, fill: COLORS['text-muted'] });
  const sw = [['Thân', C.buffalo], ['Bụng', C.belly], ['Sừng', C.horn], ['Mũi', C.nose],
    ['Má / tai', C.cheek], ['Viền', INK], ['Thẻ', C.badge], ['Dây thẻ', C.strap]];
  sw.forEach(([name, hex], i) => {
    const x = X + (i % 4) * 186, y = 560 + Math.floor(i / 4) * 84;
    b += `<circle cx="${x + 26}" cy="${y + 26}" r="24" fill="${hex}" stroke="${INK}" stroke-width="3"/>`;
    b += T(name, { ...B600, size: 16, x: x + 62, y: y + 22, fill: INK });
    b += T(hex.toUpperCase(), { ...B500, size: 14, x: x + 62, y: y + 42, fill: COLORS['text-muted'] });
  });

  // Đặc điểm khoá
  b += T('ĐẶC ĐIỂM KHOÁ (giữ ở mọi tư thế)', { ...B600, size: 14, x: X, y: 762, fill: COLORS['text-muted'] });
  [
    '2 sừng kem lưỡi liềm quét ngang, cùng họ sừng logo',
    'Mõm rộng hồng đất, 2 lỗ mũi hạt đậu · má hồng',
    'Mắt tròn đen, đốm sáng · tai cụp ngang · xoáy lông trán',
    'Thân xám #8C7B70, viền nâu #3A2417 dày 6px (khung 512)',
    'Thẻ nhân viên cam đất "Nghé · Nhân sự AI"',
  ].forEach((s, i) => {
    const y = 798 + i * 34;
    b += `<circle cx="${X + 6}" cy="${y - 6}" r="5" fill="${COLORS.primary}"/>`;
    b += T(s, { ...B500, size: 18, x: X + 22, y, fill: INK });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${b}</svg>\n`;
}

export function buildMascot(dir = '03-mascot') {
  fs.mkdirSync(`${dir}/svg`, { recursive: true });
  const f = `${dir}/svg/nghe-nghe.svg`;
  fs.writeFileSync(f, pose('nghe-nghe'));
  const out = [f, ...renderSizes(f, `${dir}/png/nghe-nghe`)];
  const sheet = characterSheet();
  fs.writeFileSync(`${dir}/character-sheet.svg`, sheet);
  fs.writeFileSync(`${dir}/character-sheet.png`, renderPng(sheet, 1600));
  return [...out, `${dir}/character-sheet.svg`, `${dir}/character-sheet.png`];
}

if (path.basename(process.argv[1] ?? '') === 'mascot.mjs') {
  for (const f of buildMascot()) console.log('+', f);
}
